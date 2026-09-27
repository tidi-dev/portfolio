---
name: perf-seo-audit
description: Use when checking the portfolio's load performance, Core Web Vitals, JavaScript size, images, fonts, metadata, social previews, structured data, sitemap or robots, at planned milestones, before release, or after adding a dependency, font or media.
---

# Performance & SEO Audit

## Purpose
Prove the site is fast and discoverable with measured numbers against the budgets in `CLAUDE.md`, not with impressions.

## When to Use
- At the milestones named in the plan, and in the release audit.
- After adding a dependency, font, image set, third-party script or new route.

## Inputs
- The production build and a local server
- Budgets from `CLAUDE.md` and the plan
- `info.md` (to check the Person data)
- The routes list

## Responsibilities
- Measure, compare against the budgets, trace regressions to a likely cause, and report.
- Not in scope: fixing (that goes to `frontend-engineer` through the main session).

## Workflow
1. **Build for production.** Record first-load JavaScript per route from the network-measured budget spec and Lighthouse's resource summary. Next.js 16 no longer prints sizes in the build output.
2. **Lighthouse** on every route, mobile and desktop, median of 3 runs (Lighthouse CI, or `npx lighthouse` with `--preset=desktop` for desktop):
   - performance ≥ 95 on mobile
   - accessibility, best practices and SEO = 100
3. **Lab vitals** on mobile: LCP ≤ 2.5 s, CLS ≤ 0.1 (target 0), TBT ≤ 200 ms (the lab proxy for INP). Name the LCP element for each route.
4. **JavaScript:** first-load JS within the plan's budget. Find the heaviest modules with a bundle analyser or the network log. Flag client code above the fold that could render on the server.
5. **Assets:**
   - the LCP image is prioritised; every image is sized, in a modern format, and lazy below the fold
   - fonts are self-hosted and subset, `display: swap`, at most 2 families, with only critical fonts preloaded
   - no render-blocking third-party scripts and no unused preconnects
6. **SEO, per route:**
   - unique `<title>` (60 characters or fewer) and meta description (160 or fewer); canonical URL; `lang`
   - Open Graph and Twitter tags with a 1200×630 image that renders correctly
   - JSON-LD `Person` and `WebSite` validate, and every Person field matches `info.md`
   - `sitemap.xml` lists every public route; `robots.txt` allows indexing in production and points to the sitemap
   - one `h1`; descriptive link text; content present in the server HTML (`curl` the route)
   - a custom 404 that returns status 404
   - favicon, app icons and `theme-color`
   - no `noindex` in production
7. **Report**, including the environment (machine, throttling preset, browser version).

## Rules
- Measure only on the production build, and report the median of 3 runs.
- **Severity:**
  - Critical: a missing or broken title, OG, sitemap or robots entry, or a performance score below 90
  - Important: any other budget miss
  - Minor: headroom warnings
- Name a likely cause (file or module) for every miss. Don't fix.
- Read-only on source files. Write only under `docs/reviews/`.

## Expected Output
`docs/reviews/<milestone>-perf-seo.md` containing:
- a verdict
- a scores table per route (mobile and desktop)
- vitals and the LCP element
- JavaScript sizes
- a pass/fail line for each SEO checklist item
- findings with severity and likely cause

## Verification / Definition of Done
- Every route is measured on mobile and desktop, as a median of 3.
- Every SEO item is checked, and the JSON-LD has been validated.
- Numbers are compared against the stated budgets, and a verdict is given.
