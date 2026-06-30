# Updating content (for the daily Claude Routine)

This site is fully static. To update it, add or edit MDX files under `src/data/` and
rebuild (`npm run build`). No database, no API calls at runtime.

The site treats a decision as **"today's"** when its `date` equals the build date, so the
routine should run on the day of (or set `date` to the day you want it featured) and then
rebuild + redeploy.

---

## Adding a decision (FOUR files, one per language)

Each decision is a folder under `src/data/decisions/<slug>/` containing up to four MDX
files, one per language:

```
src/data/decisions/trump-v-casa/
  en.mdx
  fr.mdx
  ja.mdx
  zh.mdx
```

- `<slug>` is kebab-case and MUST equal the `slug:` frontmatter field in every file.
- Start by copying `templates/decision/{en,fr,ja,zh}.mdx`.
- English (`en.mdx`) is required — it drives the homepage feed. The others are optional
  per decision; the language switcher only shows languages that exist.
- The **structured facts** (date, term, docket, vote, justices, disposition, sources URLs)
  must be identical across the four files. The **translatable fields** (`caseName` if you
  localize it, `winner`, `loser`, `holding`, `courtOpinionSummary`, `topics`, source
  `label`s) and the **MDX body** are written natively in each language — translate, don't
  transliterate.
- ⚠️ **Justice names stay in ENGLISH in every language file.** The fields `majorityAuthor`,
  `joinedBy`, `concurrences`, and `dissentBy` must use the English name (e.g.
  `Justice Brett Kavanaugh`) in `fr`/`ja`/`zh` too — do NOT translate them. The
  political-lean colored dots match English surnames; a localized name (e.g.
  `布雷特·卡瓦诺大法官`) won't match and its dot disappears. (As a safety net, the detail page
  sources these names from the English entry, but keep the data clean.)

### Frontmatter schema (decisions)

| field | required | type | notes |
|---|---|---|---|
| `slug` | yes | string | identical across the 4 files; equals the folder name |
| `lang` | yes | `en`\|`fr`\|`ja`\|`zh` | the file's language |
| `caseName` | yes | string | e.g. `Trump v. CASA, Inc.` |
| `date` | yes | date | `YYYY-MM-DD`; drives the "today" logic |
| `term` | no | string | e.g. `"2024"` (OT2024) |
| `docket` | no | string | e.g. `24-000` |
| `vote` | yes | string | e.g. `6-3` |
| `majorityAuthor` | yes | string | opinion author |
| `joinedBy` | no | string[] | justices joining the majority |
| `concurrences` | no | string[] | justices filing/joining concurrences |
| `dissentBy` | no | string[] | dissenting justices |
| `winner` | yes | string | who prevailed (plain language) |
| `loser` | yes | string | who lost (plain language) |
| `disposition` | yes | string | canonical key (see below) |
| `lowerCourt` | no | string | court under review |
| `holding` | yes | string | one-line plain-language holding |
| `courtOpinionSummary` | yes | string | one paragraph on the Court's reasoning |
| `topics` | no | string[] | subject tags |
| `sources` | no | `{label,url}[]` | primary + secondary sources |
| `featured` | no | boolean | keep prominent regardless of date |
| `outcomeLean` | no | `conservative`\|`liberal`\|`neutral` | which side the ruling favors; shown as a color code in the feed |

**`disposition` canonical keys** (rendered with localized labels):
`affirmed`, `reversed`, `reversed-remanded`, `vacated`, `vacated-remanded`,
`affirmed-in-part`, `dismissed`. Unknown keys are humanized as a fallback. To add a new
disposition label, edit `dispositions` in `src/i18n/ui.ts`.

The **MDX body** is the editorial — an opinionated, named-columnist take. Use Markdown
headings (`##`) for sections like "What this favors", "The aftermath", "My take".
Plain Markdown only (no loose raw HTML — the Astro 7 compiler is strict).

---

## Adding a justice

One MDX file per justice: `src/data/justices/<id>.mdx` (e.g. `barrett.mdx`). The `<id>` is
the page URL. Copy `templates/justice.mdx`.

| field | required | type | notes |
|---|---|---|---|
| `name` | yes | string | |
| `role` | yes | `Chief Justice`\|`Associate Justice` | |
| `appointedBy` | yes | string | nominating president |
| `confirmedYear` | yes | number | |
| `lean` | yes | `conservative`\|`liberal`\|`center` | |
| `predecessor` | no | string | |
| `seatNumber` | no | number | |
| `photo` | yes | url | official portrait URL |
| `order` | no | number | `0` = Chief, then by seniority |

Justice pages are English-only (i18n is scoped to decision details).

### Justice editorials (routine-updatable)

The opinionated take on each justice lives in a SEPARATE file:
`src/data/justice-editorials/<id>.mdx` (the `<id>` matches the bio file name). Keeping it
separate means the editorial can be rewritten periodically without touching the factual
bio. The justice page renders it as a distinct "Editorial" section; if the file is absent,
the section simply doesn't appear.

| field | required | type | notes |
|---|---|---|---|
| `justice` | yes | string | the justice id this editorial is about |
| `thesis` | no | string | one-line characterization, shown as a lead |
| `updated` | no | date | shown as "Updated …" |

Body (Markdown): an opinionated, named-columnist editorial grounded in the justice's
recent decisions and opinions. Copy `templates/justice-editorial.mdx`.

---

## Build & deploy

```bash
npm run build      # outputs static site to dist/
npm run preview    # preview the production build locally
```

Deploy `dist/` to any static host. Vercel and Netlify auto-detect Astro (build command
`astro build`, output `dist`).
