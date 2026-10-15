import type { Metadata, Viewport } from "next";
import { conference } from "@/content/conference";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TabBar } from "@/components/tab-bar";
import "./globals.css";

// Шрифты лежат в node_modules и раздаются с вашего же домена (без Google Fonts).
// Браузер скачивает только нужные наборы символов (кириллица/латиница) благодаря unicode-range.
import "@fontsource/fira-sans-extra-condensed/cyrillic-800.css";
import "@fontsource/fira-sans-extra-condensed/latin-800.css";
import "@fontsource-variable/inter/wght.css";

export const metadata: Metadata = {
  // Замените на реальный домен после публикации — нужен для превью в мессенджерах
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${conference.title} — ${conference.label}`,
    template: `%s · ${conference.title}`,
  },
  description: `${conference.label}. ${conference.dateHuman}, ${conference.city}. Программа, мастер-классы, спикеры и песни прославления.`,
  openGraph: {
    title: conference.title,
    description: `${conference.label} · ${conference.dateHuman} · ${conference.city}`,
    images: ["/img/hero.webp"],
    locale: "ru_RU",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f3eee5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-cobalt focus:px-4 focus:py-2 focus:text-white"
        >
          К содержанию
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
