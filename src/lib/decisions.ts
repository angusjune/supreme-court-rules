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

/** The Court sits in Washington, DC — its calendar day is Eastern, not the builder's. */
export const COURT_TZ = 'America/New_York';

/** A civil date ("YYYY-MM-DD"): a day on a calendar, with no time or zone of its own. */
export type Day = string;

/** The calendar day an instant falls on, in `timeZone`. */
function civilDate(instant: Date, timeZone: string): Day {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/**
 * The Court's calendar day right now. Pinned to Eastern: a build running at 02:00
 * UTC is still on the previous day at the Court, and must not advance the feed.
 */
export function courtToday(now: Date = new Date()): Day {
  return civilDate(now, COURT_TZ);
}

/**
 * The calendar day of a frontmatter date. `z.coerce.date()` turns `2026-06-30` into
 * UTC midnight, which is an instant, not a day — read it back in UTC or a builder
 * west of Greenwich sees June 29.
 */
export function dayOf(date: Date): Day {
  return civilDate(date, 'UTC');
}

export function formatDay(day: Day, lang: Lang): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Intl.DateTimeFormat(LOCALE[lang] ?? LOCALE.en, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Display a frontmatter date (a calendar day) in `lang`. */
export function formatDate(date: Date, lang: Lang): string {
  return formatDay(dayOf(date), lang);
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

/** The decisions issued on a given calendar day (the "today" set). */
export function decisionsOn(entries: DecisionEntry[], day: Day): DecisionEntry[] {
  return entries.filter((e) => dayOf(e.data.date) === day);
}
