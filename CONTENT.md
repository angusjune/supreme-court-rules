# Updating content (for the daily Claude Routine)

This site is fully static. To update it, add or edit MDX files under `src/data/` and
rebuild (`npm run build`). No database, no API calls at runtime.

The site treats a decision as **"today's"** when its `date` equals the build day **in
Eastern time** (the Court's own day — not the build machine's zone), so the routine should
run on the day of (or set `date` to the day you want it featured) and then rebuild +
redeploy.

**On a no-decision day the routine must still trigger a redeploy.** "Today" is baked in at
build time, so a day with no commit means no rebuild, and the front page keeps showing a
stale date — or, if the last push was itself a decision day, keeps that decision pinned as
"Today's Decision" indefinitely. POST the host's deploy hook as the routine's last step,
every day, even when there is nothing to commit.
See `.github/workflows/daily-rebuild.yml`.

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
  localize it, `winner`, `loser`, `holding`, `courtOpinionSummary`, `dissentSummary`,
  `topics`, source `label`s) and the **MDX body** are written natively in each language —
  translate, don't transliterate.
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
| `courtOpinionSummary` | yes | string | one neutral paragraph on the **majority's** reasoning |
| `dissentSummary` | no* | string | one neutral paragraph on the **dissent's** reasoning — *required whenever `dissentBy` is non-empty; omit for a unanimous decision |
| `topics` | no | string[] | subject tags |
| `sources` | no | `{label,url}[]` | primary + secondary sources |
| `featured` | no | boolean | keep prominent regardless of date |
| `outcomeLean` | no | `conservative`\|`liberal`\|`neutral` | which side the ruling favors; shown as a color code in the feed |

**`disposition` canonical keys** (rendered with localized labels):
`affirmed`, `reversed`, `reversed-remanded`, `vacated`, `vacated-remanded`,
`affirmed-in-part`, `dismissed`. Unknown keys are humanized as a fallback. To add a new
disposition label, edit `dispositions` in `src/i18n/ui.ts`.

### The two opinion summaries (majority + dissent)

The reasoning is captured in **two neutral fields**, not one: `courtOpinionSummary` is the
**majority's** opinion and `dissentSummary` is the **dissent's**. The detail page renders
them as two labelled blocks — "The majority's opinion" and (when present) "The dissent".

- Always write `courtOpinionSummary` — the opinion of the Court / majority.
- Write `dissentSummary` whenever the case has a dissent (`dissentBy` is non-empty). Omit
  the field entirely for a unanimous decision.
- Keep both **neutral and factual** — what each side held and why. The opinionated take
  belongs in the editorial body below, not in these summaries.

### The editorial — a FIXED section-title harness

The **MDX body** is the editorial — an opinionated, named-columnist take. Its section
titles are a **fixed harness**: use these exact `##` headings, and use the **same**
translation every time. (They used to drift — "What this favors" alone had been rendered
half a dozen different ways in Chinese.) Copy the row for the file's language **verbatim**:

| # | en | fr | ja | zh |
|---|---|---|---|---|
| 1 | `What the ruling does` | `Ce que fait la décision` | `この判決の意味` | `这项判决的意义` |
| 2 | `What this favors` | `Ce que cela favorise` | `何を利するのか` | `它有利于谁` |
| 3 | `The aftermath` | `Les conséquences` | `その後の影響` | `后续影响` |
| 4 | `My take` | `Mon avis` | `私見` | `我的看法` |

You may insert **exactly one** optional, freely-titled section for a case-specific angle
(e.g. "The Bates problem") immediately **after** section 1. That optional heading is the
only title you write yourself — never rename or re-translate the four fixed titles, and
keep them in the order above. Plain Markdown only (no loose raw HTML — the Astro 7
compiler is strict).

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
