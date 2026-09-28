# Generic patterns to avoid

> **Owner override (2026-09-28):** the owner asked for "clean, modern, developer style, many animations and 3D, follow RPG game style". Game-UI patterns (HUD, quest log, character sheet, XP and level motifs), 3D scenes, rich scroll and hover motion, and animated backgrounds tied to the RPG concept are **allowed**. The rest of this list still applies, and executions must stay clean and modern, never kitsch: no pixel-art noise, and no clutter that hurts reading.

Sources:
- Anthropic frontend-design: calibration clusters and typographic tells.
- Taste Skill v2: AI tells.
- Developer-portfolio clichés derived by applying the same principles.

Each pattern is legitimate for *some* brief. Here it is banned **as a default**. Using one requires a stated reason in `docs/design/directions.md` or `DESIGN.md`.

## Aesthetic clusters
1. Warm cream background (~#F4F1EA), high-contrast serif display, terracotta or clay accent (~#D97757).
2. Near-black background with one bright acid-green or vermilion accent.
3. Broadsheet: hairline rules, zero radius, dense newspaper columns.
4. SaaS card kit: identical rounded cards, one radius on everything, the same soft grey shadow, gradient washes.
5. Template chrome regardless of subject:
   - an ALL-CAPS tracked eyebrow above every heading
   - `A · B · C` meta strings
   - `WORD — fragment` labels
   - tinted near-black standing in for black
   - mono type for small data labels
   - `→` appended to links

## Typography
- One word in a headline accented by italic, bold or colour.
- All-caps labels, or labels above content that add nothing.
- Families chosen from habit, for example Inter with slate, Geist or Space Grotesk everywhere, or Fraunces or Instrument Serif as "the creative serif".
- `<br>`-split italic headlines, vertical rotated text, oversized "screaming" H1s, gradient text on large headings.

## Layout & structure
- A centred hero over a dark mesh or gradient blob. A hero with more than 4 text elements, or one that overflows the first viewport.
- Three equal cards in a row. The same layout family section after section. Three or more zigzag image/text rows.
- Numbered sections or markers (`01.`, `001 ·`, `01 / 04`) when the content is not a sequence.
- Split header: big headline on the left, a tiny paragraph floating on the right.
- Decorative hairline grids or crosshairs, decorative status dots, one card style for everything.
- Scroll cues ("scroll ↓", bouncing chevrons, mouse icons).

## Motion
- Fade-and-slide-up on every section, hover lift on every card.
- Perpetual pulse, float or shimmer on static content. More than one marquee.
- Scroll-jacking, parallax everywhere, custom cursors, cursor spotlights on everything.

## Content & copy
- Em dashes as a stylistic crutch.
- Filler words: elevate, seamless, unleash, next-gen, revolutionize, passionate, cutting-edge, leverage.
- Metrics not in `info.md` (`99.9% uptime`, `10x faster`, `50+ projects`).
- Poetic section labels ("Field notes", "Currently on the bench", "Selected works, 2019–2026").
- Several labels for one intent ("Let's talk", "Get in touch" and "Contact" on the same page).
- Version labels, build stamps, or locale, time and weather strips used as decoration.

## Developer-portfolio clichés (derived)
- "Hi, I'm X 👋" with a typewriter or terminal hero, where the blinking cursor is the main idea.
- Skill bars, percentages, star ratings, or a wall of tech logos as the skills section.
- Navy background, mint accent and mono numbered headings (the most-cloned portfolio template).
- Particle, starfield or 3D-globe backgrounds unrelated to the owner's work.
- Identical project cards with stock thumbnails, or fake screenshots and terminals built from divs.
- "Hire me" repeated in the nav, hero and footer with different wording.

## Assets
- Stock or AI-generated images presented as the owner's work or likeness. Placeholder photo services.
- Hand-drawn SVG icons, mixed icon families, emoji used as icons.
