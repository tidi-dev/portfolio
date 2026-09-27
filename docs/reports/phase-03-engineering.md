# Phase 3 · Content layer: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer` (`frontend-build`, `portfolio-content` C, `verification`)
- **Brief:**
  - Phase 3 of `docs/plan/implementation-plan.md`, with Global Constraints, O4, the Owner deferral and Errata
  - contrib-engineering §3
  - the Phase 3 trace rules and rulings 2–4 (location, structural privacy, QA minor M5)
  - mid-phase: the Phase 2 fix round (QA review FAIL: I1, I2, M1, M2, M5)
- **Status: DONE_WITH_CONCERNS.**
  - Every Phase 3 acceptance criterion is met with evidence, and every fix-round item is fixed with evidence.
  - The full local gate is green, run fresh, on a clean checkout of HEAD.
  - The concerns are `info.md` gaps that later phases hit, plus one trace limit. None blocks Phase 4. See Questions and Missing strings.

## Phase 2 fix round 1

Each item is its own `fix(...)` commit, apart from the Phase 3 commits. After the last one (`144c23b`), a clean detached worktree ran the full gate:
- `pnpm check` → `Tests 251 passed (251)`
- `pnpm build` → `○ /`, `○ /_not-found`, no warnings
- `pnpm test:e2e` → `73 passed (14.9s)`

| Item | Commit | Fix | Evidence |
|---|---|---|---|
| **I1** · token-only lint missed bare-value and static utilities | `7134f73` | <ul><li>QA's ten patterns added to `TOKEN_CLASS_RESTRICTIONS`. Pattern 8 is split in two, for clearer messages (typography; underline widths). Each message names the DESIGN.md lock it protects.</li><li>The comments in `eslint.config.mjs` and `theme-reset.css` now say what the reset does and doesn't remove.</li></ul> | <ul><li>34 new rejection probes, QA's 24 classes plus `rounded-t-full`, `divide-x-4`, `outline-2`, `ring`, `-rotate-3`, `skew-x-6`, `sepia`, `capitalize`, `leading-6`, `min-h-screen`. On the old config: `Tests 34 failed \| 58 passed (92)`. Fixed: `Tests 92 passed (92)`.</li><li>The accepted-class probe now also holds `border border-2 border-0 border-rule rounded-none underline opacity-0 opacity-100 decoration-1 hover:decoration-2 min-h-dvh transition-colors transition-opacity transition-transform`, with 0 false positives.</li></ul> |
| **I2** · stroke tokens made invalid `stroke:` classes; no class for the dash | `fd4a293` | <ul><li>`--stroke-dash` becomes `--dash-construction`, applied by a supplement `@utility dash-construction { stroke-dasharray: var(--dash-construction) }`.</li><li>`--stroke-width-{ink,proof}` are kept, because `stroke-ink` and `stroke-proof` need them.</li><li>Lint bans the two classes that misread them: `stroke-(width-\|dash)`.</li></ul> | <ul><li>New `tailwind-classes.test.ts` compiles every class in Tailwind's class list under the repo theme, using Tailwind's own `compile` and `__unstable__loadDesignSystem`. Every declaration that reads a supplement token must use a property that takes it. The only exceptions are exactly `stroke-width-ink` and `stroke-width-proof`, and the test proves lint rejects both.</li><li>It pins `stroke-ink` → `stroke-width: var(--stroke-width-ink)` (1.5px), `stroke-proof` → `var(--stroke-width-proof)` (2px) and `dash-construction` → `stroke-dasharray: var(--dash-construction)` (`6 4`), read from DESIGN.md's Drawing grammar. `stroke-dash` no longer exists.</li><li>On the old files: `Tests 11 failed \| 114 passed (125)`. Fixed: `Tests 129 passed (129)`.</li><li>`tokens:check` is unchanged.</li></ul> |
| **M1** · the served woff2 dropped the OFL licence records | `2535e87` | <ul><li>`preserveNameIds: [0, 13, 14]` (`LICENCE_NAME_IDS`) for the woff2 and all instances.</li><li>The pipeline refuses output whose records differ from the source's.</li><li>`sfnt.ts` gains a naming-table reader.</li></ul> | <ul><li>New font-coverage tests: before `9 failed`, after `29 passed`.</li><li>fontTools 4.60.1 (scratch venv) reads ID 13 (the SIL OFL 1.1 text) and ID 14 (`http://scripts.sil.org/OFL`) in all 9 files.</li><li>woff2: 94,168 → **94,208 B**.</li><li>`fonts:check` → `the 12 font files match a fresh generation`.</li></ul> |
| **M2** · every static instance was named "Archivo SemiBold" | `a81c4f8` | <ul><li>Each instance's naming table is rewritten with IDs 1, 2, 3, 4, 6, 16 and 17 from its weight and width, e.g. `Archivo SemiCondensed SemiBold` / `Archivo-SemiCondensedSemiBold`, and `Archivo Regular` for 400/100. The subfamily stays "Regular", which matches the `fsSelection` HarfBuzz writes (0xc0).</li><li>`sfnt-write.ts` rebuilds the TTF with valid table checksums and `head.checkSumAdjustment`.</li><li>The manifest records each instance's full name and PostScript name for Satori and the résumé.</li></ul> | <ul><li>New tests: 8 name cases plus the manifest case, 9 failed before and pass after. Each case also verifies every table checksum and the whole-file checksum.</li><li>fontTools parses and round-trips all 9 files with `checkChecksums=2` (raise on mismatch).</li><li>`fonts:check` is deterministic across two runs.</li></ul> |
| **M5** · zero-value classes didn't exist | `144c23b` | `--spacing-0: 0px` in the supplement: a structural zero, not a DESIGN.md step. | <ul><li>4 new checks failed before and pass after: the token value, "declares nothing beyond", the compile check (`min-w-0` → `min-width: var(--spacing-0)`, plus `m-0` and `gap-0`), and the lint accept probe (`min-w-0 min-h-0 m-0 p-0 gap-0 inset-0 top-0 w-0 basis-0 translate-x-0`).</li><li>`leading-0`, which the zero also creates, stays banned with the other `leading-N` classes.</li></ul> |

