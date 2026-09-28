# Font options: RPG type for the Holo Deck

- **Owner request (2026-09-28):** "can we change the font? make it like rpg game style"
- **Author:** design-lead (`design-direction`, `design-system`). **Status:** proposal. `DESIGN.md` is unchanged until the owner chooses.
- **Preview:** `docs/design/font-options.html` shows every option in Deck and Lab. Add `?opt=a|b|c|base&theme=dark|light` to show a single board.
- **Screenshots:** `docs/design/font-options/<opt>-<1440|375>-<dark|light>.png`, 16 files.

## Summary

| | A · Cartridge | B · Guild hall | C · Arcade HUD | Baseline |
|---|---|---|---|---|
| Flavour | Retro pixel, 16-bit JRPG menu | Fantasy RPG, carved quest-log titles | Modern sci-fi game HUD | Current |
| Game family | **Galmuri11** 2.403 (Regular only) | **Spectral SC** 2.005 (600, 700, 800) | **Science Gothic** 1.035 (variable) | Chakra Petch 1.000 |
| Body family | Mona Sans (Portfolio Sans), unchanged | same | same | same |
| Vietnamese (134 letters) | 134/134 | 134/134 | 134/134 | 134/134 |
| "→" "·" é, curly quotes, "…", dashes | all present | all present | all present | all present |
| Licence | OFL-1.1; RFN "Galmuri" (rename any subset) | OFL-1.1, no RFN | OFL-1.1, no RFN | OFL-1.1 |
| Self-hosted size (latin, vi, arrows) | 9 KB, 1 file | 31 to 32 KB × 3 weights | 87 KB, 1 instanced file | 11 KB × 2 |
| Change from today | Strong | Strong (tone shifts toward fantasy) | Moderate | none |

**My recommendation is A · Cartridge** (reasons at the end). C is the fallback if the owner wants to stay closest to the current sci-fi deck.

## How each family was verified
1. **Subsets:** Google Fonts metadata (`fonts.google.com/metadata/fonts`, pulled 2026-09-28) was used to screen about 200 families for the `vietnamese` subset.
2. **Coverage from the font files.** Each family's source TTF was taken from `github.com/google/fonts` (`ofl/<family>/`, with `METADATA.pb` and `OFL.txt`); Galmuri came from its npm package. fontTools 4.60.1 read each cmap against three sets:
   - all 134 precomposed Vietnamese letters (12 vowels × 5 tones in both cases, plus ă â đ ê ô ơ ư)
   - the site's character set, extracted from the strings in `src/`: printable ASCII plus `· é – — ‘ ’ “ ” … →`
   - the test strings "Hồ Trọng Đại", "Đà Nẵng" and "ố ự ẫ ị"
3. **Rendered fallback check.** On every board, Chrome DevTools `CSS.getPlatformFontsForNode` lists the font that actually drew each text node. Result: **0 glyphs from any fallback font** in all 8 option × theme boards (game roles drawn only by the game family, body roles only by Mona Sans). This catches silent fallback, which a cmap check alone cannot.
4. **Layout check.** Page-level horizontal overflow, plus per-element clipping of the stat cells, at 1440 and 375 px: 0 in all 16 captures.

**Trap found.** The Google Fonts CSS API serves unicode-range subsets that leave out U+2192, so through the API every family, including Chakra Petch and Mona Sans, appears to lack "→". Two candidates (Philosopher, Grenze) showed an arrow in my first screening sheet that turned out to be a system fallback glyph. So the preview loads the complete source files from google/fonts through jsDelivr, not the CSS API. The site's own `pnpm fonts` pipeline already subsets from google/fonts with an `arrows` range, so it is not affected.

---

## A · Cartridge: Galmuri11 + Mona Sans (recommended)

**Roles.** Galmuri11 takes the wordmark, the brand "TiDi", section and quest headings, panel headings, HUD readouts, labels, stat values, role line, buttons, nav and the speaker tag. Mona Sans keeps body text, the names "Hồ Trọng Đại" and "Dai Ho Trong", facts, slots and captions.

**Why it reads as RPG.** It is a proportional bitmap face in the tradition of 16-bit console menus. With it, "▸ PLAYER 1", "Press A to continue", "Quest journal" and "progress saved" read as a game UI at first glance, before the reader parses a word. That is the owner's own vocabulary (banner and profile) finally set in the type it evokes. Pairing a pixel face with a live 3D hologram gives a "retro UI on modern hardware" contrast, and the clean Mona Sans body keeps it from becoming a novelty site.

