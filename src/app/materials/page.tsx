import type { Metadata } from "next";
import { conference, materials } from "@/content/conference";
import { Container, PageHeader } from "@/components/ui";
import { IconBook } from "@/components/icons";

export const metadata: Metadata = { title: "Материалы и записи" };

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        title="Материалы"
        lead={`Записи проповедей, презентации мастер-классов и фото появятся здесь после ${conference.dateHuman.replace(" 2026", "")}.`}
      />
      <Container className="py-6 lg:py-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((m) => (
            <li key={m.title} className="flex items-center gap-4 rounded-2xl bg-white p-4 lg:flex-col lg:items-start lg:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper text-cobalt">
                <IconBook className="size-6" />
              </span>
              <span>
                <span className="display block text-2xl">{m.title}</span>
                <span className="block text-sm text-muted">{m.kind}</span>
                <span className="mt-1 inline-block rounded-full bg-sun/30 px-2 py-0.5 text-xs font-semibold">Скоро</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
