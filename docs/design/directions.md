# Design directions

> `design-direction` steps 2–7, drafted by `design-lead`, 2026-09-27 to 2026-09-28. **Not yet presented to the owner.**
> Inputs: `info.md` (confirmed 2026-09-27), `docs/research/portfolio-references.md`, `ava.PNG`, `banner.svg`, `profile.md` (voice only), `.claude/skills/design-direction/references/generic-patterns.md`, `CLAUDE.md`.
> Visual preview: `docs/design/directions-preview.html` shows, per direction, the hero, one project entry and one allowed diagram, in light and dark. It loads Google Fonts for the preview only.
> Copy: every quoted string is verbatim from `info.md`. A slot that needs new wording is marked `[copy: to draft & approve]`.

## Contents
1. Design Read
2. Grounded in the subject
3. Rules shared by all three directions
4. Direction A: Quest Journal (recommended)
5. Direction B: Proof
6. Direction C: Player Card
7. Contrast check (computed)
8. Comparison
9. Recommendation
10. For the owner: decisions, open questions, copy slots
11. Selection record

---

## 1. Design Read

**Reading this as:** a work-first developer portfolio for engineering hiring managers\* and for clients who arrive with a software pain point\*, with a candid, trade-off-minded and lightly playful language, leaning toward a working quest journal\*: an index of real systems that stays quiet everywhere except one game-like moment.

- **Stated in `info.md`:**
  - the goal: "Both, work-first. Projects and experience lead; a clear "bring me your pain point" contact also serves clients."
  - the voice: the house rules and the sign-off
  - the theme level: "subtle, one signature moment"
  - English only, the system theme with a toggle, no analytics
- **\*Inferred:**
  - the audience roles (hiring managers and tech leads; small-business and product clients), from the goal line and the botmivivi story
  - the aesthetic family, from the avatar and the owner's own label "Quest journal"

## 2. Grounded in the subject

Five things that are characteristic of the owner's actual work, and the visual vocabulary each one offers.

| # | From `info.md` | Visual vocabulary |
|---|---|---|
| 1 | **Proving things are genuine.** CyberRock: "prove a device is genuine before anything trusts it"; "Challenge-response auth for security chips — token, host, mutual, daisy-chain and secure-boot attestation"; "Chip lifecycle from manufacturing to the field, with supplier exports and a full audit trail". | a handshake; a lifecycle route; an audit trail running underneath |
| 2 | **Numbers that keep themselves correct.** botmivivi: "every order, return and payment moves the balance in the same transaction"; "every kilo a loader moves prices itself, so payroll is a query". | ledger lines; one transaction boundary; a running balance |
| 3 | **A migration through a five-minute window.** Quest: "DynamoDB → MySQL migration with ~5 min of downtime"; "the big challenge is the data consistency". | two territories; one narrow crossing; cargo carried across |
| 4 | **Trade-offs chosen on purpose.** House rules: "There's no perfect system — only trade-offs you choose on purpose."; "Options on the table, not one answer." | the chosen path drawn beside the replaced one; before and after |
| 5 | **A journey told through quests.** Bio: "from building Laravel applications, to AWS serverless systems, and eventually to event-driven microservices with NestJS". Quest is "a career-path system modeled on RPG quests". The owner's labels: Quest journal, Active, Side, Cleared, Party lead, Achievements, House rules, Inventory, Leveling up, AFK. | a route with stages and waypoints; status stamps; achievements |

### The two assets, and the tension between them

| | `ava.PNG` (avatar) | `banner.svg` (GitHub banner) |
|---|---|---|
| World | Warm, hand-drawn scrapbook or travel journal: parchment, kraft, washi tape, a vintage map, a globe, dashed routes. | Dark terminal window: GitHub-dark palette, monospace, a gold and green game HUD. |
| Sampled colours | Parchment `#E9BE8A`, ink `#2E281D`, wood `#784D27`, olive `#786547`. One cool note: the map's water `#859EA7` (k-means over a 108 × 144 downsample). | `#0D1117` background, `#E3B341` gold, `#3FB950` green, `#8B949E` grey (from the SVG source). |
| Risk if copied literally | Cluster 1 (warm cream, serif, terracotta). Reads as travel, which the owner declined as an interest. | Cluster 2 (near-black with one bright accent), terminal chrome and mono labels: the developer default. |
| What it gives | Warmth and craft: a person at a café table, maps and dashed routes. | The game voice: PLAYER 1, XP, LVL, a gold accent. |

**How each direction resolves the tension, deliberately:**
- **A, Quest Journal: toward the avatar.** The page shares the avatar's paper. The banner survives only as quest vocabulary and a Player 1 token. No terminal.
- **B, Proof: toward neither.** The owner's systems become the visual. The avatar is a framed artefact in About. The banner stays on GitHub.
- **C, Player Card: toward the banner, minus the terminal.** The HUD becomes a player card in the banner's gold, with no window chrome, prompt or mono. The avatar is the card portrait.

---

## 3. Rules shared by all three directions

### Page inventory, in order (work-first)
1. Header
2. Hero
3. Quest journal: CyberRock, botmivivi, Quest, then Lemonswan and Scania under NFQ Asia
4. Experience: Sunbytes, NFQ Asia
5. House rules
6. Inventory and Leveling up
7. About: bio, education and languages
8. AFK
9. Contact: email, Telegram, GitHub, résumé
10. Footer

Direction C moves Inventory up, directly under the quest index, because its signature needs it there.

### Name display
- "TiDi" leads.
- "Hồ Trọng Đại" (marked `lang="vi"`) and "Dai Ho Trong" sit beside it or directly under it, inside the same `h1`.
- "Daniel" appears in the About bio, verbatim: "I'm Dai — Daniel in English, TiDi around here."
- Line height is at least 1.15 wherever the Vietnamese name appears, so stacked diacritics never clip.

### Quest vocabulary is capped
It is limited to the owner's own labels: Quest journal; Active, Side, Cleared; Party lead; Achievements; House rules; Inventory; Leveling up; AFK. Nothing else is themed: no XP bars, levels, health bars or pixel fonts.

### Rendering the owner's strings
1. Em dashes inside the owner's sentences stay as given.
2. A name followed by an em dash and a description ("Clean Slate — v2 codebase …", "Debt ledger — every order …", "Party lead — architecture calls …") renders as a term and its description (`dt`/`dd`). Both fragments stay verbatim; only the separator becomes structure. This way the banned `WORD — fragment` label shape never appears.
3. Middot lists ("Backend · auth · solution design", the stacks, Leveling up) render as real lists without the middot. This avoids the `A · B · C` meta string.
4. Straight quotes and apostrophes render as curly ones, and `...` as `…`. This is typography, not wording.

### Not shown (per `info.md`)
- "STATUS accepting quests" (availability)
- travel and photography as interests: the avatar's map and globe are never used as travel signals
- the phone number, the second email, the reference

### Media
- No screenshots exist, and nothing is designed around them.
- The Quest video ("Quest by NFQ", public on YouTube) sits behind a click-to-load facade on the privacy-enhanced domain:
  - no third-party request until the visitor clicks
  - the poster is a styled panel with the title, not a YouTube thumbnail
- Open question: facade or a plain link (§10).

### Diagrams
- High-level only, drawn solely from the owner's descriptions: CyberRock chip auth and lifecycle, the Quest v1 → v2 migration, the botmivivi ledger.
- No internal service names and no real data.
- Built as inline SVG, each with:
  - a separate mobile drawing (not a scaled-down desktop one)
  - a text alternative: a caption plus an ordered list of the steps
- Each direction draws them in its own style, described in its section.

### Icons
- **Library:** Tabler Icons, outline set only. MIT licence; source tabler.io/icons; package `@tabler/icons-react` (3.48.0 on npm, checked 2026-09-27). `frontend-engineer` verifies and installs.
- **Needed for:** theme toggle, menu, external link, download, play.
- **Contact links are text first** ("Email", "Telegram", "GitHub"). If marks are wanted, they come from Tabler's brand set, never from a second library.
- **Stroke per direction:** A 1.5 round, B 1.5 square, C 2 round.

### Fonts
- Self-hosted: `next/font/google` (downloads at build time and serves from our domain) or the Fontsource packages named per direction.
- Subsets: latin, latin-ext, vietnamese. `font-display: swap`. At most two families.
- Vietnamese support was checked in the actual font files (from `google/fonts`). The cmap maps all 102 Vietnamese code points tested (U+1EA0–1EF9 plus Ă ă Đ đ Ĩ ĩ Ũ ũ Ơ ơ Ư ư), including the four in "Hồ Trọng Đại": Đ U+0110, ạ U+1EA1, ọ U+1ECD, ồ U+1ED3.

### Quality floor
- WCAG 2.2 AA in both themes (computed in §7).
- A 2 px focus ring in the accent, with a 2 px offset, on every interactive element.
- `prefers-reduced-motion` honoured, with a stated fallback for every animation.
- Mobile-first; touch targets ≥ 44 × 44 px.
- All content present in the server HTML: nothing hidden until a script runs.
- The theme follows the system, with a toggle and no flash. No analytics.

---

## 4. Direction A: Quest Journal (recommended)

