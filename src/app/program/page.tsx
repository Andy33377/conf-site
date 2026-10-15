import type { Metadata } from "next";
import { conference } from "@/content/conference";
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
        <Timeline />
      </Container>
    </>
  );
}
