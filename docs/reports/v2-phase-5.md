# v2 Phase 5 · Résumé PDF and links: engineering report

> `frontend-engineer`, 2026-09-28. Plan: `docs/plan/v2/implementation-plan.md` → Phase 5; contrib-engineering §7.

**Status: DONE_WITH_CONCERNS.** The gate is green and every acceptance criterion has evidence. The concern is content scope: there's no approved résumé section label for interests, so the PDF leaves them out, including the PDF-only "Reading" (see Questions 1).

## Commits (local, on `main`)
| Commit | What |
|---|---|
| `972b79a` | feat(resume): restores the v1 generator from `e74b1cb^` and adapts it to the v2 content modules, tokens and font subsets. Adds `resume:pdf` and `resume:check`, and puts `resume:check` into `pnpm check`. Pins `@playwright/test` 1.63.0 (Apache-2.0), `@axe-core/playwright` 4.13.0 (MPL-2.0) and `postcss` 8.5.28 (MIT), as contrib-engineering §1.1 lists them. I checked each with `npm view` today. |
| `78e1844` | feat(resume): `public/tidi-resume.pdf` (139,949 bytes) and `resume.lock.json`. |

## Committed, not built at build time
The plan says the PDF is committed (file map: "generated, committed", with its lock), so it isn't generated during `next build`. `pnpm resume:check` runs inside `pnpm check`. It fails whenever the model, the template, the tokens, the fonts or the scripts change and nobody runs `pnpm resume:pdf` afterwards.

## What was built
- **Model** (`src/lib/resume/model.ts`). It is built from `src/content/` only and adds no facts. The phone number, [private email removed], the reference, availability, travel and photography aren't in any content module, so the PDF can't contain them.
  - **Section headings:** `copy.resume.sectionLabels`, in the approved order: Profile · Work experience · Projects · Skills · Education · Languages · Contact.
  - **Header:** "TiDi", "Hồ Trọng Đại" (`lang="vi"`), "Dai Ho Trong" and the role.
  - **Profile:** `resume.summary` (= `hero.sentence`).
  - **Work experience:** the employer, title and period (`format.period`), plus that employer's projects.
  - **Projects:** CyberRock, botmivivi and Quest @ NFQ Asia, then Lemonswan and Scania. Each has its facts, as the site shows them:
    - botmivivi's `botmivivi.facts`, with "in the first 2 months" under the figures, as on the site
    - Quest's "Party lead" and Achievements unlocked
    - Lemonswan's link
  - **Skills:** the five groups, plus the PDF-only tools from `lists.scope`.
  - **Education:** the two degrees.
  - **Languages:** Vietnamese, and English with IELTS 6.0 · EF SET C1. English sits with its certifications, as on the site.
  - **Contact:** Email, Telegram, GitHub and Location.
- **Document** (`src/components/resume/resume-document.tsx`, `src/styles/print.css`):
  - A4 in the Lab tokens, with Chakra Petch headings and Mona Sans text. No 3D, glow, chamfer or avatar.
  - The PDF uses no upper-case or tracked type. The first render used `type-label` and `heading-panel`, and extraction came out as "P R O F I L E" and "W H AT I B U I LT". Now the PDF's text and outline read the approved labels exactly.
  - Colours:
    - `accent-ink` for the owner's labels and links
    - `holo` for the role and the statuses
    - a holo `line` under each section heading
- **Script** (`scripts/resume/`):
  1. `renderToStaticMarkup`.
  2. PostCSS and Tailwind compile `print.css`, with the three woff2 subsets inlined as data URLs.
  3. Chromium prints the page. The script stops unless all 3 faces load and axe finds 0 violations.
  4. It checks for at most 2 pages, each A4.
  5. It writes the PDF and a lock of 13 SHA-256 inputs.
- **Links:** both were wired in Phase 4 and now render, with no code change:
  - the hero `button-ghost` "Résumé" with the file-download icon
  - the Join party row "Résumé", with "PDF, 140 KB" computed from the file at build

