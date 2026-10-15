import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { speakers } from "@/content/conference";
import { Button, Container, PageHeader } from "@/components/ui";
import { IconArrow, IconPlay } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return speakers.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = speakers.find((x) => x.slug === slug);
  return { title: s ? `${s.firstName} ${s.lastName}` : "Спикер", description: s?.topic };
}

export default async function SpeakerPage({ params }: Props) {
  const { slug } = await params;
  const i = speakers.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const s = speakers[i];
  const others = speakers.filter((x) => x.slug !== slug);

  return (
    <>
      <PageHeader title={`${s.firstName} ${s.lastName}`} lead={s.church} back={{ href: "/#speakers", label: "Спикеры" }} />
      <Container className="grid gap-8 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:py-10">
        <div className="relative isolate overflow-hidden rounded-2xl bg-speaker-beige">
          <span className="absolute inset-0 -z-10 halftone-soft opacity-25" aria-hidden />
          <img
            src={s.photo}
            alt={`${s.firstName} ${s.lastName}`}
            width={640}
            height={640}
            decoding="async"
            className="mx-auto aspect-square w-4/5 max-w-sm object-cover object-bottom"
          />
        </div>

        <div>
          <p className="border-l-2 border-cobalt pl-3 leading-snug">
            {s.roles.map((r) => (
              <span key={r} className="block">
                {r}
              </span>
            ))}
          </p>

          <section className="mt-8">
            <p className="eyebrow text-cobalt">{s.when ?? "Проповедь"}</p>
            <h2 className="display mt-2 text-4xl text-terra">{s.topic ?? "Тема уточняется"}</h2>
          </section>

          <section className="mt-8">
            <h3 className="display text-2xl">Основные мысли</h3>
            {s.summary?.length ? (
              <ol className="mt-3 grid gap-3">
                {s.summary.map((t, k) => (
                  <li key={k} className="flex gap-3 rounded-2xl bg-white p-4 leading-relaxed">
                    <span className="display w-6 shrink-0 text-2xl text-terra tabular-nums">{k + 1}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 rounded-2xl border-2 border-dashed border-line p-5 text-muted">
                Основные мысли проповеди появятся здесь после конференции.
              </p>
            )}
          </section>

          {s.recordingUrl && (
            <Button href={s.recordingUrl} external className="mt-6">
              <IconPlay className="size-4" /> Запись проповеди
            </Button>
          )}

          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/speakers/${o.slug}/`}
              className="mt-10 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 font-semibold hover:text-cobalt"
            >
              <span>
                <span className="block text-xs font-normal text-muted">Другой спикер</span>
                {o.firstName} {o.lastName}
              </span>
              <IconArrow className="size-5" />
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
