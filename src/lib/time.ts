import { conference, schedule, type ScheduleItem } from "@/content/conference";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Текущие дата и минуты в часовом поясе конференции. Для проверки: ?now=2026-10-31T11:15 */
export function nowInConferenceTz(): { date: string; minutes: number } {
  if (typeof window !== "undefined") {
    const fake = new URLSearchParams(window.location.search).get("now");
    if (fake && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fake)) {
      const [d, t] = fake.split("T");
      return { date: d, minutes: toMin(t) };
    }
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: conference.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export type LiveState =
  | { kind: "before"; days: number }
  | { kind: "morning"; next: ScheduleItem; inMin: number }
  | { kind: "live"; current: ScheduleItem; currentIndex: number; next?: ScheduleItem; leftMin: number; progress: number }
  | { kind: "break"; next: ScheduleItem; inMin: number }
  | { kind: "after" };

export function getLiveState(): LiveState {
  const { date, minutes } = nowInConferenceTz();
  if (date < conference.date) {
    const days = Math.round(
      (Date.parse(conference.date + "T00:00:00Z") - Date.parse(date + "T00:00:00Z")) / 86_400_000,
    );
    return { kind: "before", days };
  }
  if (date > conference.date) return { kind: "after" };

  const first = schedule[0];
  const last = schedule[schedule.length - 1];
  if (minutes < toMin(first.start)) return { kind: "morning", next: first, inMin: toMin(first.start) - minutes };
  if (minutes >= toMin(last.end)) return { kind: "after" };

  const i = schedule.findIndex((s) => minutes >= toMin(s.start) && minutes < toMin(s.end));
  if (i === -1) {
    const next = schedule.find((s) => toMin(s.start) > minutes)!;
    return { kind: "break", next, inMin: toMin(next.start) - minutes };
  }
  const cur = schedule[i];
  const dur = toMin(cur.end) - toMin(cur.start);
  return {
    kind: "live",
    current: cur,
    currentIndex: i,
    next: schedule[i + 1],
    leftMin: toMin(cur.end) - minutes,
    progress: (minutes - toMin(cur.start)) / dur,
  };
}

export function pluralDays(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "день";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "дня";
  return "дней";
}

export function fmtMin(m: number) {
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} ч ${r} мин` : `${h} ч`;
}

/** Форма отзыва открыта с начала конференции */
export const feedbackOpensAt = conference.start;
/** Напоминание об отзыве — в конце последнего пункта программы */
export const feedbackPromptAt = schedule[schedule.length - 1].end;

function reached(hhmm: string): boolean {
  const { date, minutes } = nowInConferenceTz();
  if (date !== conference.date) return date > conference.date;
  return minutes >= toMin(hhmm);
}

/** Форма отзыва открыта (31 октября с 10:00 и дальше) */
export const isFeedbackOpen = () => reached(feedbackOpensAt);
/** Пора напоминать об отзыве (31 октября с 16:35 и дальше) */
export const isFeedbackPromptTime = () => reached(feedbackPromptAt);

/** Отметка «отзыв уже отправлен с этого устройства» — общая для формы и напоминания */
export const FEEDBACK_SENT_KEY = "feedback-sent";
export function feedbackSent(): boolean {
  try {
    return localStorage.getItem(FEEDBACK_SENT_KEY) === "1";
  } catch {
    return false;
  }
}
export function markFeedbackSent() {
  try {
    localStorage.setItem(FEEDBACK_SENT_KEY, "1");
  } catch {}
}
