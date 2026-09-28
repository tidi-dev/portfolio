# Design directions v2: RPG, 3D, alive

> `design-direction` steps 2–7, drafted by `design-lead` on 2026-09-28. **Not yet presented to the owner.**
> **Inputs:** `info.md` (Site preferences → Visual style, 2026-09-28; Approved copy), `CLAUDE.md` (goals, design and motion principles), `generic-patterns.md` (owner override), `docs/research/portfolio-references.md`, `ava.PNG`, `banner.svg`, `profile.md`, and v1 `docs/design/directions.md` (B · Proof selected, built, rejected).
> **Preview:** `docs/design/directions-v2-preview.html` is one self-contained file with a tab per direction, working Three.js heroes, one animated section each, a theme toggle and a motion toggle. Screens are in `docs/design/v2-screens/` (§11).
> **Copy:** every quoted string is verbatim from `info.md`, or it is the owner's own RPG vocabulary from `profile.md` / `banner.svg` (allowed by the brief). New wording is marked `[copy: to draft & approve]`.

## Contents
0. What v1 taught us
1. Design Read
2. Grounded in the subject
3. Rules shared by all three directions
4. Direction A: Overworld
5. Direction B: Holo Deck (recommended)
6. Direction C: Character Select
7. Contrast check (computed)
8. Comparison
9. Recommendation
10. For the owner: decisions, open questions, copy slots
11. Preview and verification
12. Selection record

---

## 0. What v1 taught us

The owner's verdict on the B · Proof build: "page is too ugly and boring, not trendy. not eyecatching, no 3d animations".

| v1 choice | Why it failed the owner | v2 rule |
|---|---|---|
| "Subtle, one signature moment", MOTION 5 | Read as static and plain | MOTION 8–9. The hero is a live 3D scene, and every section has an entrance and a reward moment |
| Quest vocabulary capped, "no XP bars, levels, health bars" | Removed the game the owner asked for | RPG UI is the design language: HUD, character sheet, quest log, inventory, level-up. It is built only from the owner's words |
| Light, documentation-like system sheets, hairlines, no shadows | "Not trendy" | Depth everywhere: 3D, glass or solid game panels, light, colour |
| One grotesque at 16 px on white | "Boring" | Display faces with character: rounded-wide (A), angular HUD (B), condensed italic (C) |
| Avatar as a small framed artefact | Wasted the most personal asset | The avatar is a hero or near-hero element in B and C, and the pin-card companion in A |

What we keep from v1: truth to `info.md`, the approved copy, AA contrast in both themes, real HTML over the 3D, and a reduced-motion experience that tells the whole story.

## 1. Design Read

**Reading this as:** a work-first developer portfolio for engineering hiring managers\* and for clients who arrive with a software pain point\*, with a playful-but-precise RPG language ("Player 1", quests, XP, inventory), leaning toward a polished game UI rendered in real-time 3D\*.

- **Stated in `info.md`:**
  - the goal: "Both, work-first. Projects and experience lead; a clear "bring me your pain point" contact also serves clients."
  - the visual style: "clean, modern, developer style; many animations and 3D so the site feels lively and eye-catching; follow an RPG game style"
  - the system theme with a toggle, English only
- **\*Inferred:**
  - the audience roles, as in v1
  - "polished game UI" as the way to satisfy both "RPG" and "clean, developer style" together

## 2. Grounded in the subject

| # | From `info.md` / the owner's assets | What it gives the design |
|---|---|---|
| 1 | **The owner already speaks RPG.** `profile.md` is built from Character stats (Class, Guild, Base, XP, Quests, Passive), a Quest journal (Active, Side, Cleared), Party lead, Achievements unlocked, Inventory, Leveling up, AFK, "Press A to continue" and "progress saved". | The UI vocabulary. No invented game terms are needed |
| 2 | **The owner's banner is a Player 1 HUD.** `banner.svg`: "▸ PLAYER 1", "XP · SYSTEM DESIGN", "LVL still leveling", "MAX not a thing", GitHub-dark `#0D1117`, gold `#E3B341`, green `#3FB950`. | A HUD strip that is honest: no numeric levels, because the owner's own answer is "still leveling" |
| 3 | **Proving a chip is genuine.** CyberRock: "prove a device is genuine before anything trusts it"; the approved depiction "A host sends a challenge, the chip answers, the response returns, verdict "genuine"; a counterfeit chip fails after the challenge." | A 3D artefact with a real mechanic, and its approved labels: "Run the handshake", "Counterfeit chip", "rejected" |
| 4 | **A career told as quests.** Quest @ NFQ Asia ("a career-path system modeled on RPG quests"), the v1 → v2 migration "DynamoDB → MySQL migration with ~5 min of downtime", then CyberRock. botmivivi, the side quest, is "back office for a flour distributor". | A route between places, and cargo crossing from an old island to a new one |
| 5 | **A warm, illustrated Player 1.** `ava.PNG`: the owner coding at a café table, with sticker vignettes of football, gaming, coding and coffee. | A character portrait for a character sheet or a character-select card |

**Honesty locks, all directions:**
- **No numbers the owner didn't give.** No "LVL 6", no percentages, no skill bars. The XP bar is the banner's own decorative 70 % fill, always labelled "still leveling" and never given a number.
- **Not shown:** "STATUS accepting quests" (availability), travel and photography (declined), the phone number, the second email, the reference. The avatar's travel sticker is never cropped out as an interest.

---

## 3. Rules shared by all three directions

### Page inventory (work-first)
1. Header or HUD
2. Hero: the 3D scene, the name lockup, the role, `hero.sentence`, and the CTA pair `hero.cta` and `resume.link`
3. Quest journal: CyberRock (Active), botmivivi (Side), Quest @ NFQ Asia (Cleared), then Lemonswan and Scania under NFQ Asia
4. Experience: Sunbytes (2024-03 to present) and NFQ Asia (2020-03 to 2024-03). The heading is `[copy: to draft & approve]`
5. House rules
6. Inventory and Leveling up
7. About, as the character sheet: bio, education, languages, and the avatar with `avatar.caption`
8. AFK
9. Contact: email, Telegram, GitHub, résumé, and the sign-off. The heading is `[copy: to draft & approve]`, with "Join party" as a candidate
10. Footer: "progress saved · still learning, always solving"

### Section-to-game mapping (the concept all three share; each direction renders it differently)
| Section | Game element | Strings (verbatim) |
|---|---|---|
| Hero | Player 1 intro and HUD | "TiDi", "Hồ Trọng Đại", "Dai Ho Trong", "Full-stack Developer", `hero.sentence`, "Bring me a pain point", "Résumé", "▸ PLAYER 1", "XP · SYSTEM DESIGN", "LVL still leveling", "MAX not a thing" |
| Quest journal | Quest log with statuses | "Active", "Side", "Cleared", the one-liners, "Role", "When", `format.period`, the "What I built" lines, `botmivivi.facts`, `quest.users`, "Party lead", "Achievements unlocked" with Clean Slate, Five-Minute Window, Front Door and No More ClickOps |
| Experience | Level timeline or route, with no level numbers | employers, titles, periods, "In production since 2020" |
| House rules | The rules of play | the intro plus the four rules verbatim, with the bold lead phrases |
| Inventory | Item slots by group | Main, Data, Ops, Companions, Alt builds, and their items (`lists.scope`) |
| Leveling up | Skills in training | the four topics verbatim |
| About | Character sheet | Class, Guild, Base, XP, Quests, Passive rows; bio; education; "Languages" |
| AFK | Idle or rest screen | the five profile interests |
| Contact | Party invite | email, Telegram, GitHub, "Résumé" / "PDF, {size}", the sign-off |

### Copy and rendering
- The v1 rendering rules still hold:
  - term and description pairs become `dt`/`dd`, so the "WORD — fragment" shape is structure, not decoration
  - middot lists become real lists
  - typography gets curly quotes
- Em dashes inside the owner's sentences stay as given.
- The name lockup is one `h1`. "Hồ Trọng Đại" carries `lang="vi"`, with line height ≥ 1.15 wherever it appears.

