"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { conference } from "@/content/conference";
import { cafeOpenNow, fmtMin, getLiveState, type LiveState } from "@/lib/time";
import { IconArrow, IconCoffee } from "./icons";

/**
 * «Сейчас идёт / Далее». До конференции — обратный отсчёт, после — ссылка на записи.
 * Рендерится только в браузере (время у каждого своё), место зарезервировано — экран не прыгает.
 */
export function LiveNow() {
  const [state, setState] = useState<LiveState | null>(null);

  useEffect(() => {
    const tick = () => setState(getLiveState());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const box =
    "relative flex min-h-[112px] flex-col justify-center overflow-hidden rounded-2xl bg-ink p-5 text-paper shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)]";

  if (!state) return <div className={box} aria-hidden />;

  // «Кафе открыто до …» — во время работы кафе (перерывы, обед, регистрация)
  const cafe = cafeOpenNow();
  const cafeLine = cafe && (
    <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-sun/15 px-3 py-1 text-sm font-semibold text-sun">
      <IconCoffee className="size-4" /> Кафе открыто до {cafe.end}
    </p>
  );

  if (state.kind === "before")
    return (
      <Link href="/program/" className={`${box} group`}>
        <span className="absolute inset-y-0 right-0 w-1/3 halftone-fade opacity-30 invert" aria-hidden />
        <p className="eyebrow text-sun">{conference.dateHuman} · {conference.weekday}</p>
        <p className="display mt-2 text-4xl text-white">Начало в {conference.start}</p>
        <p className="mt-1 text-sm text-paper/70">
          Регистрация с {conference.registrationStart} · {conference.city}, {conference.venue}
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-paper/70">
          Смотреть программу
          <IconArrow className="size-4 transition-transform group-hover:translate-x-1" />
        </p>
      </Link>
    );

  if (state.kind === "after")
    return (
      <Link href="/#feedback" className={`${box} group`}>
        <p className="eyebrow text-sun">Конференция прошла</p>
        <p className="display mt-2 text-3xl text-white">Спасибо, что были с нами!</p>
        <p className="mt-2 flex items-center gap-1 text-sm text-paper/70">
          Оставить отзыв <IconArrow className="size-4 transition-transform group-hover:translate-x-1" />
        </p>
        {cafeLine}
      </Link>
    );

  if (state.kind === "morning" || state.kind === "break")
    return (
      <Link href="/program/" className={`${box} group`}>
        <p className="eyebrow text-sun">Далее · через {fmtMin(state.inMin)}</p>
        <p className="display mt-2 text-4xl text-white">{state.next.title}</p>
        <p className="mt-1 text-sm text-paper/70">
          {state.next.start}–{state.next.end}
          {state.next.place && ` · ${state.next.place}`}
        </p>
        {cafeLine}
      </Link>
    );

  const { current, next, leftMin, progress } = state;
  return (
    <Link href={current.href ?? "/program/"} className={`${box} group`}>
      <div className="flex items-center gap-2">
        <span className="live-dot size-2.5 rounded-full bg-sun" />
        <p className="eyebrow text-sun">Сейчас идёт</p>
        <span className="ml-auto text-xs text-paper/60">ещё {fmtMin(leftMin)}</span>
      </div>
      <p className="display mt-2 text-4xl text-white">{current.title}</p>
      <p className="mt-1 text-sm text-paper/70">
        {current.start}–{current.end}
        {current.place && ` · ${current.place}`}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-sun" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      {next && (
        <p className="mt-3 text-sm text-paper/80">
          <span className="text-paper/50">Далее в {next.start}:</span> {next.title}
        </p>
      )}
      {cafeLine}
    </Link>
  );
}
