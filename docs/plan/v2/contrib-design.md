# Plan contribution v2: design

> Author: `design-lead`, 2026-09-28, for the v2 implementation plan (`implementation-plan` skill, design section).
> Inputs: `DESIGN.md` (created 2026-09-28; lint 0 errors, 0 warnings; 52 contrast pairs, 0 failures), `docs/design/directions-v2.md` §3, §5, §12 (B · Holo Deck selected 2026-09-28), the preview's B tab, `info.md` (Approved copy incl. the v2 rows), `CLAUDE.md`. Read alongside `contrib-engineering.md` and `contrib-verification.md` in this folder.
> Decisions only. Values live in `DESIGN.md`, facts in `info.md`; this file cites their names. `[copy: to draft & approve]` marks wording that waits for the owner (§5).

## 1. Page structure

### 1.1 Routes
| Route | Purpose | Spec |
|---|---|---|
| `/` | The one page | All of `DESIGN.md` |
| not-found | "Nothing here" · "Back to TiDi" | Components → Not-found |
| Résumé PDF (`resume.file`) | Linked from the hero and Join party as "Résumé" | Components → Buttons, Contact row |

### 1.2 Landmarks and heading outline
Section ids follow `contrib-engineering.md` §3 (`experience`, `about`, `contact`); the visible headings come from copy.
```text
skip link → #main
header (banner): HUD bar — wordmark "TiDi" · nav "Main" (xl+) · HUD readout · motion toggle · theme toggle · menu button (< xl)
main#main
  section#top (hero)          h1  TiDi / Hồ Trọng Đại (lang="vi") / Dai Ho Trong
  section#quest-journal       h2  Quest journal
    article#quest-cyberrock     h3  CyberRock
    article#quest-botmivivi     h3  botmivivi
    article#quest-quest         h3  Quest @ NFQ Asia        h4 Party lead · h4 Achievements
  section#experience          h2  Mission log               h3 Sunbytes · h3 NFQ Asia (projects as a list)
  section#house-rules         h2  House rules
  section#inventory           h2  Inventory                 h3 Main … Alt builds · h3 Leveling up
  section#about               h2  Character stats           h3 [education heading, copy] · h3 Languages
  section#afk                 h2  AFK
  section#contact             h2  Join party
footer (contentinfo): progress saved · still learning, always solving
```
- One `h1`. Panel headings are h3 styled as `panel-heading`; facts terms are `dt`, not headings.
- Nav: Quest journal, Mission log, House rules, Inventory, Join party. The hero CTA "Bring me a pain point" and the nav's "Join party" both land on `#contact`.
- The dialogue box's "Press A to continue" moves focus to `#afk`.

### 1.3 Section order
| # | Section | Content (`info.md`) | Main components (`DESIGN.md` names) |
|---|---|---|---|
| 1 | HUD bar | Brand; banner strings "▸ PLAYER 1", "XP · SYSTEM DESIGN", "LVL still leveling", "MAX not a thing" | HUD bar, menu sheet, skip link, icon buttons |
| 2 | Hero | Name display, role, `hero.sentence`, `hero.cta`, `resume.link`; `bench.*`, `a11y.steps.bench` | Corner brackets, hero intro, buttons, hero projector, switch, handshake log, scene tags |
| 3 | Quest journal | Projects → CyberRock (Active), botmivivi (Side), Quest @ NFQ Asia (Cleared); `botmivivi.facts`, `quest.users`, Party lead, the four achievements, `video.*`, `a11y.steps.*` | Quest holograms, mission item, quest file, status chip, stat readout, achievement badge, toast, video facade |
| 4 | Mission log | Experience → Sunbytes (CyberRock), NFQ Asia (Lemonswan, Quest, Scania); `lemonswan.one-liner`, `scania.one-liner` | Mission log timeline, link |
| 5 | House rules | The intro (two lines) and the four rules, with their bold lead phrases | Panel, rule panel |
| 6 | Inventory | The five profile skill groups (`lists.scope`); Leveling up | Panel, inventory slot, training card |
| 7 | Character stats | Class, Guild, Base, XP, Quests, Passive; bio (two paragraphs); education; `label.languages` (Vietnamese, English with IELTS 6.0 and EF SET C1); `ava.PNG` + `avatar.caption` | Panel, facts list, avatar frame, dialogue box |
| 8 | AFK | The five profile interests | AFK list |
| 9 | Join party | Sign-off; email, Telegram, GitHub, "Résumé" / `resume.contact-link`, `contact.location-label` + city | Contact row, buttons |
| 10 | Footer | "progress saved" + tagline | Footer |