### 3D and motion tech (verified on npm, 2026-09-28; `frontend-engineer` re-verifies and installs)
| Package | Version | Licence | Use |
|---|---|---|---|
| `three` | 0.186.1 | MIT | renderer |
| `@react-three/fiber` | 9.8.1 | MIT | React renderer for Three.js, as a client island |
| `@react-three/drei` | 10.7.9 | MIT | helpers: `Html` pins and labels, `Float`, `Bounds`/camera fly, `useCursor`, `AdaptiveDpr` |
| `@react-three/postprocessing` | 3.1.3 | MIT | Bloom for glow (B, and dusk in A) |
| `motion` | 13.4.4 | MIT | DOM motion: reveals, layout, springs, reduced-motion hook |
| `gsap` | 3.15.0 | GSAP Standard "no charge" licence (not OSI) | optional, only if a timeline is clearer than Motion. Owner awareness needed |

- **3D rules:**
  - Every canvas is `aria-hidden`; everything it shows also exists as HTML.
  - It renders only while on screen.
  - The DPR is capped at 1.75.
  - It is dynamically imported, so the page reads fine before it loads.
  - Assets are procedural geometry (no model files), so there are no licence questions.

### Icons, fonts and quality floor
- **Icons:** Tabler Icons outline, `@tabler/icons-react` 3.48.0, MIT, one library. Stroke per direction: A 2 round, B 1.5 square-ish, C 2.25. Used for the theme toggle, menu, external link, download, the AFK interests (ball-football, shuttlecock, swimming, device-gamepad-2, coffee), and contact marks from Tabler's brand set only.
- **Fonts:**
  - At most two families per direction, self-hosted from Fontsource (all 5.3.0, OFL-1.1).
  - Vietnamese subsets were confirmed in the Google Fonts CSS API and in each family's `google/fonts` METADATA.pb (`subsets: "vietnamese"`).
  - The preview renders "Hồ Trọng Đại" in every face; see the screens.
- **Quality floor:**
  - WCAG 2.2 AA in both themes (§7).
  - 2 px visible focus in each direction's focus colour, offset 3 px.
  - Touch targets ≥ 44 px, mobile-first, no horizontal scroll.
  - Text never sits directly on the 3D. It sits on a panel, a slab or a scrim that carries the contrast.
  - `prefers-reduced-motion` gives a calm variant with complete content.
  - Autoplaying motion longer than 5 s has a visible pause control (the "Motion" toggle pattern in the preview).
  - Nothing flashes more than 3 times per second.

---

## 4. Direction A: Overworld

### Identity
- **Concept:** the owner's career as a floating low-poly world seen from above. Each quest is a place you can fly to, and Player 1 walks the route from the cleared quest to the active one.
- **Design Read:** a work-first developer portfolio for hiring managers and clients, with a bright, friendly, cosy-strategy-game language, leaning toward a low-poly world map with clean game-UI panels.
- **Dials:**
  - **VARIANCE 7:** a full-bleed world with floating panels and pins. The sections below are calmer two-column layouts, so reading stays easy.
  - **MOTION 8:** an orbiting camera, windmill, crates, flag, clouds and walking token; camera flights; stamp slams; route drawing.
  - **DENSITY 4:** big scene, few words per panel, generous card padding.

### Palette (light-first "Daylight"; dark "Dusk")
| Light | Hex | Role | Reason |
|---|---|---|---|
| Sky | `#EAF3F8` | Page background (the hero adds a `#8ECDEB` → `#DDEFF8` sky gradient) | The world floats in daylight. A cool, bright base, far from the v1 greys |
| Cloud | `#FFFFFF` | Panels, pins, cards | Game UI panels read as clean white cards over the world |
| Deep | `#0F2437` | Text, focus ring | Deep-sea navy: softer than black, and it belongs to the sky family |
| Slate | `#4B6072` | Secondary text | |
| Marker | `#F26B1D` | The one accent, as fill and graphics: quest markers, CTA, route dots, roofs, XP | The universal game colour for "quest here". The roofs tie the world to the UI |
| Ember | `#A94300` | The accent as text: stamps, role line, links | Marker darkened to pass as text |

| Dark | Hex | Role | Reason |
|---|---|---|---|
| Dusk | `#0D1B2A` | Page background (the hero sky runs `#081322` → `#1C3A5A`) | The same world at night: lit windows and lanterns |
| Dusk panel | `#15283B` | Panels | |
| Moonlight | `#EAF2F8` | Text | |
| Mist | `#9DB2C4` | Secondary text | |
| Lantern marker | `#FF8A3D` | Accent as fill and text, focus ring | The marker, lamplit |

3D-only colours (decorative, never carrying text): grass `#74C167`, earth `#B9855A`, rock `#8E93A8`, walls `#F6F0E4`, leaves `#3FA35B`, window glow `#FFC56B`.

### Typefaces
| Role | Family | Licence, source | Why |
|---|---|---|---|
| Display: name, headings, pins, stamps | **Unbounded** (variable 200–900) | OFL-1.1, `@fontsource-variable/unbounded` 5.3.0 | A rounded, extra-wide display that reads like a modern game title, friendly but not childish. Vietnamese subset |
| Body and UI | **Be Vietnam Pro** (400–700) | OFL-1.1, `@fontsource/be-vietnam-pro` 5.3.0 | Designed by Vietnamese type designers for Vietnamese, so "Hồ Trọng Đại" gets first-class diacritics. Warm and humanist for long reading |

**Scale (ratio ≈ 1.25):**

| Style | Size | Setting |
|---|---|---|
| Brand | 44 → 76 px | Unbounded 800, line height 0.95 |
| h2 | 30 → 44 px | Unbounded 800 |
| Card title | 22 → 24 px | Unbounded 800 |
| Body | 16 → 17 px | Be Vietnam Pro, line height 1.55, ≤ 60ch |
| Labels | 12.5–14 px | Be Vietnam Pro 600, sentence case (no all-caps tracking) |

**Shape:** one soft radius system, 18 px for panels and 14 px for buttons, pill for chips and pins. Buttons have a tactile 4 px "game button" bottom edge that presses down on `:active`.

### Wireframes

**Desktop, 1440 px.** Hero full-bleed at 100svh; panels on a 48 px inset.
```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ TiDi   (Quest journal  House rules  Inventory  AFK)  ← glass pill nav                      │
│                                                                 ┌─ HUD ────────────────┐  │
│              ☁                 ( ! Quest @ NFQ Asia )           │ ▸ PLAYER 1           │  │
│        ┌──┐        ═══crates═══▶ ┌─────┐   ( ! CyberRock )      │ XP · SYSTEM DESIGN   │  │
│        │v1│ islet    bridge      │guild│·      ◉ chip          │ [██████████░░░]      │  │
│        └──┘                      └─────┘ ·  ┃keep┃             │ LVL  still leveling  │  │
│                                    · · · ·◆ · ·  ( ! botmivivi) │ MAX  not a thing     │  │
│                      3D WORLD (drag to orbit)      windmill ✣  └──────────────────────┘  │
│ ┌─ intro panel ──────────────────────┐                        ┌─ quest card ─────────┐  │
│ │ TiDi                               │                        │ [ACTIVE] [Quest      │  │
│ │ Hồ Trọng Đại   Dai Ho Trong        │                        │          unlocked]   │  │
│ │ Full-stack Developer               │                        │ CyberRock            │  │
│ │ Officially a full-stack developer… │                        │ prove a device is…   │  │
│ │ [Bring me a pain point] [Résumé]   │                        │ (Backend)(auth)(…)   │  │
│ └────────────────────────────────────┘                        │ 2024-03 to present   │  │
│                                                                └──────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Quest journal (sticky)  │ ┆ ○ [ACTIVE] CyberRock ─────────────────────────────────────┐ │
│ 2 active · 1 cleared    │ ┆   prove a device…  Role (chips)  When 2024-03 to present   │ │
│ In production since 2020│ ┆   ◆ Challenge-response auth …  ◆ Chip lifecycle …  ◆ …     │ │
│  (3 cols)               │ ┆ ○ [SIDE] botmivivi  … Users: 10 · Customers: 646 · …       │ │
│                         │ ┆ ● [CLEARED] Quest @ NFQ Asia … Achievements unlocked 2×2   │ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```
Alignment:
- The intro panel and the quest card share the bottom baseline, and the HUD aligns to the nav's right edge.
- The journal is a 300 px sticky column and a fluid column. The dashed route line runs through the status nodes.

