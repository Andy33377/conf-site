import Link from "next/link";
import { conference, masterclasses, songs, speakers } from "@/content/conference";
import { Hero } from "@/components/hero";
import { LiveNow } from "@/components/live-now";
import { MyPlan } from "@/components/my-plan";
import { ProgramOverview } from "@/components/timeline";
import { Collage, Scribble } from "@/components/deco";
import { Button, Container, Section, SectionHead } from "@/components/ui";
import {
  IconArrow,
  IconCheck,
  IconClock,
  IconGrid,
  IconMusic,
  IconUsers,
} from "@/components/icons";

const quick = [
  { href: "/program/", label: "Программа", Icon: IconClock },
  { href: "/masterclasses/", label: "Мастер-классы", Icon: IconGrid },
  { href: "/songs/", label: "Прославление", Icon: IconMusic },
  { href: "/#speakers", label: "Спикеры", Icon: IconUsers },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Путеводитель участника — то, ради чего сканируют QR-код */}
      <Container className="pt-4">
        <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
          <LiveNow />
          <div className="grid content-start gap-3">
            <MyPlan />
            <nav aria-label="Разделы" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {quick.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl bg-white/70 px-1 text-center text-[0.8rem] font-semibold transition-colors hover:bg-white hover:text-cobalt active:scale-[.97]"
                >
                  <Icon className="size-6 text-cobalt" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>

      {/* О конференции */}
      <Section id="about" className="relative overflow-hidden">
        <span className="absolute top-10 -right-4 h-24 w-10 bg-sun lg:h-32" aria-hidden />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <SectionHead title="О конференции" />
            <p className="max-w-lg text-[1.05rem] leading-relaxed">{conference.about}</p>
            <h3 className="display mt-7 text-2xl text-terra">{conference.whyTitle}</h3>
            <p className="mt-2 max-w-lg leading-relaxed">{conference.why}</p>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">{conference.newThisYear}</p>
            <ul className="mt-6 grid gap-2.5">
              {conference.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cobalt/10 text-cobalt">
                    <IconCheck className="size-4" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <Collage variant="a">
            <img
              src="/img/about.webp"
              alt="Открытая Библия на деревянном пирсе у озера на рассвете"
              width={1000}
              height={500}
              loading="lazy"
              decoding="async"
              className="photo-bw aspect-[16/8] w-full rounded-sm object-cover"
            />
          </Collage>
        </div>
        <figure className="mt-10 border-l-4 border-terra pl-4 lg:mt-14 lg:max-w-2xl">
          <blockquote className="text-lg italic leading-snug">{conference.verseText}</blockquote>
          <figcaption className="mt-2 text-sm font-semibold text-terra">{conference.verse}</figcaption>
        </figure>
      </Section>

      {/* Спикеры */}
      <Section id="speakers" className="bg-paper-2/60">
        <SectionHead title="Спикеры" />
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-10">
          {speakers.map((s) => (
            <Link key={s.slug} href={`/speakers/${s.slug}/`} className="group block overflow-hidden rounded-2xl bg-white">
              <div className="relative isolate overflow-hidden bg-speaker-beige">
                <span className="absolute inset-0 -z-10 halftone-soft opacity-25" aria-hidden />
                <img
                  src={s.photo}
                  alt={`${s.firstName} ${s.lastName}`}
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto aspect-square w-4/5 max-w-sm object-cover object-bottom"
                />
              </div>
              <div className="p-5">
                <h3 className="display text-[2rem] text-terra">
                  {s.firstName} {s.lastName}
                </h3>
                <p className="mt-3 border-l-2 border-cobalt pl-3 text-sm leading-snug">
                  {s.roles.map((r) => (
                    <span key={r} className="block">
                      {r}
                    </span>
                  ))}
                </p>
                <p className="mt-3 text-sm font-medium text-muted">{s.church}</p>
                <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-cobalt">
                  {s.topic ? `Тема: ${s.topic}` : "Тема и основные мысли"}
                  <IconArrow className="size-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Программа */}
      <Section id="program">
        <SectionHead
          title="Программа"
          lead={`${conference.dateHuman} · регистрация ${conference.registrationStart}, начало ${conference.start}`}
          more={{ href: "/program/", label: "Подробно" }}
        />
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
          <ProgramOverview />
          <Collage variant="c" className="hidden lg:block">
            <img
              src="/img/bible.webp"
              alt="Открытая Библия"
              width={356}
              height={438}
              loading="lazy"
              decoding="async"
              className="photo-bw aspect-[4/5] w-full rounded-sm object-cover"
            />
          </Collage>
        </div>
      </Section>

      {/* Мастер-классы */}
      <Section id="masterclasses" className="bg-paper-2/60">
        <SectionHead
          title="Мастер-классы"
          lead="Выберите направление — оно сохранится в «Моей конференции»."
          more={{ href: "/masterclasses/", label: "Все" }}
        />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {masterclasses.map((m) => (
            <li key={m.slug} className="w-[44%] shrink-0 snap-start sm:w-auto">
              <Link
                href={`/masterclasses/${m.slug}/`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-ink lg:aspect-[4/3]"
              >
                <img
                  src={m.image}
                  alt=""
                  width={960}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="photo-bw h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                  <span className="min-w-0">
                    <span className="display block text-[1.35rem] leading-[0.95] text-white">{m.title}</span>
                    <span className="mt-1 block text-xs leading-snug text-white/75">{m.host}</span>
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-cobalt">
                    <IconArrow className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li className="hidden lg:block">
            <Link
              href="/masterclasses/"
              className="group flex aspect-[4/3] flex-col justify-between rounded-xl border-2 border-dashed border-line p-4 transition-colors hover:border-cobalt"
            >
              <span className="text-sm text-muted">Все мастер-классы идут параллельно, {masterclasses[0].time}</span>
              <span className="flex items-end justify-between gap-2">
                <span className="display text-2xl text-cobalt">Выбрать свой</span>
                <IconArrow className="size-6 text-cobalt transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>
      </Section>

      {/* Прославление */}
      <Section id="worship" className="relative overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <div className="flex items-center gap-3">
              <IconMusic className="size-9 text-ink" />
              <h2 className="display text-[2.6rem] sm:text-5xl lg:text-6xl">Прославление</h2>
            </div>
            <p className="mt-3 text-muted">Тексты песен, которые мы будем петь вместе.</p>
            <ol className="mt-6 divide-y divide-line rounded-2xl bg-white/70">
              {songs.map((s, i) => (
                <li key={s.slug}>
                  <Link href={`/songs/${s.slug}/`} className="flex min-h-14 items-center gap-4 px-4 hover:text-cobalt">
                    <span className="display w-8 text-2xl text-terra tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-medium">{s.title}</span>
                    <IconArrow className="size-4 text-muted" />
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/songs/" variant="outline">
                Все тексты песен
              </Button>
            </div>
          </div>
          <Collage variant="b" className="relative">
            <img
              src="/img/worship.webp"
              alt="Гитары и клавишные в светлой комнате"
              width={1000}
              height={500}
              loading="lazy"
              decoding="async"
              className="photo-bw aspect-[16/8] w-full rounded-sm object-cover"
            />
            <Scribble className="-top-6 right-4 w-44" />
          </Collage>
        </div>
      </Section>

    </>
  );
}