Deferred to Phase 4 by the coordinator: M3 (a test pinning the focus ring) and M4 (widening the raw-value scan to full G5).

## What was built (Phase 3)

**Content modules** (`src/content/`): one per `info.md` section, each written `as const satisfies ContentInput<typeof Schema>` and parsed at load by `defineContent(name, schema, data)`.
- `defineContent` throws `ContentError: Invalid content in src/content/<name>.ts` plus `z.prettifyError`, so the error carries the file and the Zod path.
- It exports the parsed value, deeply readonly.
- It remembers each export's schema, for the trace.

**Schemas** (`src/content/schema/*`):
- Primitives:
  - `Text`: non-empty, trimmed, NFC, straight quotes (typography is set at render)
  - `YearMonth`; `Period`, with start ≤ end or `"present"`
  - `HttpsUrl`, `LanguageTag`, `Term`
- Every object is strict, and there are no transforms or defaults. The walker enforces both.
- **Structural keys are marked in the schema** (trace rule 2): a Zod registry, `structural`, filled by `structuralId`, `structuralEnum` and `structuralLiteral`.
  - Marked: the section ids, the CTA target, project ids and kinds, body kinds, drawing references and employer project references.
  - Every other leaf is visible and must trace.

**Approved copy:**
- `copy.ts` holds every Approved copy row that is a string or template, verbatim. Keys are camelCased per segment: `not-found.heading` → `copy.notFound.heading`.
- `drawings.ts` holds the drawing rows, as the brief asks:
  - the four step lists (`a11y.steps.*`), as arrays; the `<ol>` numbers them
  - `quest.drawing.carried`
  - `botmivivi.drawing.replaced-label`
  - the owner's labels and captions
