# Phases 7 + 8 · Remaining sheets, the video facade and the remaining drawings: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer` (`frontend-build`, `verification`)
- **Brief:** Phases 7 and 8 of `docs/plan/implementation-plan.md`, in one run, under the owner override: no tests, static fast checks only.
- **Status: DONE_WITH_CONCERNS.** Every "Must hold" item is met, with evidence below. The concerns are three design readings for `design-lead` or the main session to confirm (Deviations 1–3).

## What was built
**Phase 7: sheets and the facade**
- **Full sheet** (`full-sheet.tsx`): the body now renders, in order:
  - Party lead as a one-item term list, where the sheet has one
  - the h4 subhead over bullets or terms
  - the video facade, closing the sheet
- **Term list** (`lists/term-list.tsx`): a `dl`. Terms are `ui-strong`, descriptions `body` 4 px below, items 16 px apart. Both fragments are verbatim.
- **Compact sheet** (`sheets/compact-sheet.tsx`), in order:
  - the h3
  - the meta line: the employer from `experience.ts`, plus dates only where `period` exists
  - the approved one-liner, in `lead`
  - a facts list: What I built, Stack
  - the Lemonswan link: same tab, `external-link`, a 44 px row
- **Compact layout:** stacked below lg, 6 | 6 from lg, with one divider above the pair.
- **Facts:**
  - `compactFacts()` builds the compact rows.
  - `dd` values use `tabular-nums` (P4-4).
  - botmivivi's qualifier "in the first 2 months" follows both the Customers and the Orders values, in `text-muted`.
- **Content** (all traced to `info.md`):
  - the Quest stack, as compiled in `info.md`
  - the fact term "What I built" (`factTerms.built`)
  - the `Term` type export
- **Video facade:**
  - `video-facade.tsx` (server) and `video-facade.client.tsx` (leaf), with `lib/content/youtube.ts` for the embed URL.
  - The first render and the server HTML are an `<a>` to the watch URL, named "Watch Quest by NFQ".
  - A plain click swaps in `https://www.youtube-nocookie.com/embed/yLJZXvO_ARU?autoplay=1` with `title="Quest by NFQ"` and `referrerPolicy="strict-origin-when-cross-origin"`.
  - Focus moves to the iframe through a stable ref callback. The iframe fades in over `duration-fade` on load (instant under reduced motion), over an inert poster backdrop in the same 16:9 box.
  - A modified click (new tab or window) keeps the link's default.
- **Supplement tokens** (DESIGN.md prose):
  - `--text-underline-offset-link: 0.2em` (Links), also applied to the facts-list link
  - `--aspect-video: 16 / 9` (Shapes → Ratios)

**Phase 8: drawings**
- **Primitives:**
  - `Boundary`: ink, construction or proof; radius 6; no fill.
  - `ReplacedNode`: a construction outline with a `text-muted` label.
  - `Box`, `Region`, `TextSpot` and `Arrow` now live in `geometry/grammar.ts` (moved from `cyberrock.ts`; its output is unchanged).
- **Quest** (`quest-drawing.tsx`, `geometry/quest.ts`):
  - Territory v1 is construction, with Lambda, EventBridge and DynamoDB as replaced nodes. Territory v2 is ink, with NestJS, Prisma and MySQL.
  - The proof is DynamoDB → MySQL, labelled "~5 min of downtime", with the carried data beside it in ink.
  - Wide: 880 × 168, stores on the bottom row, the proof level. Tall: 240 × 424, v1 above and v2 below, the proof down.
- **botmivivi** (`botmivivi-drawing.tsx`, `geometry/botmivivi.ts`):
  - The proof is a boundary labelled "the same transaction" around order, return and payment, each with an ink arrow into balance.
  - Four replaced nodes sit under "Replaced manual steps", in the owner's order.
  - Wide: 880 × 224, a 2 × 2 grid on the left, the transaction on the right. Tall: 240 × 456, the steps above, the inputs stacked below.
- **Node widths:** each is the label measured in Chromium with the project's Archivo (width 87.5, 14 units), plus at least 12 units a side, on the 8-unit grid. The figures are in each geometry file's header.
- **Quest journal:** it renders all five sheets in the §1.2 order.