### Identity
- **Name:** Quest Journal
- **Concept:** TiDi's quest journal: a ruled logbook on the avatar's own paper, where every project is a dated entry with a status stamp and the career is an inked route you can walk as Player 1.
- **Design Read:** Reading this as: a work-first quest journal for hiring managers and clients with a pain point, with a warm, hand-kept, candid language, leaning toward an adventurer's logbook with inked route maps.
- **Dials:**
  - **VARIANCE 5.** A conventional reading column keeps scanning fast. The variance is spent on the frontispiece and the route map, not on the grid.
  - **MOTION 3.** One travelling element, the Player 1 token, moves only when the visitor asks. Everything else is feedback.
  - **DENSITY 5.** Each entry carries dates, status, employer, role, team and scale in the margin, with journal-like air around the text.

### Palette

| Light | Hex | Role | Reason |
|---|---|---|---|
| Parchment | `#F4E7D3` | Page background | The avatar's parchment, lightened, so page and portrait share one surface. It is kraft, not the `#F4F1EA` cream of cluster 1. |
| Note paper | `#FBF4E9` | Entry and diagram surface; button label | A lighter sheet tipped onto the page. |
| Iron ink | `#241D15` | Text, headings, diagram strokes | The avatar's brown-black outlines, deepened. |
| Pencil | `#65563F` | Dates, meta, captions | Secondary text that still passes AA. |
| Map sea | `#2C5A69` | The one accent: links, stamps, CTA fill, focus ring, token ring | The avatar's only cool tone (the map's water) inked darker. It replaces the terracotta that cluster 1 would reach for. |
| Route | `#8A6F4D` | Dashed routes and map lines | The avatar's dashed flight path. |

| Dark | Hex | Role | Reason |
|---|---|---|---|
| Espresso | `#261E17` | Page background | The café scene's coffee and the avatar's own ink: a warm brown, not a neutral near-black. |
| Café table | `#31271E` | Entry and diagram surface | The avatar's wooden table, darkened. |
| Parchment | `#F1E4CF` | Text | The page colour becomes the ink. |
| Kraft | `#C4B195` | Dates, meta, captions | Kraft paper under lamplight. |
| Map sea, lamplit | `#8FC3D1` | Accent (same roles as light) | Same hue, lifted for the dark surface. |
| Route | `#A88D69` | Dashed routes and map lines | |

### Typefaces

| Role | Family | Licence | Self-hostable source | Vietnamese |
|---|---|---|---|---|
| Display, headings, long-form text (bio, house rules, entry ledes) | **Alegreya**, variable wght 400–900, by Juan Pablo del Peral and HT Fonts | SIL OFL 1.1 | `next/font/google` ("Alegreya"), or `@fontsource-variable/alegreya` 5.3.0 | Yes: all 102 code points in the font file; Google Fonts serves a vietnamese subset |
| UI, navigation, dates, stamps, diagram labels, stack lists | **Alegreya Sans**, static 400 / 500 / 700, same designers | SIL OFL 1.1 | `next/font/google` ("Alegreya Sans"), or `@fontsource/alegreya-sans` 5.3.0 | Yes, same check |

- **Why Alegreya:**
  - Its calligraphic, literary rhythm echoes the avatar's inked lines without resorting to a script face.
  - It was designed for long texts.
  - Its contrast is moderate, so it is not the high-contrast display serif of cluster 1.
- **Why Alegreya Sans:** it shares Alegreya's skeleton, so the pairing is one voice in two registers.
- **Figures:** both files contain `lnum` and `tnum` (checked). Dates and figures opt in to lining tabular figures; running text keeps the default figures.

**Type scale, fluid from 375 to 1440 px (ratio ≈ 1.25):**

| Style | Size | Setting |
|---|---|---|
| Brand "TiDi" | 56 → 96 px | Alegreya 800, line height 0.95 |
| Vietnamese name | 28 → 40 px | Alegreya 500, line height 1.2 |
| Entry title (h3) | 24 → 30 px | Alegreya 700 |
| Body | 17 → 19 px | Alegreya 400, line height 1.55, measure ≤ 65ch |
| Section names (h2), in the margin | 17 → 19 px | Alegreya Sans 700 |
| UI and meta | 15 px | Alegreya Sans 500, lining tabular figures for dates |
| Stamps and diagram labels | 13 px | Alegreya Sans 700, tracking +0.02em, sentence case |

Section names act as running heads in the margin, and entry titles carry the size. This is a deliberate journal convention; the heading order stays semantic (h1 → h2 → h3).

**Shape and depth:**
- One radius, 2 px, for every rectangle (buttons, stamps, plates). The only circles are map symbols: waypoints and the token.
- No shadows. Depth comes from paper against paper: Note paper on Parchment, with a hairline rule.

### Wireframes

**Desktop, 1440 px.** Container 1120 px, 12 columns, 32 px gutters. The margin column spans cols 1–3; content spans cols 4–12.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  TiDi                                   Quest journal   House rules   Contact   Résumé   (◐) │  header, not sticky
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  TiDi                                                      ┌──────────────────────────┐      │  HERO, fits 1440 × 900
│  Hồ Trọng Đại                                              │                          │      │  ① name lockup (h1)
│  Dai Ho Trong                                              │                          │      │  ② role
│                                                            │        ava.PNG           │      │  ③ one bio sentence
│  Full-stack Developer                                      │   frontispiece, 3:4      │      │  ④ CTA pair
│                                                            │   cols 9–12, ≈ 350 px    │      │
│  Officially a full-stack developer, though I spend         │   8 px Note-paper mat    │      │
│  most of my time on the backend: designing APIs,           │                          │      │
│  modeling data, connecting services, and making …          │                          │      │
│                                                            │                          │      │
│  [ bring me a pain point. ]    Résumé                      └──────────────────────────┘      │
│                                                                                              │
├────────────────┬─────────────────────────────────────────────────────────────────────────────┤
│  Quest journal │  Laravel applications    AWS serverless systems   event-driven              │  SIGNATURE: walk the route
│                │                                                  microservices with NestJS  │  top of the map shows in
│                │  (●)- - - - - - - - - - - - (●)- - - - - - - - - - - - (P1)                 │  the first viewport
│                │  Lemonswan       ┆          Quest                      CyberRock            │
│                │  2020-03 to      ┆          2020-12 to                 2024 → now           │
│                │  2020-12        (●) Scania  2024-03                       ┆                 │
│                │                                                    (●) botmivivi            │
│                │  ░░░░░░░░ NFQ Asia ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░ Sunbytes ░░░░          │
│                │  ┌ caption, live region ──────────────────────────────────────┐             │
│                │  │ CyberRock   2024 → now   prove IoT devices are genuine     │             │
│                │  └────────────────────────────────────────────────────────────┘             │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  2024 → now    │  CyberRock (h3)                                                             │  ENTRY, one ruled row
│  ╭────────╮    │  prove a device is genuine before anything trusts it                        │
│  │ Active │    │  • Challenge-response auth for security chips — token, …                    │
│  ╰────────╯    │  • Chip lifecycle from manufacturing to the field, with …                   │
│  Sunbytes      │  • Anomaly detection that turns geolocation jumps and …                     │
│  Backend       │  ┌ route map: chip auth and lifecycle, on Note paper ─────────┐             │
│  auth          │  │ manufacturing - -▸ supplier exports - -▸ the field ⇄ …     │             │
│  solution      │  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ full audit trail ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │             │
│  design        │  └────────────────────────────────────────────────────────────┘             │
│  8 people      │  NestJS microservices over NATS   PostgreSQL   Redis/BullMQ …               │
│  13 services   │                                                                             │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  Live since    │  botmivivi: same row pattern, ledger map, no link, no screenshots           │
│  August 2026   │                                                                             │
│  Side          │                                                                             │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  2020-12 to    │  Quest @ NFQ Asia: same row pattern, Party lead, four                       │
│  2024-03       │  achievements as term and description, migration map,                       │
│  Cleared       │  video facade "Quest by NFQ"                                                │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  NFQ Asia      │  Lemonswan   2020-03 to 2020-12   matching logic and UI design              │  compact, two lines each
│                │  Scania      backend and frontend   Spryker framework                       │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  Experience    │  Sunbytes   Full-stack Developer            2024-03 to present              │  two-row table
│                │  NFQ Asia   Full-stack Developer,           2020-03 to 2024-03              │
│                │             Tech lead on Quest                                              │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  House rules   │  How I take on a problem. I'm still learning system …                       │  intro + four rules,
│                │  There's no perfect system — …   Understand the pain …                      │  2 × 2
│                │  Options on the table, …         Best advice with what …                    │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  Inventory     │  Main           TypeScript  Node.js  NestJS  React  Next.js …               │  text rows: no logos,
│                │  Data           PostgreSQL  MySQL  MongoDB  DynamoDB  …                     │  no levels
│                │  Ops            AWS  Azure  Docker  Kubernetes  Terraform …                 │
│                │  AI companions  Claude  ChatGPT                                             │
│                │  Alt builds     PHP  Laravel  Symfony  Python  Flask                        │
│  Leveling up   │  distributed-systems trade-offs   reliability & SRE   …                     │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  About         │  I'm Dai — Daniel in English, TiDi around here. … (2 ¶, 65ch)               │
│                │  Education & certifications        Vietnamese and English                   │
├────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│  AFK           │  Football  Badminton  Swimming  Games  Tech gossip and "how …               │
├────────────────┴─────────────────────────────────────────────────────────────────────────────┤
│  Contact (h2)    Got a pain point? Bring the constraints — I'll bring the …                  │  CONTACT, full width
│                  [ Email ]   [ Telegram ]   GitHub   Résumé                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  still learning, always solving.                                                             │  footer
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile, 375 px.**

