# Plan contribution: design

> Author: `design-lead`, 2026-09-28, for `docs/plan/implementation-plan.md` (`implementation-plan` skill, design section).
> Inputs: `info.md` (confirmed 2026-09-27), `docs/design/directions.md` (B · Proof selected 2026-09-28, §11), `DESIGN.md` (created 2026-09-28; lint 0 errors, 0 warnings), `CLAUDE.md`.
> Decisions only. Values live in `DESIGN.md` and facts in `info.md`; this file cites their names and sections. Copy marked `[copy: to draft & approve]` waits for the owner.

## 1. Page structure and information architecture

### 1.1 Routes and artefacts
| Route or artefact | Purpose | Design spec |
|---|---|---|
| `/` | The one page | All of `DESIGN.md` |
| Not-found route | A real 404 | `DESIGN.md` → Components → Contact, footer, other surfaces |
| Résumé PDF, one stable URL | Download from the hero and Contact ("Résumé" everywhere) | §2, row 36 |
| Social image, 1200 × 630 | Open Graph and Twitter | Components → other surfaces |
| Favicon, apple-touch icon | Tab and home-screen icons | Components → other surfaces |

### 1.2 Landmarks and heading outline
```text
skip link → #main
header (banner): wordmark "TiDi" · nav [name: copy] · theme toggle · menu button (< 768 px)
main#main
  section (hero)            h1  TiDi / Hồ Trọng Đại (lang="vi") / Dai Ho Trong
  section#quest-journal     h2  Quest journal
    article                   h3  CyberRock         h4 What I built
    article                   h3  botmivivi         h4 What it does
    article                   h3  Quest @ NFQ Asia  h4 Achievements
    article                   h3  Lemonswan
    article                   h3  Scania
  section#experience        h2  Experience          h3 Sunbytes · h3 NFQ Asia
  section#house-rules       h2  House rules
  section#inventory         h2  Inventory           h3 Leveling up
  section#about             h2  About               h3 Education & certifications · h3 Languages [copy]
  section#afk               h2  AFK
  section#contact           h2  the sign-off: "Got a pain point? Bring the constraints — I'll bring the trade-offs."
footer (contentinfo): "still learning, always solving."
```
- One `h1`. Every section is labelled by its heading. Facts terms ("My role", "Team", "Scale", "Stack") are `dt`, not headings.
- Nav: Quest journal, Experience, House rules, Contact. The hero CTA and the nav's "Contact" both land on `#contact` (one intent).

### 1.3 Final section order for B
| # | Section | Content (`info.md`) | `DESIGN.md` components |
|---|---|---|---|
| 1 | Header | Identity → brand "TiDi" | Header, navigation, skip link; theme toggle |
| 2 | Hero | Identity: name display, role, positioning; CyberRock one-liner as the bench caption | Hero; Handshake bench |
| 3 | Quest journal | Projects → CyberRock, botmivivi, Quest @ NFQ Asia; Experience → NFQ Asia → Lemonswan, Scania | Sheets (full ×3, compact ×2); Drawing grammar; Video facade |
| 4 | Experience | Experience → Sunbytes, NFQ Asia | Experience rows |
| 5 | House rules | About → House rules (intro and four rules) | House rules |
| 6 | Inventory, Leveling up | Skills & tools (the five profile groups); About → Leveling up | Inventory |
| 7 | About | About → Bio (two paragraphs); Education & certifications; languages; `ava.PNG` | About avatar |
| 8 | AFK | Interests → profile list | Inline list |
| 9 | Contact | About → Sign-off; Contact & links (the three shown channels and the location); the résumé PDF | Contact (facts list) |
| 10 | Footer | Identity → Tagline | Footer |

### 1.4 Sheet slots
A slot renders only when `info.md` holds its fact (`DESIGN.md` → Sheets → Facts only).

