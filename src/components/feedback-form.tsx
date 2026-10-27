"use client";

import { useEffect, useState, type FormEvent } from "react";
import { conference, masterclasses } from "@/content/conference";
import { feedbackOpensAt, feedbackSent, isFeedbackOpen, markFeedbackSent } from "@/lib/time";
import { IconCheck } from "./icons";

/** Куда уходят отзывы: веб-приложение Google Apps Script (scripts/feedback-telegram.gs) → Google Таблица + Telegram */
const ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-base outline-none transition-colors focus:border-cobalt";
const label = "mb-1.5 block text-sm font-semibold";

/**
 * Форма отзыва. Открыта 31 октября с 10:00 (с начала конференции) и после.
 * До этого — карточка «форма откроется …». Проверка: /feedback/?now=2026-10-31T10:05
 */
export function FeedbackForm() {
  const [open, setOpen] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (feedbackSent()) setStatus("sent");
    const tick = () => setOpen(isFeedbackOpen());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const card = "rounded-2xl bg-white p-5 sm:p-8";

  if (open === null) return <div className={`${card} min-h-40`} aria-hidden />;

  if (!open)
    return (
      <div className={card}>
        <p className="eyebrow text-terra">Отзыв о конференции</p>
        <p className="display mt-2 text-3xl">
          Форма откроется {conference.dateHuman.replace(/ \d{4}$/, "")} в {feedbackOpensAt}
        </p>
        <p className="mt-2 text-muted">
          В день конференции здесь можно будет поделиться впечатлениями, пожеланиями и замечаниями.
        </p>
      </div>
    );

  if (status === "sent")
    return (
      <div className={card}>
        <span className="grid size-12 place-items-center rounded-full bg-cobalt text-white">
          <IconCheck className="size-6" />
        </span>
        <p className="display mt-4 text-3xl">Спасибо за отзыв!</p>
        <p className="mt-2 text-muted">Мы обязательно его прочитаем. Благословений!</p>
        <button
          type="button"
          onClick={() => {
            setRating(0);
            setStatus("idle");
          }}
          className="mt-4 text-sm font-semibold text-cobalt hover:underline"
        >
          Написать ещё один отзыв
        </button>
      </div>
    );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        // URL-кодированные поля: их понимают и Google Apps Script, и Formspree; запрос без preflight (CORS)
        body: new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        markFeedbackSent();
        setStatus("sent");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`${card} grid gap-5`}>
      <p className="text-muted">
        Форма открыта с {conference.dateHuman.replace(/ \d{4}$/, "")}, {feedbackOpensAt}. Напишите, что вам запомнилось,
        ваши пожелания и замечания — это поможет сделать следующие встречи ещё лучше.
      </p>
      <input type="hidden" name="_subject" value={`Отзыв о конференции «${conference.title}»`} />
      {/* Ловушка для спам-ботов: люди это поле не видят */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <fieldset>
        <legend className={label}>Как вам конференция в целом?</legend>
        <input type="hidden" name="Оценка" value={rating ? `${rating} из 5` : "—"} />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-pressed={rating === n}
              aria-label={`${n} из 5`}
              className={`display grid size-12 place-items-center rounded-xl border text-2xl transition-colors ${
                rating >= n ? "border-cobalt bg-cobalt text-white" : "border-line bg-white text-muted hover:border-cobalt"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="fb-mc" className={label}>На каком мастер-классе были?</label>
        <select id="fb-mc" name="Мастер-класс" className={field} defaultValue="">
          <option value="">Не выбрано</option>
          {masterclasses.map((m) => (
            <option key={m.slug} value={m.title}>{m.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fb-best" className={label}>Что больше всего запомнилось или коснулось?</label>
        <textarea id="fb-best" name="Запомнилось" rows={4} required className={field} />
      </div>

      <div>
        <label htmlFor="fb-better" className={label}>Что можно сделать лучше в следующий раз?</label>
        <textarea id="fb-better" name="Улучшить" rows={3} className={field} />
      </div>

      <div>
        <label htmlFor="fb-wishes" className={label}>Пожелания и замечания</label>
        <textarea id="fb-wishes" name="Пожелания и замечания" rows={3} className={field} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className={label}>
            Имя <span className="font-normal text-muted">(необязательно)</span>
          </label>
          <input id="fb-name" name="Имя" autoComplete="given-name" className={field} />
        </div>
        <div>
          <label htmlFor="fb-church" className={label}>
            Церковь / город <span className="font-normal text-muted">(необязательно)</span>
          </label>
          <input id="fb-church" name="Церковь" className={field} />
        </div>
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-terra/10 px-4 py-3 text-sm text-terra-dark">
          Не получилось отправить отзыв. Проверьте интернет и попробуйте ещё раз.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-cobalt px-6 font-semibold text-white transition-colors hover:bg-cobalt-dark disabled:opacity-60"
      >
        {status === "sending" ? "Отправляем…" : "Отправить отзыв"}
      </button>
    </form>
  );
}
