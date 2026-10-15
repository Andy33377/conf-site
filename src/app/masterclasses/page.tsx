import type { Metadata } from "next";
import Link from "next/link";
import { masterclasses } from "@/content/conference";
import { Container, PageHeader } from "@/components/ui";
import { MyPlan } from "@/components/my-plan";
import { IconArrow } from "@/components/icons";

export const metadata: Metadata = { title: "Мастер-классы" };

export default function MasterclassesPage() {
  return (
    <>
      <PageHeader
        title="Мастер-классы"
        lead={`Выбери направление, которое вдохновит и поможет развиваться. Все мастер-классы идут параллельно, ${masterclasses[0].time}.`}
      />
      <Container className="py-6 lg:py-10">
        <div className="mb-6 max-w-xl">
          <MyPlan />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {masterclasses.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/masterclasses/${m.slug}/`}
                className="group flex h-full gap-4 rounded-2xl bg-white p-3 transition-shadow hover:shadow-[0_14px_40px_-24px_rgba(0,0,0,.5)] sm:flex-col sm:p-0"
              >
                <span className="relative block w-28 shrink-0 overflow-hidden rounded-xl sm:w-full sm:rounded-b-none">
                  <img
                    src={m.image}
                    alt=""
                    width={960}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="photo-bw aspect-square h-full w-full object-cover sm:aspect-[16/10]"
                  />
                  <span className="absolute right-0 bottom-0 hidden size-9 place-items-center bg-cobalt text-white sm:grid">
                    <IconArrow className="size-4" />
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center py-1 sm:p-5 sm:pt-3">
                  <span className="display text-[1.7rem] text-terra">{m.title}</span>
                  <span className="mt-1 text-sm text-muted">{m.short}</span>
                  <span className="mt-2 text-xs font-semibold text-cobalt">{m.host}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
