"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { masterclasses } from "@/content/conference";
import { IconArrow, IconCheck, IconPlus } from "./icons";

const KEY = "conf:masterclass";
const EVT = "conf:masterclass-change";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
export function saveMasterclass(slug: string | null) {
  try {
    if (slug) localStorage.setItem(KEY, slug);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVT));
}
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}
export function useMyMasterclass() {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Блок «Моя конференция» на главной */
export function MyPlan() {
  const slug = useMyMasterclass();
  const mc = masterclasses.find((m) => m.slug === slug);

  if (!mc)
    return (
      <Link
        href="/masterclasses/"
        className="group flex items-center gap-4 rounded-2xl border-2 border-dashed border-line p-4 transition-colors hover:border-cobalt"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cobalt/10 text-cobalt">
          <IconPlus />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Выберите свой мастер-класс</span>
          <span className="block text-sm text-muted">Он сохранится здесь — быстро найдёте аудиторию</span>
        </span>
        <IconArrow className="size-5 text-cobalt transition-transform group-hover:translate-x-1" />
      </Link>
    );

  return (
    <Link
      href={`/masterclasses/${mc.slug}/`}
      className="group flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,.5)]"
    >
      <img src={mc.image} alt="" width={64} height={64} className="photo-bw size-16 shrink-0 rounded-xl object-cover" />
      <span className="min-w-0 flex-1">
        <span className="eyebrow block text-cobalt">Мой мастер-класс</span>
        <span className="display mt-1 block text-2xl">{mc.title}</span>
        <span className="block truncate text-sm text-muted">
          {mc.time} · {mc.room}
        </span>
      </span>
      <IconArrow className="size-5 text-cobalt transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

/** Кнопка «Я иду» на странице мастер-класса */
export function ChooseButton({ slug }: { slug: string }) {
  const current = useMyMasterclass();
  const chosen = current === slug;
  return (
    <button
      type="button"
      onClick={() => saveMasterclass(chosen ? null : slug)}
      aria-pressed={chosen}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 font-semibold transition-colors sm:w-auto ${
        chosen ? "bg-ink text-white" : "bg-cobalt text-white hover:bg-cobalt-dark"
      }`}
    >
      {chosen ? (
        <>
          <IconCheck className="size-5" /> Вы идёте · отменить
        </>
      ) : (
        "Я иду на этот мастер-класс"
      )}
    </button>
  );
}