**Placement choice for the owner (D-design-1):** Lemonswan and Scania sit under NFQ Asia in the **Mission log** as compact project entries, not in the Quest journal as §3 listed. The Quest journal then matches the owner's own journal ("2 active · 1 cleared"), and every journal entry gets a hologram. The alternative, §3 as written, adds two compact entries without holograms after Quest. This changes the layout only; no facts change.

## 2. Component inventory
Every component is specified in `DESIGN.md` → Components (states, tokens) and Responsive Behavior. "Island" means a client leaf (engineering §5, §6).

| Component | `DESIGN.md` entries | Section(s) | States | Island |
|---|---|---|---|---|
| HUD bar | `hud-bar`, `wordmark`, `hud-player`, `xp-track`, `xp-fill`, `nav-link(-hover)`, `state-bar` | 1 | nav hover, current; readout by width | scroll-spy only |
| Icon button | `icon-button(-hover)` | 1 | hover, focus, pressed (theme, motion), expanded (menu) | yes |
| Menu sheet | `menu-sheet` | 1 | open, closed | yes |
| Skip link, focus ring | `skip-link`, `focus-ring` | all | visible on focus | no |
| Corner brackets | `corner-bracket` | 2 | load draw | no |
| Hero intro | `hud-player`, `brand-name`, `alt-names`, `role-line` | 2 | load wipe | no |
| Button primary / ghost / holo | `button-primary(-hover)`, `button-ghost`, `button-holo` | 2, 9, not-found | hover, active, focus; holo busy (`aria-disabled`) | Run only |
| Switch | `switch`, `switch-thumb(-on)` | 2 | off, on, focus | yes |
| Handshake log + verdict | `step-log`, `step-on`, `step-numeral-on`, `verdict-genuine`, `verdict-rejected` | 2 | pending, lit, skipped; genuine, rejected | yes |
| Hero projector | 3D Scenes → Hero; `scene-base`, `scene-chip`, `scene-pins` | 2 | boot, ambient, handshake, still | yes (dynamic) |
| Scene tag | `scene-tag` | 2, 3 | none | yes |
| Panel | `panel`, `panel-edge`, `panel-heading`, `divider` | 3–9 | power-on | reveal observer |
| Section heading | `section-heading` | 3–9 | none | no |
| Status chip | `status-active`, `-side`, `-cleared` | 3 | flip on unlock | yes |
| Mission item | `mission-item`, `state-bar` | 3 (lg+) | hover, current, focus | yes |
| Quest holograms | 3D Scenes → Quest holograms | 3 | project in, ambient, still | yes (dynamic) |
| Quest file | `panel`, `quest-title`, `facts-term`, `facts-value` | 3 | current | no |
| Stat readout | `stat-readout` | 3 | count-up | yes |
| Achievement badge | `achievement-badge` | 3 | power-on + glint | reveal observer |
| Toast | `toast` | 3 | in, hold, out | yes |
| Video facade | `video-facade` | 3 | idle, activated | yes |
| Mission log timeline | `timeline-line`, `timeline-node-current` | 4 | draw, node power-on | CSS (`view()`) + IO fallback |
| Rule panel | `panel`, `rule-lead` | 5 | power-on, lead underline | reveal observer |
| Inventory slot | `inventory-slot` | 6 | hover (colour only) | no |
| Training card | `panel`, `training-marker` | 6 | rise; triggers the level-up sweep | reveal observer |
| Avatar frame | `avatar-caption` | 7 | scan once; tilt (fine pointer) | tilt only |
| Dialogue box | `panel`, `speaker-tag`, `link` | 7 | continue button focus | A key only |
| AFK list | `panel` | 8 | power-on | reveal observer |
| Contact row | `contact-row`, `button-primary`, `button-ghost` | 9 | hover, focus | no |
| Link | `link` | 4, 7, 9 | hover, focus | no |
| Footer | `footer-line` | 10 | none | no |