```text
┌─────────────────────────────────────┐
│  TiDi                     (◐)   (≡) │  header 56 px
├─────────────────────────────────────┤
│  TiDi                               │  HERO: text fits
│  Hồ Trọng Đại                       │  375 × 667
│  Dai Ho Trong                       │
│  Full-stack Developer               │
│  Officially a full-stack developer, │
│  though I spend most of my time …   │
│  [ bring me a pain point.         ] │  48 px, full width
│  Résumé                             │
│  ┌───────────────────────────────┐  │
│  │ ava.PNG, 3:4, full width      │  │  frontispiece moves
│  │ (max 360 px)                  │  │  under the CTA
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  Quest journal                      │  SIGNATURE, vertical
│  Laravel applications               │  stage labels stay
│   (●) Lemonswan  2020-03 to 2020-12 │  horizontal, above
│    ┆                                │  their stretch
│  AWS serverless systems             │
│    ┆╌╌(●) Scania                    │
│   (●) Quest  2020-12 to 2024-03     │
│  event-driven microservices …       │
│   (P1) CyberRock  2024 → now        │
│    ┆╌╌(●) botmivivi                 │
│  ┌ caption, live region ─────────┐  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  2024 → now   Active   Sunbytes     │  the margin becomes
│  CyberRock                          │  a meta row
│  prove a device is genuine …        │
│  • …   • …   • …                    │
│  [route map, vertical variant]      │
│  stack list wraps                   │
├─────────────────────────────────────┤
│  botmivivi, Quest, NFQ extras       │  same pattern
│  Experience (stacked)               │
│  House rules (one column)           │
│  Inventory (label above each row)   │
│  Leveling up                        │
│  About, education, languages        │
│  AFK                                │
│  Contact: full-width buttons        │
│  footer                             │
└─────────────────────────────────────┘
```

**Alignment rules:**
- Two vertical lines rule the page:
  - **the margin line (col 1):** section names, dates, stamps, employer, role, team and scale
  - **the content line (col 4):** every entry title, paragraph, list, diagram and stack row
- **Hero:**
  - The lockup starts on the margin line.
  - The frontispiece spans cols 9–12, its top aligned to the cap height of "TiDi".
  - The text column is vertically centred on the image.
- **Entries:**
  - Margin meta baseline-aligns with the first line of the entry title.
  - Full-width hairline rules separate entries.
  - Paragraphs stop at 65ch; diagrams and stack rows may use the full content width.
- **Mobile:**
  - One left edge at 20 px, safe-area aware.
  - The margin collapses into a meta row above each title.
  - The route turns vertical, 28 px from the left edge.

### Hero
**Frontispiece.** The avatar is tipped in at 3:4 on the right, like a plate in a journal: an 8 px Note-paper mat and a hairline rule, no rotation, tape or torn edges (the avatar already carries its own). On the left, four text elements:
1. **Name lockup (h1):** "TiDi", "Hồ Trọng Đại", "Dai Ho Trong"
2. **Role:** "Full-stack Developer"
3. **One bio sentence:** "Officially a full-stack developer, though I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable."
4. **CTA pair:** "bring me a pain point." as the filled button, and Résumé as a text link

No background decoration. At 1440 × 900 the top of the journey map is visible under the hero, which pulls the eye into the work.

### Signature moment: Walk the route
The Quest journal opens with the owner's journey drawn as one inked route:
- **Stages:** the three stages from the bio label the terrain: "Laravel applications", "AWS serverless systems", "event-driven microservices with NestJS".
- **Territories:** the two employers, "NFQ Asia" and "Sunbytes".
- **Waypoints:** the projects, with their real dates.
- **Spurs:**
  - Scania has no dates, so it hangs on a spur off the NFQ Asia stretch, with no date shown.
  - botmivivi branches off CyberRock as a side path, because it is a side project.
