import type { Metadata } from "next";
import { conference, faq, schedule } from "@/content/conference";
import { Button, Container, PageHeader } from "@/components/ui";
import { Collage } from "@/components/deco";
import { IconArrow, IconFood, IconPhone, IconPin, IconPlus } from "@/components/icons";

export const metadata: Metadata = { title: "Информация участнику" };

export default function InfoPage() {
  const lunch = schedule.find((s) => s.title.startsWith("Обед"));
  return (
    <>
      <PageHeader title="Участнику" lead="Где, как добраться, питание, контакты и ответы на частые вопросы." />

      <Container className="space-y-12 py-6 lg:space-y-16 lg:py-10">
        {/* Локация */}
        <section id="location" className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="display text-4xl sm:text-5xl">Локация</h2>
            <p className="mt-4 flex gap-3">
              <IconPin className="mt-0.5 size-6 shrink-0 text-cobalt" />
              <span>
                <b className="block">{conference.city}</b>
                <span className="block text-muted">{conference.venue}</span>
                <span className="block text-muted">{conference.address}</span>
              </span>
            </p>
            <Button href={conference.mapUrl} external className="mt-6 w-full sm:w-auto">
              Открыть в картах <IconArrow className="size-5" />
            </Button>
          </div>
          <Collage variant="b">
            <img
              src="/img/venue.webp"
              alt="Здание, где проходит конференция"
              width={304}
              height={180}
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full rounded-sm object-cover"
            />
          </Collage>
        </section>

        {/* Питание и контакты */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <IconFood className="size-7 text-cobalt" />
            <h2 className="display mt-3 text-3xl">Питание</h2>
            <p className="mt-2 text-muted">
              {lunch?.title} {lunch ? `${lunch.start}–${lunch.end}` : ""}. Воду и чай можно взять в холле весь день.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <IconPhone className="size-7 text-cobalt" />
            <h2 className="display mt-3 text-3xl">Контакты</h2>
            <ul className="mt-2 space-y-2">
              {conference.contacts.map((c) => (
                <li key={c.role}>
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="group block">
                    <span className="block text-xs text-muted">{c.role} · {c.name}</span>
                    <span className="block font-semibold text-cobalt group-hover:underline">{c.phone}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ — нативный <details>: работает без JavaScript */}
        <section id="faq">
          <h2 className="display text-4xl sm:text-5xl">Частые вопросы</h2>
          <div className="mt-6 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl bg-white">
            {faq.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-16 cursor-pointer items-center gap-4 px-5 font-semibold">
                  <span className="flex-1">{f.q}</span>
                  <IconPlus className="faq-plus size-5 shrink-0 text-cobalt transition-transform" />
                </summary>
                <p className="px-5 pb-5 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
