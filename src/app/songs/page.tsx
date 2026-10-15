import type { Metadata } from "next";
import Link from "next/link";
import { songs } from "@/content/conference";
import { Container, PageHeader } from "@/components/ui";
import { IconChevron } from "@/components/icons";

export const metadata: Metadata = { title: "Прославление" };

export default function SongsPage() {
  return (
    <>
      <PageHeader title="Прославление" lead="Вместе будем прославлять Бога в пении и молитве. Тексты песен — чтобы петь вместе, даже если не знаешь слов." />
      <Container className="max-w-3xl py-6 lg:py-10">
        <ol className="divide-y divide-line overflow-hidden rounded-2xl bg-white">
          {songs.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/songs/${s.slug}/`} className="flex min-h-16 items-center gap-4 px-4 hover:bg-paper/60">
                <span className="display w-8 text-2xl text-terra tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-semibold">{s.title}</span>
                  {s.author && <span className="block text-sm text-muted">{s.author}</span>}
                </span>
                <IconChevron className="size-5 text-muted" />
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
