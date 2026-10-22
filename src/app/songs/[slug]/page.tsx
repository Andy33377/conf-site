import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { songs } from "@/content/conference";
import { Container, PageHeader } from "@/components/ui";
import { IconArrow, IconBack } from "@/components/icons";
import { getLyrics } from "@/lib/lyrics";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return songs.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = songs.find((x) => x.slug === slug);
  return { title: s ? `«${s.title}» — текст` : "Песня" };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const i = songs.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const s = songs[i];
  const prev = songs[i - 1];
  const next = songs[i + 1];
  const stanzas = getLyrics(s.slug);

  return (
    <>
      <PageHeader title={s.title} lead={s.author} back={{ href: "/songs/", label: "Прославление" }} />
      <Container className="max-w-2xl py-6 lg:py-10">
        {stanzas.length ? (
          <div className="space-y-7 text-[1.25rem] leading-[1.6] sm:text-2xl">
            {stanzas.map((st, k) => (
              <div key={k}>
                {st.label && (
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-terra sm:text-sm">{st.label}</p>
                )}
                {st.lines.length > 0 && <p className="whitespace-pre-line">{st.lines.join("\n")}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-line p-6 text-muted">
            Текст песни появится ближе к конференции.
          </p>
        )}

        <nav className="mt-12 grid grid-cols-2 gap-3" aria-label="Соседние песни">
          {prev ? (
            <Link href={`/songs/${prev.slug}/`} className="flex min-h-14 items-center gap-2 rounded-xl bg-white px-4 font-semibold hover:text-cobalt">
              <IconBack className="size-5 shrink-0" /> <span className="truncate">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/songs/${next.slug}/`} className="flex min-h-14 items-center justify-end gap-2 rounded-xl bg-white px-4 text-right font-semibold hover:text-cobalt">
              <span className="truncate">{next.title}</span> <IconArrow className="size-5 shrink-0" />
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}
