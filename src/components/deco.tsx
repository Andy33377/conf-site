import type { ReactNode } from "react";

/** Жёлтый «росчерк» как на афише */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 60"
      className={`pointer-events-none absolute ${className}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M2 52C40 40 90 18 150 6c10-2 14 2 4 8-18 11-50 26-60 34 30-12 70-26 104-36"
        stroke="var(--color-sun)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Variant = "a" | "b" | "c";

/**
 * Коллажная рамка: фото + синий и жёлтый блоки + растровые точки.
 * Декор чисто на CSS — ноль дополнительных картинок.
 */
export function Collage({
  children,
  variant = "a",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div className={`relative isolate ${className}`}>
      {variant === "a" && (
        <>
          <span className="absolute -top-3 -right-2 z-[-1] h-1/3 w-1/4 bg-cobalt" />
          <span className="absolute -bottom-3 -left-3 z-[-1] h-1/2 w-1/3 halftone opacity-70" />
          <span className="absolute -bottom-2 right-6 z-10 h-4 w-14 bg-sun" />
        </>
      )}
      {variant === "b" && (
        <>
          <span className="absolute -top-3 -left-3 z-[-1] h-2/5 w-1/3 halftone opacity-70" />
          <span className="absolute -right-3 bottom-4 z-[-1] h-2/5 w-1/5 bg-sun" />
          <span className="absolute -bottom-3 left-8 z-10 h-5 w-10 bg-cobalt" />
        </>
      )}
      {variant === "c" && (
        <>
          <span className="absolute -top-2 right-10 z-10 h-5 w-16 bg-sun" />
          <span className="absolute -bottom-3 -right-3 z-[-1] h-1/2 w-2/5 halftone opacity-60" />
          <span className="absolute -left-2 top-6 z-[-1] h-1/3 w-1/6 bg-cobalt" />
        </>
      )}
      {children}
    </div>
  );
}
