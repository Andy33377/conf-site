/**
 * Отзывы конференции → Google Таблица + Telegram.
 * Вставляется в Google Таблицу: Расширения → Apps Script. Инструкция: scripts/FEEDBACK-SETUP.md
 *
 * Свойства скрипта (Настройки проекта → Свойства скрипта):
 *   TELEGRAM_TOKEN   — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID — куда присылать (узнать: запустить findChatId)
 */

const SHEET_NAME = 'Отзывы';
const FIELDS = ['Оценка', 'Мастер-класс', 'Запомнилось', 'Улучшить', 'Пожелания и замечания', 'Имя', 'Церковь'];
const STATUS_COL = FIELDS.length + 2; // колонка «Telegram»

/** Принимает отзыв с сайта. Отвечает быстро: в Telegram пробует отправить один раз,
 *  а если Telegram просит подождать — отзыв ставится в очередь и уйдёт через минуту (flushQueue). */
function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return json({ ok: true }); // спам-бот заполнил скрытое поле — молча игнорируем

  const row = [new Date()].concat(FIELDS.map(function (f) { return String(p[f] || '').slice(0, 5000); }), ['…']);

  // 1. Сначала — в таблицу (строго по очереди, чтобы одновременные отзывы не мешали друг другу)
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  let rowIndex;
  try {
    const sh = sheet_();
    sh.appendRow(row);
    rowIndex = sh.getLastRow();
  } finally {
    lock.releaseLock();
  }

  // 2. Потом — уведомление в Telegram (отзыв уже сохранён, что бы ни случилось)
  let status = 'отправлено';
  try {
    if (!sendTelegram_(format_(p))) status = 'в очереди';
  } catch (err) {
    status = 'в очереди';
    console.error('Telegram: ' + err);
  }
  sheet_().getRange(rowIndex, STATUS_COL).setValue(status);

  return json({ ok: true });
}

/** Раз в минуту (триггер ставит setup) досылает отзывы, которые Telegram не принял сразу */
function flushQueue() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return; // предыдущий запуск ещё работает
  try {
    const sh = sheet_();
    const last = sh.getLastRow();
    if (last < 2) return;
    const values = sh.getRange(2, 1, last - 1, STATUS_COL).getValues();
    for (let i = 0; i < values.length; i++) {
      if (values[i][STATUS_COL - 1] !== 'в очереди') continue;
      const p = {};
      FIELDS.forEach(function (f, k) { p[f] = values[i][k + 1]; });
      if (!sendTelegram_(format_(p))) {
        Utilities.sleep(3000);
        i--; // Telegram просит подождать — повторим этот же отзыв
        continue;
      }
      sh.getRange(i + 2, STATUS_COL).setValue('отправлено');
      Utilities.sleep(1100);
    }
  } finally {
    lock.releaseLock();
  }
}

/** Проверка в браузере: открыть адрес веб-приложения — должно быть {"ok":true,"status":"работает"} */
function doGet() {
  return json({ ok: true, status: 'работает' });
}

/** Запустить один раз: создаёт лист с заголовками, ставит триггер очереди и проверяет Telegram */
function setup() {
  sheet_();
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'flushQueue'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('flushQueue').timeBased().everyMinutes(1).create();
  if (!sendTelegram_('✅ Бот отзывов подключён. Сюда будут приходить отзывы с сайта конференции.'))
    throw new Error('Telegram просит подождать — запустите setup ещё раз через минуту');
}

/** Показывает id чатов, где боту недавно писали. Напишите боту (или в группу с ботом), затем запустите */
function findChatId() {
  const token = prop_('TELEGRAM_TOKEN');
  const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/getUpdates', { muteHttpExceptions: true });
  const data = JSON.parse(res.getContentText());
  const seen = {};
  (data.result || []).forEach(function (u) {
    const m = u.message || u.channel_post || u.my_chat_member;
    if (m && m.chat && !seen[m.chat.id]) {
      seen[m.chat.id] = true;
      console.log('Чат: ' + (m.chat.title || m.chat.first_name || m.chat.username) + '  →  TELEGRAM_CHAT_ID = ' + m.chat.id);
    }
  });
  if (!Object.keys(seen).length) console.log('Пусто. Напишите боту любое сообщение (в группе — /start@имя_бота) и запустите ещё раз.');
}

// ——— вспомогательное ———

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Время'].concat(FIELDS, ['Telegram']));
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, STATUS_COL).setFontWeight('bold');
  }
  return sh;
}

function format_(p) {
  const lines = ['<b>📝 Новый отзыв</b>'];
  if (p['Оценка'] && p['Оценка'] !== '—') lines.push('⭐ Оценка: <b>' + esc_(p['Оценка']) + '</b>');
  if (p['Мастер-класс']) lines.push('🎓 Мастер-класс: ' + esc_(p['Мастер-класс']));
  [['Запомнилось', 'Запомнилось'], ['Улучшить', 'Что улучшить'], ['Пожелания и замечания', 'Пожелания и замечания']]
    .forEach(function (f) {
      if (p[f[0]]) lines.push('', '<b>' + f[1] + ':</b>', esc_(p[f[0]]));
    });
  const who = [p['Имя'], p['Церковь']].filter(Boolean).join(', ');
  lines.push('', '— ' + (who ? esc_(who) : 'аноним'));
  return lines.join('\n').slice(0, 4000); // лимит Telegram — 4096 символов
}

/** Одна попытка отправки. true — отправлено, false — Telegram просит подождать (429) */
function sendTelegram_(text) {
  const url = 'https://api.telegram.org/bot' + prop_('TELEGRAM_TOKEN') + '/sendMessage';
  const payload = { chat_id: prop_('TELEGRAM_CHAT_ID'), text: text, parse_mode: 'HTML', disable_web_page_preview: true };
  const res = UrlFetchApp.fetch(url, { method: 'post', payload: payload, muteHttpExceptions: true });
  const code = res.getResponseCode();
  if (code === 200) return true;
  if (code === 429) return false;
  throw new Error(code + ' ' + res.getContentText());
}

function prop_(key) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  if (!v) throw new Error('Не задано свойство скрипта ' + key + ' (Настройки проекта → Свойства скрипта)');
  return v;
}

function esc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