- `resume.summary` is the same constant as `hero.sentence`.
- Project modules reference copy values (one-liners, Quest users, the botmivivi window and impact) rather than repeat them.

**Section registry** (`sections.ts`): `quest-journal`, `experience`, `house-rules`, `inventory`, `about`, `afk`, `contact`, in DESIGN.md's order.
- Each entry has its label and a `nav` flag. The nav is Quest journal, Experience, House rules and Contact.
- `present` is derived from the content modules.

**Formatting** (`src/lib/format/`):
- `formatPeriod(period, templates)` fills the approved templates and refuses a wrong placeholder count.
- `formatNumber` is `Intl.NumberFormat("en-US")`.
- `typography` sets curly quotes and `…`, and puts a no-break space inside "~5 min". It is idempotent and keeps the owner's dashes and arrows.

**Facts builder** (`src/lib/content/facts.ts`):
- `projectFacts(project)` builds rows for present fields only, in DESIGN.md's order. botmivivi's figures come out en-US grouped, and Customers and Orders carry the `qualifier` "in the first 2 months".
- `contactFacts(contact)` builds Email (mailto), Telegram and GitHub as links, then Location as plain text.

**Build hook:** `src/app/layout.tsx` reads `lang` from `site.ts`, so `next build` evaluates content (Deviation 1). The server HTML is unchanged (`lang="en"`). No content or Zod reaches the client chunks: a grep of `.next/static/chunks` for `prettifyError`, `Invalid content`, the email and the city finds nothing.

**Trace** (`tests/support/content-trace/`):
- `collectContentLeaves` walks each export with its registered schema and marks leaves structural or visible. An export not made by `defineContent` is reported.
- Matching now falls on whole words (Deviation 2).
- The allowlist gains `https://daiho.dev`, `en` and `vi`, each with its `info.md` source.

## Evidence

### Gate
Run fresh in the working tree (`.next`, tsbuildinfo, `test-results` and `playwright-report` deleted first), then again on a **clean checkout of HEAD `18ca43f`** in a scratch worktree, with identical results. Logs are in the session scratchpad (`gate3/`, `wt-head-*.log`).

| Command | Result line |
|---|---|
| `pnpm install --frozen-lockfile` | `Lockfile is up to date, resolution step is skipped` · `Done in 458ms using pnpm v10.34.5` · 0 warnings |
| `pnpm check` | exit 0. It runs the next six rows |
| ↳ `pnpm design:lint` | `DESIGN.md passes: 0 errors, 0 warnings (0 allowlisted), 1 infos` |
| ↳ `pnpm tokens:check` | `the 3 token files match a fresh generation` |
| ↳ `pnpm fonts:check` | `the 12 font files match a fresh generation` |
| ↳ `pnpm lint` | ESLint: no output · `All matched files use Prettier code style!` |
| ↳ `pnpm typecheck` | `✓ Types generated successfully`, tsc exit 0 |
| ↳ `pnpm test` | `Test Files 13 passed (13)` · `Tests 359 passed (359)` |
| `pnpm build` | `✓ Compiled successfully` · `○ /` · `○ /_not-found` · `○ (Static) prerendered as static content`, no warnings |
| `pnpm test:e2e` | `73 passed (17.9s)` (clean checkout: `73 passed (14.5s)`). The 4 ✘ marks are the harness's expected-failure teardown self-test (`test.fail()`), as in Phases 1–2 |

- **Unit tests by file:** architecture 5, content 75 (new), design-lint 6, facts 7 (new), font-coverage 39 (+20), format 17 (new), lhci-config 6, lint-rules 96 (+38), privacy-scan 42, tailwind-classes 5 (new), tokens-check 4, tokens 27 (+2), traceability 30 (+9).
- **Each commit stands alone:** `pnpm check` on a clean checkout of `0c01288` → `Tests 268 passed (268)`; of `4d870fa` → `Tests 352 passed (352)`.
- **Trace coverage:** `content trace: 12 modules, 13 exports, 280 visible leaves checked, 28 structural leaves exempt`.

