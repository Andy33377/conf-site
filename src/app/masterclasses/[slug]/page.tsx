import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { masterclasses } from "@/content/conference";
import { Container, PageHeader } from "@/components/ui";
import { Collage } from "@/components/deco";
import { ChooseButton } from "@/components/my-plan";
import { IconClock, IconPin, IconUsers } from "@/components/icons";

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
            width={244}
            height={204}
            decoding="async"
            className="photo-bw aspect-[16/10] w-full rounded-sm object-cover"
          />
        </Collage>
        <div>
          <p className="text-lg leading-relaxed">{m.description}</p>
          <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-4">
            <Row icon={<IconClock />} label="Время" value={m.time} />
            <Row icon={<IconPin />} label="Где" value={m.room} />
            <Row icon={<IconUsers />} label="Ведущий" value={m.host} />
          </ul>
          <p className="mt-5 text-sm text-muted">
            <b className="text-ink">Для кого:</b> {m.forWhom}
          </p>
          <div className="mt-7">
            <ChooseButton slug={m.slug} />
          </div>
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
