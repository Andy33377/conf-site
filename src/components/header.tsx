import Link from "next/link";
import { Container } from "./ui";
import { IconCross } from "./icons";

export const nav = [
  { href: "/#about", label: "О конференции" },
  { href: "/#speakers", label: "Спикеры" },
  { href: "/program/", label: "Программа" },
  { href: "/masterclasses/", label: "Мастер-классы" },
  { href: "/songs/", label: "Прославление" },
  { href: "/info/", label: "Участнику" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="На главную">
      <IconCross className="size-5 text-terra" />
      <span className="display text-[0.95rem] leading-[0.9] tracking-normal">
        Я знаю,
        <br />в Кого я уверовал
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-paper">
      <Container className="flex h-14 items-center justify-between gap-6 sm:h-16">
        <Logo />
        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="py-2 text-ink/80 transition-colors hover:text-cobalt">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
