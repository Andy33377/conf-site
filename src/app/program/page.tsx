import type { Metadata } from "next";
import { cafeHours, conference } from "@/content/conference";
import { IconCoffee } from "@/components/icons";
import { Timeline } from "@/components/timeline";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Программа" };

export default function ProgramPage() {
  return (
    <>
      <PageHeader
        title="Программа"
        lead={`${conference.dateHuman}, ${conference.weekday.toLowerCase()} · ${conference.city}. Регистрация ${conference.registrationStart}, начало ${conference.start}. В день конференции текущий пункт подсвечивается.`}
      />
      <Container className="max-w-3xl py-8 lg:py-12">
        <section className="mb-8 flex gap-4 rounded-2xl bg-white p-4 sm:p-5" aria-label="Часы работы кафе">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ochre/15 text-ink">
            <IconCoffee className="size-6" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold">Кафе открыто</h2>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {cafeHours.map((c) => (
                <li key={c.start} className="rounded-full bg-paper px-2.5 py-1 text-sm font-semibold tabular-nums">
                  {c.start}–{c.end}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <Timeline />
      </Container>
    </>
  );
}