| Slot | CyberRock | botmivivi | Quest @ NFQ Asia |
|---|---|---|---|
| Status | Active | Side | Cleared |
| Dates | `[copy: date format]` | `[copy: date format]` | 2020-12 to 2024-03 |
| Lede | "prove IoT devices are genuine" | "back office for a flour distributor, live in production" | "a career-path platform on RPG quest mechanics" |
| Drawing | chip authentication and lifecycle | the ledger | the v1 → v2 migration |
| Facts | My role (inline list), Team, Scale, Stack | My role, the usage figures and impact `[copy]`, Stack | My role (Tech lead), Team, users `[copy: label]`, Stack |
| Body | What I built: three bullets | What it does: three terms | Party lead (term); Achievements: four terms; video facade |
| Link | none | none | the video only |

| Slot | Lemonswan | Scania |
|---|---|---|
| Meta | NFQ Asia, 2020-03 to 2020-12 | NFQ Asia, no dates |
| One-liner | `[copy: from the résumé project line]` | `[copy: from "trucks, for a German company"]` |
| What was built | "matching logic and UI design" | "backend and frontend" |
| Stack | Laravel 8.10, MySQL, Redis (cache), Tailwind CSS | Spryker framework |
| Link | lemonswan.com | none |

### 1.5 IA rules
- **Rendering (directions §3):** em dashes inside the owner's sentences stay; "Name — description" strings become term lists; middot strings become inline lists; straight quotes become curly and `...` becomes `…`. The words never change.
- **Not shown:** the availability line, travel and photography, the phone number, the second email and the reference.
- **Themed words:** only the owner's labels (Quest journal; Active, Side, Cleared; Party lead; Achievements; House rules; Inventory; Leveling up; AFK).

## 2. Component inventory
Names in the second column are `DESIGN.md` component entries or section headings. "JS" means a client leaf is needed.

| # | Component | `DESIGN.md` | Used in | States and variants | JS |
|---|---|---|---|---|---|
| 1 | Theme tokens | front matter; Known Gaps 1–2 | everywhere | light, dark (`-dark`) | no |
| 2 | Page shell and section | `page`, Layout | everywhere | none | no |
| 3 | Focus ring | `focus-ring` | every control | `:focus-visible` | no |
| 4 | Skip link | `skip-link` | top | hidden, focused | no |
| 5 | Site header and nav | Header, navigation, skip link; `nav-link`, `nav-link-hover` | top | hover, focus | no |
| 6 | Menu disclosure (< 768 px) | `icon-button`, `icon-button-hover`, `divider` | header | closed, open, hover, focus | small, or native |
| 7 | Theme toggle | `icon-button`, `icon-button-hover` | header | light, dark (`aria-pressed`), hover, focus; hidden without JS | yes |
| 8 | Text link | `link`, `link-hover` | Résumé, Lemonswan, contact | hover, focus | no |
| 9 | Primary button (or button-styled link) | `button-primary`, `-hover`, `-active` | hero CTA, run, play mark | hover, active, focus | no |
| 10 | Toggle button | `button-toggle`, `-hover`, `-pressed` | bench | off, pressed, hover, focus | inside the bench |
| 11 | Hero lockup | Hero; `display`, `name`, `ui-strong`, `lead` | hero | wraps | no |
| 12 | Handshake bench | Handshake bench; `plate`, `verdict-genuine`, `verdict-rejected`, `caption` | hero | rest, idle, challenge, response, genuine, rejected; compact, wide; reduced motion; no JS | yes, the only motion leaf |
| 13 | Full sheet | Sheets; `heading-sheet`, `meta`, `lead`, `divider` | Quest journal ×3 | base, md, lg layouts | no |
| 14 | Compact sheet | Sheets | Lemonswan, Scania | stacked, 6 \| 6 | no |
| 15 | Status and date labels | `label-strong`, `meta` | sheet heads | none | no |
| 16 | Facts list | Sheets → Lists; `facts-label` | sheets, Contact | none | no |
| 17 | Term list | Sheets → Lists | botmivivi, Quest | none | no |
| 18 | Inline list | Sheets → Lists | stacks, roles, Inventory, Leveling up, AFK, Experience | wraps | no |
| 19 | Bullet list and subheads | Sheets → Lists | CyberRock; sheet and About subheads | none | no |
| 20 | Drawing figure shell | Drawing grammar; `plate`, `caption` | three sheets | wide, tall; text alternative | no |
| 21 | Drawing primitives | `drawing-node`, `drawing-node-replaced`, `drawing-proof`, `drawing-construction` | bench and drawings | light, dark | no |
| 22 | CyberRock drawing | drawing table, row 1 | CyberRock | wide, tall | no |
| 23 | Quest migration drawing | drawing table, row 2 | Quest | wide, tall | no |
| 24 | botmivivi ledger drawing | drawing table, row 3 | botmivivi | wide, tall | no |
| 25 | Video facade | Video facade | Quest | poster, hover, focus, loading, playing; link without JS | yes, small |
| 26 | Experience rows | Experience, House rules, Inventory, AFK | Experience | stacked, aligned rows | no |
| 27 | House rules list | same | House rules | stacked, split | no |
| 28 | Inventory groups | same | Inventory | 1, 2, 3 columns | no |
| 29 | About block and avatar figure | About avatar | About | stacked, split | no |
| 30 | Contact block | Contact, footer, other surfaces | Contact | stacked, split | no |
| 31 | Footer | same; `divider` | bottom | none | no |
| 32 | Not-found page | same | 404 | none | no |
| 33 | Social image | same | metadata | light only | build time |
| 34 | Favicon and apple-touch icon | same | metadata | light, dark | no |
| 35 | Icons | Shapes → Icons | the ten named icons | none | no |
| 36 | Résumé PDF | Typography, Colors (light) | download | none | build time or one-off |

