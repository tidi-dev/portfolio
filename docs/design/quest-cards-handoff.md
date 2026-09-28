# Quest cards · handoff for frontend-engineer

Source of truth: `DESIGN.md` → Components (Quest card, Quest card row, Quest detail panel, Toast), Motion, Responsive Behavior, Colors, changelog 2026-09-28. Owner, 2026-09-28: "Card row + detail panel"; overrides plan v2's "files all visible, no hidden tabs" ruling. No screenshots or preview pages (owner rule).

## Tokens
Re-export with `npx @google/design.md export --format css-tailwind DESIGN.md`; hand-map only what the schema drops (Known Gaps 1).

| Change | Token |
|---|---|
| Add colour | `success-wash` `#1A7F3714`, `success-wash-dark` `#3FB9501F` |
| Add spacing | `quest-card` 312px |
| Add components | `quest-card`, `quest-card-hover`, `quest-card-selected`, `quest-card-active`, `quest-card-aura`, `quest-card-aura-dark` |
| Remove component | `mission-item` |
| Add duration (theme.css, by hand) | `--transition-duration-swap: 320ms` |
| Remove duration | `--transition-duration-flip` and the `chip-flip` keyframes. Keep `project` only if the hero still uses it |

## Components (`src/components/quest-journal/`, `src/styles/quest.css`)
- **Add** `quest-card.tsx` (the card: strip, chip, title, lede, divider, key stat, "▸" cursor) and `quest-tabs.client.tsx` (tablist state: roving tabindex, arrows with wrap, Home/End, automatic activation, hash deep links, focus into the panel on a deep link).
- **Add** a card stat to the content, not the component: `projects.ts` gains `cardStat: { key, value, qualifier }` per full project, built from existing fields only (`factTerms.scale` + "13" + "services across Azure and AWS"; `factTerms.customers` + 646 + `copy.botmivivi.facts.window`; `factTerms.users` + "~300" + "users in Ha Noi, Da Nang, Sai Gon, Can Tho"). A content test asserts `${value} ${qualifier}` equals `facts.scale` and `copy.quest.users` verbatim, and botmivivi's value equals `usage.customers`.
- **Change** `quest-journal.tsx`: card row (tablist) then one detail panel (stage + three tabpanels). `quest-file.tsx` becomes the tabpanel body (keep `questAnchor` as the tabpanel id). `quest-hologram.client.tsx`: one placement, the panel stage (4:3 sticky from `lg`, 16:10 ≤ 320 px band below), one canvas, model = selected. `quest-journal-controller.client.tsx`: selection state replaces the IntersectionObserver band and the polite status region; unlock counts drive the toast (visitor selections only), achievements and the botmivivi count-up (first time each panel shows). `quest-toast.tsx`: position in the stage, restartable. Extend the existing `noscript` style: hide the card row and the stage, show every tabpanel.
- **Remove** `mission-list.client.tsx`, `quest-file-frame.client.tsx` (if only used for the band observer), the `quest-aside`, `quest-viewport`/`quest-band` split, `mission-item` styles, and the status chip flip.
- **Mission log:** project links point to `#quest-{id}` and must select that card.

## Acceptance checks
1. Lint, typecheck, build, tests green; `DESIGN.md` lint still 0 / 0.
2. On load CyberRock is selected, its panel shows, the other two panels are `hidden`; one `<canvas>` in the section.
3. axe 0 violations in both themes on the section; roles: one `tablist`, three `tab` (`aria-selected`, `aria-controls`), three `tabpanel` (`aria-labelledby`, `tabindex="0"`).
4. Keyboard: Tab lands on the selected card; Left/Right select and wrap; Home/End; next Tab reaches the panel. Focus ring fully visible on every card at 320 px and 1440 px (not clipped by the scroller, not under the HUD).
5. CyberRock keeps its `success` edge, strip and aura while botmivivi or Quest is selected; the selected card shows the 2 px `accent-ink` edge and "▸" in both themes.
6. Swap: cover plus holo scan edge ≤ 320 ms; with `data-motion="off"` the swap is instant and the toast only fades. "Quest unlocked" does not appear on load; it appears on each click, arrow selection and Mission log link.
7. 320 px: `document.documentElement.scrollWidth === clientWidth`; the card row scrolls and snaps, the second card peeks; swiping doesn't change the selection. From `md`: 3 cards, no row scroll.
8. `/#quest-quest` on load selects Quest and focuses its panel.
9. JS disabled: no card row, no stage, all three panels stacked with their headings.
10. Every card string traces to `src/content/` (no new copy); card targets ≥ 44 px; no token-free colour, size or duration in the diff.