**Mobile, 375 px.**
```text
┌───────────────────────────────┐
│ TiDi             ┌ HUD ─────┐ │
│                  │▸ PLAYER 1│ │
│   ( ! Quest… ) ( ! CyberRock )│
│  ▢═══▢ · · ·◉keep             │
│   3D world 58svh ( ! botmiv…) │
│        windmill ✣             │
│ ┌ intro panel (overlaps −56) ┐│
│ │ TiDi                       ││
│ │ Hồ Trọng Đại  Dai Ho Trong ││
│ │ Full-stack Developer       ││
│ │ Officially a full-stack…   ││
│ │ [Bring me a pain point]    ││
│ │ [Résumé]                   ││
│ └────────────────────────────┘│
│ ┌ quest card (tap a pin) ────┐│
│ └────────────────────────────┘│
│ Quest journal                 │
│ ┆○ [ACTIVE] CyberRock …       │
│ ┆○ [SIDE] botmivivi …         │
│ ┆● [CLEARED] Quest …          │
└───────────────────────────────┘
```
Mobile rules:
- The nav collapses to "Menu" (`a11y.menu-button`).
- The world is a 58svh band with vertical scrolling kept (`touch-action: pan-y`).
- Pins shrink to 34 px with the label kept, and the hit area is padded to 44 px.
- The achievements grid becomes one column.

### 3D hero
- **The scene:** three low-poly floating islands above a sea of clouds, all procedural geometry with flat shading and soft shadows.
  - **Main island:** CyberRock as a stone keep, with a security chip hovering on top inside a spinning check ring. botmivivi is a windmill, for the flour distributor, with sacks at its base.
  - **Guild islet:** Quest as a guild hall with a banner.
  - **v1 islet:** a grey shed. A rope bridge links it to the guild islet, and crates cross the bridge from v1 to v2: the migration.
  - **The route:** a dotted line from the guild hall to the keep, and a side branch to the windmill. The Player 1 token walks from the cleared quest to the active one.
- **What the visitor can do:**
  - Drag to orbit, with the pitch clamped; the camera slowly auto-orbits when idle.
  - Hover a landmark for a pointer cursor and a highlight.
  - Click a landmark or its pin, and the camera flies to it, a ring bursts at its base, and the quest card updates with a "Quest unlocked" stamp slam. Pins are real `<button>`s with `aria-pressed`, so the whole interaction works from the keyboard.
- **Tech:**
  - R3F `<Canvas shadows>`, with drei `<Html>` for the pins (occlusion-aware), `CameraControls` or a custom damped spherical rig as in the preview, and `Instances` for the route dots and trees.
  - Bloom is used only at Dusk, for windows and lanterns.
  - Theme changes relight the scene (sun to moon, window emissive on); geometry never swaps.

### Signature moment: fast travel
Selecting a quest flies the camera across the world to its landmark. The quest card slams its status stamp and plays "Quest unlocked" `[copy: to draft & approve]`. The world rewards curiosity, and every stop is a real project.

### Motion system
| Moment | What moves | Communicates | Timing (for DESIGN.md tokens) |
|---|---|---|---|
| Page load | The sky fades in and the islands rise into place (y −1 → 0, staggered); the XP bar fills 0 → 70 % with one shine pass; the pins drop in | "The world is ready, Player 1" | 900 ms `easeOutCubic`; XP 1.8 s `cubic-bezier(.2,.8,.2,1)`; pins +80 ms stagger |
| Ambient (hero only) | The windmill turns, crates cross, the flag waves, clouds drift, the islands bob ±0.08, the token walks the route every 13 s | A living world, with each loop tied to a project | continuous; paused off-screen, and by the Motion toggle |
| Scroll | The journal route line draws down (CSS `animation-timeline: view()` with an IO fallback); each quest node pops, and its card slides in from the route side | Progress along a path | 1.6 s draw; card 600 ms `back-out(1.2)` |
| Hover | Game buttons lift 2 px and press 3 px; pins gain an accent ring; landmarks highlight | Tactile, clickable | 150 ms |
| Quest unlocked | Camera flight (damped spring), ring burst, stamp slam (scale 2.2 → 1, rotate −14° → −3°) | Selection is a reward | flight ~1.2 s; slam 500 ms `back-out(1.6)` |
| Achievement unlocked | The four Quest achievements pop in sequence, each with a light sweep | "Achievements unlocked" | 500 ms each, +150 ms stagger |
| Level up (Leveling up section, production) | The four topics rise out of the route like waypoints, and the section heading gets a single gold ring pulse | Skills in training | 600 ms, once |

### Section mapping
| Section | A's game element |
|---|---|
| Quest journal | A route with status nodes and quest cards; the world landmarks mirror it |
| Experience | Two regions on the route: "NFQ Asia" (with Lemonswan, Quest and Scania as its stops) and "Sunbytes" (CyberRock). Periods verbatim, no level numbers |
| House rules | Four waystone cards along a short path, each lead phrase bold. They reveal in reading order |
| Inventory + Leveling up | A satchel grid of slot cards per group; Leveling up as waypoints still ahead on the route |
| About | Character sheet: the avatar in a panel (`avatar.caption` visible), the stats rows, the bio |
| AFK | A campfire corner of the world: a small 3D vignette (optional) and five Tabler icons with labels |
| Contact | "Join party" `[copy]` panel with email, Telegram, GitHub, résumé and the sign-off |

### Content fit
- Everything needed exists. No screenshots are needed; the world is procedural.
- **Depictions need approval** (§10): the keep with a chip for CyberRock, the windmill for botmivivi, the guild hall and crates-over-a-bridge for the Quest migration.

### Reduced motion
- The world renders as one still frame at a composed angle, and nothing loops.
- Selecting a pin cuts the camera to the landmark instead of flying; the card updates without the slam.
- The route and cards are shown fully drawn.
- The preview does exactly this (`reduced-a-1440-light.png`).

### Risks and trade-offs
- **Cute tips into kitsch.** Mitigated by a strict palette (one accent), flat shading without textures, and clean white panels with real typographic hierarchy.
- **The world reads as a game before it reads as a developer.** The panels carry the developer content; the world is the frame.
- **Modelling effort is the highest of the three:** about 10 procedural props and camera choreography.
- **The hero has 6 text groups.** The intro keeps the 4-element rule; the HUD and the quest card are scene UI. Mobile stacks them below the world.

