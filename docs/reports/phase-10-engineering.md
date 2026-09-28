# Phase 10 · Résumé PDF: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer` (`frontend-build`, `verification`)
- **Brief:** Phase 10 of `docs/plan/implementation-plan.md`, under the owner override: no tests, and static fast checks only.
- **Status: DONE_WITH_CONCERNS.** Every "Must hold" item is met, with evidence below. The concerns are three layout and label choices the owner or design lead should confirm (see Gaps).
- `DaiHo Resume.pdf` was never opened, read or referenced.

## What was built
- **Model** (`src/lib/resume/model.ts`)
  - `buildResumeModel()` selects from `src/content/` only. It adds no facts and no new strings.
  - It reuses `projectFacts`, `compactFacts`, `contactFacts` and `formatPeriod`.
  - Contents, in order:
    - identity: TiDi, "Hồ Trọng Đại" (`lang="vi"`), Dai Ho Trong, the role
    - `resume.summary` (= hero sentence)
    - Contact: the three opted-in channels and the location (O4)
    - Experience
    - all five projects
    - the five skill groups, plus `skills.resumeOnly`
    - education and certifications
    - languages
    - the AFK list, plus `interests.resumeOnly` ("Reading")
  - The PDF title is `resume.title` ("TiDi, Résumé").
- **Layout** (`src/components/resume/resume-document.tsx`)
  - Pure React, with no `next/*` imports. It renders the `<body>`; `scripts/resume/render.ts` adds `<html lang="en" data-theme="light">`, the `<title>` and the CSS.
  - It follows the facts-list language: each section's h2 is the term in the 88 px `facts-label` column (`label-strong`, `text-muted`), with 1 px `rule` dividers between sections.
  - Headings: h3 for employers and projects, h4 for subheads.
  - Colours: `primary` and `text-muted`, with `accent` on links only. No drawings, no photo, Archivo only.
  - Lists are joined with real commas, so extracted text keeps its separators.
- **Styles**
  - `src/styles/print.css`: the site's token chain in the same order, `@source` limited to the résumé components, and `@page { size: A4; margin: var(--spacing-2xl) var(--spacing-xl) }`.
  - `bullet-list` moved byte-for-byte from `globals.css` to `src/styles/bullet-list.css`, which both stylesheets import.
- **`pnpm resume:pdf`** (`scripts/resume/build.ts`, `render.ts`, `lock.ts`)
  1. `renderToStaticMarkup`.
  2. PostCSS and `@tailwindcss/postcss` compile `print.css`. The 8 static Archivo instances (`src/assets/og`) are inlined as `@font-face` data URLs, and all 8 must load.
  3. Playwright Chromium with `colorScheme: light` and print media, then axe must report 0 violations.
  4. `page.pdf({ tagged, outline, preferCSSPageSize, printBackground })`.
  5. The PDF must be A4 and 1–2 pages; otherwise nothing is written.
  6. Writes `public/tidi-resume.pdf` and `resume.lock.json`: SHA-256 of the model JSON and 19 source files (résumé components, model, typography, print CSS, tokens, fonts, render and build scripts), a combined hash, and the PDF's own hash.
- **`pnpm resume:check`** (`scripts/resume/check.ts`)
  - Recomputes the hashes, names each changed, new or removed input, and checks that the committed PDF matches the lock's hash.
  - No browser. It is part of `pnpm check`, and a CI step follows `fonts:check`.
- **Links**
  - `src/lib/resume/file.ts` stats `public/tidi-resume.pdf` at build time. It exports `undefined` when the file is missing, so no link is rendered.
  - Hero: the CTA pair. Below md it stacks (CTA full width, then Résumé); from md it is one row. The Résumé link is `link` + `download` icon, 44 px tall, with the `download` attribute (`components/contact/resume-link.tsx`).
  - Contact: a Résumé row before Location. The link text is `PDF, {size}`, filled by `lib/format/file-size.ts` from the real file ("PDF, 74 KB", with a no-break space), plus the `download` icon and attribute. It uses a new `FactValue` kind, `"download"`.
- **Dependency:** `postcss` 8.5.28, exact pin (MIT, the latest per `npm view`, 2026-09-28). The same version was already in the tree through `@tailwindcss/postcss`, so no new code was installed.

## Commits
- `66a3a5d` feat(resume): generate the résumé PDF from content, with a source lock
- `f2bb26c` feat(resume): link the résumé from the hero and Contact

## Static checks (fresh, after the last change)
- `pnpm check` → exit 0
  - `design:lint`: "passes: 0 errors, 0 warnings"
  - `fonts:check`: "the 12 font files match a fresh generation"
  - `resume:check`: "public/tidi-resume.pdf matches its 20 locked inputs"
  - Prettier: "All matched files use Prettier code style!"
  - ESLint: no output (0 problems)
  - typecheck: "✓ Types generated successfully", and `tsc` is clean
