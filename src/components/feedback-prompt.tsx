"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { feedbackSent, isFeedbackPromptTime } from "@/lib/time";

const DONE_KEY = "feedback-prompt-done"; // «Я уже оставил(а) отзыв»
const SNOOZE_KEY = "feedback-prompt-snooze"; // до какого времени не беспокоить
const SNOOZE_MIN = 30;

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {}
}

/**
 * Напоминание об отзыве — 31 октября в 16:35, после заключительной молитвы.
 * Появляется само, даже если страница уже открыта. Не показывается тем, кто уже отправил
 * отзыв с этого устройства или нажал «Я уже оставил(а) отзыв».
 * «Напомнить позже» — снова через 30 минут.
 * Проверка: /?now=2026-10-31T16:40 (сбросить — очистить данные сайта или открыть в режиме инкогнито)
 */
export function FeedbackPrompt() {
  const path = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const tick = () => {
      if (read(DONE_KEY) === "1" || feedbackSent()) return setShow(false);
      if (Date.now() < Number(read(SNOOZE_KEY) ?? 0)) return;
      if (isFeedbackPromptTime()) setShow(true);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const snooze = () => {
    write(SNOOZE_KEY, String(Date.now() + SNOOZE_MIN * 60_000));
    setShow(false);
  };
  const done = () => {
    write(DONE_KEY, "1");
    setShow(false);
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && snooze();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // На странице самой формы окно не нужно
  if (!show || path.startsWith("/feedback")) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={snooze}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fb-prompt-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,.6)] sm:p-8"
      >
        <p className="eyebrow text-terra">Конференция завершилась</p>
        <h2 id="fb-prompt-title" className="display mt-2 text-4xl">Спасибо, что были с нами!</h2>
        <p className="mt-3 text-muted">
          Если вы ещё не оставили отзыв — пожалуйста, уделите пару минут. Напишите, что было полезным, ваши пожелания
          и замечания. Это поможет нам сделать следующие встречи ещё лучше.
        </p>
        <div className="mt-6 grid gap-3">
          <Link
            href="/feedback/"
            onClick={snooze}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cobalt px-6 font-semibold text-white hover:bg-cobalt-dark"
          >
            Оставить отзыв
          </Link>
          <button
            type="button"
            onClick={done}
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-cobalt px-6 font-semibold text-cobalt hover:bg-cobalt hover:text-white"
          >
            Я уже оставил(а) отзыв
          </button>
          <button
            type="button"
            onClick={snooze}
            className="inline-flex min-h-10 items-center justify-center text-sm font-semibold text-muted hover:text-ink"
          >
            Напомнить позже
          </button>
        </div>
      </div>
    </div>
  );
}
