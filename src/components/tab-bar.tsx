"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconClock, IconGrid, IconHome, IconMusic } from "./icons";

const tabs = [
  { href: "/", label: "Главная", Icon: IconHome },
  { href: "/program/", label: "Программа", Icon: IconClock },
  { href: "/masterclasses/", label: "Классы", Icon: IconGrid },
  { href: "/songs/", label: "Песни", Icon: IconMusic },
];

/** Нижняя панель как в приложении — только на телефонах */
export function TabBar() {
  const path = usePathname() || "/";
  const norm = path.endsWith("/") ? path : path + "/";

  return (
    <nav
      aria-label="Быстрая навигация"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === "/" ? norm === "/" : norm.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold transition-colors ${
                  active ? "text-cobalt" : "text-muted"
                }`}
              >
                <span
                  className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${
                    active ? "bg-cobalt/10" : ""
                  }`}
                >
                  <Icon className="size-[1.3rem]" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
