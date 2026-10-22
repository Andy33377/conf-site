"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isFeedbackOpen } from "@/lib/time";

const KEY = "feedback-prompt-seen";

/**
 * Всплывающее окно «Оставьте отзыв» — появляется само, когда открывается форма отзыва
 * (31 октября в 16:35), даже если страница уже открыта. Показывается один раз:
 * после «Оставить отзыв» или «Позже» больше не беспокоит.
 * Проверка: /?now=2026-10-31T16:40 (сбросить — очистить данные сайта в браузере)
 */
export function FeedbackPrompt() {
  const path = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    const tick = () => {
      if (isFeedbackOpen()) setShow(true);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // На странице самой формы окно не нужно
  if (!show || path.startsWith("/feedback")) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center" onClick={close}>
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
          Нам очень важно ваше мнение. Пожалуйста, уделите пару минут и оставьте отзыв: что было полезным, что
          коснулось сердца и что можно сделать лучше. Это поможет подготовить следующие встречи.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/feedback/"
            onClick={close}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cobalt px-6 font-semibold text-white hover:bg-cobalt-dark"
          >
            Оставить отзыв
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-line px-6 font-semibold text-muted hover:border-ink hover:text-ink"
          >
            Позже
          </button>
        </div>
      </div>
    </div>
  );
}
