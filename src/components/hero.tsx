import { conference } from "@/content/conference";
import { Container } from "./ui";
import { Scribble } from "./deco";
import { LiveNow } from "./live-now";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-6 lg:pb-10">
      {/* декоративные элементы фона */}
      <span className="absolute top-40 -left-6 h-28 w-8 bg-cobalt lg:top-64 lg:h-40 lg:w-10" aria-hidden />
      <span className="absolute top-24 -left-2 h-48 w-24 halftone-fade opacity-40" aria-hidden />

      <Container className="relative">
        <div className="grid items-end gap-2 pt-6 lg:grid-cols-[1.05fr_1fr] lg:gap-0 lg:pt-12">
          {/* Текст */}
          <div className="relative z-10">
            <p className="eyebrow rise text-cobalt">{conference.label}</p>
            <h1
              className="display rise rise-2 mt-3 text-terra text-[clamp(4.2rem,22vw,9.8rem)] lg:text-[clamp(5.5rem,8.2vw,8.6rem)]"
              aria-label={conference.title}
            >
              {conference.titleLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h1>
            <p className="rise rise-3 mt-4 flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-cobalt">
              <span className="h-0.5 w-10 bg-cobalt" aria-hidden />2 Тимофею 1:12
            </p>
          </div>

          {/* Коллаж */}
          <div className="relative -mx-4 mt-2 sm:mx-0 lg:-ml-6 lg:mt-0">
            <span className="absolute -top-3 right-6 z-10 h-16 w-12 bg-cobalt sm:right-10" aria-hidden />
            <span className="absolute bottom-6 -left-1 z-10 h-10 w-24 bg-cobalt" aria-hidden />
            <span className="absolute right-0 bottom-0 z-10 h-24 w-28 halftone opacity-80" aria-hidden />
            <img
              src="/img/hero.webp"
              alt="Молодой человек с рюкзаком поднимается по ступеням к светящемуся кресту"
              width={902}
              height={664}
              fetchPriority="high"
              decoding="async"
              className="relative aspect-[902/664] w-full object-cover lg:aspect-[5/4] [clip-path:polygon(6%_6%,100%_0,100%_100%,0_100%,0_22%)]"
            />
            <Scribble className="-bottom-2 left-6 z-20 w-40 lg:w-56" />
          </div>
        </div>

        {/* Тёмная карточка: до конференции — дата, время и место; в день — «Сейчас идёт» */}
        <div className="relative z-20 -mt-4 lg:-mt-8">
          <LiveNow />
        </div>
      </Container>
    </section>
  );
}