## Commits
- `ac50db8` feat(sheets): add term lists, compact sheets and the video facade
- `846cf44` feat(drawings): add the Quest migration and botmivivi ledger drawings
- plus the commit adding this report

## Static checks (fresh, after the last change)
- `pnpm check` → exit 0:
  - `design:lint … passes: 0 errors, 0 warnings (0 allowlisted)`
  - `fonts:check: the 12 font files match a fresh generation`
  - ESLint clean, and `All matched files use Prettier code style!`
  - `✓ Types generated successfully`, with `tsc` clean
- `pnpm build` → exit 0: `○ /`, `○ /_not-found`, no warnings.

## Behaviour evidence
A throwaway Playwright probe ran from the session scratchpad against `next start` on :3117, which was stopped by its PID. It is not a test, and nothing from it is committed. YouTube hosts were stubbed.

| Item | Result |
|---|---|
| Foreign requests before activation (after hover and focus) | 0 (Chromium, WebKit); no YouTube or Google `link` hints |
| Activation (Enter) | iframe `src` is the nocookie embed with `?autoplay=1`, `title="Quest by NFQ"`; `document.activeElement` is the iframe; opacity 1 with `transition: opacity 0.15s`; referrer policy `strict-origin-when-cross-origin` |
| Box shift on activation | poster y 0, height 0, next heading 0 px |
| No JS | `a[href="https://www.youtube.com/watch?v=yLJZXvO_ARU"]`; box 335 × 188.44 px (16:9 = 188.4) |
| Sheets | `target="_blank"` 0; empty `dd` 0; one link in the sheets, Lemonswan with `external-link`; the Scania meta is "NFQ Asia" alone; no undefined, null, NaN, "·" or `[copy:` in the journal |
| Figures | "10", "646 …", "2,951 …" |
| Matrix 320 / 375 / 768 / 1024 / 1440 × light and dark | overflow 0; each figure shows exactly one variant (tall below 1024, wide at 1024 and 1440); `data-proof` count 1 per shown SVG; every SVG `aria-hidden`; the `sr-only` `ol` present; 0 console errors or warnings |
| Width sweep 320–1920 px, 8 px steps, plus 767/769, 1023/1025–1027, 1279/1281 (209 widths) | 0 failures (no overflow, one variant per drawing); the smallest label is 14.22 px (1024 px, wide), and 14.35 px at 320 |

- **Console warning found and fixed:** Chromium warned "Allow attribute will take precedence over 'allowfullscreen'". `fullscreen` was already in `allow`, so the redundant `allowFullScreen` was removed. On the re-run, both engines logged 0 errors.
- **Screenshots** (scratchpad, not committed): the Quest journal at 320, 375, 768, 1024 and 1440 in both themes, plus drawing crops at 320 (dark) and 768 (light). I compared them with DESIGN.md.

## Deviations (for a ruling)
1. **The botmivivi boundary encloses only the three inputs.** "balance" sits outside it, and the arrows cross the boundary edge. That is the literal DESIGN.md row ("around order, return and payment, each with an ink arrow into balance"). If "the same transaction" should include the balance, only the geometry changes.
2. **The qualifier is repeated.** "in the first 2 months" appears on both the Customers and the Orders rows, so each `dt`/`dd` pair reads true on its own. The approval lists it once, after Orders. A `dl` can't group two rows under one note without breaking its content model.
3. **The carried data is ink,** outside the proof group, like CyberRock's attestation modes. DESIGN.md says only "beside it".
4. **Territory labels** ("v1", "v2", "the same transaction") sit inside each region's top-left corner. DESIGN.md gives no position.
5. **No connectors inside the territories,** and none between the replaced steps and the transaction. `info.md` names the parts, not their links.
6. **Poster layout:** the content is centred with an 8 px gap. The one-liner on compact sheets uses `lead`, like full-sheet ledes. DESIGN.md gives neither.
7. **The fade starts on the iframe's `load`,** not on the click (Motion: "the video is ready"). Focus moves on the click.

## Gaps and notes
- No copy gaps: every string comes from `src/content/`. Nothing was invented.
- Not done, per build mode: tests, axe, budgets, D8 (QA watches the video), and a real-network player check (P4-10).
- The lean suite's `tokens.test.ts` should cover the two new supplement tokens, and the drawings test should cover the new label boxes.
- The `Referrer-Policy` header is Phase 11. The iframe sets its own policy.
