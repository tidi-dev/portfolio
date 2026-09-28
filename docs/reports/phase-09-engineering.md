# Phase 9 · Remaining sections: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer` (`frontend-build`, `verification`)
- **Brief:** Phase 9 of `docs/plan/implementation-plan.md`, under the owner override: no tests, and static fast checks only.
- **Status: DONE_WITH_CONCERNS.** Every "Must hold" item is met. The concerns are one content reading and the WebP avatar sizes (see Deviations and Gaps).

## What was built
- **Experience** (`components/experience/experience-section.tsx`)
  - Sunbytes and NFQ Asia, each with:
    - an h3 in `ui-strong`
    - the title in `body`
    - the dates in `meta`, using the approved `format.period`
    - the projects as an inline list
  - Stacked below lg. From lg, aligned rows on cols 1–3, 4–6, 7–8 and 9–12, split by a `divider`. There is no header row.
- **House rules** (`components/house-rules/house-rules-section.tsx`)
  - Both intro lines in `body`, then an `ol` of the four rules in the owner's order.
  - Each rule has a visible numeral (`label-strong`, `text-muted`) in a 32 px (`w-xl`) column, then the rule in `lead`.
  - The opening phrase is in `<strong>`. `bolder` takes 400 to 700, so no new weight token is needed.
  - A divider sits between rules. From lg, the intro takes cols 1–4 and the rules cols 5–12.
  - **Content:** `house-rules.ts` now stores `{ text, emphasis }` per rule, from info.md → About → House-rule emphasis. The schema checks that each phrase opens its rule.
- **Inventory** (`components/inventory/inventory-section.tsx`)
  - A `dl` of the five profile groups in 1, 2 and 3 columns (base, md, lg).
  - Then the h3 "Leveling up" over one inline list.
- **About** (`components/about/about-section.tsx`, `about-avatar.tsx`)
  - The bio: two paragraphs, verbatim.
  - The avatar, then the h3 "Education & certifications" (a term list) and the h3 "Languages" (an inline list).
  - Below lg, the DOM order is bio, avatar (at most 320 px wide), education, languages.
  - From lg, the text takes cols 1–7 and the avatar cols 9–12, top-aligned with the bio. The `rows-about` utility sets `grid-template-rows: auto 1fr`, so no gap opens between the bio and the education list.
- **Avatar**
  - `git mv ava.PNG src/assets/images/ava.png`. SHA-256 is `ece44660…c88d01` both before (`git show HEAD:ava.PNG`) and after.
  - Static import into `next/image` with `alt=""`, `loading="lazy"`, intrinsic 1086 × 1448 and DESIGN.md's `sizes`. There is no `priority` and no preload.
  - The mat is a `plate`: `p-sm`, `lg:p-md`, 1 px `rule` border, radius 6.
  - The approved caption sits under the mat.
  - No crop, filter or rotation.
- **AFK** (`components/afk/afk-section.tsx`): the h2 and one inline list, which is the profile list.
- **Contact** (`components/contact/contact-section.tsx`)
  - An h2 with `id="contact"` holding the sign-off verbatim, in `heading-section`.
  - Then `FactsList variant="contact"`, with 48 px rows:
    - Email → `mailto:tidi.dev1321@gmail.com`
    - Telegram → `https://t.me/tidi1321`
    - GitHub → `https://github.com/tidi-dev`
    - Location → "Ho Chi Minh City, Vietnam", as plain text in the last row
  - Links are 44 px targets.
  - There is no Résumé row yet (Phase 10).
- **Registry and nav:** `page-sections.ts` registers all six sections. The nav now lists Quest journal, Experience, House rules and Contact, and the hero CTA renders, linking to `/#contact`.
- **Tokens:** a supplement token, `--max-width-avatar: 320px` (DESIGN.md → About avatar and the Responsive table).

## Commits
- `251c042` chore(assets): move the avatar into src/assets/images, byte for byte
- `b97aedb` feat(content): add the house-rule emphasis phrases from info.md
- `6330604` feat(sections): add Experience, House rules, Inventory, About, AFK and Contact

## Evidence (Node 24.21.0, pnpm 10.34.5)
- `pnpm check`: exit 0
  - design:lint: 0 errors, 0 warnings
  - fonts:check: the 12 font files match
  - eslint and prettier: "All matched files use Prettier code style!"
  - typecheck: "✓ Types generated successfully"; `tsc` clean
- `pnpm build`: "✓ Compiled successfully", "✓ Generating static pages … (3/3)"; `/` and `/_not-found` are static.
- **Prerendered HTML** (`.next/server/app/index.html`)
  - Nav hrefs are `/#quest-journal`, `/#experience`, `/#house-rules` and `/#contact`, and every one resolves to an existing id.
  - One h1; the h2s appear in contrib-design §1.3 order; the h3 outline matches §1.2.
  - "Ho Chi Minh City, Vietnam" appears only in the Contact row and its RSC payload.
  - There are 4 `<strong>` phrases, which match info.md.
  - The avatar `img` has `alt=""`, `loading="lazy"`, `width=1086`, `height=1448` and the DESIGN.md `sizes`, with no image preload.
- **Self-check** (not the phase review): Playwright on `next start`, at 320, 375, 768, 1024 and 1440 px, light and dark.
  - Horizontal overflow is 0 in all 10 cells.
  - 0 console errors or warnings.
  - The avatar is not loaded before scroll.
  - Contact rows are 48 px and contact links 44 px, at 320 and 1440.
  - The rendered avatar is 254 px wide at 320, 294 px at 375 and 768, 265 px at 1024, and 350 px at 1440.
- **Screenshots** (scratchpad, not committed): `p9-{light,dark}-{375,768,1440}-{a,b}.png`, plus full pages at `p9-{light,dark}-{320,375,768,1024,1440}.png`, under `/private/tmp/claude-501/-Users-tidi-tidi-portfolio/12972f44-7853-494e-99de-08bd4a5e6d05/scratchpad/`.

## Deviations
1. **`id="contact"` is on the h2, as the brief and DESIGN.md say,** not on the `section`, which is what contrib-design §1.2's outline shows. The section is labelled by that h2. Every other section keeps its id on the `section`.
2. **Experience project names use the sheet titles** from `projects.ts`, so NFQ Asia lists "Lemonswan, Quest @ NFQ Asia, Scania". info.md → Experience → NFQ Asia writes "Quest". Both trace to info.md. For `design-lead` or the main session: should the row read "Quest"? That needs a display-name field; it is not built.
3. **Education layout is not specified in DESIGN.md.** I used the term-list pattern: the degree or subject in `ui-strong`, the school or credentials in `body`, and the years in `meta`. It adds no joining punctuation.
4. **The avatar's 320 px cap applies to the mat.** The image is at most 294 px (DESIGN.md says "at most 320 px wide" without naming which box). `sizes` is as specified and slightly over-requests.

## Gaps
- **Avatar variant sizes** (the budget is suspended, so this is recorded only):
  - AVIF is ≤ 150 KB up to w=1080 (133 KB).
  - WebP exceeds 150 KB from w=828 (174 KB) and reaches 255 KB at w=1080. Only DPR ≥ 2.5 screens request those widths.
  - Fix later with `quality` or by capping `deviceSizes`, once budgets return.
- **Not run, per the owner's build mode:** tests, axe, e2e, Lighthouse, budgets, the privacy scan and a QA review. External link status (2xx or 3xx) was not checked.
- **No missing strings.** Every rendered string traces to `info.md` or Approved copy.
