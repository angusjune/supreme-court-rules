# Supreme Court Today

> What did the US Supreme Court rule today?

A static site (Astro 7) with two tabs:

- **Decisions** — a feed of Supreme Court decisions. Today's decision is featured
  prominently with full facts and an editorial excerpt; older decisions appear as a
  compact list. If the Court issued nothing today, the feed shows **"No decisions today."**
- **Justices** — profiles of the nine justices: appointment, political lean, and notable
  rulings.

Each **decision detail** page gives the outcome (who won, who lost, the disposition),
neutral summaries of the majority and (where there is one) the dissent opinions, links to
primary sources, and — the point of the site — an **opinionated editorial** on the ruling. Decision details are available in **English,
French, Japanese, and Chinese** via a per-page language switcher.

## Stack

- [Astro 7](https://astro.build) — static output (`output: 'static'`), no SSR adapter.
- `@astrojs/mdx` — content as MDX.
- Tailwind CSS v4 via `@tailwindcss/vite`.
- Content Collections (Content Layer API) with the `glob()` loader.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static build -> dist/
npm run preview    # preview the production build
npm run check      # astro check (type + content validation)
```

Requires Node ≥ 22.12.

## Project layout

```
src/
  content.config.ts        # collection schemas (decisions, justices)
  i18n/ui.ts               # UI label dictionary (en/fr/ja/zh) + disposition labels
  lib/decisions.ts         # feed/grouping/date helpers
  layouts/BaseLayout.astro
  components/              # Nav, HeroDecision, DecisionArticle, LanguageSwitcher, ...
  pages/
    index.astro                       # Decisions feed
    decisions/[slug]/index.astro      # decision detail (English)
    decisions/[slug]/[lang].astro     # decision detail (fr/ja/zh)
    justices/index.astro              # justices grid
    justices/[id].astro               # justice detail
  data/
    decisions/<slug>/{en,fr,ja,zh}.mdx
    justices/<id>.mdx
templates/                # copy-to-create templates for the daily routine
```

## Updating content

See [`CONTENT.md`](./CONTENT.md) — the schema and the daily-update workflow (each decision
is four MDX files, one per language).

## Deploy

Static output (`dist/`), deployed on **Netlify**, which builds on every push to `main`.

**The site must also rebuild every day**, not just when content changes. "Today" is baked
in at build time, so on a day the Court issues nothing there is no commit, no rebuild, and
the feed keeps showing a stale date. `.github/workflows/daily-rebuild.yml` POSTs a Netlify
build hook just after midnight Eastern. Create the hook under Project configuration →
Build & deploy → Continuous deployment → Build hooks (branch: `main`) and add its URL as a
`DEPLOY_HOOK_URL` repo secret:

```bash
gh secret set DEPLOY_HOOK_URL --repo angusjune/supreme-court-rules   # paste when prompted
```
