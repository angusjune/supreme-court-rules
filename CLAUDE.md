# CLAUDE.md

"Supreme Court Today" — a static **Astro 7** site (two tabs: Decisions feed + Justices)
answering "What did the US Supreme Court rule today?". Decision details are multilingual
(en/fr/ja/zh); the feed and Justices are English-only. Content is updated daily by a Claude
Routine that commits to `main`.

See `README.md` (overview/layout) and `CONTENT.md` (content schema + how to add
decisions/editorials) — keep both current when the model changes.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> dist/
npm run preview  # serve the built dist/
npm run check    # astro check (types + content validation)
```

Node >= 22.12.

## Content model

- Each decision = FOUR files: `src/data/decisions/<slug>/{en,fr,ja,zh}.mdx`
  (collection id is `<slug>/<lang>`; the folder name MUST equal the `slug:` frontmatter).
- Justices: `src/data/justices/<id>.mdx` (bio) + `src/data/justice-editorials/<id>.mdx`
  (opinionated take, kept separate so it can be rewritten without touching the bio).
- For content/routine work, only edit files under `src/data/` — never components, config,
  schema, or build setup.

## Gotchas (non-obvious — each of these has bitten us)

- **Astro 7's Rust compiler is strict.** Close every non-void tag; MDX bodies are plain
  Markdown (no loose raw HTML); `compressHTML` defaults to `'jsx'`, so whitespace between
  inline elements collapses — add explicit spaces / `{' '}` where a gap matters.
- **A `slug` frontmatter field overrides the content-layer entry `id`.** The `decisions`
  and `justiceEditorials` loaders pass `generateId` to derive the id from the file path.
  Do NOT remove it — without it a decision's four language files collapse to one id and
  only the last (zh) survives.
- **Justice names stay in ENGLISH in every language file** (`majorityAuthor`, `joinedBy`,
  `concurrences`, `dissentBy`). The political-lean dots match English surnames, so a
  localized name loses its dot. `DecisionArticle.astro` re-sources these from the English
  sibling entry as a safety net — keep the data clean anyway.
- **"Today" is computed at build time** (`new Date()` in `src/pages/index.astro`), so the
  site must be rebuilt daily for the "No decisions today" state to advance.
- **Tailwind v4 `@theme` tokens auto-generate utilities.** `--color-*` in
  `src/styles/global.css` creates `text-*`/`bg-*`/`border-*` classes; avoid names that
  collide with Tailwind's own utilities (the lean color is `centrist`, not `center`, which
  would clash with `text-center`).

## Conventions

- Styling: Tailwind v4 via `@tailwindcss/vite`, using the `@theme` tokens
  (`text-ink`, `text-muted`, `border-line`, `bg-surface`, `text-accent`, …).
- Chrome/UI labels come from `t(lang)` in `src/i18n/ui.ts` — never hardcode chrome text in
  components or content. `outcomeLean` (conservative|liberal|neutral) drives the feed/title
  dots; `makeLeanResolver` in `src/lib/decisions.ts` maps a justice name → lean by surname.
- A decision carries TWO neutral reasoning fields: `courtOpinionSummary` (the majority) and
  the optional `dissentSummary` (the dissent — include it whenever `dissentBy` is non-empty),
  rendered as "The majority's opinion" / "The dissent". Editorial `##` section titles are a
  FIXED harness with one blessed translation per language (see `CONTENT.md`) — copy them
  verbatim; don't re-translate, or the four titles drift across decisions.
```