## 3. 3D and motion strategy per section
The motion system, tokens and reduced variants are in `DESIGN.md` → Motion; the scenes are in `DESIGN.md` → 3D Scenes. One motion mode: `prefers-reduced-motion` or the HUD motion toggle sets `data-motion="off"`.

| Section | 3D | Entrance | Reward moment | Hover and pointer | `data-motion="off"` |
|---|---|---|---|---|---|
| HUD bar | none | strip slides down, XP fills to 70 % | level-up sweep when Leveling up is reached | nav colour | static, XP at 70 % |
| Hero | Hero projector (Bloom in Deck) | brackets draw, intro wipes, hologram boots | the handshake autoplays once, then Run / Counterfeit | rig tilt, chip drag, button sweep | still frame; Run jumps to the verdict; no autoplay |
| Quest journal | Quest holograms: a sticky viewport from `lg`, a band per file below | files power on | Quest unlocked: the model projects in, the chip flips, the toast; achievements glint; botmivivi counts up | mission items, viewport tilt (lg) | model cut, toast fades, final values |
| Mission log | none (CSS line) | line draws with scroll; nodes power on | the current node's gold core | links | fully drawn |
| House rules | none | panels power on in reading order | the lead-phrase underline sweeps | none | present |
| Inventory | none | panels power on | the ▲ markers rise + the HUD level-up sweep | slot colour | present |
| Character stats | none | panels power on; stat rows tick in | the avatar scan line | avatar tilt (fine pointer) | present, no tilt |
| AFK | none | panel powers on | none: the idle screen stays calm on purpose | none | present |
| Join party | none | panel powers on | none; the gold Email button is the goal | button sweep | present |

**Quest journal interaction (design decision, differs from `contrib-engineering.md` §6.2):**
- **Every quest file is rendered and visible, stacked; nothing is hidden behind tabs.** Work-first visitors scan all three quests by scrolling.
- The current quest is the file ≥ 50 % in view, or the one whose mission item was activated. Mission items are in-page links with `aria-current`, not a tablist. Activating one scrolls to the file (instant under `data-motion="off"`) and moves focus to its heading.
- The toast is `aria-hidden`. Scroll-driven unlocks would make a live region chatter; the state is carried by `aria-current` and by focus.
- **Mobile:** each file opens with its own hologram band. Engineering chooses between drei `View` over one canvas and one small canvas per band, with only the visible one live.
- If the main session prefers engineering's tabs, `DESIGN.md` stays valid except for the mission item's role, and the toast then gets engineering's polite live region.

**Other rulings needed from the main session, so the contributions agree:**
- **Mobile hero order (engineering D3):** `DESIGN.md` adopts engineering's R5. Only the canvas leads; the controls follow the intro. The owner may prefer the preview's order (see §5, D-design-2).
- **Pause scope (engineering D4):** `DESIGN.md` answers yes on both. Motion off gives every reduced variant, including an instant user-run handshake, and the choice persists across visits.
- **"▸", "▼", "▲" (engineering D2):** these render as Tabler filled icons (`DESIGN.md` → Shapes).
- **Checkpoints:** engineering's Phase 2 "design checkpoint 1" should be removed. The owner chose one design checkpoint after the build (§4). Per-phase QA reviews are unaffected.

