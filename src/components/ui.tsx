import Link from "next/link";
import type { ReactNode } from "react";
import { IconBack, IconChevron } from "./icons";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-10 sm:py-14 lg:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHead({
  title,
  lead,
  more,
  as: Tag = "h2",
}: {
  title: string;
  lead?: string;
  more?: { href: string; label: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        <Tag className="display text-[2.6rem] sm:text-5xl lg:text-6xl">{title}</Tag>
        {lead && <p className="mt-3 max-w-xl text-[0.95rem] text-muted sm:text-base">{lead}</p>}
      </div>
      {more && (
        <Link
          href={more.href}
          className="group mb-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-cobalt"
        >
          {more.label}
          <IconChevron className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "light";
  className?: string;
  external?: boolean;
}) {
  const styles = {
    solid: "bg-cobalt text-white hover:bg-cobalt-dark shadow-[0_6px_20px_-8px_rgba(20,56,224,.7)]",
    outline: "border-2 border-cobalt text-cobalt hover:bg-cobalt hover:text-white",
    light: "bg-white text-cobalt hover:bg-paper",
  }[variant];
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold transition-colors active:scale-[.98] ${styles} ${className}`;
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Шапка внутренних страниц: «назад» + большой заголовок */
export function PageHeader({
  title,
  lead,
  back = { href: "/", label: "Главная" },
}: {
  title: string;
  lead?: string;
  back?: { href: string; label: string };
}) {
  return (
    <Container className="pt-5 pb-2 sm:pt-10">
      <Link
        href={back.href}
        className="-ml-1 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-muted hover:text-ink"
      >
        <IconBack className="size-4" />
        {back.label}
      </Link>
      <h1 className="display mt-2 text-[2.9rem] sm:text-6xl lg:text-7xl">{title}</h1>
      {lead && <p className="mt-3 max-w-2xl text-muted">{lead}</p>}
    </Container>
  );
}