- **The token:** a round Player 1 token (a crop of the avatar's face) stands on CyberRock, the active quest.

Choosing a waypoint walks the token along the dashed route to it and updates a caption with the dates, the owner's one-line summary and a link to the full entry below.

| Mode | Behaviour |
|---|---|
| Pointer | Click or tap a waypoint. |
| Keyboard | The waypoints form one tab stop (roving tabindex). ← → and ↑ ↓ move through them in route order: Lemonswan, Scania, Quest, CyberRock, botmivivi. Home and End jump to the first and last. Each move walks the token and updates the caption, which is a polite live region. The caption's entry link is the next tab stop. The focus ring is on the waypoint marker (2 px Map sea, 3 px offset). |
| Reduced motion | The token jumps without travelling; the caption swaps without a crossfade; the route never animates. |
| No JavaScript and assistive tech | The same content is an ordered list of links in the same route order, grouped by employer. Scania's caption and list item carry no date, so its place on the spur implies none. The SVG route is `aria-hidden` decoration behind the list, and the token rests on CyberRock. |
| Mobile | The route turns vertical with the same controls. Targets are at least 44 px. |

### Diagrams in this direction
The three allowed diagrams become **inked route maps** inside their entries, on Note paper:
- **Territories:** soft tinted areas.
- **Routes:** dashed lines, 1.5 px.
- **Landmarks:** ring markers, labelled in Alegreya Sans.
- **Region names:** Alegreya italic, the map-labelling convention.

What each map shows:
- **CyberRock:** manufacturing → supplier exports → the field, with the challenge-response at the field and "full audit trail" running underneath.
- **Quest:** v1 and v2 as two territories, crossed once through "~5 min of downtime", carrying users, quest collection, award and status.
- **botmivivi:** order, return and payment feeding one balance inside "the same transaction".

### Motion budget

| Element | Trigger | What moves | Timing | What it communicates | Reduced motion |
|---|---|---|---|---|---|
| Player 1 token | Waypoint chosen (click, tap or arrow key) | The token translates along the route path (transform only) | 420–600 ms, scaled by distance; ease-in-out; interruptible | Where each quest sits on the owner's path, and how they connect | Jumps instantly |
| Caption | Waypoint change | Opacity crossfade | 160 ms, ease-out | The caption belongs to the new waypoint | Instant swap |
| Arrived entry | Following a caption link | The margin stamp's tint fades out | 600 ms | "You arrived here" | No tint; the focus ring only |
| Links and buttons | Hover, `:focus-visible` | Colour and underline offset | 120 ms | Feedback | Colour only |
| Video facade | Click | The iframe fades in over the poster | 150 ms | Loading | Instant |

Nothing else moves: no scroll reveals, no route drawing itself on scroll, no loops. Theme changes are instant.

### Content fit

| Needs | In `info.md`? | Notes |
|---|---|---|
| Avatar for the frontispiece | Yes, `ava.PNG` | 3.1 MB: optimise; it is the LCP image on desktop. |
| Player 1 token | Derived | A round crop of the avatar's face. Needs the owner's approval. |
| Names, role, bio sentence, CTA | Yes | CTA casing is a copy slot (§10). |
| Journey stages | Yes | Verbatim fragments of the bio. |
| Project → stage placement | Derived | Needs the owner's confirmation (§10). |
| Dates per waypoint | Yes, except Scania | Scania sits on an undated spur. |
| Status stamps | Yes | Active, Side, Cleared. |
| Three diagrams | Allowed | Drawn from the owner's descriptions only. |
| Section labels | Yes | The owner's labels. |
| Screenshots | Not needed | |
| Video | Yes | Quest. |
| Map accessible name and keyboard hint | No | `[copy: to draft & approve]` |

### Risks and trade-offs
- **Tone:**
  - Warmth can read soft or nostalgic for a security and backend role. The ruled index, the real numbers and the system maps must carry the rigour.
  - The map could suggest travel, which the owner declined as an interest. Map labels are stacks and employers only, never places.
- **Rendering:**
  - Parchment shifts on uncalibrated screens and can turn yellow or muddy. Check it on a real phone in daylight before sign-off.
  - Alegreya has a small x-height, so body text needs 17 px or more (19 px on desktop).
- **Cost:**
  - The route map is the most bespoke SVG work in the three directions: desktop and mobile drawings, token travel along a path, roving focus.
  - Two families (about four font files after subsetting) cost more than B or C.
- **Content:** the stage placement is an inference that the owner must confirm.

### Genericness review

| Pattern checked | First draft | Revision | Why |
|---|---|---|---|
| Cluster 1: cream, high-contrast serif, terracotta | Cream page, a display serif, a red "stamp" accent | The page is sampled from the avatar's parchment; the serif is Alegreya at modest display sizes; the accent is Map sea teal | The warm page is the one remaining element, and it has a stated reason: it is the owner's own asset's surface. |
| Scrapbook decoration | Torn edges, washi tape, paper grain, tilted cards | Removed: the UI is flat and ruled | The avatar already is the scrapbook. "Remove one accessory." Textures also cost bytes. |
| Handwriting face for headings | Considered | Rejected | Few script faces cover Vietnamese well, legibility suffers, and it is a cliché. |
| Vertical dotted timeline | Experience as dots on a line | Replaced by the route (the signature) plus a two-row table | The timeline shape is generic; the route carries the owner's own stages. |
| Mono dates in the margin | Mono tabular dates | Alegreya Sans lining tabular figures | Mono for small data labels is template chrome. |
| All-caps stamps and eyebrows | "CLEARED", "01 · WORK" | Sentence-case stamps; section names are real headings in the margin | All-caps labels and decorative eyebrows are banned. |
| Numbered entries | "Entry 01" | Dates instead | Numbering is kept for the route only, because chronology is a real sequence. |
| `WORD — fragment`, `A · B · C` | The owner's strings rendered as is | Term/description pairs and lists (§3) | Same words, no template shape. |

**Would a similar prompt land here?** A generic "RPG developer portfolio" prompt lands on pixel fonts, a dark HUD and XP bars. A generic "journal" prompt lands on cream, serif, terracotta and washi tape. A differs through:
- a palette sampled from the owner's avatar, with a teal ink accent
- a ruled log with a margin index
- the Player 1 token walking the owner's own career stages, with real dates

---

## 5. Direction B: Proof

### Identity
- **Name:** Proof
- **Concept:** Show the mechanism: a cool, precise system sheet where each quest is explained by a drawing of the system that makes it trustworthy, opened by a handshake the visitor can run.
- **Design Read:** Reading this as: a work-first systems portfolio for technical hiring managers and tech-literate clients, with a precise, evidence-first language, leaning toward engineering documentation (system sheets and drawings).
- **Dials:**
  - **VARIANCE 6.** Wide drawing bands and a split hero with a live figure break the column rhythm. The sheets share one structure, so scanning still works.
  - **MOTION 5.** The handshake is a short orchestrated sequence (about 1.1 s). Nothing moves on its own.
  - **DENSITY 4.** Fewer, deeper sheets with room around the drawings. Details live in a facts column.

### Palette

| Light | Hex | Role | Reason |
|---|---|---|---|
| Wafer | `#F4F4F8` | Page background | A cool silicon-wafer grey with a violet cast. The design is light-first. |
| Plate | `#FFFFFF` | Drawing plates, sheets | Where the drawings live. |
| Epoxy | `#14161B` | Text, component strokes | Chip-package black. |
| Lead | `#525866` | Secondary text | The grey of chip leads. |
| Attest violet | `#5B3FD0` | The one accent: the verified path, links, CTA fill, focus ring | The colour of UV security ink, the everyday proof that a label or a note is genuine. Named after "secure-boot attestation". |
| Trace | `#737A87` | Construction lines: the audit trail, replaced or rejected paths | The drafting convention of construction versus final ink, which draws "trade-offs you choose on purpose". |

| Dark | Hex | Role | Reason |
|---|---|---|---|
| Darkroom | `#15131C` | Page background | The UV check happens in the dark. |
| Plate, dark | `#201D2A` | Plates, sheets | |
| Marking | `#ECEAF4` | Text | Laser-etched chip marking. |
| Lead, dark | `#A9A5BA` | Secondary text | |
| UV glow | `#B7A6FF` | Accent (same roles as light) | The ink fluorescing. |
| Trace, dark | `#827D96` | Construction lines | |

### Typefaces

| Role | Family | Licence | Self-hostable source | Vietnamese |
|---|---|---|---|---|
| Every role, through the width and weight axes | **Archivo**, variable wdth 62–125 and wght 100–900, by Omnibus-Type | SIL OFL 1.1 | `next/font/google` ("Archivo", with the wdth axis), or `@fontsource-variable/archivo` 5.3.0 | Yes: all 102 code points in the font file; vietnamese subset on Google Fonts |

- **Why Archivo:** a grotesque built for technical and editorial use.
  - Its width axis gives the name a wide, engineered stance (width 125) and the drawing labels a compact register (width 87.5), all from one file.
  - It needs no mono face, which removes the terminal tell.
- **Figures:** `tnum` and `lnum` are present, and the default digits are near-tabular.

**Type scale (ratio ≈ 1.333):**

| Style | Size | Setting |
|---|---|---|
| Brand "TiDi" | 60 → 112 px | Width 125, weight 800, line height 0.9 |
| Section (h2) | 32 → 44 px | Width 125, weight 700 |
| Sheet title (h3) | 24 → 32 px | Width 112, weight 700 |
| Vietnamese name | 24 → 32 px | Width 100, weight 500, line height 1.2 |
| Body | 16 → 17 px | Width 100, weight 400, line height 1.6, measure ≤ 68ch |
| Drawing labels and facts | 13 → 14 px | Width 87.5, weight 600, tabular figures |

**Shape and depth:** one radius, 6 px, for every node, plate, chip and button. No shadows: plates sit on Wafer with a hairline border. Drawings follow an 8 px grid.

### Wireframes

**Desktop, 1440 px.** Container 1200 px, 12 columns, 24 px gutters.

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│  TiDi                         Quest journal   Experience   House rules   Contact   (◐)        │  header
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│                                      │ ┌ SIGNATURE: run the handshake ──────────────────┐     │  HERO, split 5 | 7
│  TiDi   (Archivo, width 125)         │ │                                                │     │  ① name lockup (h1)
│  Hồ Trọng Đại    Dai Ho Trong        │ │  ┌──────┐   challenge ──────▸   ┌──────┐       │     │  ② role + bio line
│                                      │ │  │ host │                       │ chip │       │     │  ③ CTA pair
│  Full-stack Developer                │ │  └──────┘   ◂────── response    └──────┘       │     │  ④ figure + caption
│  Officially a full-stack developer,  │ │                                                │     │
│  though I spend most of my time …    │ │  verdict: genuine                              │     │
│                                      │ │  [ ▶ copy ]   [ copy: counterfeit ]            │     │
│  [ bring me a pain point. ]  Résumé  │ │  prove a device is genuine before              │     │
│                                      │ │  anything trusts it                            │     │
│                                      │ └────────────────────────────────────────────────┘     │
├──────────────────────────────────────┴────────────────────────────────────────────────────────┤
│  Quest journal (h2)                                                                           │
│  CyberRock (h3)                                                Active      2024 → now         │  sheet head
│  prove IoT devices are genuine                                                                │
│  ┌ drawing band, 12 columns, on Plate ──────────────────────────────────────────────────┐     │
│  │ manufacturing ━━▸ supplier exports ━━▸ the field ━━▸ challenge-response ━━▸ genuine  │     │  ━ verified path, violet
│  │ ┆ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ full audit trail ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┆     │     │  ─ ─ Trace, dashed
│  │ geolocation jumps, slow responses ─ ─▸ Slack-alerted incidents                       │     │
│  └──────────────────────────────────────────────────────────────────────────────────────┘     │
│  What I built (cols 1–7)                              │  My role   Backend, auth,             │  facts, cols 9–12
│  • Challenge-response auth for security chips — …     │            solution design            │
│  • Chip lifecycle from manufacturing to the …         │  Team      8 people                   │
│  • Anomaly detection that turns geolocation …         │  Scale     13 services across         │
│                                                       │            Azure and AWS              │
│                                                       │  Stack     NestJS microservices …     │
├───────────────────────────────────────────────────────┴───────────────────────────────────────┤
│  botmivivi: same sheet; ledger drawing, with the manual steps it replaced in Trace            │  Trace = replaced or
│  Quest @ NFQ Asia: same sheet; v1 in Trace, v2 in ink, the ~5 min window in violet;           │  rejected paths
│  Party lead; achievements; video facade                                                       │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│  Lemonswan (cols 1–6)                        │  Scania (cols 7–12)                            │  compact, no drawing
├──────────────────────────────────────────────┴────────────────────────────────────────────────┤
│  Experience   Sunbytes   Full-stack Developer   2024-03 to present   CyberRock                │  table
│               NFQ Asia   Full-stack Developer   2020-03 to 2024-03   Lemonswan, Quest, Scania │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│  House rules: intro (cols 1–4)   │  four rules as a spec list (cols 5–12)                     │
├──────────────────────────────────┴────────────────────────────────────────────────────────────┤
│  Inventory: five groups in three columns          Leveling up: one row                        │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│  About: two paragraphs (cols 1–7)                     │  ava.PNG, framed, 3:4 (cols 9–12)     │  the avatar lives here
│  Education & certifications, languages                │                                       │
├───────────────────────────────────────────────────────┴───────────────────────────────────────┤
│  AFK (one row)                                                                                │
│  Contact: the sign-off at h2 size; Email, Telegram, GitHub, Résumé                            │
│  still learning, always solving.                                                              │  footer
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile, 375 px.**

```text
┌──────────────────────────────────────┐
│  TiDi                     (◐)   (≡)  │
├──────────────────────────────────────┤
│  TiDi                                │  HERO: text first
│  Hồ Trọng Đại                        │
│  Dai Ho Trong                        │
│  Full-stack Developer                │
│  Officially a full-stack developer … │
│  [ bring me a pain point.         ]  │
│  Résumé                              │
│  ┌ figure, on Plate ─────────────┐   │  the handshake stays
│  │ host ── challenge ─▸ chip     │   │  horizontal: it fits
│  │      ◂─ response ──           │   │  in 335 px
│  │ verdict                       │   │
│  │ [ ▶ copy ]  [ copy ]          │   │  44 px targets
│  └───────────────────────────────┘   │
├──────────────────────────────────────┤
│  Quest journal                       │
│  CyberRock                           │
│  Active   2024 → now                 │
│  ┌ drawing, vertical variant ────┐   │  redrawn top to bottom,
│  │ manufacturing                 │   │  not a scaled-down
│  │   ┃                           │   │  desktop drawing
│  │ supplier exports              │   │
│  │   ┃                           │   │
│  │ the field ⇄ challenge-resp…   │   │
│  │ ┆ full audit trail            │   │
│  └───────────────────────────────┘   │
│  facts (stacked dl)                  │
│  What I built (list)                 │
├──────────────────────────────────────┤
│  botmivivi, Quest (same pattern)     │
│  Lemonswan, Scania (stacked)         │
│  Experience (stacked dl)             │
│  House rules, Inventory, Leveling up │
│  About + framed avatar               │
│  AFK, Contact, footer                │
└──────────────────────────────────────┘
```

**Alignment rules:**
- **Hero:**
  - The hero splits 5 | 7 columns.
  - The figure's top aligns to the cap height of "TiDi"; the CTA baseline aligns with the figure's caption.
- **Sheets:**
  - Drawing bands span all 12 columns with one shared inner padding. Node heights and gaps are multiples of 8 px.
  - Under each drawing, text takes cols 1–7 and facts take cols 9–12 (col 8 is air). Facts use a fixed 88 px label column.
  - In the sheet head, the title sits left; status and dates sit right on the same baseline.
- **Mobile:**
  - One column with 20 px edges.
  - Every drawing has a vertical variant.
  - Facts become a stacked list above the bullets.

### Hero
**Test bench.** On the left, three text elements:
1. **Name lockup (h1):** "TiDi" at width 125, then "Hồ Trọng Đại" and "Dai Ho Trong"
2. **Role plus bio sentence:** "Full-stack Developer", then the same positioning sentence as A
3. **CTA pair:** "bring me a pain point." and Résumé

On the right, the fourth element: the handshake figure on a Plate, captioned with "prove a device is genuine before anything trusts it". There is no avatar in the hero; it appears framed in About.

### Signature moment: Run the handshake
The figure shows the challenge-response between a host and a chip, from "Challenge-response auth for security chips":
1. The run button sends a challenge: a violet packet travels from host to chip.
2. The chip answers, and its frame pulses once.
3. The response travels back.
4. The verdict reads "genuine".

A second toggle swaps in a counterfeit chip. The next run ends rejected: the response line stays in Trace and the verdict changes.

| Mode | Behaviour |
|---|---|
| Keyboard | Two native buttons: run, and the counterfeit toggle (`aria-pressed`). Enter or Space activates. Running again interrupts and restarts. Each step and the verdict are announced in a polite live region. |
| Reduced motion | No travelling packets. The steps show as a numbered sequence (a real sequence) that switches state instantly; the verdict appears as text. |
| No JavaScript | A static figure of the completed handshake, with the caption. |
| Mobile | The figure stays horizontal (it fits 335 px); the buttons go full width. |

Labels: "challenge", "response", "genuine", "host" and "chip" come from `info.md`. The button, the toggle and the rejected verdict are `[copy: to draft & approve]`.

### Diagrams in this direction
**Engineering drawings** are the main visual:
- **Components:** Epoxy strokes at 1.5 px.
- **The verified or chosen path:** Attest violet at 2 px.
- **Construction lines:** Trace dashes, for the audit trail and for what was replaced.

What each drawing shows:
- **CyberRock:** the lifecycle and auth as above, plus "geolocation jumps" and "slow responses" leading to "Slack-alerted incidents".
- **Quest:** v1 in Trace (Lambda, DynamoDB, EventBridge), v2 in ink (NestJS, Prisma, MySQL), and the crossing in violet, labelled "~5 min of downtime".
- **botmivivi:** the manual steps it replaced in Trace (from "replace manual step from creating order, write report, customer debt, inventory"), and the ledger in ink.

### Motion budget

| Element | Trigger | What moves | Timing | What it communicates | Reduced motion |
|---|---|---|---|---|---|
| Challenge packet | Run | Translates host → chip | 360 ms, ease-out | The host asks the chip to prove itself | Step highlights instantly |
| Chip frame | Challenge arrives | Scales 1 → 1.04 → 1, once | 160 ms | The chip answers | None |
| Response packet | After the pulse | Translates chip → host | 360 ms, ease-out | The proof comes back | Step highlights instantly |
| Verdict | End of the sequence | Opacity in | 200 ms | Genuine, or rejected | Text appears |
| Counterfeit verdict | Run while the toggle is on | A 2-cycle, 3 px horizontal shake | 240 ms | A failed proof | No shake |
| Links and buttons | Hover, `:focus-visible` | Colour | 120 ms | Feedback | Colour only |

Nothing moves unless the visitor presses run. Drawings are static and never self-animate.

### Content fit

| Needs | In `info.md`? | Notes |
|---|---|---|
| Handshake labels | Yes | From "Challenge-response auth for security chips". The host/chip framing needs a technical check by the owner. |
| Button, toggle, rejected verdict | No | `[copy: to draft & approve]` |
| Three drawings | Allowed | For construction lines, Quest v1 and botmivivi's replaced steps exist; CyberRock has no replaced path, so only its audit trail is dashed. |
| A case-study narrative | Partly | The CyberRock hard-problem story was skipped, so its sheet leans on the drawing and three bullets. |
| Facts column | Yes | Role, team, scale, stack. |
| Avatar | Yes | Used in About only. |
| Screenshots | Not needed | |

### Risks and trade-offs
- **Content:**
  - The hero centres CyberRock: the one project whose story the owner skipped, and which has no public link.
  - Diagram-led storytelling can over-weight architecture for clients who care about outcomes. The facts column must carry the outcomes (~5 min, 646 customers, 90% of time).
- **Tone:**
  - The warm, hand-drawn avatar sits awkwardly in a cool violet system. It is boxed in About, so the first impression has no person in it.
  - Violet on dark can read as crypto or web3 if gradients or glows creep in. Rule: no gradients, no glow.
- **Cost:** the highest of the three: an interactive hero figure plus three drawings, each with a mobile variant. The hero's script must stay a small client leaf; the LCP is text.

### Genericness review

| Pattern checked | First draft | Revision | Why |
|---|---|---|---|
| Cluster 2 and the "dark tech" default | Dark-first, a dot grid, mono labels, an acid accent | Light-first on Wafer; no decorative grid; no mono at all; a violet accent grounded in UV security ink | The drawings supply structure; mono labels are template chrome. |
| Perpetual motion | Packets looping in the hero diagram | Packets move only on run | No perpetual motion on static content. |
| Stats strip | 13 services, 8 people, ~5 min, 646 customers under the hero | Each number moved into its sheet's facts column | Metrics as decoration are banned; in context they are evidence. |
| Numbered case studies | "01 / 03" | Removed | Not a sequence. |
| Three equal cards | "What I built" as three cards per sheet | A bullet list plus the facts column | Three equal cards in a row. |
| Blueprint cliché | A Prussian-blue page with white lines | Ink on a light plate; construction lines carry meaning | The drafting convention is used for information, not costume. |
| Tinted near-black (dark theme) | Darkroom `#15131C` | Kept, with a stated reason | The UV-check metaphor; light remains the primary design. Flagged for the owner. |

**Would a similar prompt land here?** "Backend engineer portfolio with system diagrams" lands on dark, mono and an animated architecture diagram, much like the reference site. B differs:
- it is light-first and has no mono
- its drawings show the owner's three real systems
- it has a proof-violet signal
- its hero moves only when asked

---

## 6. Direction C: Player Card

### Identity
- **Name:** Player Card
- **Concept:** A player card that stays beside the work: the avatar and four owner-written stats pinned on the left, the quest index on the right, and an inventory that shows where each tool was used.
- **Design Read:** Reading this as: a work-first index portfolio for recruiters and hiring managers who skim, with a friendly game-menu language, leaning toward a character sheet in a split sticky layout.
- **Dials:**
  - **VARIANCE 4.** Split sticky is a familiar pattern. The novelty is what the card holds, not the grid.
  - **MOTION 2.** State feedback only, when an item is equipped.
  - **DENSITY 7.** All five quests are in the first desktop viewport, with stats and inventory at a glance: built for people who skim.

### Palette

| Light | Hex | Role | Reason |
|---|---|---|---|
| Menu | `#FAF9F6` | Page background | A quiet game-menu white, neutral, so the gold and the avatar carry the warmth. |
| Card | `#FFFFFF` | The player card, index, slots | |
| Controller navy | `#131A2A` | Text | The navy of the avatar's gaming sticker (chair, hoodie, controller). |
| Slate | `#525A6B` | Stat labels, meta | |
| Gold ink | `#855A00` | Accent for text and lines: links, role, equipped border, focus ring | The banner gold, darkened to pass AA on white. |
| XP gold | `#E3B341` | Fill only: equipped slot, highlight bar | The owner's banner gold, exact. Never used as text on light. |

| Dark | Hex | Role | Reason |
|---|---|---|---|
| Night screen | `#10151F` | Page background | The night-sky monitor in the gaming sticker; close to the banner's `#0D1117`. |
| Card, dark | `#182030` | Card, slots | |
| Star white | `#E8ECF3` | Text | The star on that screen. |
| Slate, dark | `#A3ACBC` | Labels, meta | |
| XP gold | `#E3B341` | Accent for text, lines and fills | The banner gold passes on dark. |

### Typefaces

| Role | Family | Licence | Self-hostable source | Vietnamese |
|---|---|---|---|---|
| Every role, through weights 400 / 500 / 600 / 800 | **Be Vietnam Pro**, static, by Lâm Bảo, Tony Le and ViệtAnh Nguyễn | SIL OFL 1.1 | `next/font/google` ("Be Vietnam Pro"), or `@fontsource/be-vietnam-pro` 5.3.0 | Designed for it: all 102 code points in the font file; vietnamese subset on Google Fonts |

- **Why Be Vietnam Pro:**
  - It is a neo-grotesk drawn by Vietnamese designers with the diacritics designed in, so "Hồ Trọng Đại" gets first-class stacked marks.
  - Its round-shouldered forms suit a game-menu card without a "gamer" display face.
- **Trade-off:** the file has no `tnum` and its digits are proportional (checked), so dates align by column start, never digit by digit.

**Type scale (ratio ≈ 1.2):**

| Style | Size | Setting |
|---|---|---|
| Card name "TiDi" | 36 → 48 px | Weight 800, line height 1.0 |
| Section (h2) | 22 → 24 px | Weight 800 |
| Vietnamese name | 20 px | Weight 600, line height 1.3 |
| Entry (h3) | 18 → 20 px | Weight 700 |
| Body | 15 → 16 px | Weight 400, line height 1.6, measure ≤ 70ch |
| Labels and slots | 13 → 14 px | Weight 600 |

**Shape and depth:** one radius, 10 px, for the card, slots, buttons and index rows. No shadows: the card is defined by a hairline border. The only boxed element is the card; index rows are rows.

### Wireframes

**Desktop, 1440 px.** Container 1240 px, 12 columns, 32 px gutters. The card spans cols 1–4 (sticky, top 24 px); content spans cols 5–12.

```text
┌────────────────────────────────┬───────────────────────────────────────────────────────────┐
│  ╭──────────────────────────╮  │           Quest journal   Experience   House rules   (◐)  │  content header
│  │ ava.PNG, 16:10 crop      │  │                                                           │
│  │ café table and stickers  │  │  Quest journal (h2)                  2 active   1 cleared │  INDEX: all five quests
│  ╰──────────────────────────╯  │  ┌──────────────────────────────────────────────────────┐ │  in the first viewport
│  TiDi (h1)                     │  │ CyberRock         Active    2024 → now   Sunbytes    │ │  rows, not cards
│  Hồ Trọng Đại                  │  │ prove IoT devices are genuine                        │ │
│  Dai Ho Trong                  │  ├──────────────────────────────────────────────────────┤ │
│  Full-stack Developer          │  │ botmivivi         Side      live in production       │ │
│  ────────────────────────────  │  │ back office for a flour distributor, live in …       │ │
│  Guild     Cyber security for  │  ├──────────────────────────────────────────────────────┤ │
│            IoT (EU)            │  │ Quest @ NFQ Asia  Cleared   2020-12 to 2024-03       │ │
│  Passive   Can't leave a pain  │  │ a career-path platform on RPG quest mechanics        │ │
│            point alone         │  ├──────────────────────────────────────────────────────┤ │
│  In production since    2020   │  │ Lemonswan  2020-03 to 2020-12     Scania  NFQ Asia   │ │
│  Location  Ho Chi Minh City,   │  └──────────────────────────────────────────────────────┘ │
│            Vietnam             │  Inventory (h2)                                           │  SIGNATURE: equip an item
│  ────────────────────────────  │  Main  [TypeScript] [Node.js] [NestJS] [React] …          │  slots are toggle buttons;
│  [copy: equipped]  NestJS      │  Data  [PostgreSQL] [MySQL] [DynamoDB] [Redis] …          │  tools with no quest
│  CyberRock, botmivivi, Quest   │  Ops   [AWS] [Azure] [Terraform] [GitHub Actions] …       │  are plain text
│  ────────────────────────────  │  ──────────────────────────────────────────────────────── │
│  [ bring me a pain point. ]    │  CyberRock (h3): bullets, facts, drawing                  │  DETAILS
│  Email   Telegram   GitHub     │  botmivivi: term/description list, ledger drawing         │
│  Résumé                        │  Quest: Party lead, achievements, migration, video        │
│                                │  Experience, House rules, Leveling up, About and          │
│  card: sticky, never taller    │  education, AFK, Contact                                  │
│  than the viewport             │  footer                                                   │
└────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

**Mobile, 375 px.**

```text
┌───────────────────────────────────────┐
│  TiDi                     (◐)   (≡)   │
├───────────────────────────────────────┤
│  ┌───────┐  TiDi                      │  the card becomes a
│  │  ava  │  Hồ Trọng Đại              │  compact header
│  │  3:4  │  Dai Ho Trong              │  block, not sticky
│  │ 112px │  Full-stack Developer      │
│  └───────┘                            │
│  Guild              Passive           │  stats in a 2 × 2 grid
│  Cyber security …   Can't leave a …   │
│  In production      Location          │
│  since 2020         Ho Chi Minh City… │
│  [ bring me a pain point.         ]   │
├───────────────────────────────────────┤
│  Quest journal   2 active   1 cleared │
│  CyberRock   Active   2024 → now      │  index rows,
│  botmivivi   Side                     │  full width
│  Quest @ NFQ Asia   Cleared           │
│  Lemonswan   Scania                   │
├───────────────────────────────────────┤
│  Inventory                            │  slots wrap,
│  [NestJS] [PostgreSQL] [Redis] …      │  44 px tall
│  ┌ result, live region ──────────┐    │  the result shows
│  │ NestJS: CyberRock, botmivivi, │    │  under the grid
│  │ Quest                         │    │  (the card is not
│  └───────────────────────────────┘    │  sticky on mobile)
├───────────────────────────────────────┤
│  entry details, Experience, House     │
│  rules, Leveling up, About, AFK,      │
│  Contact, footer                      │
└───────────────────────────────────────┘
```

**Alignment rules:**
- **The card:**
  - It stays sticky only while it fits: `max-height: 100dvh − 48px`. Below a viewport height of about 820 px, it stops being sticky. It never scrolls internally.
  - Its contents sit on one 16 px inset. Stat labels use a fixed 112 px column so values line up. Separators are full-width hairlines.
- **Index rows:** name, status, dates and employer sit on a four-column subgrid, so statuses and dates align down the list. The one-liner sits on the second line.
- **Inventory:** groups are rows with a fixed 96 px label column. Slots wrap and share one height: 40 px with a pointer, 44 px on touch.
- **Slot boundary:** a 1.5 px Slate border (6.92:1 on the card), so a slot reads as a control and stays distinct from the plain-text tools.
- **Below 1024 px:** the card becomes a compact header block and the page is one column.

### Hero
**The card is the hero.** On desktop it holds four groups:
1. **Name lockup (h1):** "TiDi", "Hồ Trọng Đại", "Dai Ho Trong"
2. **Role:** "Full-stack Developer"
3. **Stats:**
   - Guild: "Cyber security for IoT (EU)"
   - Passive: "Can't leave a pain point alone"
   - In production since: "2020"
   - Location: "Ho Chi Minh City, Vietnam"
4. **CTA and contact:** "bring me a pain point." with Email, Telegram, GitHub and Résumé

The portrait is a 16:10 crop of `ava.PNG` (the café table with the stickers around it), which keeps the card within the viewport. The right column opens straight on the Quest journal index ("2 active", "1 cleared"), so all five quests are visible in the first viewport.

### Signature moment: Equip an item
The Inventory sits directly under the quest index:
- **Slots:** every tool that `info.md` ties to a project is an item slot.
- **Equipping** a slot:
  - fills it with XP gold
  - shows it in the card's equipped slot, with the quests that used it
  - marks those quest rows with a gold bar while the others dim
- **Plain text:** tools with no project in `info.md` are listed as text, not slots.

| Mode | Behaviour |
|---|---|
| Keyboard | The slots form one tab stop (roving tabindex). Arrow keys move; Home and End jump. Enter or Space equips (`aria-pressed`), and Escape unequips. The result is announced in a polite live region. |
| Reduced motion | State changes are instant; the gold bar does not grow. |
| No JavaScript | A plain list. Each entry lists its stack anyway. |
| Mobile | The result appears inline under the grid, because the card is not sticky on mobile. |

**Mapping derived from the project stacks in `info.md`**, for the owner to confirm:

| Tool | Quests |
|---|---|
| NestJS | CyberRock, botmivivi, Quest |
| Node.js | CyberRock, Quest |
| React | CyberRock, Quest |
| Vue 3 | botmivivi |
| PostgreSQL | CyberRock, botmivivi |
| MySQL | Quest, Lemonswan |
| DynamoDB | Quest |
| Redis | CyberRock, botmivivi, Lemonswan |
| NATS | CyberRock |
| BullMQ | CyberRock, botmivivi |
| AWS | CyberRock, Quest |
| Azure | CyberRock |
| Terraform | Quest |
| GitHub Actions | CyberRock, Quest |
| Argo CD | CyberRock |
| New Relic | Quest |
| Laravel | Lemonswan |

No project listed, so plain text: TypeScript, Next.js, MongoDB, Docker, Kubernetes, Claude, ChatGPT, PHP, Symfony, Python, Flask.

### Diagrams in this direction
**Compact flow strips** inside the entry details:
- **Lines:** Controller navy at 2 px, with gold for the highlighted path.
- **Nodes:** 10 px rounded, labelled in Be Vietnam Pro 600.

The botmivivi ledger is the model: "order", "return" and "payment" flow into "balance", inside a boundary labelled "the same transaction".

### Motion budget

| Element | Trigger | What moves | Timing | What it communicates | Reduced motion |
|---|---|---|---|---|---|
| Item slot | Equip (click, Enter or Space) | The XP gold fill fades in | 160 ms, ease-out | This item is equipped | Instant |
| Card equipped slot | Equip | Text crossfade | 160 ms | What the character now holds | Instant |
| Quest rows | Equip | The gold bar scales in (scaleY); others fade to 0.55 opacity | 200 ms, ease-out | Which quests used the tool | Instant, no scale |
| Unequip | Escape, or click again | The reverse | 120 ms | Back to neutral | Instant |
| Links and buttons | Hover, `:focus-visible` | Colour | 120 ms | Feedback | Colour only |

No sticky-card animation, no reveals, no loops.

### Content fit

| Needs | In `info.md`? | Notes |
|---|---|---|
| Card portrait | Yes, `ava.PNG` | A 16:10 crop on desktop; the full 3:4 image, small, on mobile. |
| Stats | Yes | Guild, Passive, In production since, Location. "Class" and "Base" appear only in the owner's README, so they are `[copy: to draft & approve]` or omitted. |
| Tool → quest mapping | Derived | Needs the owner's confirmation. |
| Quest index one-liners and statuses | Yes | |
| Equipped label and "used in" wording | No | `[copy: to draft & approve]` |
| Inventory items | Yes | Skills & tools. |
| Screenshots | Not needed | |

### Risks and trade-offs
- **Distinctiveness:** split sticky is the most familiar layout of the three. The difference rests on the card's content and the inventory.
- **Theme level:** this is the most RPG of the three. It stays within "subtle" only with four stats, no numbers dressed as levels, and no gamer typeface.
- **Typography:** no tabular figures (above).
- **Layout:** the sticky card must never exceed the viewport height; at short viewports it stops being sticky.
- **Colour:**
  - Gold needs two tones in the light theme: XP gold as fill, Gold ink for text and lines.
  - The dark theme sits close to GitHub's own palette, with a risk of looking like a GitHub profile.
- **Content:** eleven tools have no project in `info.md` and render as plain text, which may read as a gap (TypeScript especially).
- **Mobile:** it loses the "card reacts beside the quests" effect.

### Genericness review

| Pattern checked | First draft | Revision | Why |
|---|---|---|---|
| Terminal chrome from the banner | Window dots, a prompt, a blinking cursor, mono | All removed | "Typewriter or terminal hero" and window chrome are banned; the banner already exists on GitHub. |
| Skill bars and levels | XP bars per skill, "LVL" | No levels. Slots are equip toggles; Leveling up lists topics, not progress. | Skill bars and percentages are banned. |
| All-caps eyebrow and stat table | "▸ PLAYER 1", seven stats in caps | Four stats with sentence-case labels; no eyebrow | All-caps tracked eyebrows; hero discipline (at most four groups). |
| Cluster 2 in the dark theme | Near-black with one bright accent | Light is the primary design; dark keeps the navy and gold with a stated reason | Continuity with the owner's banner and the gaming sticker's night screen. Flagged for the owner. |
| Gold text on white | `#E3B341` as link colour (1.95:1) | XP gold as fill only; Gold ink `#855A00` for text | Contrast. |
| One card style for everything | Quest cards, stat cards, slot cards | The card is the only box; quests are rows | "One card style for everything" and the SaaS card kit. |

**Would a similar prompt land here?** "Gamer developer portfolio" lands on a dark HUD, a pixel font, XP bars and neon. C differs:
- it is light-first
- it uses a Vietnamese-designed neo-grotesk
- its four stats are the owner's own
- its inventory answers a recruiter's real question: where was NestJS used?

---

## 7. Contrast check (computed)

- **Method:** WCAG 2.x relative luminance and contrast ratio, computed by a node script (no rounding before the comparison). Every pair below is a real text/background or accent pairing in the direction.
- **Thresholds:** text ≥ 4.5:1; meaningful graphics and UI boundaries ≥ 3:1.
- **Exempt (decorative, never the only carrier of information):** territory tints (A), hairline rules between entries, and the XP gold fill against white (C, 1.95:1; corrected by the main session after recomputing). The fill always comes with a Gold ink border at 6.07:1.
- **Result: 48 pairs, 0 failures.**

**A · Quest Journal**

| Theme | Pair | Foreground | Background | Ratio | Needs | Result |
|---|---|---|---|---|---|---|
| light | Body text | Iron ink `#241D15` | Parchment `#F4E7D3` | 13.65:1 | 4.5:1 | Pass |
| light | Body text on entry/diagram surface | Iron ink `#241D15` | Note paper `#FBF4E9` | 15.23:1 | 4.5:1 | Pass |
| light | Secondary text (dates, meta) | Pencil `#65563F` | Parchment `#F4E7D3` | 5.82:1 | 4.5:1 | Pass |
| light | Secondary text on surface | Pencil `#65563F` | Note paper `#FBF4E9` | 6.50:1 | 4.5:1 | Pass |
| light | Links, stamps, focus ring | Map sea `#2C5A69` | Parchment `#F4E7D3` | 6.21:1 | 4.5:1 | Pass |
| light | Stamps and links on surface | Map sea `#2C5A69` | Note paper `#FBF4E9` | 6.93:1 | 4.5:1 | Pass |
| light | Button label on accent fill | Note paper `#FBF4E9` | Map sea `#2C5A69` | 6.93:1 | 4.5:1 | Pass |
| light | Route line (meaningful graphic) | Route `#8A6F4D` | Note paper `#FBF4E9` | 4.31:1 | 3:1 | Pass |
| dark | Body text | Parchment `#F1E4CF` | Espresso `#261E17` | 13.07:1 | 4.5:1 | Pass |
| dark | Body text on entry/diagram surface | Parchment `#F1E4CF` | Café table `#31271E` | 11.63:1 | 4.5:1 | Pass |
| dark | Secondary text (dates, meta) | Kraft `#C4B195` | Espresso `#261E17` | 7.86:1 | 4.5:1 | Pass |
| dark | Secondary text on surface | Kraft `#C4B195` | Café table `#31271E` | 7.00:1 | 4.5:1 | Pass |
| dark | Links, stamps, focus ring | Map sea (lamplit) `#8FC3D1` | Espresso `#261E17` | 8.51:1 | 4.5:1 | Pass |
| dark | Stamps and links on surface | Map sea (lamplit) `#8FC3D1` | Café table `#31271E` | 7.57:1 | 4.5:1 | Pass |
| dark | Button label on accent fill | Espresso `#261E17` | Map sea (lamplit) `#8FC3D1` | 8.51:1 | 4.5:1 | Pass |
| dark | Route line (meaningful graphic) | Route `#A88D69` | Café table `#31271E` | 4.64:1 | 3:1 | Pass |

**B · Proof**

| Theme | Pair | Foreground | Background | Ratio | Needs | Result |
|---|---|---|---|---|---|---|
| light | Body text | Epoxy `#14161B` | Wafer `#F4F4F8` | 16.50:1 | 4.5:1 | Pass |
| light | Body text on plate | Epoxy `#14161B` | Plate `#FFFFFF` | 18.10:1 | 4.5:1 | Pass |
| light | Secondary text | Lead `#525866` | Wafer `#F4F4F8` | 6.50:1 | 4.5:1 | Pass |
| light | Secondary text on plate | Lead `#525866` | Plate `#FFFFFF` | 7.13:1 | 4.5:1 | Pass |
| light | Links, verified path, focus ring | Attest violet `#5B3FD0` | Wafer `#F4F4F8` | 6.24:1 | 4.5:1 | Pass |
| light | Accent on plate (diagram labels) | Attest violet `#5B3FD0` | Plate `#FFFFFF` | 6.85:1 | 4.5:1 | Pass |
| light | Button label on accent fill | Plate `#FFFFFF` | Attest violet `#5B3FD0` | 6.85:1 | 4.5:1 | Pass |
| light | Construction lines (meaningful graphic) | Trace `#737A87` | Plate `#FFFFFF` | 4.32:1 | 3:1 | Pass |
| dark | Body text | Marking `#ECEAF4` | Darkroom `#15131C` | 15.45:1 | 4.5:1 | Pass |
| dark | Body text on plate | Marking `#ECEAF4` | Plate (dark) `#201D2A` | 13.88:1 | 4.5:1 | Pass |
| dark | Secondary text | Lead (dark) `#A9A5BA` | Darkroom `#15131C` | 7.69:1 | 4.5:1 | Pass |
| dark | Secondary text on plate | Lead (dark) `#A9A5BA` | Plate (dark) `#201D2A` | 6.91:1 | 4.5:1 | Pass |
| dark | Links, verified path, focus ring | UV glow `#B7A6FF` | Darkroom `#15131C` | 8.68:1 | 4.5:1 | Pass |
| dark | Accent on plate (diagram labels) | UV glow `#B7A6FF` | Plate (dark) `#201D2A` | 7.80:1 | 4.5:1 | Pass |
| dark | Button label on accent fill | Darkroom `#15131C` | UV glow `#B7A6FF` | 8.68:1 | 4.5:1 | Pass |
| dark | Construction lines (meaningful graphic) | Trace (dark) `#827D96` | Plate (dark) `#201D2A` | 4.19:1 | 3:1 | Pass |

**C · Player Card**

| Theme | Pair | Foreground | Background | Ratio | Needs | Result |
|---|---|---|---|---|---|---|
| light | Body text | Controller navy `#131A2A` | Menu `#FAF9F6` | 16.50:1 | 4.5:1 | Pass |
| light | Body text on card | Controller navy `#131A2A` | Card `#FFFFFF` | 17.37:1 | 4.5:1 | Pass |
| light | Secondary text (stat labels) | Slate `#525A6B` | Menu `#FAF9F6` | 6.58:1 | 4.5:1 | Pass |
| light | Secondary text on card | Slate `#525A6B` | Card `#FFFFFF` | 6.92:1 | 4.5:1 | Pass |
| light | Links, role line, focus ring | Gold ink `#855A00` | Menu `#FAF9F6` | 5.77:1 | 4.5:1 | Pass |
| light | Gold ink on card | Gold ink `#855A00` | Card `#FFFFFF` | 6.07:1 | 4.5:1 | Pass |
| light | Equipped slot label on XP gold fill | Controller navy `#131A2A` | XP gold `#E3B341` | 8.93:1 | 4.5:1 | Pass |
| light | Equipped border / highlight bar (UI) | Gold ink `#855A00` | Card `#FFFFFF` | 6.07:1 | 3:1 | Pass |
| dark | Body text | Star white `#E8ECF3` | Night screen `#10151F` | 15.42:1 | 4.5:1 | Pass |
| dark | Body text on card | Star white `#E8ECF3` | Card (dark) `#182030` | 13.76:1 | 4.5:1 | Pass |
| dark | Secondary text (stat labels) | Slate (dark) `#A3ACBC` | Night screen `#10151F` | 7.99:1 | 4.5:1 | Pass |
| dark | Secondary text on card | Slate (dark) `#A3ACBC` | Card (dark) `#182030` | 7.13:1 | 4.5:1 | Pass |
| dark | Links, role line, focus ring | XP gold `#E3B341` | Night screen `#10151F` | 9.39:1 | 4.5:1 | Pass |
| dark | XP gold on card | XP gold `#E3B341` | Card (dark) `#182030` | 8.38:1 | 4.5:1 | Pass |
| dark | Equipped slot label on XP gold fill | Night screen `#10151F` | XP gold `#E3B341` | 9.39:1 | 4.5:1 | Pass |
| dark | Equipped border / highlight bar (UI) | XP gold `#E3B341` | Card (dark) `#182030` | 8.38:1 | 3:1 | Pass |

---

## 8. Comparison

| | A · Quest Journal | B · Proof | C · Player Card |
|---|---|---|---|
| Concept | A ruled quest log on the avatar's paper; the career is a route you walk | Each quest explained by a drawing of its system; a handshake you can run | A pinned player card beside a scannable quest index |
| Layout family | Index or log, one column with a margin index; frontispiece hero | Systems or diagram led; split hero with a live figure; full-width drawing bands | Split sticky: pinned card and a scrolling index |
| Typography | Alegreya + Alegreya Sans (humanist serif and sans) | Archivo, one variable family (width axis) | Be Vietnam Pro, one family (Vietnamese-designed) |
| Colour temperature | Warm: parchment, espresso | Cool: wafer, darkroom | Neutral, with gold |
| Accent | Map sea teal | Attest violet | Banner gold |
| Dials V / M / D | 5 / 3 / 5 | 6 / 5 / 4 | 4 / 2 / 7 |
| Hero | Avatar frontispiece and name lockup | Name and the live handshake figure | The card itself |
| Signature | Walk the route | Run the handshake | Equip an item |
| Avatar's role | Opens the page | Framed in About | Card portrait |
| Diagrams | Inked route maps inside entries | The main visual, full width | Compact strips inside entries |
| First desktop viewport | Who, plus the top of the journey map | Who, plus the CyberRock mechanism | Who, plus all five quests |
| RPG intensity | Subtle: labels, stamps, the Player 1 token | Lowest: labels and the handshake | Highest: stats and inventory (still no HUD chrome) |
| Tension resolved toward | The avatar (journal) | Neither: the work | The banner (game voice), minus the terminal |
| Content fit | Good; the stage placement needs confirmation | Medium: leans on CyberRock, whose story was skipped | Good; the tool mapping needs confirmation |
| Build effort and performance risk | Medium: two families, three route maps plus the token | High: an interactive hero, three drawings × two layouts | Low to medium: one family, a grid interaction |
| Main risk | Reads soft for a security and backend role | Cool and impersonal; the avatar clashes | Closest to familiar templates; the RPG could exceed "subtle" |

The directions differ on all four axes the skill names: layout family, typography, colour temperature and motion.

---

## 9. Recommendation

I recommend **A, Quest Journal**.
- **Both audiences at once.** The audience is split between hiring managers who skim and clients who must trust a person with their pain point, and A serves both. The ruled log with its margin index scans nearly as fast as C's index. The avatar, the owner's single strongest asset, opens the page instead of being boxed away.
- **The tension, resolved on purpose.** A resolves the avatar and banner tension toward the journal. The banner's game voice survives exactly where the owner asked for it: in a few labels, and in one game-like moment.
- **A signature built from facts.** Walking the Player 1 token from "Laravel applications" to "event-driven microservices with NestJS" is built from the owner's own sentence and real dates. It informs rather than decorates, and it degrades to an ordered list.
- **No screenshots needed.** The three allowed diagrams become route maps in the same visual language.

Two modifications to consider:
1. Keep the top of the journey map inside the first desktop viewport (already in the wireframe).
2. The signatures are portable. If the owner prefers function over flourish, C's "Equip an item" could replace the route inside A.

---

## 10. For the owner

### Decisions that need approval
1. **Direction:** A, B or C, with any modifications. Recommended: A.
2. **Signature interaction** for the chosen direction (the route, the handshake or equip). Signatures are portable between directions.
3. **Stated exceptions to the generic-pattern bans** in the chosen direction:
   - **A:** the warm parchment page (one element of cluster 1) and the warm brown dark theme
   - **B:** the violet-tinted dark theme
   - **C:** a navy near-black dark theme with one bright gold accent, near cluster 2, matching the banner
4. **Avatar crops:** A's Player 1 token (a round crop of the face) and C's 16:10 card crop. Both are crops of `ava.PNG`, with no other edits.
5. **Rendering rule** for the owner's em-dash and middot strings (§3): the words stay unchanged; the separator becomes structure.
6. **Derived mappings** used by the signatures: project → journey stage (A); tool → quest (C); the host/chip framing (B).

### Open questions
1. **Video:** a click-to-load facade on the privacy-enhanced domain, or a plain link to YouTube?
2. **Journey stages (A):**
   - Is it right to put Lemonswan under "Laravel applications", Quest across the boundary from "AWS serverless systems" to "event-driven microservices with NestJS" (v1 → v2), and CyberRock in the last stage?
   - Is an undated spur right for Scania?
3. **botmivivi figures:**
   - Which figures should the site show?
   - How should "save 90% of time, 80% of errors" read as a sentence?
   - Number format: 2951 or 2,951?
4. **"Player 1":** should the banner's "PLAYER 1" name the token in A, given that "STATUS accepting quests" stays off?
5. **TypeScript (C):** should it be linked to the NestJS projects? `info.md` does not say so explicitly.

### Copy slots, `[copy: to draft & approve]`
- **All directions:**
  - The CTA label. "bring me a pain point." (from the banner, lowercase, with a period) as given, or sentence case.
  - The hero sentence, which repeats "full-stack developer" right under the role.
  - The Résumé link label.
  - Accessible names for the theme toggle and the menu.
  - The video facade label.
- **A:** the map's accessible name and keyboard hint, and the token's accessible description.
- **B:** the run button, the counterfeit toggle and the rejected verdict.
- **C:** the equipped-slot label and the "used in" sentence; whether the README's "Class" and "Base" labels appear.

---

## 11. Selection record

**Selected: B · Proof, 2026-09-28** ("i choose option B, go with option B"). The owner stated no modifications.

Taken as chosen with the selection; the owner can reopen any of these:
- **Signature:** B's own, "Run the handshake".
- **Ban exception:** B's violet-tinted dark theme.
- **Handshake framing:** host/chip. It stays in the copy review, where the owner confirms the depiction is accurate.

Main-session rulings for the §10 items that apply to B (logged in `docs/progress.md`):
- **Video:** click-to-load facade on the privacy-enhanced domain.
- **Rendering rule:** as in §3.
- **Number format:** en-US grouping (2,951).

Items that wait for the copy step (`portfolio-content` B, with owner approval):
- the botmivivi figures and their wording
- the CTA label and casing
- the hero sentence
- the handshake button, toggle and verdict labels
- the Résumé link label
- the accessible names
- the video facade label