## 4. Design checkpoint (one, after the build)
- **When:** in phase F, after the gate, code review, UI audit and content verification (`contrib-verification.md` §2 order). It reuses QA's captures.
- **Who:** `design-lead` critiques (`design-system`, Critique) → `docs/reviews/v2-design-critique.md`; then the main session shows the owner. It is the owner's single look-and-feel sign-off.
- **Screens** (`docs/reviews/v2/screens/`): 320, 375, 768, 1024, 1440, 1920 px × Deck and Lab, full page. Plus these states at 375 and 1440 in both themes:
  - the hero at rest after autoplay (genuine), mid-run (the packet in flight), and counterfeit (rejected)
  - each quest current, with the toast visible (lg), and the mobile hologram bands
  - the menu open; focus visible on a chamfered button, the switch and a mission item
  - `data-motion="off"` for the whole page at 1440 Deck and 375 Lab
- **Motion evidence:** a short screen recording or frame sequence at 1440 Deck of the load timeline, the autoplayed handshake, one Quest unlocked, and the level-up sweep. The design check judges motion, so stills aren't enough.
- **Criteria:**
  - Does the signature moment land in the first viewport at 375 and 1440?
  - Hierarchy and scanning order.
  - Deck and Lab parity (Lab designed, not washed out).
  - Restraint: remove one accessory.
  - No drift into the bans (`DESIGN.md` → Do's and Don'ts).
  - The honesty locks hold (no numbers on the XP bar; no availability).
  - Glow never under body text.
  - Reduced motion still tells the whole story.
- **Findings format:** `screen@width/theme — issue — DESIGN.md reference — change — severity`. A fix that changes the system updates `DESIGN.md` first; a material look change goes to the owner.

## 5. Open copy slots and owner choices
| # | Slot | Where | Status |
|---|---|---|---|
| C-v2-1 | Motion toggle accessible name (engineering D1). Candidates to draft: "Motion" (the `a11y.theme-toggle` pattern with `aria-pressed`), "Pause animation" | HUD bar | `[copy: to draft & approve]`, needed first (hero phase) |
| C-v2-2 | Stat labels "Guild" and "Passive": the owner's words (`profile.md`, quoted in `info.md` Identity) but missing from `ui.profile-labels` | Character stats | `[copy: to draft & approve]` (confirm) |
| C-v2-3 | The education panel heading (`info.md` heading: "Education & certifications") | Character stats | `[copy: to draft & approve]` |
| C-v2-4 | Inventory group label: "AI companions" (`info.md`) or "Companions" (`profile.md`). Default: `info.md` | Inventory | `[copy: to draft & approve]` (confirm) |
| C-v2-5 | Quest heading: "Achievements" (`info.md` label list, the default) or "Achievements unlocked" (`profile.md`) | Quest file | `[copy: to draft & approve]` (confirm) |
| C-v2-6 | Banner strings as HUD labels: "XP · SYSTEM DESIGN", "LVL still leveling", "MAX not a thing" (in `info.md` as banner text; only "▸ PLAYER 1" is in `ui.profile-labels`) | HUD bar | `[copy: to draft & approve]` (confirm) |
| C-v2-7 | Routine terms: "Team", "Scale", "Stack" (quest facts); "Email", "Telegram", "GitHub" (contact rows). v1 used them without a batch | Quest file, Join party | `[copy: to draft & approve]` (one confirm batch) |
| D-design-1 | Lemonswan and Scania in the Mission log (§1.3) | Mission log | owner choice |
| D-design-2 | Mobile hero: the console after the intro (the default, a clean focus order) or above it (the preview) | Hero | owner choice |

Already approved and reused, so no new copy: `toast.quest-unlocked`, `heading.experience`, `heading.contact`, `ui.profile-labels`, `depiction.holograms`, `behaviour.handshake-autoplay`, and `a11y.steps.cyberrock` / `quest` / `botmivivi` as the steps under each quest hologram. The scene tags "host" / "chip" come from `depiction.bench`; "v1" / "v2" come from Quest facts.
