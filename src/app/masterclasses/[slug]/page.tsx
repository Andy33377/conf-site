import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { masterclasses } from "@/content/conference";
import { Container, PageHeader } from "@/components/ui";
import { Collage } from "@/components/deco";
import { ChooseButton } from "@/components/my-plan";
import { IconArrow, IconClock, IconUsers } from "@/components/icons";
import { Notes } from "@/components/notes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return masterclasses.map((m) => ({ slug: m.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = masterclasses.find((x) => x.slug === slug);
  return { title: m ? `Мастер-класс «${m.title}»` : "Мастер-класс", description: m?.short };
}

export default async function MasterclassPage({ params }: Props) {
  const { slug } = await params;
  const m = masterclasses.find((x) => x.slug === slug);
  if (!m) notFound();
  const others = masterclasses.filter((x) => x.slug !== slug);

  return (
    <>
      <PageHeader title={m.title} back={{ href: "/masterclasses/", label: "Все мастер-классы" }} />
      <Container className="grid gap-8 py-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-10">
        <Collage variant="c" className="lg:order-2">
          <img
            src={m.image}
            alt=""
            width={960}
            height={600}
            decoding="async"
            className="photo-bw aspect-[16/10] w-full rounded-sm object-cover"
          />
        </Collage>
        <div>
          <p className="text-lg leading-relaxed">{m.description}</p>
          <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-4">
            <Row icon={<IconClock />} label="Время" value={m.time} />
            <Row icon={<IconUsers />} label="Ведущий" value={m.host} />
          </ul>
          <p className="mt-5 text-sm text-muted">
            <b className="text-ink">Для кого:</b> {m.forWhom}
          </p>
          <div className="mt-7">
            <ChooseButton slug={m.slug} />
          </div>

          <section className="mt-10">
            <h2 className="display text-3xl">Материалы</h2>
            {m.presentation && (
              <figure className="mt-3 overflow-hidden rounded-2xl bg-white">
                <img
                  src={m.presentation.src}
                  alt={m.presentation.alt}
                  width={m.presentation.width}
                  height={m.presentation.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                />
                <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-muted">
                  <span>Презентация ведущего</span>
                  <a href={m.presentation.src} download className="font-semibold text-cobalt hover:underline">
                    Скачать
                  </a>
                </figcaption>
              </figure>
            )}
            {m.slides && (
              <div className="mt-3 overflow-hidden rounded-2xl bg-white">
                <div className="grid gap-1 bg-line">
                  {m.slides.images.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${m.slides!.title} — слайд ${i + 1}`}
                      width={m.slides!.width}
                      height={m.slides!.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-muted">
                  <span>Презентация ведущего · {m.slides.images.length} слайдов</span>
                  {m.slides.pdf && (
                    <a href={m.slides.pdf} download className="font-semibold text-cobalt hover:underline">
                      Скачать PDF
                    </a>
                  )}
                </div>
              </div>
            )}
            {m.materials?.length ? (
              <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-white">
                {m.materials.map((f) => (
                  <li key={f.url}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-14 items-center justify-between gap-3 px-4 font-semibold hover:text-cobalt"
                    >
                      {f.title} <IconArrow className="size-4 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : m.presentation || m.slides ? null : (
              <p className="mt-3 rounded-2xl border-2 border-dashed border-line p-5 text-muted">
                Презентации и конспекты от ведущего появятся здесь.
              </p>
            )}
          </section>

          <Notes id={`mc-${m.slug}`} title={`Мастер-класс «${m.title}» — ${m.host}`} />
        </div>
      </Container>
      <Container className="pb-12">
        <h2 className="display mb-4 text-3xl">Другие направления</h2>
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {others.map((o) => (
            <li key={o.slug} className="shrink-0">
              <Link
                href={`/masterclasses/${o.slug}/`}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-white/60 px-4 text-sm font-semibold hover:border-cobalt hover:text-cobalt"
              >
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cobalt/10 text-cobalt">{icon}</span>
      <span>
        <span className="block text-xs text-muted">{label}</span>
        <span className="block font-semibold">{value}</span>
      </span>
    </li>
  );
}
