import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Decisions collection.
 *
 * One MDX file PER DECISION PER LANGUAGE:
 *   src/data/decisions/<slug>/<lang>.mdx   (lang = en | fr | ja | zh)
 *
 * The collection `id` becomes `<slug>/<lang>` (e.g. "trump-v-casa/en").
 * Structured facts are identical across a decision's four files; translatable
 * text (caseName?, winner, loser, holding, courtOpinionSummary, dissentSummary,
 * topics) and the MDX body are written natively per language.
 */
const decisions = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/data/decisions',
    // Derive the id from the file path ("<slug>/<lang>") so it is unique per
    // language. Without this, the `slug` frontmatter field would override the id
    // and collapse a decision's four language files into one entry.
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    slug: z.string(), // shared decision key, identical across the language files
    lang: z.enum(['en', 'fr', 'ja', 'zh']),
    caseName: z.string(),
    date: z.coerce.date(), // decision date — drives the "today" logic
    term: z.string().optional(), // e.g. "2024" (OT2024)
    docket: z.string().optional(),
    vote: z.string(), // e.g. "6-3"
    majorityAuthor: z.string(),
    joinedBy: z.array(z.string()).default([]),
    concurrences: z.array(z.string()).default([]),
    dissentBy: z.array(z.string()).default([]),
    winner: z.string(),
    loser: z.string(),
    // Canonical disposition key (affirmed, reversed, reversed-remanded, vacated,
    // vacated-remanded, dismissed, affirmed-in-part, ...). Labelled via src/i18n/ui.ts.
    disposition: z.string(),
    lowerCourt: z.string().optional(),
    holding: z.string(), // one-line plain-language holding
    // A paragraph on the MAJORITY's reasoning. (Field name kept for back-compat; it
    // now stands specifically for the majority opinion, paired with `dissentSummary`.)
    courtOpinionSummary: z.string(),
    // A paragraph on the DISSENT's reasoning. Include it whenever `dissentBy` is
    // non-empty; omit for unanimous decisions with no dissent. Optional (not enforced
    // by a refine) so pre-existing entries without it keep validating.
    dissentSummary: z.string().optional(),
    topics: z.array(z.string()).default([]),
    sources: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    featured: z.boolean().default(false),
    // Which ideological side the ruling favors (editorial classification).
    outcomeLean: z.enum(['conservative', 'liberal', 'neutral']).optional(),
  }),
});

/**
 * Justices collection. One MDX file per justice: src/data/justices/<id>.mdx
 * English only (i18n is scoped to decision details).
 */
const justices = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/justices' }),
  schema: z.object({
    name: z.string(),
    role: z.enum(['Chief Justice', 'Associate Justice']),
    appointedBy: z.string(),
    confirmedYear: z.number(),
    lean: z.enum(['conservative', 'liberal', 'center']),
    predecessor: z.string().optional(),
    seatNumber: z.number().optional(),
    photo: z.string().url(),
    order: z.number().default(99), // Chief = 0, then by seniority
  }),
});

/**
 * Justice editorials. One MDX file per justice: src/data/justice-editorials/<id>.mdx
 * (the file id matches the justices-collection id). Kept SEPARATE from the factual bio
 * so the editorial can be rewritten periodically without touching the biography.
 */
const justiceEditorials = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/data/justice-editorials',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    justice: z.string(), // justice id this editorial is about
    thesis: z.string().optional(), // one-line take
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { decisions, justices, justiceEditorials };