### Acceptance criteria (plan, Phase 3)
- ✅ **Tests:** `pnpm test` → `Test Files 13 passed (13)` · `Tests 359 passed (359)`. The content, traceability, format and facts suites all run. There is no privacy test, per the Owner deferral: privacy is checked structurally in `content.test.ts`.
- ✅ **An unsourced string fails traceability (shown):**
  - I set `drawings.botmivivi.labels.balance` to "account balance" and ran `pnpm vitest run tests/unit/traceability.test.ts`:
    - `× every visible string and number leaf in src/content/ traces to info.md or the allowlist`
    - `"path": "drawings.ts:drawings.botmivivi.labels.balance"`, `"value": "account balance"`
    - `Tests 1 failed | 29 passed (30)`, exit 1
  - Reverted (`cmp` against the backup: identical).
  - **Permanent:** "the whole pipeline on a fixture module" imports `tests/fixtures/content-trace/sample.ts`. It reports the invented string with its path, exempts the structural key and flags the export not made by `defineContent`.
- ✅ **Invalid content fails `next build` with a readable Zod path (shown, then reverted):**
  - I set `site.ts` canonical to `http://daiho.dev` and ran `pnpm build`:
    - `Error [ContentError]: Invalid content in src/content/site.ts`
    - `✖ Use an https URL on a real domain`
    - `→ at canonical`
    - then `> Build error occurred`, exit 1
  - Reverted (`cmp` identical); the gate's builds afterwards pass.
  - `content.test.ts` pins the error format for a nested path: `"✖ The period ends before it starts\n  → at period.end"`.
- ✅ **Structural privacy** (rulings 2 and 3), each a `content.test.ts` case:
  - "info.md's opt-ins are the email, Telegram, GitHub and the location": read from info.md's Shown-on-the-site list.
  - "contact.ts has one entry per opt-in, and nothing else": keys `email, telegram, github, location`, equal to the schema's shape.
  - "each entry holds the opted-in value": `tidi.dev1321@gmail.com`, `@tidi1321`, the GitHub URL and "Ho Chi Minh City, Vietnam", each read from info.md.
  - "the Contact schema has no field for a phone number, a second email or a reference": `phone`, `secondEmail` and `reference` each fail with `unrecognized_keys`.
  - "no content schema declares a phone, second-email or reference field": all schema keys; `email` appears once.
  - "the location lives in contact.ts only (ruling 2)": only `contact.location.text` and `.locality`. The label is `copy.contact.locationLabel` = "Location". The Person data can use `locality` and `country`.
  - **Why this matters:** the trace alone can't catch a wrong email, because the corpus contains both addresses. The mutation below proves the structural test does.
- ✅ **Fonts:** font coverage passes on the content modules. `font-coverage.test.ts` → "covers every string in src/content/" passes over all 308 leaves, and the suite is `39 passed`.

### The rulings in the brief
- ✅ **Trace rule 1** (site configuration in the allowlist with its source): tests `https://daiho.dev, sourced from info.md → Site preferences → Domain` and `en, sourced from info.md → Site preferences → Language`. `vi` is added too (Deviation 3).
- ✅ **Trace rule 2** (structural keys marked in the schema): the walker tests, plus 28 structural leaves in the real scan.
- ✅ **Trace rule 3** (everything visible traces): 280 visible leaves, 0 untraced.
- ✅ **Ruling 4 / QA M5** (no vacuous pass): the real-content test asserts that the directory exists, `modules > 0`, visible leaves > 0, and no unregistered exports.

### Mutation checks (do the tests bite?)
The tests were written before the modules, but their first failures were "module not found". So each mutation below was applied to real content, the named tests were run, and the file was restored. A content hash before and after all eight was identical (log: scratchpad `mutations.log`).