- `pnpm build` → exit 0: "✓ Compiled successfully", "Generating static pages … (3/3)", and no warnings. The built `index.html` has 2 links to `/tidi-resume.pdf` with `download`: "Résumé" and "PDF, 74 KB".
- `pnpm resume:pdf` → "wrote public/tidi-resume.pdf (2 A4 pages, 73949 bytes; axe 0 violations) and resume.lock.json"
- **Freshness demo:** a throwaway edit added "Confluence" to `skills.ts`.
  - `pnpm resume:check` → exit 1: "changed model", "the source hash differs", "the résumé is out of date: run pnpm resume:pdf".
  - After `git checkout src/content/skills.ts` → exit 0.
- **One-off `next start`** (PID stopped): at 375, 768 and 1440 px, in light and dark:
  - `/tidi-resume.pdf` returns 200 `application/pdf`
  - 0 console errors or warnings

## PDF facts
One-off extraction with `unpdf` 1.8.1, run in the scratchpad (not committed).

| Check | Result |
|---|---|
| Pages | 2, at 594.96 × 841.92 pt (A4) |
| Size | 73,949 bytes (74 KB) |
| Tagged | `MarkInfo {"Marked":true}`, `/StructTreeRoot` present |
| Title | "TiDi, Résumé" |
| Outline | "TiDi Hồ Trọng Đại Dai Ho Trong" › Contact, Experience (Sunbytes, NFQ Asia), Quest journal (5 projects), Inventory, Education & certifications, Languages, AFK |
| Fonts | 6 embedded subsets (`FontFile2` ×6): Archivo ExpandedBold, Regular, Medium, Bold, SemiCondensedBold, SemiCondensedSemiBold |
| Text contains | all 18 spot strings: "Hồ Trọng Đại", Dai Ho Trong, TiDi, Full-stack Developer, "Ho Chi Minh City, Vietnam", tidi.dev1321@gmail.com, @tidi1321, github.com/tidi-dev, Sunbytes, NFQ Asia, the 5 periods, Serverless framework, Spryker framework, Reading |
| Text excludes | phone pattern, "[private]", "accepting quests", "reference" or "manager": all absent |

- **Extracted text opens:** "TiDi / Hồ Trọng Đại Dai Ho Trong / Full-stack Developer / Officially a full-stack developer, … / Contact Email tidi.dev1321@gmail.com Telegram @tidi1321 GitHub github.com/tidi-dev Location Ho Chi Minh City, Vietnam / Experience Sunbytes Full-stack Developer 2024-03 to present …"
- **Page renders** (PDFKit, scratchpad): `…/scratchpad/rd-1.png`, `rd-2.png`
- **Site screenshots:** `…/scratchpad/p10-hero-{light,dark}-{375,768,1440}.png` and `p10-contact-*.png`
- `…` = `/private/tmp/claude-501/-Users-tidi-tidi-portfolio/12972f44-7853-494e-99de-08bd4a5e6d05`

## Deviations
- **No `resume-pdf.test.ts` or `resume-model.test.ts`:** owner build mode (no tests). The build script enforces axe 0, A4 and ≤ 2 pages, and the text checks above were run one-off.
- **Heading whitespace:** the h1 and the h2s use `whitespace-pre-wrap`. Chromium builds the outline from laid-out lines and dropped the space at a line break ("TiDiHồ…", "Education &certifications"). The markup has no incidental whitespace, so nothing else changes.
- **Terms rejoined with the owner's dash:** "Debt ledger — every order, …" and "Party lead — …". Content splits these strings at " — "; the PDF sets term and description on one line, so each reads exactly as info.md writes it. The site's stacked term list adds no punctuation. Stacking in the PDF would have pushed it to 3 pages.
- **`@page` margins:** 48 px top and bottom, 32 px at the sides (2xl and xl tokens, through `var()`, which Chromium resolves in `@page`). Side margins were narrowed from 2xl to fit 2 pages.
- **CLAUDE.md** does not list `resume:pdf` or `resume:check` yet. The main session should add them (I don't edit CLAUDE.md).

## Gaps and questions (no copy invented)
1. **Section labels:** the PDF reuses the site's labels from `sections.ts` and `about.ts`: Contact, Experience, Quest journal, Inventory, Education & certifications, Languages, AFK.
   - "Quest journal", "Inventory" and "AFK" may read poorly to recruiters or ATS.
   - info.md's own headings ("Projects", "Skills & tools", "Interests") would be a one-line change each, if the owner approves them for the PDF.
2. **PDF-only skills have no label:** Serverless framework, CI/CD, Git, Slack, Jira and Spryker framework appear as an unlabelled line under the five Inventory groups. No approved label exists.
3. **Page 2 has about 50 px spare.** Any content growth (for example a sixth project) will trip the 2-page guard, and `resume:pdf` will then refuse to write. That is by design, but the layout has no slack.
