# v2 Phase F · fix round 1 (engineering report)

> `frontend-engineer`, 2026-09-28. Inputs: `docs/reviews/v2/final/qa-review.md` (FAIL: F1–F14), `docs/reviews/v2/final/design-check.md` (rulings 1–8, V1–V10), `DESIGN.md` at `4202c1f`.
> Commits `47e6ecd`..`8d93d63` (26 commits on local `main`, not pushed). `718e2bd` in that range is another agent's docs commit.
> Screens are in `docs/reviews/v2/final/fix-1/screens/` (50 PNGs, gitignored like every `screens/` folder). They were captured with Playwright 1.63 Chromium (SwiftShader WebGL) against my own `next start` on :3500 (PIDs 80009, 83328, 84417, each stopped by PID). I didn't touch :3000.

## Status: DONE_WITH_CONCERNS
Every finding is fixed and the gate is green. The concerns are three small judgement calls for design-lead (see Concerns). No new copy was needed.

## Gate (fresh, Node 24.21.0, after the last commit)
`pnpm check && pnpm build` → exit 0
- `design:lint` → `passes: 0 errors, 0 warnings (0 allowlisted), 1 infos`
- `tokens:check` → `the 2 token files match a fresh generation`
- `fonts:check` → `the 6 font files match a fresh generation`; `all 123 characters … are in all 3 font files`
- `resume:check` → `public/tidi-resume.pdf matches its 13 locked inputs`
- eslint clean; Prettier `All matched files use Prettier code style!`; typecheck exit 0
- `next build` → `○ /`, `○ /_not-found`, `○ /icon`, all static; no warnings

**Regenerated as the DESIGN.md change required:**
- `pnpm tokens` (`47e6ecd`: `--spacing-avatar-xl`)
- `pnpm fonts` (`db17068`): only `fonts.manifest.json` changed, because `stat-value` no longer asks for `tnum`. The woff2 files are byte-identical, so the fonts themselves are unchanged.
- `pnpm resume:pdf` (`a8b8253`): `theme.css` and the tokens are locked résumé inputs. Same content, 2 pages, 139,949 B, axe 0.

## Cross-cutting checks (this session)
- **axe 4.13** (WCAG 2.0, 2.1 and 2.2 A/AA): 0 violations in 12 runs. That covers 375 and 1440 px, both themes, motion on and reduced, plus the open menu at 375 px.
- **Overflow:** `scrollWidth == clientWidth` at 320, 375, 768, 1024, 1440 and 1920 px in both themes, after scrolling to the bottom.
- **Console:** no errors and no 4xx on page loads. The only warnings are the known upstream `THREE.Clock` deprecation (F11), SwiftShader's "GPU stall" driver notes, and `WEBGL_lose_context extension not supported` on the context-loss path. The last one appears only when the canvas unmounts 2 s after a loss that is never restored.

## Findings