| Mutation | Caught by |
|---|---|
| A drawing label becomes "account balance" | traceability: the untraced leaf, with its path |
| `hero.cta` becomes "Bring me your pain point" | C6 `hero.cta`. The trace passes: those words are in info.md's Goals |
| A CyberRock bullet truncated after "to the field" | "each owner quote appears in info.md as a whole quoted string" |
| "Argo CD" dropped from CyberRock's stack | "each list is whole" |
| `contact.email` becomes the second email | "each entry holds the opted-in value". The trace passes: the corpus holds both emails |
| About and AFK swapped in the registry | "lists the sections in DESIGN.md's order" |
| Team removed from CyberRock | facts: "CyberRock: the role as an inline list, then team, scale and stack" |
| A drawing label becomes "en" | **not caught** (Question 4) |

### Screenshots
None. Phase 3 has no UI: the page is still the empty shell. The one change that reaches it is that `lang` now comes from `site.ts`. It still renders `lang="en"`: in the prerendered `index.html`, and in the smoke spec in all 4 projects × 2 themes.

## Map: `info.md` section → module

| `info.md` | Module(s) | Mapped | Not mapped, and why |
|---|---|---|---|
| Identity | `identity.ts` | Brand "TiDi"; name "Dai Ho Trong"; "Hồ Trọng Đại" with `lang: "vi"`; "Daniel"; role; tagline | <ul><li>**Positioning:** it is `copy.hero.sentence` (Approved copy).</li><li>**Location:** it lives in `contact.ts` (O4).</li><li>**Avatar alt:** it is `copy.avatar.caption`.</li><li>**Not used by any planned surface:** "In production since 2020", current field ("Guild") and trait ("Passive"). contrib-engineering §3.2 listed them, but DESIGN.md never shows them.</li><li>**Not content:** `banner.svg` isn't used, and the résumé photo wasn't provided.</li><li>The domain mapping appears as project facts.</li></ul> |
| Goals & audience | `site.ts` | `primaryAction: "contact"` (the CTA target, a structural key); the CTA wording is `copy.hero.cta` | none |
| About | `about.ts`, `house-rules.ts` | Bio (2 paragraphs), sign-off, Leveling up (label and 4 items); house-rules intro (2) and rules (4), in order | The résumé summary: the approved `resume.summary` is the hero line, so the old summary (with "seamless") isn't used |
| Experience | `experience.ts`, `projects.ts` | Sunbytes and NFQ Asia: employer, title, period, project references. Lemonswan and Scania compact sheets: period (Scania has none), one-liner (copy), what was built, stack, the Lemonswan link. Quest: role, team "8 juniors", users (copy), Party lead, short name "Quest" | Résumé-only bullet lists: responsibilities, technologies, Quest's team leadership and key achievements, and CyberRock's résumé project line. No approved surface uses them yet, so the Phase 10 résumé model adds them if the PDF needs them |
| Projects | `projects.ts`, `drawings.ts` | CyberRock, botmivivi and Quest @ NFQ Asia as full sheets: status, period, lede, drawing reference, facts, body (bullets or terms), Party lead, video. All drawing labels, captions and step lists | The "2 active · 1 cleared" counts aren't rendered (derivable). botmivivi's purchase receipts and import/export figures are excluded by the approved compact set |
| Skills & tools | `skills.ts` | The five profile groups, item for item; résumé-only items (lists.scope) | none |
| Education & certifications | `about.ts` | Two degrees (degree, school, years as written), "English: IELTS 6.0, EF SET C1", languages (label from copy) | none |
| Interests | `interests.ts` | The profile AFK list (5 items); résumé-only "Reading" (lists.scope) | "Video games" (résumé): lists.scope names only "Reading" as PDF-only. Travel and photography are declined |
| Contact & links | `contact.ts` | Email, Telegram (handle and URL), GitHub (text and URL), location (text, locality, country; label from copy) | The second email, the phone and the reference have no schema field (structural privacy) |
| Site preferences | `site.ts`, `copy.ts` | Canonical `https://daiho.dev`, `lang: "en"`; the résumé file name is `copy.resume.file` | Theme, analytics, stack, hosting and repository are build decisions, not content |
| Approved copy | `copy.ts`, `drawings.ts` | All 39 rows: 26 verbatim at their `copy.ts` key, 1 alias (`resume.summary` = `hero.sentence`), 8 composed from parts (checked back to the row text), 4 approvals of a depiction, pattern or scope | The four non-string rows each carry a recorded reason in the C6 test. `lists.scope` is implemented by `resumeOnly` and has its own test |
| Open questions, Not included | none | none | Excluded by design; the structure keeps them out |

