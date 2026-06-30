import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LANG, type Lang } from '../i18n/ui';

export type DecisionEntry = CollectionEntry<'decisions'>;
export type Lean = 'conservative' | 'liberal' | 'center';

const NAME_SUFFIX = /^(jr|sr|ii|iii|iv)\.?$/i;

/** Surname from a full name ("John G. Roberts Jr." -> "Roberts"). */
export function surnameOf(name: string): string {
  const words = name.split(/\s+/).filter((w) => w && !NAME_SUFFIX.test(w));
  const last = words[words.length - 1] ?? name;
  return last.replace(/[^A-Za-z]/g, '');
}

/**
 * Build a resolver mapping a free-text justice reference (e.g.
 * "Justice Samuel Alito (joined by Justice Gorsuch)") to that justice's lean,
 * matching on the EARLIEST surname that appears (the primary author).
 */
export function makeLeanResolver(
  justices: CollectionEntry<'justices'>[],
): (name: string) => Lean | null {
  const entries = justices
    .map((j) => ({ surname: surnameOf(j.data.name).toLowerCase(), lean: j.data.lean }))
    .filter((e) => e.surname);
  return (name: string) => {
    const lower = name.toLowerCase();
    let bestIdx = Infinity;
    let bestLean: Lean | null = null;
    for (const e of entries) {
      const idx = lower.indexOf(e.surname);
      if (idx !== -1 && idx < bestIdx) {
        bestIdx = idx;
        bestLean = e.lean;
      }
    }
    return bestLean;
  };
}

const LOCALE: Record<Lang, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

/** YYYY-MM-DD in local time, for stable same-day comparison. */
export function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang] ?? LOCALE.en, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** The decision slug for an entry (id is "<slug>/<lang>"). */
export function slugOf(entry: DecisionEntry): string {
  return entry.data.slug ?? entry.id.split('/')[0];
}

/** All decision entries across all languages. */
export async function allDecisions(): Promise<DecisionEntry[]> {
  return getCollection('decisions');
}

/** One entry per decision (the default-language entry), newest first. */
export async function decisionFeed(): Promise<DecisionEntry[]> {
  const all = await allDecisions();
  return all
    .filter((e) => e.data.lang === DEFAULT_LANG)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Group every entry by decision slug. */
export async function decisionsBySlug(): Promise<Map<string, DecisionEntry[]>> {
  const all = await allDecisions();
  const map = new Map<string, DecisionEntry[]>();
  for (const e of all) {
    const slug = slugOf(e);
    const list = map.get(slug) ?? [];
    list.push(e);
    map.set(slug, list);
  }
  return map;
}

/** Languages that actually exist for a decision, in canonical order. */
export function availableLangs(entries: DecisionEntry[]): Lang[] {
  const order: Lang[] = ['en', 'fr', 'ja', 'zh'];
  const present = new Set(entries.map((e) => e.data.lang));
  return order.filter((l) => present.has(l));
}

/** Decisions whose date matches the given build date (the "today" set). */
export function decisionsOn(entries: DecisionEntry[], today: Date): DecisionEntry[] {
  const key = ymd(today);
  return entries.filter((e) => ymd(e.data.date) === key);
}
