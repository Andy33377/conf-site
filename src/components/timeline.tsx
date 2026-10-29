"use client";

import Link from "next/link";
import { useEffect, useState, type ElementType } from "react";
import { program, schedule } from "@/content/conference";
import { cafeSlotFor, getLiveState } from "@/lib/time";
import { IconChevron, IconCoffee } from "./icons";

/** Индекс текущего пункта и последнего завершённого (в плоском списке schedule) */
function useProgress() {
  const [p, setP] = useState({ current: -1, done: -1 });
  useEffect(() => {
    const tick = () => {
      const s = getLiveState();
      if (s.kind === "live") setP({ current: s.currentIndex, done: s.currentIndex - 1 });
      else if (s.kind === "break") setP({ current: -1, done: schedule.indexOf(s.next) - 1 });
      else if (s.kind === "after") setP({ current: -1, done: schedule.length - 1 });
      else setP({ current: -1, done: -1 });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return p;
}

// смещение каждой части в плоском списке
const offsets = program.reduce<number[]>((acc, b, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + program[i - 1].items.length);
  return acc;
}, []);

/** Полная программа по частям; текущий пункт подсвечивается в день конференции */
export function Timeline() {
  const { current, done } = useProgress();

  return (
    <div className="space-y-8">
      {program.map((block, bi) => (
        <section key={block.title} id={`part-${bi}`} className="scroll-mt-20">
          <h2 className="eyebrow mb-2 flex items-center gap-3 text-cobalt">
            <span className="h-0.5 w-6 bg-cobalt" aria-hidden />
            {block.title}
          </h2>
          <ol>
            {block.items.map((item, ii) => {
              const i = offsets[bi] + ii;
              const isNow = i === current;
              const isDone = i <= done;
              const first = ii === 0;
              const last = ii === block.items.length - 1;
              const Row = (item.href ? Link : "div") as ElementType;
              const cafe = cafeSlotFor(item);
              return (
                <li key={item.start} className="grid grid-cols-[3.6rem_1.25rem_1fr] sm:grid-cols-[5rem_2rem_1fr]">
                  <time
                    className={`pt-3 text-sm font-semibold tabular-nums ${isDone ? "text-muted/60" : "text-ink"}`}
                  >
                    {item.start}
                  </time>
                  <span className="relative flex justify-center" aria-hidden>
                    <span
                      className={`absolute w-0.5 ${first ? "top-[1.15rem]" : "top-0"} ${
                        last ? "h-[1.15rem]" : "bottom-0"
                      } ${isDone ? "bg-cobalt" : "bg-line"}`}
                    />
                    <span
                      className={`relative mt-[0.95rem] size-3 rounded-full border-2 ${
                        isNow
                          ? "live-dot border-cobalt bg-cobalt"
                          : isDone
                            ? "border-cobalt bg-cobalt"
                            : "border-ink/30 bg-paper"
                      }`}
                    />
                  </span>
                  <Row
                    href={item.href as string}
                    className={`my-1 ml-1 flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                      isNow ? "bg-cobalt text-white" : "bg-white/70"
                    } ${item.href && !isNow ? "hover:bg-white" : ""}`}
                  >
                    <span className="min-w-0 flex-1">
                      {isNow && <span className="eyebrow mb-0.5 block text-sun">Сейчас</span>}
                      <span className={`block font-semibold ${isDone ? "text-muted" : ""}`}>{item.title}</span>
                      <span className={`block text-xs ${isNow ? "text-white/75" : "text-muted"}`}>
                        {item.start}–{item.end}
                        {item.note && ` · ${item.note}`}
                      </span>
                      {cafe && (
                        <span
                          className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${
                            isNow ? "bg-white/15 text-white" : "bg-ochre/15 text-ink"
                          }`}
                        >
                          <IconCoffee className="size-3.5" /> Кафе открыто {cafe.start}–{cafe.end}
                        </span>
                      )}
                    </span>
                    {item.href && <IconChevron className="size-5 shrink-0 opacity-60" />}
                  </Row>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

/** Краткая программа для главной: 4 части дня */
export function ProgramOverview() {
  const { current, done } = useProgress();

  return (
    <ol className="grid gap-2.5">
      {program.map((block, bi) => {
        const from = offsets[bi];
        const to = from + block.items.length - 1;
        const isNow = current >= from && current <= to;
        const isDone = done >= to;
        const [label, name] = block.title.includes(". ") ? block.title.split(". ") : ["", block.title];
        const nowItem = isNow ? schedule[current] : null;
        return (
          <li key={block.title}>
            <Link
              href={`/program/#part-${bi}`}
              className={`group flex items-center gap-4 rounded-2xl p-4 transition-colors ${
                isNow ? "bg-cobalt text-white" : "bg-white/70 hover:bg-white"
              }`}
            >
              <span
                className={`w-[4.4rem] shrink-0 text-sm font-semibold leading-tight tabular-nums ${
                  isDone ? "text-muted/60" : ""
                }`}
              >
                {block.items[0].start}
                <span className={`block text-xs font-medium ${isNow ? "text-white/70" : "text-muted"}`}>
                  {block.items[block.items.length - 1].end}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                {label && (
                  <span className={`eyebrow block ${isNow ? "text-sun" : "text-cobalt"}`}>
                    {isNow ? "Сейчас" : label}
                  </span>
                )}
                <span className={`display mt-0.5 block text-2xl ${isDone ? "text-muted" : ""}`}>{name}</span>
                {nowItem && <span className="block text-sm text-white/80">{nowItem.title}</span>}
              </span>
              <IconChevron className="size-5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