## Evidence (fresh, on the committed tree, Node 24.21.0, pnpm 10.34.5)
- **`pnpm check && pnpm build`** → exit 0. The only log line matching warn or error is `design:lint … passes: 0 errors, 0 warnings`. Output:
  - `tokens:check: the 2 token files match`
  - `fonts:check: the 6 font files match`
  - `all 123 characters of 27 files … are in all 3 font files`
  - `resume:check: public/tidi-resume.pdf matches its 13 locked inputs`
  - eslint clean; `All matched files use Prettier code style!`; typecheck exit 0
  - `○ /` and `○ /_not-found` both static
- **`pnpm resume:pdf`** → `wrote public/tidi-resume.pdf (2 A4 pages, 139949 bytes; axe 0 violations) and resume.lock.json`.
- **`resume:check` after a content edit that wasn't regenerated.** I changed "Jira" to "Jira X" in `skills.ts`:
  - it exited 1 with `changed model` / `the source hash differs` / `the résumé is out of date: run pnpm resume:pdf`
  - I restored the file (`git diff` empty), and it exited 0 again
- **PDF structure.** Read from the file itself, with PDFKit and unpdf 1.8.1, both installed in my scratchpad, not the repo:
  - Title `TiDi, Résumé`; 2 pages, 594.96 × 841.92 pt (A4)
  - `/MarkInfo /Marked true`, `/StructTreeRoot`, `/Lang (en)`, `/Outlines`
  - The outline: "TiDi Hồ Trọng Đại Dai Ho Trong", then the 7 section labels with their entries
  - Link annotations: `https://lemonswan.com/`, `mailto:tidi.dev1321@gmail.com`, `https://t.me/tidi1321`, `https://github.com/tidi-dev`
- **Extracted text** (full text in `docs/reviews/v2/phase-5/raw/pdf-text.txt`, git-ignored):
  - line 1: `TiDi Hồ Trọng Đại Dai Ho Trong`
  - section lines, each exactly as approved: `Profile`, `Work experience`, `Projects`, `Skills`, `Education`, `Languages`, `Contact`
- **Privacy grep** on the extracted text → **no match** (grep exit 1). Patterns:
  - `[private]`, `+84` and 10-digit phone shapes
  - `phone`, `reference`, `referee`, `manager`
  - `availab`, `accepting`, `STATUS`
  - `travel`, `photograph`, `camera`
  - A second grep for any run of 7 or more digits (with spaces, dots or dashes) → no match (exit 1).
  - I didn't open `DaiHo Resume.pdf`, and it is ignored by `.gitignore:3`.
- **Links on the production build** (my own `next start` on :3115, headless Chromium):
  - `/tidi-resume.pdf` → `200`, `Content-Type: application/pdf`, `Content-Length: 139949`
  - At 375 and 1440, in both themes, the hero "Résumé" and the Join party "PDF, 140 KB" (term "Résumé") both point to `/tidi-resume.pdf`, 48 px high, with no `target`
  - The hero link takes keyboard focus
  - No horizontal overflow: `scrollWidth − clientWidth` = 0
- **Console:** 16 messages across the 4 runs, all `THREE.Clock: This module has been deprecated` (the known warning). 0 errors, 0 page errors.

## External links (the final pass)
DESIGN.md → Link says external links open in the same tab and carry the external-link icon. contrib-verification says any `target="_blank"` needs `rel="noopener noreferrer"`. The page has 5 off-site links:

| Link | `target` | External icon | HTTP (curl, following redirects) |
|---|---|---|---|
| Telegram `https://t.me/tidi1321` | none (same tab) | yes | 200 |
| GitHub `https://github.com/tidi-dev` | none | yes | 200 |
| Lemonswan `https://lemonswan.com/` | none | yes | 200 |
| Quest video facade `https://www.youtube.com/watch?v=yLJZXvO_ARU` | none | play icon, per DESIGN.md → Video facade (it plays in place) | 200 (embed URL also 200) |
| `mailto:tidi.dev1321@gmail.com` | none | mail icon (not a web page) | n/a |