- **Résumé PDF** (not a page component, but a design deliverable): A4, Archivo (static instances), light tokens only (`primary`, `text-muted`; `accent` on links only), no drawings, no photo. Its structure mirrors the facts-list language: name and role, contact (the three shown channels and the location), experience, projects, skills, education, languages. Content comes from `info.md` minus the phone number and the reference. Its wording is a copy slot (§7, row 15); the location takes the Contact label (row 18).
- Nothing else is built: no cards, no carousel, no command palette, no contact form, no timeline widget.

## 3. Responsive strategy
- **Mobile-first.** Breakpoints: base 320–767 px, md from 768 px, lg from 1024 px; content caps at 1200 px. Per-section collapse: `DESIGN.md` → Responsive Behavior (not restated here).
- **Container queries, not viewport breakpoints,** switch the bench variants (at an inner width of 480 px), the sheet drawings (880 px) and the bench controls (480 px). This keeps the labels at 14 px or more in every column and at 200 % zoom, with no JavaScript measurement.
- **What to look at, per width** (for the checkpoints and `qa-reviewer`'s matrix):

| Width | Must hold |
|---|---|
| 320 | Bench compact and tall drawings at 1.025× (labels 14.35 px: a 246 px plate inner width over 240 units), both legible; names wrap cleanly; no overflow from "microservices", "daisy-chain" or the email address; the menu works |
| 375 | Hero text plus the top of the bench in the first viewport (375 × 667) |
| 768 | Nav inline; bench wide but capped at 648 px; each full sheet puts the tall drawing beside the facts |
| 1024 | Hero split 5 \| 7 with the sentence at 36–48 characters per line; bench wide (490.7 px inner, 1.022×); sheet drawings wide (the band's 894 px inner width passes the 880 px threshold, 1.016×) |
| 1440 | The whole hero in the first 1440 × 900 viewport; drawing labels scaled 1.3× at most; facts column readable |
| 1920 | Container capped; margins grow; nothing stretches |

- **Targets and reflow:** every control at least 44 × 44 px; no link sits inside a sentence; reflow at 200 % zoom; safe-area insets on the edges.

## 4. Interaction strategy
Everything is server-rendered. Client leaves: the theme toggle (with the no-flash head script), the handshake bench, the video facade, and the menu only if a native disclosure can't meet the behaviour in the table below. Design needs no animation library: CSS transitions and the Web Animations API cover the budget. The final call, and the JS budget, belong to `frontend-engineer`.

| Element | Semantics | Keyboard | Without JS |
|---|---|---|---|
| Skip link | link to `#main` | first Tab stop | works |
| Nav links | links in `nav` | Tab | works |
| Menu (< 768 px) | button with `aria-expanded` and `aria-controls`; in-flow panel | Enter or Space toggles; Escape closes and returns focus; a chosen link closes it | links stay reachable |
| Theme toggle | button with `aria-pressed` | Enter or Space | hidden; the system theme applies |
| Hero CTA | link to `#contact`, styled as `button-primary` | Enter | works |
| Résumé | link to the PDF with `download` | Enter | works |
| Run | button | Enter or Space; restarts any run | hidden; the bench shows its rest state |
| Counterfeit | button with `aria-pressed`, constant label | Enter or Space; cancels a run | hidden |
| Bench readout | polite live region | none | shows "genuine" |
| Video poster | link to the YouTube watch URL, upgraded to load the youtube-nocookie iframe | Enter; focus moves to the iframe | opens YouTube |
| Lemonswan, contact links | links (`mailto:`, https) | Enter | works |

- **Feedback:** every control changes colour on hover and shows the focus ring; nothing lifts or scales. State never rests on colour alone: the toggle swaps its icon, the verdict has text and an icon, links are underlined.
- **Privacy:** no third-party request before the visitor activates the video. No analytics.

## 5. Motion strategy
- **Budget** (`DESIGN.md` → Motion): the handshake sequence on run, colour feedback on controls, and the video fade. Nothing else moves.
- **Non-goals:** no scroll reveals, smooth scrolling, theme or menu transitions, hover lifts, loops or self-animating drawings.
- **Technique:** only `transform` and `opacity` animate; the sequence is driven by the bench's state and cancelled on restart; durations and easings use the Motion tokens (`duration-travel`, `duration-pulse`, `duration-verdict`, `duration-shake`, `duration-feedback`, `duration-fade`, `ease-out`, `ease-in-out`), hand-mapped because the schema can't carry them.
- **Reduced motion:** state jumps, step numerals 1 and 2 on the lines, the verdict announced alone; colour feedback stays.
- **Checks:** a genuine run takes about 1,080 ms and a rejected run about 600 ms; run during a run restarts cleanly; toggling during a run returns to idle; reduced-motion captures show the numbered final state.

## 6. Design checkpoints
Both follow `design-system` → Critique. Findings use `screen@width/theme — issue — DESIGN.md reference — suggested change — severity`. A fix that changes the system updates `DESIGN.md` first, and a material change goes to the owner.

### 6.1 Checkpoint 1: after the first visual phase
- **For the checkpoint to mean anything, the first visual phase must include:** the token pipeline and fonts; the page shell (header, skip link, theme toggle, footer); the hero with the bench in its static rest state, both variants; and the CyberRock sheet with its drawing, both variants. That proves type, colour, the drawing grammar and the signature's composition in both themes before the other drawings and the bench motion are built.
- **Inputs from `qa-reviewer`:** the matrix at 320, 375, 768, 1024, 1440 and 1920 px × light and dark, in `docs/reviews/<phase>/screens/`, plus a no-JS capture of the hero.
- **Checks, defined before the build:**
  1. The bench reads as the hero's visual anchor at 1440 and 375, and its rest state says "genuine" with no interaction.
  2. Scanning order: name, role and sentence, CTA, bench, Quest journal. The whole hero fits 1440 × 900.
  3. The width axis reads as intended ("TiDi" at 125, labels at 87.5); Vietnamese marks never clip; measures hold.
  4. Violet appears only on the proof, links, CTA, run button and focus ring.
  5. The CyberRock drawing follows the grammar (one proof, ink lifecycle, construction trail); the tall variant reads at 320 px; labels are 14 px or more; the text alternative exists.
  6. The dark theme reads as a darkroom, not crypto: no glow, and the contrast pairs hold.
  7. Restraint: name one accessory to remove.
  8. No drift toward generic patterns: no card kit, mono, eyebrow or stats strip.
- **Output:** `docs/reviews/<phase>-design-critique.md`. **Gate:** sign-off by the main session; by the owner if the look changes.

### 6.2 Checkpoint 2: pre-release
- **Scope:** every section, both themes, all six widths; the bench states (rest, idle with the toggle pressed, genuine, rejected) with and without reduced motion; the video poster; the 404; the social image; the favicon at 16, 32 and 180 px; the résumé PDF.
- **Checks:**
  1. One rhythm and one set of alignment lines across all sections.
  2. The avatar reads as intentional: matted, captioned, unaltered, in About only.
  3. The CyberRock sheet stands on facts alone, with nothing implied.
  4. The four drawings read as one grammar.
  5. Motion timing and reduced-motion variants as specified.
  6. Approved copy fits its slots, with no placeholder anywhere.
  7. The md (768–1023) arrangements look designed, not stretched.
- **Output:** `docs/reviews/pre-release-design-critique.md`.

## 7. Copy slots for owner approval
Drafted through `portfolio-content` B (options from `info.md` facts only); approved text goes to `info.md` → Approved copy.

| # | Slot | Where | Source facts | Needed | Before |
|---|---|---|---|---|---|
| 1 | CTA label: "bring me a pain point." as given (lowercase, period) or sentence case | hero | banner text | decision | first visual phase |
| 2 | Hero sentence: the positioning line repeats "full-stack developer" under the role | hero | Identity → Positioning | keep or options | first visual phase |
| 3 | "Résumé" label and Contact link text | hero, Contact | Site preferences → Résumé | options | first visual phase |
| 4 | Accessible names: theme toggle, menu button, nav landmark; skip link label | header | none (UI) | options | first visual phase |
| 5 | Run label, counterfeit toggle label, rejected verdict, the bench's step-list wording | bench | CyberRock → What I built | options | bench motion phase |
| 6 | Host/chip framing of the handshake (technical accuracy) | bench | CyberRock → What I built | owner check | first visual phase |
| 7 | CyberRock drawing: supplier exports as an output, the auth step after "the field" | CyberRock | CyberRock → What I built | owner check | first visual phase |
| 8 | Quest drawing: carried-data labels (the owner's note reads "uers"); step-list wording | Quest | Quest → The migration | confirm | project sheets |
| 9 | botmivivi drawing: the replaced-steps label; step-list wording | botmivivi | botmivivi → What it replaced | options | project sheets |
| 10 | botmivivi figures: which to show, how "save 90% of time, 80% of errors" reads, and their facts labels | botmivivi facts | botmivivi → Usage; What it replaced and the impact | options | project sheets |
| 11 | One date format for sheet heads ("2024 → now" or "2024-03 to present"; how botmivivi's August 2026 start reads) | sheet heads | Projects; Experience | decision | project sheets |
| 12 | Quest facts: the users label; Lemonswan and Scania one-liners (the Lemonswan line says "leading") | sheets | Quest → Team and users; Lemonswan; Scania | options | project sheets |
| 13 | Avatar caption: the owner's alt text as a visible caption, with `alt=""` on the image | About | Visual assets → `ava.PNG` | confirm | remaining sections |
| 14 | "Languages" label; AFK list source (profile, not the résumé list); Inventory limited to the five profile groups | About, AFK, Inventory | Education; Interests; Skills & tools | confirm | remaining sections |
| 15 | Résumé PDF wording; its summary contains "seamless" (the owner's résumé wording) | PDF | About → Summary (résumé) | keep or options | release surfaces |
| 16 | Video facade: accessible name and the line saying YouTube loads on play | Quest | Quest → Video | options | project sheets |
| 17 | 404 heading and home link; page title and meta description | 404, metadata | Identity | options | release surfaces |
| 18 | Location label: the facts term before "Ho Chi Minh City, Vietnam" (the value stays verbatim) | Contact, résumé PDF | Identity → Location; Contact & links (opt-in, 2026-09-28) | options | remaining sections |

## 8. Design decisions for the owner
1. **Technical accuracy** (rows 6–8): the host/chip framing, the CyberRock drawing's structure, and the Quest crossing. Recommendation: confirm as drawn; each is built from the owner's own sentences.
2. **Date format** (row 11). Recommendation: one format across sheet heads, the month-precise "YYYY-MM to YYYY-MM" already used for Quest and Lemonswan.
3. **Avatar caption** (row 13). Recommendation: show the owner's alt text as the caption; it frames the illustration as an exhibit, which answers B's "avatar clashes" risk.
4. **CTA casing** (row 1). The designs work either way.

## 9. Notes for assembly
- **`DESIGN.md` departs from §5 in these places** (by ruling, `DESIGN.md` wins over contributions written from §5):
  1. The CyberRock drawing shows supplier exports as an output and leaves anomaly detection out.
  2. The bench rests on the completed handshake: the server HTML equals the hydrated state. Its controls and the theme toggle are hidden without JS.
  3. Drawing and bench variants switch by container query (authored widths: sheets 880 and 240 units; bench 480 and 240).
  4. The header is not sticky; the menu panel opens in flow (no overlay, no focus trap).
  5. Violet is reserved for proof and action: status labels, bullets and the role line are ink.
  6. The pressed toggle swaps `square` for `square-check` and thickens its border.
  7. Middot lists render inline with commas.
  8. New tokens and roles: `accent-hover`, `rule`, `lead`; the icon set grows to ten (`check`, `x`, `square`, `square-check` and `menu-2` join §3's five needs).
- **Dependencies to verify and install** (`frontend-engineer`): Archivo through `next/font/local`, subset from the pinned OFL `Archivo[wdth,wght].ttf` (google/fonts `95f4904`; engineering ruling 1, `DESIGN.md` → Typography); `@tabler/icons-react` 3.48.0 (MIT, checked with `npm view` on 2026-09-28).
- **Token pipeline** (tested with `@google/design.md` 0.4.0): `export --format css-tailwind` emits every colour (each `-dark` as its own variable), `--font-*`, `--text-*`, `--leading-*`, `--tracking-*`, `--font-weight-*`, `--radius-base` and `--spacing-*`. It emits no components, `fontVariation` or `fontFeature`. The thin mapping file must add: the dark swap (`--color-X` → `--color-X-dark` under the dark theme), `font-stretch` per role, `tnum` and `lnum` for labels, the fluid clamps, the motion tokens, the breakpoints (48rem, 64rem), the skip-link layer, the drawing strokes and dashes, and the focus ring. The exported family name "Archivo" must point at next/font's generated family.
- **Social image:** `next/og` can't read variable axes, so the lockup needs static Archivo instances (an expanded width at 800). Verify availability and licence.
- **Avatar:** `ava.PNG` is 3.1 MB. Serve responsive AVIF or WebP with explicit dimensions, lazy-loaded; it is never the LCP.
- **Captures `qa-reviewer`'s matrix should add for design:** the bench states, reduced motion, the no-JS hero, and 200 % zoom at 1280 px (to confirm the drawing variant switch).