| ID | What changed | Commit | Evidence |
|---|---|---|---|
| **F1** major | On `webglcontextlost` the stage switches at once to `data-holo-state="lost"`. The poster cuts in and the dead canvas hides with no cross-fade (the transition applies only outside `lost`), the tags hide, and the frameloop goes to `never`. The canvas stays mounted: a restore within 2 s returns to `live`; otherwise it unmounts as before. The quest stages share the hook and the state helper (`holo/holo-state.ts`). | `5dc460b` | See **Context-loss capture** below. `f1-contextlost-50ms-1440-{dark,light}.png` show the poster at 50 ms; `f1-contextlost-2550ms-1440-*.png` show the poster after the unmount. |
| **F2** major | While the sheet is open, Tab from the last link goes to the Menu button (its "x"), and Shift+Tab from the button goes to the last link. The popover's own focus order covers the rest. Esc is native. | `cd1b9fb` | See **Keyboard pass** below. `f2-menu-open-first-link-375-dark.png`, `f2-menu-tab6-back-to-x-375-dark.png` |
| **F3** major | A new `target-inline` utility gives the links `inline-flex`, a 44 × 44 px minimum, and `margin-block: calc((1lh - 44px) / 2)`, so the line box doesn't change. | `7a6bbbe` | At 320, 375, 768, 1024 and 1440 px: CyberRock is 74.7 × 44 and Quest 44 × 44, while the h4 stays 18.2 px tall (unchanged look). A scan of every link and button finds nothing under 44 px except the 1 × 1 sr-only skip link. `experience-1440-*.png` |
| **F4** | After hydration the facade link gets `role="button"`, and Space calls preventDefault and then activates it. Without JS it is still a plain link (`role` null, href is the watch URL). | `aed8fa9` | Space: 0 → 1 iframe ("Quest by NFQ", focused), and `scrollY` stays at 3283 → 3283. `f4-space-activated-1440-dark.png` |
| **F5** | Speaker tag: `type-label` → `type-nav`. | `1c37c2e` | Text "TiDi", rendered "TiDi", `text-transform: none`, 14 px / 600, in both themes. `f5-speaker-tag-1440-{dark,light}.png` |
| F6 | No code. Square ring accepted (ruling 2). | none | none |
| **F7** | `src/components/brand/monogram.tsx`: a 32 px gold (`accent`) chamfered tile with an `on-accent` "T", taken from the DTCG tokens and rendered to PNG at build time. It is declared by `app/icon.tsx` and served at a static `app/favicon.ico/route.ts`. No artwork of the owner. | `7da9515` | `GET /favicon.ico` → `200 image/png`; `/icon` → `200 image/png`; `<link rel="icon" href="/icon?…" type="image/png" sizes="32x32">`. |
| **F8** | An instant run sets `held`, so `shownVerdict` is empty. After one painted frame (a double rAF) a `reveal` event shows it. The log lines and the scene are final at once. | `9c40c40` | Reduced motion, a MutationObserver on `<output>`. From rest: `["", "genuine"]`. Rejected, then rejected again: `["", "rejected"]`. |
| **F9** | Wordmark: `min-w-target`. The text stays at the page edge. | `aa026cc` | 44 × 44 px at every width. |
| **F10** | 1) The camera backs off along z only when the host, its radius and its tag wouldn't fit. At 375 × 812 px and on wide stages the DESIGN.md framing is unchanged. 2) **Root cause of the "HOST" tag cut at the top:** in the calm mode (frameloop `demand`) the tags were projected through a stale camera world matrix. The frame callback runs before the render refreshes it, and no second frame follows. The camera effects (hero and quest) now call `updateMatrixWorld()`. | `763b41d`, `8d93d63` | The host tag's left edge is inside the viewport at 320 × 700 (21 px), 320 × 568 (23 px), 375 (28 px), 1024 and 1440. `f10-hero-320x700-{light,dark}-motion-off.png` show both tags pinned beside their anchors; compare QA's `hero-reduced-375-light.png`. |
| F11 | No code. The `THREE.Clock` warnings are upstream (R3F 9.8.1) and need a ruling. The `WEBGL_lose_context` warning now appears only on the unrecovered-loss path, from R3F's `forceContextLoss` on unmount. | none | Console logs above |
| **F12** | `theme.css` maps each component dimension once, named after its DESIGN.md entry or section: XP track, state bar, button-holo padding, switch, 56 px rows, status chip, quest band cap, timeline line and node, avatar widths. The component CSS reads the names, and the switch thumb inset and timeline offset are derived from them. The avatar's `sizes` attribute reads `avatar-xl` from `tokens.generated.json` (the widest rendered width), so no breakpoints are repeated. | `4df18d3` | Gate green. Visuals unchanged in the section captures (`*-1440-*.png`, `*-375-*.png`). |
| F13 | Done through ruling 1 (`f0e370e`, `font-variant-numeric: normal`), V3 and V7. | see rows | see rows |
| **F14** | The pending settle's cancel lives in a ref. A new select cancels it, and an unmount effect clears it (listener and timer). | `3cb7685` | Code path only. It is single-page, with no practical trigger to capture. |
| **V1** | Palette: `baseMetalness` and `baseRoughness` (Lab 0.15 / 0.6, Deck 0.7 / 0.35); Lab cone 0.16 → 0.22. Applied to both rigs and swapped in place with the theme. | `a64ef23` | `hero-1440-light.png`, `hero-375-light.png`, `quest-journal-1440-light.png`: the base reads as `scene-metal`, not a slab. |
| **V2** | Quest canvas: the hero's Deck Bloom (a shared `DeckBloom`), plus a holo rim ring at r 1.37–1.40. The feather already applies through `holo-canvas`. | `a64ef23` | `quest-journal-1440-dark.png`: the base glows, and the rim is visible. |
| **V3** | `rule-lead` is inline, with `text-decoration` 2 px, offset 4 px, `accent-ink`. After the wipe the colour transitions `transparent → accent-ink` over `sweep`; in the calm mode it is present at once. | `1ddd930` | Computed: `inline underline 2px 4px`, accent-ink in both themes; the reduced-motion colour is accent-ink at once. `house-rules-{1440,375}-{dark,light}.png`: no line starts with "—". |
| **V4** | The cover sits in its own `power-track` (`inset: 0; overflow: clip`) and moves `translateX(0 → 100%)`, led by a 2 px holo line at 70 %. | `f21ef15` | Mid-wipe computed transforms: `translateX(821px)` and `(402px)` (Inventory). Reduced motion: at rest at `translateX(716px)`, clipped. No overflow at any width. `v4-power-on-mid-1440-dark.png` (the screenshot landed after the wipe finished). |
| **V5** | `animation-range: entry 10% cover 45%`, with the `view-timeline-inset` removed so the range is relative to the whole viewport. | `0816240` | Line scale 0.894 with the log's middle at 70 % of the viewport, and 1.0 at 55 % and 50 %, in both themes. `v5-experience-middle-1440-dark-motion-on.png` |
| **V6** | `stats-card` from `xl`: `var(--spacing-avatar-xl)`. | `699fa15` | The avatar is 264 px at 1440 in both themes. `about-1440-*.png` |
| **V7** | From `lg` the grid stretches its items, so the sign-off panel matches the rows panel. `PartyBrackets` place four brackets just outside the grid's corners (their frame sets `--bracket-*`), drawn from `scale(0)` over `brackets` when `.contact-signoff` is revealed (`:has()`); in the calm mode they are present at once. | `5a08647` | Sign-off 364 px = rows 364 px; brackets `none` (drawn) after the reveal and in reduced motion. `contact-1440-{light,dark}.png` |
| **V8** | Below `sm`: the CTA pair and the console controls use `flex-col` at full width (the CTA pair also gets `self-stretch`). From `sm` each pair sits in a row. | `c9ed2b8`, `99bfffa` | At 375 px all four controls are 343 px wide, in both themes. `hero-375-*.png`, `f10-hero-320x700-*.png` |
| **V9** | Training card: `flex items-start gap-xs p-md`, and the marker is one line box high (`1lh`), centred on the first line. | `55d8196` | The 12 px marker is followed by the text 8 px later; the card is 50 px high (it was two lines). `inventory-1440-*.png` |
| **V10** | `afk-icon` rises 4 px and fades in with its panel (`row`, delay `rows`, stagger `row` via `--i`), once. | `2281232` | Mid-rise: the first icon at opacity 0.68, `translateY(1.27px)`, the rest still 0 / 4 px; at the end all are 1 / `none`; reduced motion: all 1. `v10-afk-mid-rise-1440-dark.png` |