No link uses `target`, so no `rel` is needed. Nothing needed changing.

## Acceptance
- ✅ **Static gate green** (Evidence above).
- ✅ **The PDF opens:**
  - PDFKit and pdf.js both parse it: 2 A4 pages, tagged, with an outline
  - its title is "TiDi, Résumé"
  - its section labels are exactly the approved ones, in order
  - Every fact in the approved résumé sections is from `info.md`, through `src/content/`. Not every `info.md` fact is in the PDF: see Questions 1 and 2.
- ✅ **Text grep clean:** no phone number, [private email removed], reference, availability, travel or photography.
- ✅ **Screenshots** in `docs/reviews/v2/phase-5/screens/` (git-ignored, like Phase 4's):
  - `hero-resume-{375,1440}-{light,dark}.png`
  - `contact-resume-{375,1440}-{light,dark}.png`
  - `hero-resume-focus-1440-{light,dark}.png`
  - `resume-page-1.png` and `resume-page-2.png`, rendered from the committed PDF at 2×
- ✅ **0 console errors;** the only warning is the known THREE.Clock one.
- ✅ **Plan extras:**
  - A4, at most 2 pages, tagged
  - "Hồ Trọng Đại" is present
  - `resume:check` fails on a content edit that wasn't regenerated
  - the file serves with 200

## Deviations
1. **Section headings use `heading-quest`, in `primary`, not an upper-case label type.** An upper-case label type would put "WORK EXPERIENCE" in the PDF text and outline, not the approved "Work experience". Fact terms, statuses and the role also use non-upper-case types for the same reason: `nav` and `body-strong`.
2. **In the PDF, each quest file's "When" row moves to the right of the project name,** like the Work experience periods. That saved the room needed to fit 2 pages; the period text is the same `format.period` string.
3. **Mona Sans is embedded as Type 3 glyphs.** Skia/Chromium embeds variable fonts this way; Chakra Petch, which is static, is embedded as `CIDFontType2`.
   - Every glyph is inside the PDF, and text still extracts, through the ToUnicode maps.
   - Embedding it as TrueType would need static Mona Sans instances, which would need another tool (v1 built static Archivo instances). I didn't add one.
4. **The links keep Phase 4's wiring:** same tab, `type="application/pdf"`, no `download` attribute. The PDF opens in the browser's viewer. The file-download icon is DESIGN.md's; adding `download` is a one-word change if the main session wants it.

## Questions and concerns
1. **Interests aren't in the PDF.** `lists.scope` gives the PDF an extra interest ("Reading"). But `resume.section-labels` (Profile · Work experience · Projects · Skills · Education · Languages · Contact) has no interests section, and v1's "AFK" isn't in the list. I left the section out rather than invent a label.
   - **Missing string:** an approved label for an interests section (for example "Interests"), and where it goes in the order.
   - With that string, it is a small change to the model and the template, and there is room on page 2.
2. **Other facts that aren't in the PDF,** because no approved résumé slot exists for them:
   - "Daniel"
   - the tagline
   - Guild ("Cyber security for IoT (EU)")
   - XP ("In production since 2020")
   - Passive
   - the bio, House rules and Leveling up
   - the Quest video

   v1's PDF didn't have them either. Tell me if any should be added, and under which approved label.
3. **The PDF's creation date changes on every run,** so the bytes change each time `resume:pdf` runs. The lock records the committed PDF's hash, and `resume:check` compares against that, so the check stays stable.
4. **Processes:** I started my own `next start` on :3115 (pnpm 53995, node 53997) and stopped both by PID. PID 6878 on :3000 was untouched. `docs/progress.md` was not staged.
