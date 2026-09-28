# v2 Phase 4 · Remaining sections and scroll motion: engineering report

> `frontend-engineer`, 2026-09-28. Plan: `docs/plan/v2/implementation-plan.md` → Phase 4.

**Status: DONE_WITH_CONCERNS.** The gate is green and every acceptance criterion has evidence. The concerns are small calls for the main session and design-lead (the power-on technique, the "TIDI" speaker tag, the Résumé row wiring). None of them blocks Phase 5.

## Commits (local, on `main`)
| Commit | What |
|---|---|
| `5b374c3` | feat(content): each AFK item gets a structural Tabler icon id (ball-football, feather, swimming, device-gamepad-2, coffee), so icons follow the items if reordered. No text changed. `Icon` gains the Phase 4 icons from DESIGN.md's list and three sizes (20 base, 24 for Join party and AFK, 12 for the training marker). |
| `d36227a` | feat(shell): scroll-spy (`lib/nav/scroll-spy.ts`, one shared IntersectionObserver, a `useSyncExternalStore` source) drives `aria-current="true"` and the 2 px state-bar underline in the HUD nav and the menu sheet. The HUD gets the level-up bar along its bottom edge. |
| `061bfc8` | feat(sections): the six sections, `Panel` / `PanelHeading` / `SectionFrame`, the reveal observer, `sections.css`, `reveal.css`, the avatar (`src/assets/images/ava.png`, byte for byte, via `next/image`). Quest files now power on like every panel, and their fact rows tick in. |

## What was built
- **Page:** `page.tsx` renders every registry section with content, in order (`renderedSections`), so every nav target exists: `#quest-journal`, `#experience`, `#house-rules`, `#inventory`, `#contact`, plus `#about` and `#afk`.
- **Mission log** (`#experience`): a 2 px holo line with 16 px nodes rotated 45°. Sunbytes, the current employer (an open period), has the gold core. Each node is a panel: employer h3, title, period, then the projects as h4 items.
  - CyberRock and Quest link to their quest files.
  - Lemonswan and Scania are listed here (`placement.nfq-projects`): name, period (Lemonswan only), one-liner, What I built and Stack, and Lemonswan's external link.
  - Layout: one column; 2 columns inside the node from md; 8 columns, offset 2, from lg.