## Files (Phase 3: 40 files, 2,746 insertions; the fix round: 23 files; and the report)
- **Content:**
  - `src/content/{site,identity,about,house-rules,experience,projects,skills,interests,contact,copy,drawings,sections}.ts`
  - `src/content/schema/{define,primitives,site,sections,identity,about,house-rules,experience,projects,skills,interests,contact,copy,drawings}.ts`
- **Logic:** `src/lib/format/{typography,period,number}.ts`; `src/lib/content/facts.ts`
- **App:** `src/app/layout.tsx` (`lang` from `site.ts`)
- **Tests:**
  - `tests/unit/{content,format,facts}.test.ts` (new); `tests/unit/traceability.test.ts` (extended)
  - `tests/support/info-md.ts`, `tests/support/content-trace/structural.ts` (new); `trace.ts`, `allowlist.json` (changed)
  - `tests/fixtures/content-trace/sample.ts` (new)
- **Fix round:**
  - `eslint.config.mjs`, `src/styles/{theme-reset,theme.supplement}.css`
  - `scripts/fonts/{config,pipeline,sfnt}.ts`, `scripts/fonts/{names,sfnt-write}.ts` (new)
  - regenerated `src/assets/fonts/archivo.{woff2,manifest.json}` and `src/assets/og/*.ttf` (8)
  - `tests/unit/{lint-rules,tokens,font-coverage}.test.ts`, `tests/unit/tailwind-classes.test.ts` and `tests/support/tailwind.ts` (new)

## Commits (local only, no remote)

```text
18ca43f feat(content): build present-only facts-list rows
4d870fa feat(content): mirror info.md in schema-validated content modules
0c01288 feat(format): format periods, en-US numbers and typography
144c23b fix(tokens): add a structural zero so min-w-0 and the other zero classes exist
a81c4f8 fix(fonts): name each static instance for its weight and width
2535e87 fix(fonts): keep the OFL copyright and licence records in every font file
fd4a293 fix(tokens): give the construction dash a real utility and ban the stroke traps
7134f73 fix(lint): ban the bare-value utilities that break DESIGN.md
```

This report is committed on top. The main session's uncommitted `docs/progress.md` and QA's `docs/reviews/phase-02-code-review.md` were left alone. No git config was changed. The scratch worktree was removed.

## Deviations (each with its reason)
1. **`layout.tsx` reads `lang` from `site.ts`.**
   - Without an import from the app, `next build` never evaluates content, so "invalid content fails next build" couldn't be shown in a phase with no UI.
   - `lang` is site configuration that the content model owns (contrib-engineering §3.2), and the rendered HTML is unchanged.
   - **Consequence:** in Phase 3, the build evaluates `site.ts` only. Every other module joins the build graph when Phase 4+ imports it. Until then, `pnpm check` validates all 12.
