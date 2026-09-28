# v2 · Quest cards: engineering report

**Status: NEEDS_CONTEXT.** The build is complete, but the gate is red on one lint error that needs a ruling (see Open question).

## Files
- `src/content/schema/projects.ts`, `src/content/projects.ts`: `cardStat { source, key?, value, qualifier }`. A Zod `refine` on `FullProject` fails the build unless the stat rejoins its source verbatim.
- **Added:** `src/components/quest-journal/quest-card.tsx` and `quest-tabs.client.tsx` (tablist, tab, tabpanel, swap cover, deep links).
- **Changed:**
  - `quest-journal.tsx`, `quest-file.tsx` (now the tabpanel body), `quest-hologram.client.tsx` (one stage), `quest-journal-controller.client.tsx` (selection state)
  - `quest-toast.tsx`, `noscript-style.tsx`, `quest.css`, `reveal.css` (Active lights)
  - `quest-scene.tsx` (cut, then project in over `swap`), `lib/motion/tokens.ts`, `theme.css`, the regenerated tokens and résumé
- **Removed:** `mission-list.client.tsx`, `quest-file-frame.client.tsx`, `quest-aside`/`quest-grid`/`quest-files`/`quest-viewport`/`quest-band`, `mission-item`/`mission-bar`, `chip-flip`, `--transition-duration-flip`, `--transition-duration-project` and `--state-bar-width`.
- **Commits:** `5a0dedd` feat(content), `62cdc21` feat(quest-journal).

## Evidence (fresh, Node 24)
- `pnpm check`: design:lint → "0 errors, 0 warnings"; tokens:check → "match a fresh generation"; fonts:check → "match a fresh generation"; resume:check → "matches its 11 locked inputs"; **lint → "✖ 1 problem (1 error)"** at `quest-tabs.client.tsx:233` `jsx-a11y/no-noninteractive-tabindex`.
- `pnpm typecheck` → "Types generated successfully", exit 0.
- `rm -rf .next && pnpm build` → "Compiled successfully", exit 0.
- **cardStat refine** (scratch tsx): the 3 real stats pass. Wrong value, wrong qualifier and wrong source are each rejected, including through `Projects` (path `[0,"cardStat"]`).
- **DOM and keyboard script** (Playwright against `next start -p 3620`) → **95/95 passed**. It covers:
  - roles and states
  - CyberRock selected by default, 1 canvas
  - Tab → arrows (wrap) → Home/End → Tab to the panel
  - the toast: none on load; on click, arrow keys and Mission log links
  - `/#quest-quest`
  - JS off: 3 panels
  - reduced motion: `animation-name: none`, the toast only fades
  - no page scroll at 320/375/1024/1440 in both themes (320: scrollWidth 320 = clientWidth 320; peek 52 px)
  - swiping keeps the selection
  - targets ≥ 240 px
  - focus rings unclipped and below the HUD
  - axe: 0 violations on `#quest-journal` in both themes
  - 0 console errors (4 headless "GL Driver Message … GPU stall" warnings were filtered, from the GPU driver, not the app)

## Acceptance checks
1. ❌ lint (1 error, pending the ruling below); ✅ typecheck, build, `DESIGN.md` lint 0/0. No tests (out of scope).
2. ✅
3. ✅
4. ✅
5. ✅ (light and dark: CyberRock success edge, strip, aura = 1 while botmivivi is selected; selected: accent-ink, 2 px, cursor opacity 1)
6. ✅ (cover `swap-scan` 0.32 s; reduced: no cover, toast fade)
7. ✅
8. ✅
9. ✅
10. ✅ (card strings come from `projects.ts`/`factTerms`; literals are only 1 px rules, the 2 px scan edge and the −4 px cursor offset, as in the existing reveal code)

## Deviations
- **Quest card stat:** "~300" plus the caption, with no key (main-session ruling). The schema therefore has `source` (checked) separate from an optional `key` (shown).
- **Removed `project` 700 ms:** it had no user left (handoff: "keep only if the hero uses it"), but `DESIGN.md` → Motion → Tokens still lists it.
- **Card width from `md`:** cards fill their 4-column cell (403 px at 1440), following "cards 4 · 4 · 4". The 312 px `quest-card` cap applies in the phone row.
- **noscript tabpanel rule:** it sits in `@layer base` with `!important`, because preflight's layered `[hidden]{display:none!important}` beats unlayered rules.
- **Toast re-clicks:** re-selecting the current card restarts the toast but not the swap (the swap runs only on a change).

## Open question
WAI-ARIA tabs and acceptance check 3 need `tabindex="0"` on each tabpanel. The jsx-a11y **strict** preset flags it. The plugin's recommended preset exempts `roles: ["tabpanel"]`, and strict does not. I did not disable or loosen the rule. Two options:
- (a) Add `{ roles: ["tabpanel"] }` to `jsx-a11y/no-noninteractive-tabindex` in `eslint.config.mjs`.
- (b) Use `tabIndex={-1}`, which fails check 4 ("next Tab reaches the panel") for panels with no focusable content.
