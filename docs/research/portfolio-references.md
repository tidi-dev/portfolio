# Portfolio reference study

`design-direction` step 1. **Patterns only:** no names, facts, copy or assets from references are recorded or reused. Captured 2026-09-27 by the main session.

## Reference: https://tiendinh.dev/ (supplied by the owner as inspiration)

**Method**
- The HTML and CSS were fetched and inspected: tokens, fonts, breakpoints, motion, landmarks, metadata, JSON-LD.
- Two desktop screenshots were taken.
- **Not visually verified:**
  - Sections below the projects rendered blank in capture, because content is hidden until scroll-reveal runs.
  - Mobile layout, because window resizing was ignored. It was inferred from CSS breakpoints: 640, 860, 900, 1024 and 1220 px.

### Snapshot
| Aspect | Observation |
|---|---|
| Stack | Next.js App Router. Fonts via `next/font` (self-hosted). Generated `opengraph-image` route. 11 JS chunks, ≈ 237 KB decompressed. |
| Information architecture | One long page with 13 sections:<br>• intro, stack strip, about, expertise, code samples<br>• featured projects, system architecture, two domain deep-dives<br>• process, experience timeline, principles, contact<br>Navigation is a section nav plus a ⌘K command palette. |
| Theme | Dark only. Near-black background (`#0a0c12`), three panel tints, borders as white at 6–14% opacity, a five-step grey text ramp. |
| Colour | Emerald accent (`#34d399`) with lighter tints, cyan secondary, and macOS window-dot colours for window chrome. |
| Type | Geometric sans (Sora) for display and body. IBM Plex Mono used heavily (≈ 44 rules) for labels, chips, stats and terminal blocks. |
| Shape | Five radii (8–20 px) plus pill. |
| Layout | 1200 px container, 20/32 px gutters, 72/110 px section gap.<br>Split hero: text on the left, an animated system diagram on the right.<br>Below the hero: a stats strip and a tech marquee. |
| Motion | ≈ 14 keyframe animations: aurora, blob drift, pulses, shimmer, marquee, and a rotating accent word with a typing cursor.<br>Scroll-driven timeline (`animation-timeline: view()` inside `@supports`) and reveal-on-scroll.<br>A global reduced-motion rule and a visible "Pause animations" control. |
| Accessibility | An `aria-label` on every section, one `h1` (11 `h2`, 30 `h3`), skip link, `forced-colors` styles, labelled icon buttons, form fields with `autocomplete`. |
| SEO | Description, OG and Twitter (`summary_large_image`), generated OG image, `theme-color`.<br>JSON-LD: `Person`, `ProfilePage`, `WebSite`, and `CreativeWork` per project.<br>`robots.txt` and `sitemap.xml` present. |

**Implied dials:** VARIANCE ≈ 5 (conventional split hero and card sections), MOTION ≈ 8 (ambient, scroll and interaction), DENSITY ≈ 6 (many sections and labels).

### Worth adopting (as patterns, adapted to our owner)
1. **Subject-grounded hero visual.** The visual expresses the owner's actual domain instead of generic decoration: a strong case of "ground the design in the subject".
2. **Case-study project entries:** problem, then solution, then outcomes in a compact side column, with tags and a source link.
3. **Structured data depth:** `ProfilePage`, `Person`, `WebSite`, and `CreativeWork` per project, plus a generated OG image.
4. **Motion accessibility:**
   - a visible pause control
   - a global reduced-motion rule that forces reveal elements visible
   - scroll-driven animation as progressive enhancement
5. **Token discipline:** named variables for colour, duration, easing, radius and z-index layers (nav, palette, toast, hints).
6. **Robustness:** `forced-colors` support, labelled sections, a contact form with correct `autocomplete`, and an obfuscated email address.
7. **Command palette navigation.** Worth it only if our site has enough destinations to justify it.

### Worth avoiding or rethinking (checked against `generic-patterns.md`)
This reflects our rules, not a quality verdict: the reference is carefully built.
1. **Near-black background, one emerald accent, heavy mono labels.** These are calibration clusters 2 and 5, the "dark tech" developer default.
2. **Rotating accent word with a typing cursor** in the headline: single-word accent plus the typewriter cliché.
3. **Numbered mono eyebrows** ("01 · About") on sections that are not a sequence.
4. **Stats strip of operational metrics** used as decoration. For us, numbers appear only if they are in `info.md` and matter to the audience.
5. **Window-dot or terminal chrome** as a content container, and a tech-logo marquee as the stack section.
6. **Perpetual motion** (pulses, shimmer, aurora, blob drift) on static content.
7. **Thirteen sections on one page:** a long scroll, repeated layout families, and deep-dives that dilute the first impression for a time-poor reader.
8. **Dark-only theme,** and content hidden until reveal runs, so it is blank when observers or JavaScript fail and in screenshot tools.
9. **Five radii plus pill** with no evident rule. This breaks a single shape system.

## Archetypes for direction work
General developer-portfolio patterns, used as shared vocabulary in `design-direction`. These are not claims about specific sites.

| Archetype | Shape | Best when | Needs |
|---|---|---|---|
| Editorial single column | Type-led, generous whitespace, text-first work list | The owner writes well; few visual assets | Strong typography, good copy |
| Split sticky | Fixed identity/nav column with a scrolling content column | Recruiter audience; experience-heavy | Clear hierarchy, compact entries |
| Case-study led | Fewer, deeper project stories with media | Three or more projects with screenshots and outcomes | Real media and outcomes |
| Systems / diagram led | The owner's domain drawn as an interactive diagram | Backend, infra or data work that is hard to screenshot | Restraint; the diagram must carry real information |
| Index / list driven | Dense, scannable lists of work, writing and links | Breadth of work; long-lived and low-maintenance | Rigorous type scale and alignment |
| Signature interaction | One memorable interactive moment, calm elsewhere | Designer-leaning or creative developers | A reduced-motion fallback that still makes sense |

## Takeaways for the interview
- **Audience and goal:** recruiters, clients or peers, and job search, freelance or presence. This decides density and the call to action.
- **Assets:** how many projects have real screenshots, repos or outcomes. This decides case-study-led vs index vs diagram-led.
- **Theme strategy:** dark only, or system preference with a toggle.
- **Metrics:** any real, verifiable numbers the owner wants shown.
- **Features:** writing or blog, résumé download, contact form vs `mailto`, command palette.