2. **The trace matches whole words,** stricter than §5.2's plain substring. A short token like "en" or "vi" no longer traces through "English" or "services", so the two `lang` allowlist entries are necessary rather than decorative. Punctuation edges match as written. No existing case changed.
3. **`vi` is allowlisted.** The ruling names only `en`, but "vi" is the same kind of value: the `lang` of "Hồ Trọng Đại" (plan → Global Constraints). QA reviews new entries.
4. **`lib/format/file-size.ts` isn't built.** contrib-engineering's file map lists it for E3, but the plan's Phase 3 task and the brief don't, and its only user is Phase 10's Résumé size hint. YAGNI.
5. **`contactFacts` is added** beside `projectFacts`: DESIGN.md says Contact reuses the facts list. The Résumé row joins in Phase 10.
6. **Some facts are left unmapped:** trait, current field, "since 2020", the old résumé summary, and the résumé-only bullet lists. No planned surface uses them. contrib-engineering §3.2 predates the approvals; see the map.
7. **Content checks go beyond the fragment trace.** Owner quotes must appear whole, lists whole, periods as written, and approved rows exact. The trace alone passes truncations and approved-wording edits (see the mutations).
8. **Quest's Team is "8 juniors"**, the owner's answer.md words, rather than info.md's paraphrase "8 juniors led". Both trace.
9. **Fix round, I1:** QA's pattern 8 is split into two entries, so each gets its own message. The matches are identical.
10. **Fix round, M2:** the subfamily is "Regular" for every instance, with the weight in the family name (non-RIBBI naming), because HarfBuzz leaves `fsSelection` REGULAR. IDs 16 and 17 carry "Archivo" and the width and weight.

## Questions for the main session
1. **The "Inventory" label isn't recorded in `info.md`.**
   - It is the owner's profile heading, and DESIGN.md and directions call it "the owner's".
   - In `info.md` it traces only by coincidence, through botmivivi's "customer debt, inventory".
   - Record it (for example on Skills & tools: `Inventory` as the owner's section name) before Phase 9 renders the h2.
2. **The house rules' bold first phrases.** DESIGN.md renders each rule's first phrase in weight 700, "as in the owner's profile". `info.md` stores the rules as plain text, and the bold split exists only in `profile.md`. Record the four phrases in `info.md` before Phase 9. I didn't take them from `profile.md`.
3. **Quest @ NFQ Asia has no Stack list in `info.md`.**
   - contrib-design §1.4 lists a Stack slot, but info.md → Projects → Quest has none. The résumé technologies are sentences ("v2: NestJS with Prisma.").
   - The sheet omits the row for now: an absent field renders nothing.
   - The owner can supply a list, or approve using a technologies line, before Phase 7.
4. **The allowlist matches by value.**
   - "en" is allowlisted as the `lang` value, so a visible label changed to "en" still passes (the mutation above).
   - Options:
     - scope allowlist entries to content paths (a change to §5.4's format, so QA's call)
     - treat `lang` fields as structural keys instead of allowlisting them (a change to the ruling)
5. **The About bio repeats the hero sentence.** Bio paragraph 1 holds the approved hero sentence verbatim, so Phase 9 renders it twice. This is `design-lead`'s or the owner's call.
6. **botmivivi's qualifier.** "in the first 2 months" qualifies both customers and orders. The rows carry it as data; how the facts list shows it (once, after Orders) is a Phase 7 design detail.

## Missing strings (later phases; nothing was invented)

| Phase | String | State |
|---|---|---|
| 7 | Quest's Stack list | Not in `info.md` (Question 3) |
| 9 | The house rules' bold first phrases | The split isn't in `info.md` (Question 2) |
| 9 | "Inventory" as the section label | Present only by coincidence (Question 1) |
| 10 | Résumé section headings and any connecting words | Only the summary, file name and title are approved. Section names can reuse `info.md`'s headings ("Experience", "Projects", "Skills & tools", "Education & certifications", "Languages", "Interests"). Anything else needs approval |
| 11 | The 404 page's document `<title>` | Not approved; `not-found.heading` "Nothing here" could serve, if ruled |

## Ideas (not built)
- **Scope allowlist entries to content paths** (Question 4). That closes the value-based gap without weakening the rendered-HTML checks.
- **Pin the Contact row order** (Email, Telegram, GitHub, Résumé, Location) in the Phase 9 or 10 e2e, where the Résumé row lands.
