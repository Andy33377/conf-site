import Link from "next/link";
import { conference } from "@/content/conference";
import { Container } from "./ui";
import { Logo, nav } from "./header";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2/60 pt-10 pb-28 lg:pb-12">
      <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted">
            {conference.label}
            <br />
            {conference.dateHuman} · {conference.city}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink/75 hover:text-cobalt">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3">
          {conference.socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-cobalt hover:text-cobalt"
            >
              {s.name}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
