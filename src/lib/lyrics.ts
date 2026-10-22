import { readFileSync } from "node:fs";
import path from "node:path";

export type Stanza = { label?: string; lines: string[] };

/** Подпись части с двоеточием: «Припев:», «1 куплет:», «Бридж: x2», «• Припев:» */
const LABEL = /^[•\-\s]*([0-9]*\s*[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9 ()—–\-]{0,40}):\s*([xхXХ]\s*\d+)?\s*$/;
/** Подпись без двоеточия — только для известных слов: «Припев», «2 куплет», «Бридж x2» */
const KEYWORD =
  /^[•\-\s]*((?:\d+\s*)?(?:финальный\s+)?(?:пред\s*-?\s*припев|припев|куплет|бридж|запев|кода|концовка)(?:\s*\d+)?)\s*([xхXХ]\s*\d+)?\s*$/i;

function parseLabel(line: string): string | null {
  const m = line.match(LABEL) ?? line.match(KEYWORD);
  if (!m) return null;
  const label = m[1].trim() + (m[2] ? ` ${m[2].replace(/\s+/g, "")}` : "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Читает src/content/lyrics/<slug>.txt при сборке и делит на части */
export function getLyrics(slug: string): Stanza[] {
  let raw = "";
  try {
    raw = readFileSync(path.join(process.cwd(), "src/content/lyrics", `${slug}.txt`), "utf8");
  } catch {
    return [];
  }
  const blocks = raw
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean))
    .filter((b) => b.length);

  // Первая строка-одиночка без подписи — это название песни, оно уже в заголовке страницы
  if (blocks.length > 1 && blocks[0].length === 1 && !parseLabel(blocks[0][0])) blocks.shift();

  const out: Stanza[] = [];
  let pending: string | undefined; // подпись, после которой стоит пустая строка
  for (const b of blocks) {
    const label = parseLabel(b[0]);
    const lines = label ? b.slice(1) : b;
    if (label && !lines.length) {
      pending = label;
      continue;
    }
    out.push({ label: label ?? pending, lines });
    pending = undefined;
  }
  if (pending) out.push({ label: pending, lines: [] });
  return out;
}
