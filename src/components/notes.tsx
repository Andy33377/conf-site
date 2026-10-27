"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Личные заметки к мастер-классу. Хранятся только в браузере (localStorage) этого устройства,
 * сохраняются сами при наборе. «Сохранить себе» — системное меню «Поделиться»
 * (Заметки, Telegram, почта), а где его нет — копирование в буфер обмена.
 */
export function Notes({ id, title }: { id: string; title: string }) {
  const key = `notes:${id}`;
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      setText(localStorage.getItem(key) ?? "");
    } catch {}
    setLoaded(true);
  }, [key]);

  function onChange(v: string) {
    setText(v);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        if (v.trim()) localStorage.setItem(key, v);
        else localStorage.removeItem(key);
        setSaved(true);
      } catch {}
    }, 400);
  }

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  }

  async function share() {
    const body = `${title}\n\n${text.trim()}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: body });
        return;
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(body);
      flash("Скопировано — вставьте в заметки или мессенджер");
    } catch {
      flash("Не получилось скопировать");
    }
  }

  function clear() {
    if (!text.trim()) return;
    if (!window.confirm("Удалить заметку? Её нельзя будет восстановить.")) return;
    onChange("");
  }

  const empty = !text.trim();

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <h2 className="display text-3xl">Мои заметки</h2>
        <span className="mb-1 text-xs text-muted" aria-live="polite">
          {loaded && !empty && (saved ? "Сохранено" : "…")}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        disabled={!loaded}
        rows={8}
        placeholder="Записывайте мысли, стихи, идеи с мастер-класса…"
        aria-label={`Заметки: ${title}`}
        className="mt-3 w-full resize-y rounded-2xl border border-line bg-white p-4 text-base leading-relaxed outline-none transition-colors focus:border-cobalt"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={share}
          disabled={empty}
          className="inline-flex min-h-11 items-center rounded-full bg-cobalt px-5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-dark disabled:opacity-40"
        >
          Сохранить себе
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={empty}
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted hover:text-terra disabled:opacity-40"
        >
          Очистить
        </button>
        {msg && <span className="text-sm text-cobalt">{msg}</span>}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Заметки хранятся только на этом устройстве и в этом браузере. Чтобы не потерять — нажмите «Сохранить себе» и
        отправьте их в Заметки, Telegram или на почту.
      </p>
    </section>
  );
}