### Context-loss capture (F1)
The hero at 1440 px, in both themes, with motion on and reduced. I called `WEBGL_lose_context.loseContext()` on the live canvas and then sampled it:

| When | State | Poster opacity | Canvas | Tags | Frameloop |
|---|---|---|---|---|---|
| 0, +50 and +300 ms after the loss | `lost` | 1 | 0 | 0 | `never` |
| After `restoreContext()` | `live` (the cross-fade runs) | | | 1 | `always` / `demand` |
| Lost again, +50 ms | `lost` | 1 | 0 | 0 | |
| Lost again, +2550 ms | `poster` | 1 | unmounted | 0 | |

- Before the fix, QA measured the poster at +1800 ms.
- In the calm mode the path is the same, with nothing animated.

### Keyboard pass on the mobile menu (F2)
Run at 375 and 1024 px (below `xl`), in both themes:

| Step | Focus lands on |
|---|---|
| Tab from the page top | Skip link, then Menu |
| Enter | "Quest journal" (in the sheet) |
| Tab ×4 | Mission log, House rules, Inventory, Join party |
| Tab 5 | Menu ("x"), with the sheet still open |
| Tab 6 | Quest journal |
| Shift+Tab from Menu | Join party |
| Esc | Menu, with the sheet closed and `aria-expanded="false"` |