**Evidence**
- Source: `npm galmuri@2.40.3` (OFL-1.1, repository `quiple/galmuri`, https://galmuri.quiple.dev). File `dist/Galmuri11.ttf`, name table "Version 2.403", © 2019–2025 Lee Minseo.
- Vietnamese 134/134. The site set and the test strings are complete, with no fallback when rendered.
- **Only the Regular weight qualifies.** `Galmuri11-Bold` covers 32/134 Vietnamese letters and `Galmuri14` covers 40/134, so both are rejected. Galmuri9 (134/134) is a possible smaller companion, but is not proposed.
- **RFN.** `galmuri.css` declares 'Reserved Font Name "Galmuri"' (neither `ofl.md` nor the name table repeats it; I read it conservatively). A subset is a Modified Version, so it ships renamed (for example "Portfolio Pixel"), exactly as Mona Sans became Portfolio Sans. Subset size: 9 KB woff2 (the full file is 504 KB, because of Hangul).
- Not on google/fonts, so the fonts pipeline needs a second source (the npm tarball, with its hash). `frontend-engineer` verifies and installs.

**Readability risks and mitigations**
- **One weight.** Hierarchy comes from size and colour only. The Regular stroke is 1 pixel unit (8 px at 96 px), so the brand gets a hard one-unit offset shadow (`0.0833em 0.0833em 0`, `holo` 35 % in Deck, 20 % in Lab), the classic sprite drop shadow. This replaces the soft 32 px glow. It is decorative; the text contrast is unchanged. `font-synthesis: none`, so no faux bold.
- **The pixel grid.** 1200 upm at 100 units per pixel gives a 12 px grid, and sizes stay on multiples of 12 to keep edges crisp. That means stepped sizes at breakpoints instead of fluid `clamp()`.
- **Small UI text.** Buttons, nav and labels are 12 px, which reads well in the screenshots at 1× and 2×. If the owner finds the CTA small, 24 px is the next crisp step; it fits a 48 px button but is heavy next to the 17 px hero sentence.
- **Long text stays out.** The pixel face never sets paragraphs, facts or the names, so 16 px body reading is untouched.
- **Vietnamese stacking.** Diacritics sit tall, so headings use a line height of at least 1.3.

**`DESIGN.md` changes if chosen**

| Token | Today | A |
|---|---|---|
| `display` | Chakra 700, `clamp(3.5rem, 7vw, 6.5rem)`, lh 0.9, −0.01em | Galmuri 400, 60 px, 96 px from `lg`, lh 1.05, 0; hard pixel shadow |
| `heading-section` | 700, clamp 2 → 2.75rem, lh 1.1 | 400, 36 px, 48 px from `md`, lh 1.3 |
| `heading-quest` | 700, 1.5 → 1.75rem | 400, 24 px, lh 1.3 |
| `heading-panel` | 700, 0.8125rem, 0.18em, uppercase | 400, 12 px, 1 px (0.0833em), uppercase |
| `label` | 600, 0.75rem, 0.12em, uppercase | 400, 12 px, 1 px, uppercase |
| `stat-value` | 700, 1.75 → 2rem, proportional | 400, 24 px, 36 px from `md`, `tnum` (Galmuri has it) |
| `wordmark` | 700, 1.25rem | 400, 24 px |
| `role` | 600, 0.9375rem, 0.06em, uppercase | 400, 12 px, 1 px, uppercase |
| `button` | 700, 0.9375rem, 0.04em | 400, 12 px, 1 px |
| `nav`, `speaker-tag` | 600, 0.875rem, 0.02em | 400, 12 px, 1 px; the menu sheet keeps `heading-quest` (24 px) |
| Body tokens | Mona Sans | unchanged |

Also:
- Lock 5 becomes "Galmuri11, renamed (HUD, display, controls) + Mona Sans (reading)".
- New principle: pixel sizes are multiples of 12 px, with no fluid type on pixel roles.
- Uppercase stays limited to the owner's labels (unchanged). Names never uppercase (unchanged).
- Typography table: source, licence, RFN and the reason.
- Known Gaps: one weight.
- Changelog entry.
- Colours are unchanged, so all 52 contrast pairs stand.

---

## B · Guild hall: Spectral SC + Mona Sans

**Roles.** Spectral SC takes the brand, headings, panel headings, labels, stats, role, buttons, nav and the wordmark. Mona Sans keeps the body and names, and in this option also the **project titles** (see risks).

**Why it reads as RPG.** Sharp, wedge-serif small caps are the carved-title language of fantasy RPG menus (quest logs, item names, "Join party"). Spectral was drawn by Production Type for screens (Google Docs), so it stays crisp and modern on glass panels, with no parchment. It is the cleanest route to "fantasy" that passes Vietnamese; Cinzel, the obvious fantasy choice, fails it (below).

**Evidence**
- Source: google/fonts `ofl/spectralsc/` (upstream https://github.com/productiontype/Spectral), "Version 2.005", OFL-1.1, © 2017 The Spectral Project Authors, **no RFN**. Also on npm as `@fontsource/spectral-sc` 5.3.0 (OFL-1.1).
- Vietnamese 134/134. The site set and the test strings are complete, with no fallback when rendered.
- Features include `lnum`, `tnum` and `smcp`. Subset: about 32 KB per weight, and 3 weights are needed.

**Readability risks and mitigations**
- **Old-style figures by default.** The "1" in "PLAYER 1" reads as "I". Fix: `lining-nums` on every game role, plus `tabular-nums` on stats. (Caught in my first screenshot and fixed in the preview.)
- **Small caps erase lowercase names.** "botmivivi" rendered as BOTMIVIVI, which breaks the rule "names never take an uppercase style". Fix: project and employer titles use Mona Sans 600, `wdth` 112 (a new `heading-name` token). "TiDi" keeps its shape, because T and D stay full caps and the i's become small caps, but it is still a small-cap style on a name. **The owner must accept that, or the brand moves to Mona Sans and loses most of the flavour.**
- **Every heading renders as caps.** The DOM keeps sentence case (accessibility and voice are unchanged), but word shapes flatten; this is fine for 1 to 3 word headings.
- **Tone.** Serif fantasy against a sci-fi hologram and chip handshake moves the Holo Deck concept from "sci-fi command deck" toward "fantasy guild". It is the biggest conceptual shift of the three.

**`DESIGN.md` changes if chosen**
- `display` 800, lh 0.95, +0.01em
- `heading-section` 700, lh 1.15, +0.02em
- `heading-quest` 700, +0.02em, for non-name titles only
- new `heading-name`: Mona Sans 600, wdth 112, 1.5 → 1.75rem
- `heading-panel` 700, 0.14em, uppercase
- `label` 700, 0.12em, uppercase
- `stat-value` 800, `lnum` + `tnum`
- `role` 600, 1rem, 0.08em, no transform (the small caps carry it)
- `button` 700, 1rem, 0.04em
- `nav` 600, 0.9375rem, 0.03em
- a `fontFeature: lnum` note on every game token (export drops `fontFeature`: Known Gap 1)
- lock 5, the Typography table, the names principle and the changelog

---

## C · Arcade HUD: Science Gothic + Mona Sans

**Roles.** The same split as today: Science Gothic replaces Chakra Petch everywhere Chakra is used.

**Why it reads as RPG.** Extended, squared capitals in the tradition of spaceship and racing-game HUDs. Chakra Petch reads "tech"; Science Gothic at `wdth` 112 to 120 reads "game title". It keeps the Holo Deck's sci-fi concept intact, so it is the smallest conceptual change.

**Evidence**
- Source: google/fonts `ofl/sciencegothic/` (upstream https://github.com/googlefonts/science-gothic), "Version 1.035", OFL-1.1, © 2024 Font Detective LLC, **no RFN**. Added to Google Fonts 2025-08-07. Also on npm as `@fontsource-variable/science-gothic` 5.3.0.
- Vietnamese 134/134. The site set and the test strings are complete, with no fallback when rendered.
- Axes are CTRS 0–85, slnt −10–0, wdth 50–200 and wght 100–900; features include `tnum`. The full file is 2.7 MB. Instanced (CTRS 0, slnt 0, wdth 75–120, wght 600–900) and subset, it is **87 KB**, which I measured.

**Readability risks and mitigations**
- **Width on mobile.** At 375 px, "Customers" and "2,951" overflowed their stat cells. Fix: below `md`, labels and panel headings go to `wdth` 85 with 0.05em tracking, and stats to 1.5rem at `wdth` 75. Section headings use `wdth` 100 below `md` and 112 from `md`.
- **Tight word space** between "Quest" and "journal" at heavy weights. It is acceptable, but more visible than in the other options.
- **Width is a variation axis.** Width values must be mapped by hand (`font-stretch`), because export drops `fontVariation` (Known Gap 1). That means more per-token values than today.

**`DESIGN.md` changes if chosen**
- `display` 900, wdth 120, lh 0.95, 0
- `heading-section` 800, wdth 100 → 112 (`md`), clamp 1.75 → 2.5rem, lh 1.15
- `heading-quest` 700, wdth 100, 1.375 → 1.5rem, lh 1.2
- `heading-panel` 700, wdth 112 (85 below `md`), 0.14em
- `label` 700, wdth 112 (85 below `md`), 0.1em
- `stat-value` 800, wdth 112, `tnum` (below `md`: 1.5rem, wdth 75)
- `wordmark` 900, wdth 120
- `role` 700, wdth 112, 0.06em
- `button` 700, wdth 100, 0.02em
- `nav` 600, wdth 100
- CTRS pinned at 0; lock 5, the Typography table and the changelog

---

## Baseline: Chakra Petch + Mona Sans
Shown last in the preview. It passes every check, but the owner has asked for something that looks more like a game.

## Rejected candidates

| Candidate | Reason |
|---|---|
| Cinzel, Cinzel Decorative, Marcellus (and SC), MedievalSharp, Uncial Antiqua, Almendra (and SC), Pirata One, Metamorphous, Fondamento, Eagle Lake, New Rocker, Macondo, Forum, Aboreto, Faculty Glyphic | No Vietnamese subset (GF metadata). The Cinzel file covers 38/134 Vietnamese letters |
| Press Start 2P, Pixelify Sans, Silkscreen, Jersey 10/15/20/25, Tiny5, Micro 5, DotGothic16, Doto, Sixtyfour, Workbench, Bytesized, Jacquard 12/24, Jacquarda Bastarda 9, Bitcount (all) | No Vietnamese subset |
| Orbitron, Audiowide, Oxanium, Rajdhani, Russo One, Michroma, Quantico, Aldrich, Share Tech, Teko, Zen Dots, Tomorrow, Bruno Ace, Turret Road, Electrolize, Anta | No Vietnamese subset |
| Galmuri11 Bold, Galmuri14 | Files cover 32/134 and 40/134 Vietnamese letters |
| Caudex | 114/134: no ơ or ư with tones (fails "ự") |
| VT323, Goldman, Genos, Exo 2, Grenze Gotisch, Grenze, Texturina, Gideon Roman, Luxurious Roman, Kings, Fruktur, Philosopher, Yeseva One, Vollkorn SC | No U+2192 "→" in the file (Vollkorn SC also lacks `^` and `|`). VT323 is also terminal chrome, which `DESIGN.md` bans |
| Jaro | Passes coverage, but the rendered tone marks are ambiguous: "ố" reads as "ó" and "ẫ" as "ả" |
| Handjet | Passes coverage, but at pixel settings "Đ" reads as "B" ("Bà Nẵng"). It is a condensed LED style, not JRPG |
| Tektur | Passes everything, but its uppercase Y reads as V in all six stylistic sets, so the owner's HUD line becomes "XP · SVSTEM DESIGN" at 12 px. Runner-up for C |
| Alegreya SC, Bona Nova SC, Cormorant SC, Cormorant Unicase, Ysabeau SC | Pass. Runners-up for B: Cormorant's hairlines break up at 12 px on Deck; Alegreya is more bookish and calligraphic; Bona Nova is more ornate |
| Hubot Sans, Saira Stencil, Asimovian, Bungee | Pass, not chosen. Hubot isn't clearly more "game" than Chakra; Asimovian's quirky y and g hurt labels; Bungee is caps-only and would uppercase names; Saira Stencil reads as motorsport |

## Recommendation
**A · Cartridge (Galmuri11 + Mona Sans).**
- The owner asked for "rpg game style" after rejecting v1 as boring and not eye-catching. A pixel face is the one choice a visitor reads as "game" instantly, and it matches the console language the owner already writes in ("▸ PLAYER 1", "Press A to continue", "progress saved", "Join party").
- It keeps what the build got right: the colours, the chamfered panels, the hologram, and a comfortable Mona Sans body at 16 px, where the pixel face never goes.
- It is also the lightest file (9 KB).
- Costs, stated plainly:
  - one weight, so hierarchy comes from size and colour, plus the sprite shadow on the brand
  - stepped rather than fluid sizes
  - a renamed subset from a non-Google source
- **C** is the safe alternative if the owner wants the current sci-fi deck to stay primary, with a clearly gamier headline face.
- **B** is the right answer only if the owner wants the site to feel like fantasy rather than sci-fi.

## Needs the owner's decision
1. Choose A, B, C, or keep Chakra Petch. This is a material change to `DESIGN.md` lock 5.
2. If A: are the 12 px buttons and nav acceptable, or should the CTA use 24 px?
3. If B: accept "TiDi" in small caps, or move the brand to Mona Sans?

## For the main session (not owner decisions)
- **Possible layout bug in the current build at 320 px.** In the preview, which mirrors the site's `stat-grid` (3 columns, 12 px gap, 16 px panel padding), the "Customers" label is 83.6 px wide in today's Chakra Petch against a 77.3 px column at 320 px. It fits at 375 px. Please ask `qa-reviewer` to check the real botmivivi readout at 320 px, because the site's container padding may differ from the preview's.
- Whichever option is chosen, `frontend-engineer` adds the family to `pnpm fonts` with the arrows range and runs the manifest coverage check. For A, the source is the npm tarball and the subset is renamed.