- **House rules:** the two intro lines (the first as the owner's small print), then an `<ol>` of four panels, each with a numeral chip and the lead phrase in `rule-lead` over the rest of the rule. One column, 2 × 2 from md.
- **Inventory:** five groups (h3 each) of slots. Leveling up is a panel of training cards, each with a success filled triangle. Stacked below lg; 8 + 4 from lg.
- **Character stats** (`#about`):
  - a stats panel: the avatar frame (`alt=""`, `avatar.caption` on the scrim) plus the six rows
  - the dialogue box: the "TiDi" speaker tag, both bio paragraphs, and "Press A to continue ▼"
  - Education (the two degrees)
  - Languages (Vietnamese; English with IELTS 6.0 · EF SET C1, matched from the certifications by subject, per contrib-design §1.3)
  - Layout per DESIGN.md: 7 · 5 and 7 · 5 from lg; the avatar at most 220 px above the rows, then 160 px beside them from sm.
- **Press A to continue:** a real link to `#afk`. With JavaScript it focuses the AFK h2 (`tabindex="-1"`), scrolls there (instant with motion off) and pushes the hash. The A key does the same while the link has focus (it is the box's only focusable element).
- **AFK:** one panel, five 56 px items with 24 px icons. 2 columns, 3 from md, 5 from lg. A last item left alone on its row spans the free columns, so the long "Tech gossip…" item isn't squeezed at 320 px.
- **Join party** (`#contact`): the sign-off panel, then the rows:
  - Email: the address as `button-primary` with the mail icon
  - Telegram and GitHub: `button-ghost`, with brand and external-link icons, same tab
  - Location: plain text with map-pin
  - Nothing else is shown: no phone, no [private email removed], no reference, no availability.
- **Scroll motion** (`reveal-observer.client.tsx`, `reveal.css`): one IntersectionObserver and no scroll listeners.
  - **Panel power-on:** ≥ 25 % in view (or a quarter of the viewport filled, for very tall panels), once. Panels reached together stagger in reading order (`--reveal-order` × `stagger-panel`).
  - **Stat rows and facts:** opacity + translateX(−10px) over `row`, from `delay-rows`, `stagger-row` apart.
  - **House rules:** each lead phrase's underline sweeps in, `scaleX(0 → 1)` over `sweep`, after the wipe.
  - **Level up:** the triangles rise 6 px and fade in. A 2 px accent bar sweeps across the HUD strip once per page load.
  - **Avatar:** the scan band crosses once (`scan`, `delay-scan`). It tilts up to 6° toward a mouse pointer, with motion on only.
  - **Mission log line:** `scaleY` along a named view timeline (`animation-timeline`, range `entry-crossing`, the view inset so it draws around 70 % down the viewport). Where scroll timelines are missing, it draws over `line` once the log is reached.
- **Motion library:** not added. Everything above is CSS transitions and animations plus the one observer. No sequence needed Motion's exit animations or springs.

## Evidence (fresh, on the final tree, Node 24.21.0, pnpm 10.34.5)
- `pnpm check` → exit 0:
  - `design:lint … passes: 0 errors, 0 warnings`
  - `tokens:check: the 2 token files match`
  - `fonts:check: the 6 font files match` and `all 123 characters of 27 files … are in all 3 font files`
  - eslint 0 problems; `All matched files use Prettier code style!`; typecheck exit 0
- `pnpm build` → exit 0, 0 lines matching warn or error. `○ /` and `○ /_not-found` are both static.
- **Raw-value grep** (hex, px, rem, ms, vw, em, rgb, hsl in the changed `src/*.ts(x)`). Two hits, neither a design value:
  - the `next/image` `sizes` hint in `character-stats.tsx`
  - the scroll-spy `rootMargin` band
- `'use client'` appears only in `*.client.tsx`.
- **Manual pass:** a Playwright 1.63 script (installed in my scratchpad, not the repo), headless Chromium with Metal, against my own `next start` on :3114. Its log and the visible text of the six sections are in `docs/reviews/v2/phase-4/raw/` (git-ignored): `manual-pass.txt` and `sections-text.txt`.

## Acceptance
- ✅ **Static gate green** (above).
- ✅ **Screenshots** in `docs/reviews/v2/phase-4/screens/` (git-ignored, 60 files):
  - `{experience,house-rules,inventory,about,afk,contact}-{375,1440}-{light,dark}-motion-{on,off}.png`: 48 files. Every section has motion (at least the power-on), so each has both. Each was walked through the viewport first, so every panel was reached.
  - `full-1440-dark-motion-{on,off}.png` and `full-375-light-motion-{on,off}.png`
  - extras:
    - `power-on-mid-1440-dark.png` (the wipe mid-way)
    - `level-up-sweep-1440-dark.png` (the bar at the HUD's right)
    - `press-a-focus-1440-light.png`
    - `nojs-{375-dark,1440-light}-full.png`
    - `{about,afk,contact}-320-light-motion-on.png`
  - With motion on, the Mission log line in section captures is drawn to the scroll position of the capture, because it is scroll-linked.
- ✅ **JavaScript off, complete content:**
  - All 7 sections are present, with 18 panels.
  - 0 panels covered or clipped, and 0 fact rows or markers below opacity 1.
  - The timeline line is untransformed (fully drawn).
  - `data-motion` and `data-reveal-ready` are absent. The nav links are plain anchors.
  - Nothing waits for a reveal: the hidden pre-state exists only under `[data-motion="on"][data-reveal-ready]`, and only the running observer sets the second attribute.
- ✅ **Reduced motion is calm and complete.** Checked under the system `prefers-reduced-motion`, and with Motion toggled off:
  - `data-motion="off"`; 0 covered panels, 0 faded rows, line drawn, 0 running animations.
  - After scrolling the whole page: 19/19 revealed, 0 one-shot plays (no scan, no level-up sweep), still 0 animations.
- ✅ **With motion on**, panels below the fold wait (18/18 covered) until reached. After scrolling through twice: 19/19 revealed, 0 still covered, and the one-shots played exactly once each (`levelup-bar`, `avatar-scan`).
  - The line's scaleY at log top −600 / −300 / 0 / +300 px was 0 / 0.20 / 0.63 / 1.
- ✅ **Keyboard order is logical; focus is never hidden:**
  - **1440, 23 stops:** skip link → TiDi → nav (5) → Motion → Dark theme → CTA → Run → Counterfeit → 3 mission items → Watch Quest by NFQ → CyberRock → lemonswan.com → Quest → Press A to continue → email → Telegram → GitHub.
  - **375, 16 stops:** the same, with Menu in place of the nav and no mission items.
  - For every stop, `elementFromPoint` at its centre hit the element itself, with top ≥ 60 px. The only flag was the skip link itself (fixed at top 8 px, on the top z layer, by design).
  - Press A: A on the focused link, and a click, both focus `afk-title` at top 76 px (`scroll-padding-top`), with hash `#afk`.
- ✅ **Scroll-spy:** at each section, the current nav link was:
  - top → none; Quest journal → "Quest journal"; Mission log → "Mission log"; House rules → "House rules"; Inventory → "Inventory"
  - Character stats and AFK → none (they aren't in the nav); Join party → "Join party"
- ✅ **No horizontal scroll at 320 px:** `scrollWidth` 320 = `clientWidth` 320 in light and dark, motion on and off, after scrolling through. 0 elements extend past the right edge. The email button fits on one line at 320 (the row's buttons pad 12 px below sm).
- ✅ **0 console errors or hydration warnings.** 61 console messages across all runs, all `THREE.Clock: This module has been deprecated` (the known R3F 9.8.1 warning). No page errors.
  - Production React reports hydration mismatches as console errors, and there were none.
  - I didn't run `next dev`: PID 6878 serves this repository on :3000, and a second dev server would share `.next`.
- ✅ **Every visible fact maps to `info.md`.** Checked against `raw/sections-text.txt`:
  - **Mission log:** employers, titles and periods from Experience in `format.period`. Projects per `placement.nfq-projects`. `lemonswan.one-liner` and `scania.one-liner`. Lemonswan's "matching logic and UI design", Laravel 8.10 · MySQL · Redis (cache) · Tailwind CSS and its approved link. Scania's "backend and frontend" and Spryker framework, with no dates. Labels: "What I built" (info.md), Stack (`ui.small-labels`).
  - **House rules:** the intro and the four rules verbatim; the lead phrases are the profile's bold ones (House-rule emphasis).
  - **Inventory:** the five profile groups (`lists.scope`), with "Companions" from `ui.small-labels`; Leveling up verbatim.
  - **Character stats:**
    - Rows: Class, Guild, Base, XP, Quests, Passive (`ui.profile-labels`, `ui.small-labels`). Values from Identity, Contact and Projects, as profile.md words them.
    - Bio: verbatim. Speaker tag: the brand "TiDi". "Press A to continue" (`ui.profile-labels`).
    - Education: from Education & certifications, labelled `ui.small-labels` "Education". Languages: `label.languages` "Languages"; Vietnamese and English with IELTS 6.0 and EF SET C1.
    - `avatar.caption` visible; the image has `alt=""`.
  - **AFK:** the profile's five interests. Travel and photography are not shown.
  - **Join party:** the sign-off verbatim; Email, Telegram, GitHub (`ui.small-labels`) with the opted-in values; `contact.location-label` "Location" with "Ho Chi Minh City, Vietnam". Not shown: the phone, [private email removed], the reference, availability.
  - No string was written by me, and no copy was missing.

## Deviations
1. **The power-on wipe is a cover, not a clip on the panel.** My first build clipped each panel with `clip-path: inset(0 100% 0 0)`. The motion-on run showed 1 of 19 elements revealed after scrolling the whole page. The root cause: Chromium's IntersectionObserver applies the target's own clip-path, so a panel clipped to nothing never intersects and is never revealed.
   - **Fix:** each panel (and each quest file) holds an `aria-hidden` `power-cover`, a `surface` layer that shrinks away to the right (`scaleX(1 → 0)`, origin right) over `wipe`, `ease-power`.
   - It reads as the same left-to-right wipe, uses a transform (which CLAUDE.md prefers), and never takes a pointer.
   - **Regression evidence:** the motion-on run now reports 19/19 revealed.
   - DESIGN.md's Motion table still says `clip-path: inset(...)`. Design-lead may want the table updated.
2. **No 3 s CSS timeout reveal** (contrib-engineering §6.1). The safety is structural instead: the hidden pre-state applies only while the observer runs (`data-reveal-ready`, set by the observer on mount). If JavaScript is off, hydration fails or the observer never starts, nothing is hidden.
   - A timeout would reveal every below-the-fold panel before the visitor reaches it, which would cancel the power-ons. The rule is also wrapped in `@media screen`, so print shows everything.
3. **Reveals are transitions declared on the revealed state only.** Hiding is instant and happens off screen, each power-on runs once, and turning motion back on never replays a wipe. The two one-shot rewards (the scan and the level-up sweep) are animations started once with `data-play` and removed on `animationend`, so they also never replay.
4. **The lead phrase sits on its own line** above the rest of the rule. That lets its underline be a single `scaleX` bar, as DESIGN.md's motion specifies. An inline underline across wrapped lines can't be transformed. The DOM text is the owner's sentence, unchanged.
5. **The Résumé row is wired but inert.** Like the hero CTA, it renders only when `public/tidi-resume.pdf` exists, labelled `resume.link` with "PDF, {size}". No PDF exists, so nothing renders. Phase 5 only needs to generate the file. Remove the wiring if the brief meant "don't touch it".
6. **Project names in the Mission log are h4** (under the employer's h3), so Lemonswan and Scania, which carry facts, have headings. For the quest-file links, the h4 wraps the link.
7. **Quest files join the power-on**, and their fact rows tick in (contrib-design §3, "files power on"). This is a small edit to two Phase 3 files: `quest-file-frame.client.tsx` gains `data-reveal` and the cover; `quest-facts.tsx` gains the `--i` row index.
8. **The avatar lazy-loads** through `next/image` (AVIF/WebP, the `sizes` hint above). It isn't the LCP image, so it has no `priority`.

## Concerns and open questions
1. **The speaker tag reads "TIDI".** DESIGN.md's `speaker-tag` uses `label` typography, which is uppercase, so the brand renders in capitals (the DOM keeps "TiDi"). Design-lead may prefer `button` or `nav` type to keep the brand's casing.
2. **The level-up sweep replays only on a reload.** It is once per page load, not once per visit across reloads. "Per visit" read as per load.
3. **Glass and backdrop:** the power cover is `surface`, so it assumes panels sit on the page surface, which all of them do today. A panel placed over the hero backdrop or a canvas would need a different cover.
4. **At lg the stats panel has empty space** under the rows, because the dialogue is taller. This is design-lead's call in F.
5. **Scroll-driven line support:** Chromium supports `animation-timeline`. Browsers without it (at the time of writing, Firefox without its flag) use the observer fallback, which I didn't exercise here; its CSS is behind `@supports not`.
6. **Processes:** I started and stopped only my own `next start` on :3114, by PID (pnpm 42307 and node 42309, and the two earlier pairs 36547/36555 and 38976/38978). PID 6878 on :3000 was untouched. `docs/progress.md` was not staged.