- Every step: `elementFromPoint` hit the focused element, so no focus was covered.
- Console clean.

## Deviations from the brief
1. **F10 goes beyond DESIGN.md's literal camera numbers.** The z pull-back applies only where the spec's framing would clip the host; everywhere else the spec's values hold. The QA fix suggested it, but DESIGN.md → 3D Scenes → Camera doesn't state it. design-lead may want to record it there.
2. **F10 also fixed the tag projection bug** (stale camera matrix in the calm mode, `8d93d63`). It explained the tag cut in QA's `page-320-light-motion-off.png` and `hero-reduced-375-*.png`.
3. **V7 brackets show at every width.** DESIGN.md → Shapes says "the Join party grid" without a breakpoint, and the hero's brackets also show at every width. If design-lead meant "from `lg` only", it is a one-line `display` change.
4. **F7's icon is a new visual asset** (a gold chamfered "T"). The brief allowed a token-coloured monogram, but design-lead may want to confirm the mark.

## Concerns / for design-lead
- **V4 resting edge:** before its wipe, an unrevealed panel's cover sits at `translateX(0)`, so its 2 px holo edge shows as a vertical line at the panel's left while the panel is less than 25 % in view. This is visible in `quest-journal-1440-dark.png` (files 2 and 3 below the fold) and in the Inventory panels of the first V4 capture. It follows the spec, but it reads as "standing by". Hiding the edge until the wipe starts would need a spec note.
- **F11** needs a ruling to accept the upstream `THREE.Clock` warnings.
- **F12:** the component dimensions are now single-sourced in `theme.css`. If design-lead adds spacing tokens for them (56, 160, 220 and so on), the mapping collapses into the export.
- Fonts are untouched, as instructed. The owner's font pick (another agent's `718e2bd`) will need `pnpm fonts` and `pnpm resume:pdf` in its own task.

## Files changed (source)
- **Holo scenes (`src/components/holo/`):** `holo-state.ts` (new), `hero-scene-props.ts`, `quest-scene-props.ts`, `scenes/use-context-loss.ts`, `scenes/hero-scene.tsx`, `scenes/quest-scene.tsx`, `scenes/deck-bloom.tsx` (new), `scenes/palette.ts`, `scenes/hero-rig.ts`, `scenes/quest-rig.ts`
- **Hero (`src/components/hero/`):** `hero-stage.client.tsx`, `hero.tsx`, `cta-pair.tsx`
- **Quest journal (`src/components/quest-journal/`):** `quest-hologram.client.tsx`, `quest-journal-controller.client.tsx`
- **Shell (`src/components/shell/`):** `menu-sheet.client.tsx`, `hud-strip.tsx`, `corner-brackets.tsx`
- **Sections (`src/components/sections/`):** `mission-log.tsx`, `character-stats.tsx`, `house-rules.tsx`, `inventory.tsx`, `afk.tsx`, `join-party.tsx`
- **Other components:** `src/components/video-facade/video-facade.client.tsx`, `src/components/ui/panel.tsx`, `src/components/brand/monogram.tsx` (new)
- **App routes:** `src/app/icon.tsx` (new), `src/app/favicon.ico/route.ts` (new)
- **Logic:** `src/lib/handshake/machine.ts`
- **Styles (`src/styles/`):** `theme.css`, `holo.css`, `reveal.css`, `sections.css`, `shell.css`, `quest.css`, `hero.css`
- **Generated:** `src/styles/tokens.generated.{css,json}`, `src/assets/fonts/fonts.manifest.json`, `public/tidi-resume.pdf`, `resume.lock.json`

`info.md`, `DESIGN.md`, `CLAUDE.md`, `docs/progress.md` and `docs/design/font-options*` were not edited or staged.