### Genericness review
- **Checked:** centred hero (no, it's asymmetric panels); gradient blob (no, it's a real scene); particles unrelated to the work (no, every prop maps to a project); fade-up on every section (no, route draw and stamp slam instead); all-caps eyebrows (only the status stamps, which are the owner's labels).
- **Changed:**
  - Considered and rejected: a pixel-art token and a parchment map. Pixel art violates the override, and parchment re-enters cluster 1. A faceted gem token and a daylight sky were chosen instead.

---

## 5. Direction B: Holo Deck (recommended)

### Identity
- **Concept:** Player 1's command deck. The owner's banner HUD becomes the page frame, and his hardest quest, proving a chip is genuine, floats as a live hologram you can rotate and run.
- **Design Read:** a work-first developer portfolio for technical hiring managers and tech-literate clients, with a sleek, sci-fi RPG HUD language, leaning toward holographic game UI in the owner's GitHub-dark banner palette.
- **Dials:**
  - **VARIANCE 6:** a split hero, then a 12-column bento of HUD panels. The structure is strong enough for scanning, and varied by panel size.
  - **MOTION 9:** a continuously alive hologram (rings, scan, motes); a scripted handshake; panel "power-on" wipes; the XP bar.
  - **DENSITY 6:** a HUD is denser by nature; panels group information tightly with clear labels.

### Palette (dark-first "Deck"; light "Lab")
| Dark | Hex | Role | Reason |
|---|---|---|---|
| Void | `#070B14` | Page background | The banner's `#0D1117`, pushed deeper so the hologram glows |
| Glass | `#0F1726` | Panels | |
| Signal | `#E6EDF3` | Text | The banner's text colour |
| Static | `#8B949E` | Secondary text | The banner's grey |
| Gold | `#E3B341` | The one UI accent: Player 1, CTA fill, focus ring, XP, headings | The banner's own gold |
| Holo | `#4FD8E8` | Hologram light: 3D, meaningful lines, the role line. Never a second button colour | The projector's light |
| Genuine / Rejected | `#3FB950` / `#F85149` | Verdict states only | The banner's green; GitHub's red |

| Light | Hex | Role | Reason |
|---|---|---|---|
| Lab | `#EEF2F6` | Page background | The same deck with the lights on: a clean lab |
| Panel | `#FFFFFF` | Panels | |
| Ink | `#0D1117` | Text | The banner's background becomes the ink |
| Graphite | `#57606A` | Secondary text | |
| Gold | `#E3B341` fill with Ink text; Gold ink `#7D5A00` as text and focus | Accent | Gold can't be text on white, so its ink variant carries text |
| Holo teal | `#0B7285` | Hologram lines (normal blending instead of additive) | Cyan washes out on white; teal keeps the hologram legible |
| Genuine / Rejected | `#1A7F37` / `#CF222E` | Verdicts | |

### Typefaces
| Role | Family | Licence, source | Why |
|---|---|---|---|
| Display, HUD labels, buttons | **Chakra Petch** (500–700) | OFL-1.1, `@fontsource/chakra-petch` 5.3.0, by Cadson Demak | Squared, chamfered letterforms that match the chamfered HUD panels. Reads as game HUD without being a novelty face. Vietnamese subset |
| Body | **Mona Sans** (variable width 75–125, weight 200–900) | OFL-1.1, `@fontsource-variable/mona-sans` 5.3.0 | GitHub's own typeface, from the platform where the owner's RPG README and banner live. The width axis gives the names an expanded stance at 112 % width, and body text at 100 %. Replaces mono, so there is no terminal tell |

**Scale (ratio ≈ 1.333):**

| Style | Size | Setting |
|---|---|---|
| Brand | 56 → 104 px | Chakra Petch 700, holo glow in dark only |
| Panel heading | 13 px | Chakra Petch 700, tracked 0.18em. The one deliberate all-caps system: HUD labels, and only the owner's labels |
| h2 (sections) | 32 → 44 px | Chakra Petch 700 |
| Body | 16 → 17 px | Mona Sans 400, ≤ 52ch in the hero, ≤ 68ch elsewhere |
| Stat keys | 12 px | Chakra Petch 600, gold |

**Shape:**
- One system: chamfered corners (a 14 px 45° cut, `clip-path`) on panels and buttons, and 0 radius elsewhere.
- Corner brackets frame the viewport.
- There are no drop shadows; depth comes from glow and glass.

### Wireframes

**Desktop, 1440 px.** A 1240 px container; the hero is a 5/7 split.
```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ TiDi        ▸ PLAYER 1   XP · SYSTEM DESIGN [▮▮▮▮▮▮▮▮▮▮▯▯▯]   LVL still leveling   MAX not a thing │
│ ⌐                                                                                        ¬ │
│   ▸ PLAYER 1                         │   HOST ◇╮          ≈≈≈ scan ring ≈≈≈        CHIP     │
│   TiDi  (104 px, holo glow)          │         ╰──challenge──▶ ┌▤▤▤▤▤▤▤┐                   │
│   Hồ Trọng Đại   Dai Ho Trong        │    ◀──response──────── │  die   │ ←hologram chip    │
│   ── FULL-STACK DEVELOPER            │                         └▤▤▤▤▤▤▤┘                   │
│   Officially a full-stack developer… │                  ░░░ light cone + motes ░░░         │
│   [Bring me a pain point] [Résumé]   │              (( ((  projector rings  )) ))          │
│                                      │ [Run the handshake]      ┌ 1 The host sends a…   ┐ │
│                                      │ [▭ Counterfeit chip]     │ 2 The chip sends back…│ │
│ └                                    │                          │ 3 Verdict: GENUINE    │ ┘│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌ CHARACTER STATS ─────────────────────────────┐ ┌ INVENTORY ─────────────────────────┐   │
│ │ ┌avatar┐  CLASS    Full-stack Developer      │ │ MAIN  [TypeScript][Node.js][NestJS]│   │
│ │ │ holo │  GUILD    Cyber security for IoT(EU)│ │ DATA  [PostgreSQL][MySQL]…         │   │
│ │ │ scan │  BASE     Ho Chi Minh City, Vietnam │ │ OPS   [AWS][Azure][Docker]…        │   │
│ │ └──────┘  XP / QUESTS / PASSIVE …            │ └────────────────────────────────────┘   │
│ └──────────────────── span 7 ──────────────────┘ └───────────── span 5 ─────────────┘     │
│ ┌ LEVELING UP ──── [▲ distributed-systems…][▲ reliability & SRE][▲ …][▲ …] ── span 12 ┐   │
│                      progress saved · still learning, always solving                       │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```
Alignment:
- The HUD strip is fixed to the top.
- The intro text column and the handshake log share the stage baseline.
- The bento panels align to the 12-column grid with 16 px gaps.
- Every panel heading has a trailing rule to the panel edge.

**Mobile, 375 px.**
```text
┌───────────────────────────────┐
│ TiDi      ▸ PLAYER 1 [▮▮▮▮▯]  │
│ ⌐                           ¬ │
│ HOST ◇╮             CHIP      │
│       ╰──────▶ ┌▤▤▤┐          │
│   hologram 48svh └▤▤▤┘        │
│      (( projector rings ))    │
│ [Run the handshake]           │
│ [▭ Counterfeit chip]          │
│ ┌ 1 The host sends a…       ┐ │
│ │ 2 The chip sends back…    │ │
│ └ 3 Verdict: GENUINE        ┘ │
│ ▸ PLAYER 1                    │
│ TiDi                          │
│ Hồ Trọng Đại  Dai Ho Trong    │
│ ── FULL-STACK DEVELOPER       │
│ Officially a full-stack…      │
│ [Bring me a pain point]       │
│ [Résumé]                      │
│ CHARACTER STATS (stacked)     │
│ INVENTORY (wrapping slots)    │
│ LEVELING UP (2 × 2)           │
└───────────────────────────────┘
```
Mobile rules:
- The HUD strip keeps only Player 1 and the XP bar.
- The hologram comes first; eye-catch beats text order here, and the `h1` still comes first in DOM order, repositioned with CSS `order`.
- The controls stack below the canvas, never over it.

### 3D hero
- **The scene:** a holographic projector.
  - **Base:** a dark metal disc with three counter-rotating light rings and a tick ring.
  - **Light:** an additive light cone rises from it, with drifting motes.
  - **The chip:** a floating security chip (package, 40 pins, a glowing circuit die drawn procedurally) that bobs and turns, crossed by a scan ring sweeping up and down.
  - **The host:** a gold wireframe node beside it, joined to the chip by two faint paths.
- **What the visitor can do:**
  - Move the pointer to tilt the whole rig, and drag to spin the chip.
  - Press **"Run the handshake"** (approved) to play the challenge-response. A gold packet travels host → chip ("1. The host sends a challenge."), a cyan packet returns ("2. The chip sends back a response."), the chip flares green with a pulse ring, and the verdict reads **genuine**.
  - Toggle **"Counterfeit chip"** (approved, `aria-pressed`) and the chip fails after the challenge: step 2 is struck through, the chip flashes red with one short shake, and the verdict reads **rejected** (approved). This is exactly the approved depiction.
  - The live step list is real HTML and the verdict is an `<output role="status">`, so screen readers get the whole story.
- **Tech:**
  - R3F with `<EffectComposer><Bloom/></EffectComposer>` for glow; in the preview, additive materials fake it.
  - `shaderMaterial` for the cone.
  - `Instances` for the pins and ticks.
  - The sequence is a small state machine shared by the 3D scene and the HTML log.

### Signature moment: run the handshake
The one bold thing: the visitor runs the owner's real authentication mechanism and gets a verdict. It shows what he builds, it uses copy the owner already approved, and it plays automatically once on load so no one misses it.

### Motion system
| Moment | What moves | Communicates | Timing |
|---|---|---|---|
| Page load | Corner brackets draw in; the HUD strip slides down; the XP bar fills through its segments; the hologram "boots" (rings scale 0 → 1, cone fades, chip materialises with a scan pass); the handshake auto-runs once at +1.4 s | System online, Player 1 | brackets 400 ms; XP 2.2 s; boot 1.2 s |
| Ambient (hero) | Rings rotate, the scan sweeps, motes rise, the chip bobs | A live hologram | continuous; off-screen pause; Motion toggle |
| Scroll | Bento panels power on with a left-to-right `clip-path` wipe (staggered 160 ms); the avatar gets one holo scan line; the stat rows tick in | Panels coming online | wipe 900 ms `cubic-bezier(.7,0,.2,1)`; rows +100 ms |
| Hover | Buttons: a light sweep crosses the gold. Inventory slots: a holo border with 1 px lift. Panels: brackets brighten | Interactive surfaces | 200–500 ms |
| Quest unlocked (Quest journal) | Selecting a quest projects its mini-hologram (the chip for CyberRock, a ledger stack for botmivivi, two linked data slabs for the Quest migration) into a shared viewport; the status chip flips | Opening a quest file | 700 ms |
| Achievement unlocked | Each achievement badge powers on with a chamfer glint, as a toast-like reveal in the Quest file | "Achievements unlocked" | 400 ms, +120 ms stagger |
| Level up | Entering Leveling up: a single gold bar sweep across the HUD strip, and the ▲ markers rise | "Leveling up" | 800 ms, once per visit |

### Section mapping
| Section | B's game element |
|---|---|
| Quest journal | A mission list (left) and a quest file (right) with a small hologram per quest. Statuses as HUD chips; details as `dt`/`dd` rows; the Quest file lists Party lead and Achievements unlocked |
| Experience | A vertical mission timeline, with the two employers as nodes on a holo line. Periods verbatim |
| House rules | Four panels that power on in order, each lead phrase in gold |
| Inventory + Leveling up | Slot grid by group (as previewed); Leveling up as four "in training" panels |
| About | Character stats panel: avatar in a holo frame, stats rows, bio, education, languages |
| AFK | An "AFK" status panel: five interests with Tabler icons, idle-state styling |
| Contact | "Join party" `[copy]` comms panel: email, Telegram, GitHub, résumé, sign-off. The CTA repeats the gold style |
| Footer | "progress saved · still learning, always solving" as the HUD's last line |

### Content fit
- Everything exists. The hero reuses approved copy (`bench.run`, `bench.toggle`, `bench.verdict-rejected`, `a11y.steps.bench`, `depiction.bench`).
- The quest holograms for botmivivi and Quest are new depictions and need approval.

### Reduced motion
- The hologram renders one still frame: rings still, no motes drifting.
- "Run the handshake" jumps straight to the final state (steps lit, verdict shown, chip coloured green or red), and the colour holds.
- Panels appear without the wipe.
- The preview does this (`reduced-b-1440-dark.png`).

### Risks and trade-offs
- **Cluster 2** (near-black with a bright accent) and the sci-fi HUD are familiar looks. Justified below; mitigated with a light theme that is a real design, not an inversion.
- **Less "fantasy RPG" than A or C.** The RPG lives in the HUD, the character stats, the quest file and the inventory. This is the RPG of the owner's own banner, not of swords.
- **Glow can smear text.** Glow never sits behind body text: text sits on Glass, or on the Void at 16:1.
- **Bloom costs GPU.** Performance is out of scope, but it is still limited to the hero canvas.

### Genericness review
- **Cluster 2 used, with a stated reason:** it is the owner's own banner palette (GitHub-dark, gold, green), which he designed for his RPG README. The accent is gold, not acid green or emerald, and the cyan is light inside the 3D, not a UI accent.
- **Removed from the banner:**
  - window dots, the `$` prompt and the typing cursor (the terminal cliché)
  - mono labels (replaced by Chakra Petch)
  - the "STATUS accepting quests" line (availability)
- **Avoided:** numbered eyebrows, a tech-logo marquee (the inventory is text slots), and skill bars.
- **Changed:**
  - Considered and rejected: a starfield background and a 3D globe, both unrelated to the work. The hologram carries the scene alone.

---

## 6. Direction C: Character Select

### Identity
- **Concept:** a bold JRPG menu screen. Player 1 is a collectible character card you can spin and flip on a glowing pedestal, orbited by loot (the inventory groups), and every section is a menu tab.
- **Design Read:** a work-first developer portfolio for hiring managers and clients, with an energetic, graphic, modern-JRPG-menu language, leaning toward slanted high-contrast game menus with the owner's illustrated avatar as the star.
- **Dials:**
  - **VARIANCE 8:** diagonal slabs, skewed panels, a vertical menu, the card centred on the slab edge.
  - **MOTION 8:** slab wipes, card spin and flip, orbiting gems, menu cursor, tab slides, the level-up banner sweep.
  - **DENSITY 5:** big type, clear menu, compact slots.

### Palette (light-first "Menu Day"; dark "Menu Night")
| Light | Hex | Role | Reason |
|---|---|---|---|
| Paper | `#F2F4FF` | Page background | A cool periwinkle white, the menu backdrop |
| Card | `#FFFFFF` | Panels, slots | |
| Ink | `#0A0F3C` | Text | An indigo-black that belongs with cobalt |
| Dusk ink | `#454B7A` | Secondary text | |
| Cobalt | `#2335E0` | Slabs, selected tabs, links, focus; white text on it | The dominant game-menu colour: saturated, confident, opposite of v1's quiet greys |
| Sun | `#FFD23F` | Highlight bars, menu cursor fill, CTA fill, role bar; Ink text on it | The JRPG selection highlight. It also echoes the banner's gold, brighter |

| Dark | Hex | Role | Reason |
|---|---|---|---|
| Night | `#080B2E` | Page background | |
| Night panel | `#141A5C` | Panels, slots | |
| Starlight | `#F4F5FF` | Text | |
| Haze | `#B5BAE6` | Secondary text | |
| Cobalt, lit | `#4557F5` | Slabs (Starlight text on it) | Brighter cobalt, so the slab separates from Night |
| Sun | `#FFD23F` | Highlight, links, focus | |

### Typefaces
| Role | Family | Licence, source | Why |
|---|---|---|---|
| Every role, through the width axis and italic | **Saira** (variable width 50–125, weight 100–900, roman and italic) | OFL-1.1, `@fontsource-variable/saira` 5.3.0, by Omnibus-Type | A sporty techno-grotesque, the genre of racing and game UI. Width 72 italic 900 gives the menu titles and the brand their slanted energy, and width 100 roman 400 gives readable body text. One family matches the slanted shape system. Vietnamese subset |

**Scale (ratio ≈ 1.414, dramatic by design):**

| Style | Size | Setting |
|---|---|---|
| Brand | 72 → 150 px | Saira width 72, italic 900, line height 0.82 |
| h2 | 40 → 68 px | Saira width 75, italic 900, with a sun underline bar |
| Menu | 22 px | Saira width 80, italic 800 |
| Body | 16.5 px | Saira width 100, 400, ≤ 46ch in the hero |
| Labels | 11–14 px | Saira 700–800 |

**Shape:**
- One system: skewed parallelograms (−10° to −14°) for slabs, buttons, tabs and highlight bars, and square corners everywhere.
- Hard offset shadows (5 px, Ink) on primary buttons: a comic-graphic depth instead of soft blur.

### Wireframes

**Desktop, 1440 px.** Grid: menu 250 px, stage 1.05fr, intro 1fr.
```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ TiDi                 │         ▲ beam            ◆ gem        ╱██████████████████████████│
│                      │    ◇ gem   ┌────────────┐            ╱███  TiDi (150 px italic)   │
│   Quest journal      │            │▸ PLAYER 1  │  ◆        ╱████  Hồ Trọng Đại  Dai Ho… │
│ ▶[Inventory     ]◀sun│            │  avatar    │         ╱█████  [Full-stack Developer]  │
│   House rules        │            │  card      │        ╱██████  Officially a full-…     │
│   AFK                │            │ [TiDi     ]│  ◆    ╱███████  [Bring me a pain point]▰ │
│                      │            │ Full-stack │      ╱████████  [Résumé]                 │
│ Press (A) to continue│            └────────────┘     ╱█████████                          │
│         ▼            │      ⬡ pedestal, rune ring  ╱ sun slash ███  cobalt slab           │
│                      │  Illustrated avatar of TiDi… (caption)                              │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Inventory ▔▔▔▔ (sun bar)                                                                    │
│ ╱Main╱ ╱Data╱ ╱Ops╱ ╱Companions╱ ╱Alt builds╱   ← skewed tabs (role=tablist)               │
│ [TypeScript◣] [Node.js◣] [NestJS◣] [React◣] [Next.js◣] [Vue 3◣]   ← slots slide in         │
│ Leveling up   ═══════ sun banner sweeps ═══════                                              │
│ ╱▲ distributed-systems…╱ ╱▲ reliability & SRE╱ ╱▲ infrastructure as code╱ ╱▲ AI in…╱        │
│ progress saved · still learning, always solving                                             │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```
Alignment:
- The cobalt slab's leading edge passes just right of the card, so the card sits on the boundary between the two worlds.
- The intro text aligns to the slab's inner edge.
- The menu is vertically centred in the viewport.

**Mobile, 375 px.**
```text
┌───────────────────────────────┐
│ TiDi                          │
│ Quest journal  Inventory  Hou→│ ← horizontal menu strip
│      ◇     ┌──────────┐   ◆   │
│            │▸ PLAYER 1│       │
│  card +    │  avatar  │       │
│  pedestal  │ [TiDi   ]│       │
│  62svh     └──────────┘       │
│ ╲╲╲╲ ⬡ pedestal ╲╲╲╲╲╲╲╲╲╲╲╲ │
│████ cobalt band (skewY) ██████│
│  Illustrated avatar of TiDi…  │
│  TiDi                         │
│  Hồ Trọng Đại  Dai Ho Trong   │
│  [Full-stack Developer]       │
│  Officially a full-stack…     │
│  [Bring me a pain point]      │
│  [Résumé]                     │
│ Inventory  ╱Main╱╱Data╱…      │
│ [slot][slot]  (2 columns)     │
│ Leveling up (1 column)        │
└───────────────────────────────┘
```
Mobile rules:
- The vertical menu becomes a scrolling strip, and the "Press A" button hides because keyboards are rare.
- The slab becomes a skewed band under the card.
- The slots go to two columns.

### 3D hero
- **The scene:** a hexagonal cobalt pedestal with sun-yellow edges, a counter-rotating hex ring and a dashed rune ring, and a light beam rising behind the card.
  - **The loot:** five faceted gems orbit it, one per inventory group: Main, Data, Ops, Companions, Alt builds.
  - **Sparkles** rise in the beam.
- **The card** is a DOM element in CSS 3D (`preserve-3d`, `backface-visibility`):
  - The front is the avatar with a holographic foil sheen, "▸ PLAYER 1", "TiDi" and "Full-stack Developer".
  - The back is the stats: Class, Guild, Base, XP, Passive.
  - Keeping the card in the DOM means the avatar and stats are real, selectable, accessible content, and there is no WebGL texture or CORS issue.
- **What the visitor can do:**
  - Drag the card to spin it; it springs back.
  - Click, Enter or Space to flip it. It is a real `<button aria-pressed>` overlay, named `[copy: to draft & approve]`.
  - Hover a gem for a tooltip with that group and its items (duplicated in the Inventory section).
  - Move the pointer to tilt the card and shift the foil.
  - Press the **A** key, or the "Press A to continue" button, to jump to the Inventory.
- **Tech:** R3F for the pedestal, rings, beam (`shaderMaterial`) and gems; the card is a sibling DOM element driven from the same `useFrame` loop, a spring toward the flip target. drei `Html` is not needed.

### Signature moment: select your character
The avatar card sits on the pedestal and responds to touch: spin it, flip it to read the stats, and watch the loot orbit. "Press A to continue", the owner's own line, is a working control.

### Motion system
| Moment | What moves | Communicates | Timing |
|---|---|---|---|
| Page load | The cobalt slab and sun slash wipe in diagonally; the card drops onto the pedestal (scale 0.6 → 1, rotate −8° → 0); menu items and intro lines slide in from opposite sides | "Character select" screen transition | slab 900 ms `cubic-bezier(.7,0,.2,1)`; card 900 ms `back-out(1.15)`; lines +70 ms |
| Ambient (hero) | Pedestal and rings rotate, gems orbit and bob, sparkles rise, the card sways ±9°, the "▼" blinks at 1.6 s (2 steps, well under 3 Hz) | A live menu idle state | continuous; off-screen pause; Motion toggle |
| Scroll | Section titles slide in on a skew; slots enter staggered from the left | Menu page change | 450 ms, +45 ms stagger |
| Hover | Menu: a sun bar grows under the item, and a ▶ cursor appears. Slots: lift and skew −3°, the corner gem scales. Buttons: the offset shadow deepens | JRPG cursor feedback | 180–250 ms `back-out` |
| Quest unlocked (Quest journal) | Selecting a quest tab plays a full-width skewed banner wipe showing the quest title and status, then the quest detail panel slides in | Entering a quest | 700 ms |
| Achievement unlocked | Badges flip in like cards, 3D rotateY 90° → 0 | "Achievements unlocked" | 450 ms, +100 ms |
| Level up | Entering Leveling up: a sun banner sweeps across the section (scale 0 → 1 → 0 across the X axis), then the four topics rise | "Leveling up" | 1.3 s banner, then +100 ms stagger |

### Section mapping
| Section | C's game element |
|---|---|
| Quest journal | A quest menu: a left list with status badges, and a right detail panel on a cobalt slab. Party lead and Achievements unlocked as flip badges |
| Experience | Chapter select: two chapters, NFQ Asia and Sunbytes, as skewed panels. Chapter numbering would be new copy; avoided unless the owner wants it |
| House rules | A "rules" menu screen: the four rules as a selectable list with a large detail pane, cursor-driven |
| Inventory + Leveling up | Tabbed slot grid (as previewed); the Leveling up banner |
| About | The card's back is the short character sheet; the full sheet (bio, education, languages) is a menu page |
| AFK | A rest screen: the avatar's own sticker vignettes (football, gaming, coffee, coding; never the travel one) as small cards with the five interests |
| Contact | "Join party" `[copy]` as the final menu item and screen: email, Telegram, GitHub, résumé, sign-off |

### Content fit
- Everything exists. The avatar is used heavily, which is its best use.
- **Needs approval:**
  - the gem-per-group depiction
  - the sticker crops from `ava.PNG` for AFK (an owner asset, but a new use)
  - the card flip label

### Reduced motion
- The slabs are static.
- The card sits still, and flipping swaps faces instantly with no rotation animation.
- The gems stay in place.
- The banner sweep and the slot stagger are off.
- The preview does this (`reduced-c-1440-light.png`).

### Risks and trade-offs
- **The loudest of the three.** Cobalt and sun at full saturation can feel shouty on long pages. Mitigated: slabs only in the hero and the section openers; content panels are white or Night panel.
- **Condensed italic display is harder to read.** It is used only at display sizes; body text is roman width 100.
- **The 3D is the lightest here.** The WebGL is the stage; the star is a CSS 3D card, which may read as "less 3D" to the owner.
- **The genre reference is strong.** It must not look like a copy of any specific game's menu. The original parts are the shape system and the avatar card.

### Genericness review
- **Checked:**
  - Oversized screaming H1: the brand is large by genre, but it is one word, the owner's brand, with no gradient text.
  - `<br>`-split italic headline: no.
  - Numbered markers: removed. The first draft numbered the inventory slots 1–6, which is a numbered marker on non-sequential content, so they were cut in the preview.
  - Hover lift on every card: only slots and buttons, with skew, not lift-everything.
- **Changed:**
  - Considered and rejected: a pixel-font "PRESS START". The owner's own "Press A to continue", set in Saira, is used instead.

---

## 7. Contrast check (computed)

- **Method:** WCAG 2.x relative luminance, computed by a Node script with no rounding before comparison. Thresholds: text ≥ 4.5:1; UI, focus and meaningful graphics ≥ 3:1.
- **Result: 54 pairs, 0 failures.**
- **Exempt (decorative, never the only carrier of information):**
  - 3D scene colours
  - glow
  - hairline rules and panel borders (`--line`)
  - the XP gradient fill (always labelled in text)

| Dir | Theme | Pair | Foreground | Background | Ratio | Needs | Result |
|---|---|---|---|---|---|---|---|
| A | light | Body text | Deep `#0F2437` | Sky `#EAF3F8` | 14.06:1 | 4.5:1 | Pass |
| A | light | Body text on panel | Deep `#0F2437` | Cloud `#FFFFFF` | 15.82:1 | 4.5:1 | Pass |
| A | light | Secondary text | Slate `#4B6072` | Sky `#EAF3F8` | 5.81:1 | 4.5:1 | Pass |
| A | light | Secondary text on panel | Slate `#4B6072` | Cloud `#FFFFFF` | 6.53:1 | 4.5:1 | Pass |
| A | light | Accent as text (links, stamps) | Ember `#A94300` | Cloud `#FFFFFF` | 6.02:1 | 4.5:1 | Pass |
| A | light | Accent as text on page | Ember `#A94300` | Sky `#EAF3F8` | 5.35:1 | 4.5:1 | Pass |
| A | light | CTA label on marker fill | Deep `#0F2437` | Marker `#F26B1D` | 5.19:1 | 4.5:1 | Pass |
| A | light | Marker graphic on panel (UI) | Marker `#F26B1D` | Cloud `#FFFFFF` | 3.05:1 | 3:1 | Pass |
| A | light | Focus ring (Deep) on page | Deep `#0F2437` | Sky `#EAF3F8` | 14.06:1 | 3:1 | Pass |
| A | dark | Body text | Moonlight `#EAF2F8` | Dusk `#0D1B2A` | 15.37:1 | 4.5:1 | Pass |
| A | dark | Body text on panel | Moonlight `#EAF2F8` | Dusk panel `#15283B` | 13.27:1 | 4.5:1 | Pass |
| A | dark | Secondary text | Mist `#9DB2C4` | Dusk `#0D1B2A` | 7.95:1 | 4.5:1 | Pass |
| A | dark | Secondary text on panel | Mist `#9DB2C4` | Dusk panel `#15283B` | 6.86:1 | 4.5:1 | Pass |
| A | dark | Accent as text (links, stamps) | Lantern marker `#FF8A3D` | Dusk panel `#15283B` | 6.40:1 | 4.5:1 | Pass |
| A | dark | CTA label on marker fill | Dusk `#0D1B2A` | Lantern marker `#FF8A3D` | 7.42:1 | 4.5:1 | Pass |
| A | dark | Focus ring (marker) on page | Lantern marker `#FF8A3D` | Dusk `#0D1B2A` | 7.42:1 | 3:1 | Pass |
| B | dark | Body text | Signal `#E6EDF3` | Void `#070B14` | 16.66:1 | 4.5:1 | Pass |
| B | dark | Body text on glass | Signal `#E6EDF3` | Glass `#0F1726` | 15.18:1 | 4.5:1 | Pass |
| B | dark | Secondary text | Static `#8B949E` | Void `#070B14` | 6.40:1 | 4.5:1 | Pass |
| B | dark | Secondary text on glass | Static `#8B949E` | Glass `#0F1726` | 5.83:1 | 4.5:1 | Pass |
| B | dark | Accent text (Player 1, links) | Gold `#E3B341` | Glass `#0F1726` | 9.22:1 | 4.5:1 | Pass |
| B | dark | CTA label on gold fill | Void `#070B14` | Gold `#E3B341` | 10.11:1 | 4.5:1 | Pass |
| B | dark | Hologram line (meaningful graphic) | Holo `#4FD8E8` | Void `#070B14` | 11.55:1 | 3:1 | Pass |
| B | dark | Verdict genuine (text) | Genuine `#3FB950` | Glass `#0F1726` | 7.06:1 | 4.5:1 | Pass |
| B | dark | Verdict rejected (text) | Rejected `#F85149` | Glass `#0F1726` | 5.35:1 | 4.5:1 | Pass |
| B | dark | Focus ring (gold) on page | Gold `#E3B341` | Void `#070B14` | 10.11:1 | 3:1 | Pass |
| B | light | Body text | Ink `#0D1117` | Lab `#EEF2F6` | 16.82:1 | 4.5:1 | Pass |
| B | light | Body text on panel | Ink `#0D1117` | Panel `#FFFFFF` | 18.92:1 | 4.5:1 | Pass |
| B | light | Secondary text | Graphite `#57606A` | Lab `#EEF2F6` | 5.68:1 | 4.5:1 | Pass |
| B | light | Secondary text on panel | Graphite `#57606A` | Panel `#FFFFFF` | 6.39:1 | 4.5:1 | Pass |
| B | light | Accent text (Player 1, links) | Gold ink `#7D5A00` | Panel `#FFFFFF` | 6.30:1 | 4.5:1 | Pass |
| B | light | Accent text on page | Gold ink `#7D5A00` | Lab `#EEF2F6` | 5.60:1 | 4.5:1 | Pass |
| B | light | CTA label on gold fill | Ink `#0D1117` | Gold `#E3B341` | 9.72:1 | 4.5:1 | Pass |
| B | light | Hologram line (meaningful graphic) | Holo teal `#0B7285` | Lab `#EEF2F6` | 4.96:1 | 3:1 | Pass |
| B | light | Verdict genuine (text) | Genuine `#1A7F37` | Panel `#FFFFFF` | 5.08:1 | 4.5:1 | Pass |
| B | light | Verdict rejected (text) | Rejected `#CF222E` | Panel `#FFFFFF` | 5.36:1 | 4.5:1 | Pass |
| B | light | Focus ring (gold ink) on page | Gold ink `#7D5A00` | Lab `#EEF2F6` | 5.60:1 | 3:1 | Pass |
| C | light | Body text | Ink `#0A0F3C` | Paper `#F2F4FF` | 16.71:1 | 4.5:1 | Pass |
| C | light | Body text on panel | Ink `#0A0F3C` | Card `#FFFFFF` | 18.32:1 | 4.5:1 | Pass |
| C | light | Secondary text | Dusk ink `#454B7A` | Paper `#F2F4FF` | 7.54:1 | 4.5:1 | Pass |
| C | light | Secondary text on panel | Dusk ink `#454B7A` | Card `#FFFFFF` | 8.27:1 | 4.5:1 | Pass |
| C | light | Text on cobalt slab | Card `#FFFFFF` | Cobalt `#2335E0` | 7.90:1 | 4.5:1 | Pass |
| C | light | Highlight label on sun bar | Ink `#0A0F3C` | Sun `#FFD23F` | 12.68:1 | 4.5:1 | Pass |
| C | light | Cobalt as text/links | Cobalt `#2335E0` | Paper `#F2F4FF` | 7.21:1 | 4.5:1 | Pass |
| C | light | Sun bar edge vs cobalt slab (UI) | Sun `#FFD23F` | Cobalt `#2335E0` | 5.47:1 | 3:1 | Pass |
| C | light | Focus ring (cobalt) on page | Cobalt `#2335E0` | Paper `#F2F4FF` | 7.21:1 | 3:1 | Pass |
| C | dark | Body text | Starlight `#F4F5FF` | Night `#080B2E` | 17.63:1 | 4.5:1 | Pass |
| C | dark | Body text on panel | Starlight `#F4F5FF` | Night panel `#141A5C` | 14.53:1 | 4.5:1 | Pass |
| C | dark | Secondary text | Haze `#B5BAE6` | Night `#080B2E` | 10.14:1 | 4.5:1 | Pass |
| C | dark | Secondary text on panel | Haze `#B5BAE6` | Night panel `#141A5C` | 8.36:1 | 4.5:1 | Pass |
| C | dark | Text on cobalt slab | Starlight `#F4F5FF` | Cobalt, lit `#4557F5` | 4.92:1 | 4.5:1 | Pass |
| C | dark | Highlight label on sun bar | Night `#080B2E` | Sun `#FFD23F` | 13.25:1 | 4.5:1 | Pass |
| C | dark | Sun as text/links | Sun `#FFD23F` | Night `#080B2E` | 13.25:1 | 4.5:1 | Pass |
| C | dark | Focus ring (sun) on page | Sun `#FFD23F` | Night `#080B2E` | 13.25:1 | 3:1 | Pass |

**Notes:**
- In C, secondary text on the slab uses `#DDE1FF` on Cobalt (6.13:1) in light. In dark, the slab text is `#FFFFFF` (5.34:1) and the secondary text is Starlight `#F4F5FF` (4.92:1). A first choice of `#E4E7FF` measured 4.36:1, failed, and was replaced in the preview. `DESIGN.md` will list these.
- A's white panels are 92 % opaque over the sky. The worst-case backdrop (Sky) is what the table shows.

---

## 8. Comparison

| | A · Overworld | B · Holo Deck | C · Character Select |
|---|---|---|---|
| 3D world | Floating low-poly islands; a landmark per quest | Holographic projector; the chip handshake | Hex pedestal; orbiting loot; CSS 3D avatar card |
| What you do | Orbit, fly to quests, "Quest unlocked" | Tilt, spin, **Run the handshake**, Counterfeit toggle | Spin and flip the card, hover the loot, **Press A** |
| Palette | Bright daylight: sky, white, marker orange; night variant | Dark neon from the owner's banner: void, gold, holo cyan; lab variant | Saturated menu: cobalt and sun; night variant |
| Theme lead | Light first | Dark first | Light first |
| Layout | Full-bleed world with floating panels; route-based journal | Split hero and 12-column HUD bento | Diagonal slabs, vertical menu, tabbed pages |
| Type | Unbounded + Be Vietnam Pro | Chakra Petch + Mona Sans | Saira (one family, width axis, italic) |
| Shape | Soft 18 px radius, tactile buttons | Chamfered 45° corners, brackets | Skewed parallelograms, hard offset shadow |
| RPG flavour | Adventure map | Sci-fi HUD / character stats | JRPG menu / character select |
| "Developer style" | Medium: panels carry it | **High**: the owner's own banner, a real auth mechanism | Medium: the inventory and stats carry it |
| Eye-catch | High | High | Highest (colour and avatar) |
| Uses the avatar | Character sheet panel | Character stats panel (holo frame) | **The hero card** |
| Reuses approved copy | Hero, journal | Hero, journal, **all bench strings** | Hero, inventory |
| New depictions to approve | 3 (keep, windmill, guild and crates) | 2 (quest holograms for botmivivi and Quest) | 2 (gems per group, AFK sticker crops) |
| Build effort | Highest (world modelling, camera) | Medium (one scene, a state machine) | Medium (stage, card spring, tabs) |
| Dials V / M / D | 7 / 8 / 4 | 6 / 9 / 6 | 8 / 8 / 5 |

## 9. Recommendation

**B · Holo Deck.**

- **"Developer style" and "RPG" at once:** B meets both parts of the brief, because it grows directly out of the artefact the owner made for himself, the Player 1 HUD banner. Its palette, "▸ PLAYER 1", "XP · SYSTEM DESIGN" and "still leveling" are his.
- **Proof of the work, told as a game:** the 3D hero is not decoration. It is the owner's hardest real work, chip challenge-response authentication. Visitors run it with labels he has already approved, which serves the work-first audience of hiring managers and technical clients.
- **The avatar still has a home:** it is the Character stats portrait.
- **It is the clean break from v1** that the owner asked for: dark, glowing, alive, and 3D from the first frame, with a real light theme for "follow the system".

If the owner wants the warmest and most "game world" feel, A is the strong alternative. If the avatar should be the star, C's player card can be borrowed into B's Character stats panel as a modification, without changing B's system.

---

## 10. For the owner

### Decisions that need approval
1. **Direction:** A, B or C (with any modifications, for example "B with C's flip card").
2. **Depictions (new visual claims about the owner's work):**
   - A: CyberRock as a keep with a chip on top; botmivivi as a windmill; the Quest migration as crates crossing a bridge from a v1 islet to a v2 guild hall.
   - B: small holograms for botmivivi (a ledger stack) and Quest (two linked data slabs).
   - C: one gem per inventory group; sticker crops from `ava.PNG` for AFK (never the travel sticker).
3. **Theme lead:** B is dark first, while `info.md` says "follow the system, with a toggle". B honours that with a designed light "Lab" theme. Confirm dark-first design effort is fine.
4. **The GSAP licence**, if the engineer proposes GSAP. It is free but not OSI-licensed; Motion (MIT) is the default.
5. **Profile labels used as UI:** "Character stats", "Class", "Base", "XP", "Quests", "Role", "When", "Press A to continue", "progress saved", "▸ PLAYER 1". They are the owner's words from `profile.md` and `banner.svg`, but not yet in `info.md` → Approved copy. The main session may want to record them.

### Open questions
- **Experience heading, and Contact heading:** needed in every direction ("Join party" is a candidate).
- **C only:** should the chapter panels in Experience carry chapter numbers? That would be new copy and a numbered-marker exception.
- **B only:** keep the handshake auto-running once on load, or wait for the visitor's click?

### Copy slots, `[copy: to draft & approve]`
- **All:**
  - the Experience heading and the Contact heading
  - "Quest unlocked" (the stamp and toast label)
- **A:** the world's accessible name and pin hint.
- **B:** quest-hologram captions for botmivivi and Quest, following the `a11y.drawing-steps` pattern.
- **C:** the card's accessible name, for example "Flip the player card"; the gem tooltip heading pattern.

---

## 11. Preview and verification

**File:** `docs/design/directions-v2-preview.html`.
- One self-contained file of about 100 KB.
- Three.js 0.186.1 loads from cdn.jsdelivr.net and fonts from Google Fonts; both are preview-only.
- The avatar comes from `../../ava.PNG`.

**Controls:** A, B and C tabs; "Dark theme" (`a11y.theme-toggle`, with `aria-pressed`); and "Motion", a pause toggle that also follows `prefers-reduced-motion`.
- The URL hash selects the view: `#b-dark`, `#c-light`.
- `?motion=off` forces the calm variant.

**Each direction has:**
- a working 3D hero with its interaction (fly to a quest, run the handshake, flip the card)
- one animated section with real `info.md` strings: A's quest journal, B's character stats, inventory and leveling up, C's tabbed inventory and leveling up

**Verified** in headless Google Chrome through the DevTools protocol (a harness in the session scratchpad, no installs):

| Check | Result |
|---|---|
| Console errors, warnings, uncaught exceptions | **0** across all 17 captures |
| Canvas draws | Yes, in every capture. The canvas was read back to 64 × 64: 547–1821 drawn pixels and 61–144 distinct colours per scene |
| Frame rate while visible | 60–61 frames per second, from rAF counting during capture on the laptop GPU |
| Off-screen | 0 frames: the loop pauses canvases scrolled out of view |
| Reduced motion (emulated) | `data-motion=off`; 0 ambient frames; the scene renders on demand; the handshake verdict and the pin camera cut work without animation |
| Horizontal overflow at 375 px and 1440 px | None (`scrollWidth` equals the viewport). A 5 px overflow from pre-reveal offsets was found and fixed with `overflow-x: clip` |
| Fonts loaded | Unbounded, Be Vietnam Pro, Chakra Petch, Mona Sans, Saira; "Hồ Trọng Đại" renders in each |

**Screens** (`docs/design/v2-screens/`):
- **A:** `a-1440-light-hero`, `a-1440-dark-hero` (CyberRock selected), `a-1440-light-quest-journal`, `a-375-light-hero`, `a-375-dark-quest-journal`
- **B:** `b-1440-dark-hero`, `b-1440-light-hero` (Counterfeit run, "rejected"), `b-1440-dark-character-sheet`, `b-375-dark-hero`
- **C:** `c-1440-light-hero`, `c-1440-dark-hero-flipped`, `c-1440-light-inventory`, `c-375-light-hero`, `c-375-dark-inventory`
- **Reduced motion:** `reduced-a-1440-light`, `reduced-b-1440-dark`, `reduced-c-1440-light`

**Known preview simplifications** (production does these properly):
- Bloom is faked with additive materials.
- Pins are not occlusion-aware.
- Only the first sections of each page are built.
- The CTA points to `mailto:` and the Résumé link is inert.

---

## 12. Selection record

Pending the owner's choice. Record here: "Selected: ⟨name⟩ + modifications, ⟨date⟩".

**Selected: B · Holo Deck, 2026-09-28**. Owner decisions:
- **Headings:** "Mission log" (Experience) and "Join party" (Contact).
- **Handshake:** plays once on load.
- **Approved:** the holograms (a botmivivi ledger stack; Quest's two linked data slabs), the profile labels as UI, and "Quest unlocked".
- **Theme:** follows the system, with a toggle (dark "Deck" and light "Lab").
