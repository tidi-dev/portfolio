---
name: portfolio-content
description: Use when gathering or confirming the owner's personal information, creating or editing info.md, writing or changing any visible copy about the owner (headlines, bio, project summaries, alt text, meta descriptions), turning info.md into site content files, or checking that rendered content is truthful and traceable to info.md.
---

# Portfolio Content

## Purpose
Keep every fact on the site true, confirmed by the owner, and traceable to `info.md`. Keep the words clear enough to do their job.

## When to Use
- Discovery interview, or any time needed content is missing from `info.md`.
- Drafting or editing visible copy about the owner.
- Creating or updating content files derived from `info.md`.
- Verifying a build before a phase review or a release.

## Inputs
- `info.md` (source of truth; structure in [references/info-md-template.md](references/info-md-template.md)).
- The owner's answers (main session only).
- `DESIGN.md` voice notes and the plan's content model, when they exist.

## Responsibilities
- Uphold the invariant: **no personal fact without a confirmed `info.md` entry.**
- Ask, record, read back, confirm. Draft copy only from confirmed facts.
- Surface gaps; never fill them.

## Workflow

### A. Discover (main session only, because it needs the owner)
1. Read `info.md` and the template. List the fields the agreed sections need and mark the gaps.
2. Ask by topic: one topic per message, at most 4 questions. Use multiple choice for preferences and open questions for facts. Offer the shortcut: "paste a CV, LinkedIn text or bio and I'll extract it for you to confirm."
3. Record answers in the owner's words under the matching heading. Pending items go under **Open questions**; declined or not applicable items go under **Not included**.
4. Read back a short summary of what changed. The owner confirms or corrects, then update "Last confirmed".

### B. Draft copy
1. List the confirmed facts the string may use.
2. Write 2–3 options for high-visibility strings (hero line, intro, about); one option for routine strings.
3. Apply the voice rules. Every claim maps to a listed fact: no new superlatives, metrics or adjectives-as-claims.
4. The main session presents the options. Approved wording is saved to `info.md` → **Approved copy**, with the date.

### C. Map to site content
1. Content files (location set by the plan) mirror `info.md`: same facts, and approved copy verbatim.
2. A schema validates them at build time; required fields fail the build when missing.
3. An optional field absent from `info.md` means the element is not rendered. No placeholder.

### D. Verify
1. Collect the visible text from the production build, plus alt text, `<title>`, meta and OG tags, and JSON-LD.
2. For each personal fact (name, titles, employers, dates, numbers, links, claims), find its `info.md` entry. Anything unmatched is a finding.
3. Scan for placeholders: `lorem`, `TODO`, `TBD`, `Your Name`, `example.com`, `href="#"`, invented metrics.
4. Check links: external links return 2xx or 3xx; `mailto:` and `tel:` are well formed and opted in.
5. Check voice: em or en dashes in UI copy we wrote, Title Case headings, filler words, more than one label for the same intent.

## Rules
- `info.md` is the only source of personal information. Reference portfolios (for example https://tiendinh.dev/) are never a source of facts, copy, images or structure-with-content.
- Never invent, embellish, estimate or round up: numbers, dates, titles, employers, skills, testimonials, awards, availability.
- Missing: ask (main session) or omit. Placeholder text never ships.
- New wording about the owner ships only after the owner approves it.
- **Voice:**
  - first person for self-description; sentence case for headings and buttons
  - active voice and concrete verbs; numerals for counts; `…` and curly quotes
  - no filler ("passionate", "seamless", "cutting-edge", "elevate", "leverage")
  - one label per intent site-wide
  - no em or en dashes in UI copy we write (the owner's own approved wording is kept as given)
- Images: only owner-provided assets the owner has rights to. Alt text describes what the image shows.
- Contact details, location and availability are shown only if the owner opted in.

## Expected Output
- **A:** updated `info.md` and a changelog summary in chat, plus the remaining gaps.
- **B:** copy options, each with its fact mapping; approved text saved.
- **C:** content files that match `info.md`, and a passing schema check.
- **D:** a findings list, one per line: `location — string — issue — info.md reference or "no source"`.

## Verification / Definition of Done
- **D** finds zero unmatched facts, zero placeholders and zero broken links.
- Every approved string in the build matches **Approved copy** verbatim.
- The owner confirmed the latest `info.md` summary, and the date is recorded.
