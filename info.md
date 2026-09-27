# Owner information

> Source of truth for who the owner is. Only facts the owner explicitly provided or confirmed.
> Sources, all provided by the owner on 2026-09-27: `profile.md`, `DaiHo Resume.pdf`, `answer.md`, and the in-chat choices. Quotes are the owner's own words.
> Last confirmed: **2026-09-27**. The owner answered the final questions without corrections, which was treated as confirmation. Any correction the owner raises overrides this.

## Identity
- Name (résumé): Dai Ho Trong
- Also known as (profile): "I'm Dai — Daniel in English, TiDi around here."
- Name display (owner, answer.md): "both, "Daniel" appear, want the Vietnamese spelling with diacritics"
  - TiDi as the brand, with the full name beside it.
  - "Daniel" appears.
  - The Vietnamese spelling with diacritics appears: **Hồ Trọng Đại** (owner's choice, 2026-09-27, Vietnamese order with the family name first).
- Role / title (owner, answer.md): **Full-stack Developer**
- Positioning (profile): "Officially a full-stack developer, though I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable."
- Tagline (profile banner): "still learning, always solving."
- Location: Ho Chi Minh City, Vietnam
- In production since: 2020
- Domains (profile), mapped by the owner in answer.md:
  - Dating app: Lemonswan
  - E-commerce: Scania (trucks, for a German company)
  - HRMS: part of Quest
  - Cybersecurity: CyberRock
- Current field (profile, "Guild"): Cyber security for IoT (EU)
- Trait (profile, "Passive"): "Can't leave a pain point alone"

### Visual assets (in this repo, provided by the owner)
- **`ava.PNG`**: illustrated avatar, 1086×1448 PNG (3.1 MB, to be optimised).
  - Profile alt text: "Illustrated avatar of TiDi coding, gaming, playing football and drinking coffee".
  - Style: warm hand-drawn scrapbook or travel journal, with parchment and kraft paper, torn edges, washi tape, a vintage map, a globe, a camera and a dashed flight path.
  - The centre shows the owner coding on a laptop at a café table. Sticker vignettes show football, gaming with a controller, coding, pour-over coffee, and a backpack traveller looking at mountains and sea.
- **`banner.svg`**: 840×250, a dark terminal-window banner in a GitHub-dark palette with a monospace face.
  - Text: "tidi@saigon: ~/player-1", "▸ PLAYER 1", "DAI HO TRONG", "aka TiDi · Daniel", "still learning. always solving.", "no perfect system. only trade-offs.", "bring me a pain point.", "STATUS accepting quests", "XP · SYSTEM DESIGN", "LVL still leveling", "MAX not a thing".
  - Note: "STATUS accepting quests" reads as availability, which the owner chose not to show. That line stays off the site unless the owner approves it.
- **Résumé photo:** not provided as a separate file, so it is not used.

## Goals & audience
- Primary goal (owner's choice, 2026-09-27): **Both, work-first.** Projects and experience lead; a clear "bring me your pain point" contact also serves clients.
- Primary call to action: contact, via email or Telegram (see Contact & links).

## About
- Bio (profile):
  - "I'm Dai — Daniel in English, TiDi around here. Officially a full-stack developer, though I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable."
  - "My journey has taken me from building Laravel applications, to AWS serverless systems, and eventually to event-driven microservices with NestJS. Somewhere along the way, I even built a career-path platform inspired by RPG quest mechanics — which probably explains a lot about the rest of this page."
- Summary (résumé):
  - "I possess extensive experience in creating and designing Restful APIs for web applications. My track record includes successfully developing multiple highly-scalable applications using diverse technology stacks."
  - "My proficiency spans across a multitude of frameworks, languages, and development tools, with a particular emphasis on Node.js framework. Additionally, I have hands-on experience in the DevOps aspect, ensuring seamless integration between development and operations for efficient project delivery."
- House rules (profile). Intro: "How I take on a problem. I'm still learning system design, so these get patched." / "If something in your software hurts, bring it over. This is how I'll approach it:"
  1. "There's no perfect system — only trade-offs you choose on purpose."
  2. "Understand the pain before prescribing the fix. The problem, the constraints, the context — in that order."
  3. "Options on the table, not one answer. I'd rather argue trade-offs with you than grab the first thing that compiles."
  4. "Best advice with what I know today. If I'm wrong, I'd rather find out early — that's where the XP comes from."
- Sign-off (profile): "Got a pain point? Bring the constraints — I'll bring the trade-offs."
- Leveling up (profile): distributed-systems trade-offs · reliability & SRE · infrastructure as code · AI in the dev loop

## Experience

### Sunbytes, project CyberRock
- Dates: 2024-03 to present
- Title: **Full-stack Developer** (owner-confirmed, 2026-09-27)
- Role on the project (profile): Backend · auth · solution design
- Team and scope (owner, answer.md): "8 people, end to end solution design, chip authentication and lifecycle"
- Scale (owner, answer.md): "13 services with both azure and aws"
- Project (résumé): "A new sovereign European trust platform for secure electronic components, trusted data and circularity, utilizing the Node.js and microservices."
- Responsibilities (résumé):
  - Design and implement scalable and maintainable RESTful APIs.
  - Develop automated tests for individual services.
  - Assist DevOps with monitoring and pipeline setup using GitHub Actions.
- Technologies (résumé):
  - Node.js with the NestJS framework and PostgreSQL.
  - NATS-based microservices for request-response and event-driven communication.
  - BullMQ with Redis as a queue system to generate and export millions of serial chips.
  - GitHub Actions for deployment, running unit tests.
  - Application deployments managed with ArgoCD.
- Project detail: see Projects → CyberRock.

### NFQ Asia
- Dates: 2020-03 to 2024-03 (joined March 2020, per the owner in answer.md)
- Title: **Full-stack Developer**, with **Tech lead** shown as the role on Quest (owner-confirmed, 2026-09-27).
- Projects at NFQ Asia (owner-confirmed):
  - Lemonswan (2020-03 to 2020-12)
  - Quest (2020-12 to 2024-03)
  - Scania (dates not provided)

#### Quest
- Summary (résumé): "a career path system inspired by the quest mechanism commonly found in role-playing games"
- Role (profile): "led the v1 → v2 rebuild as the team's technical authority"
- Team and users (owner, answer.md): "8 juniors, ~300 users in Ha Noi, Da Nang, Sai Gon, Can Tho"
- Why v2 (owner, answer.md): "overkill when using serverless and nosql (dynamodb), too many dependencies, workaround solution to ensure the data consistency, depend on a third-party service: HRMS, aws billing due to lamda function"
- The migration (owner, answer.md): "all data from v1 since switch from nosql to mysql, the big challenge is the data consistency, map each uers with its quest collection, with award and status"
- Incident (owner, answer.md): "incident that lambda function, cause the high billing"
- Responsibilities (résumé):
  - Establish the codebase and project structure for Quest v2 from scratch.
  - Design and implement Restful APIs for Quest v2, adhering to industry best practices and ensuring scalability and maintainability.
  - Design new database schema and migrate data from NoSQL to MySQL.
  - Mentor and guide other developers in the team, fostering a collaborative and knowledge-sharing environment.
  - Take ownership of the technical aspects of the development, ensuring consistency, efficiency, and optimal performance across the entire application.
  - Responsible for deployment in different environments (dev, staging, production).
  - Plan and execute the seamless migration of data from the v1 system to the v2 system, minimizing downtime and ensuring data accuracy and completeness.
- Team leadership (résumé). "Led a dynamic team as the primary technical authority for the Quest project."
  - **Technical leadership:** collaborated across teams to integrate cutting-edge tech; conducted code reviews, ensuring high standards and preserving project integrity.
  - **Project management:** developed and managed timelines in alignment with business objectives; implemented agile methodologies for enhanced adaptability and responsiveness.
  - **Mentorship:**
    - guided fresher and junior developers on technical challenges and career progression
    - conducted knowledge-sharing sessions, fostering a collaborative learning culture
    - provided mentorship and coaching to team members, resulting in professional development and improved performance
- Key achievements (résumé):
  - Created the codebase and architecture for Quest v2 from scratch, leveraging NestJS and Prisma for a robust and scalable foundation.
  - Re-organized codebase and structure to make it simpler and easy to catch up.
  - Identified and eliminated redundant code segments, significantly reducing the potential bugs.
  - Data migration from DynamoDB in v1 to MySQL in v2 with minimum downtime (~5m).
  - Aligned the codeflow with business logic requirements, reducing dependencies on third-party services and enhancing the robustness of Quest v2.
  - Identified and resolved authentication challenges by directly integrating Google Single Sign-On (SSO) into Quest v2, bolstering security and user authentication processes.
  - Eliminated manual steps and enhanced infrastructure management by implementing Terraform for Infrastructure as Code (IaC).
  - Incorporated New Relic as an Application Performance Monitoring (APM) tool, enabling real-time performance monitoring and issue detection.
- Technologies (résumé):
  - **v1:** Node.js and the Serverless framework, a microservices architecture built on AWS native services (Lambda, DynamoDB, S3), API Gateway with EventBridge for inter-service communication.
  - **v2:** NestJS with Prisma.
  - **Front-end:** ReactJS and VueJS.
  - **Integrations:** Google OAuth 2.0 for authentication, Slack webhooks for notifications, GitHub Actions for code-format checks and Prettier.

#### Lemonswan
- Dates: 2020-03 to 2020-12 (an NFQ Asia project, confirmed by the owner)
- Project (résumé): "one of the leading dating platforms in Germany. It was built with one specific group of users in mind: singles with serious intentions."
- What I built (owner, answer.md): "matching logic and UI design"
- Link (owner-approved): https://lemonswan.com/
- Responsibilities (résumé):
  - Worked within an agile team and helped to prioritize and scope feature requests and implement features.
  - Integrated RESTful APIs into frontend applications, facilitating data communication between the frontend and backend components.
  - Developed user interfaces (UI) for frontend applications, ensuring a seamless and intuitive user experience.
- Technologies (résumé): Laravel 8.10, MySQL, Redis (cache), Tailwind CSS.

#### Scania (e-commerce)
- Employer: NFQ Asia (owner, 2026-09-27)
- Owner (answer.md): "Ecommerce is Scania, which selling cars, using Spryker framework". Corrected by the owner in chat, 2026-09-27: "at NFQ, selling truck, not cars for German company. build BE, FE"
- What I built: backend and frontend
- Stack: Spryker framework
- Dates and further stack: not provided. Shown under NFQ Asia (2020–2024) without its own dates.

## Projects
Profile "Quest journal": 2 active · 1 cleared.

### CyberRock (Active, 2024 → now)
- One line (profile): "prove IoT devices are genuine" / "prove a device is genuine before anything trusts it"
- My role (profile): Backend · auth · solution design. Owner's scope (answer.md): "end to end solution design, chip authentication and lifecycle".
- Team: 8 people. Scale: 13 services across Azure and AWS (owner, answer.md).
- What I built (profile):
  - "Challenge-response auth for security chips — token, host, mutual, daisy-chain and secure-boot attestation"
  - "Chip lifecycle from manufacturing to the field, with supplier exports and a full audit trail"
  - "Anomaly detection that turns geolocation jumps and slow responses into Slack-alerted incidents"
- Stack: NestJS microservices over NATS · PostgreSQL · Redis/BullMQ · React · Azure and AWS · GitHub Actions · Argo CD
- Links / media: none (the owner skipped a public link)

### botmivivi (Side, live in production)
- One line (profile): "back office for a flour distributor, live in production" / "numbers that keep themselves correct"
- Ownership (owner, answer.md): "my own product for my family business"
- Live since (owner, answer.md): August 2026
- My role (profile): Built end to end
- Usage (owner, answer.md): "10 users, internal app, after 2 months, 646 customers, 2951 orders,325 purchase receipt, 107786 import, 89945 export". Units of the import and export figures (owner, chat, 2026-09-27): "in bags mostly".
- What it replaced and the impact (owner, answer.md): "replace manual step from creating order, write report, customer debt, inventory, etc. save 90% of time, 80% of errors"
- What it does (profile):
  - "Debt ledger — every order, return and payment moves the balance in the same transaction"
  - "Price whitelist — off-list prices are flagged to Slack; customers can lock a price and prepay"
  - "Tonnage payroll — every kilo a loader moves prices itself, so payroll is a query"
- Stack (profile): NestJS · Prisma · PostgreSQL · Redis/BullMQ · Vue 3
- Links / media (owner, answer.md): "internal app, so can not show any link". No link and no screenshots.

### Quest @ NFQ Asia (Cleared, 2020-12 to 2024-03)
- One line (profile): "a career-path platform on RPG quest mechanics"; "Quest is a career-path system modeled on RPG quests: professional growth laid out as quests to take on and complete."
- My role (profile): Tech lead. "Party lead — architecture calls, code reviews, cross-team work, agile timelines, and mentoring freshers and juniors."
- Team and users: 8 juniors led; ~300 users in Ha Noi, Da Nang, Sai Gon, Can Tho (owner, answer.md).
- Achievements (profile):
  - "Clean Slate — v2 codebase and architecture from scratch with NestJS + Prisma"
  - "Five-Minute Window — DynamoDB → MySQL migration with ~5 min of downtime"
  - "Front Door — Google SSO built in, fewer third-party dependencies"
  - "No More ClickOps — Terraform for infrastructure, New Relic for monitoring"
- Video (owner-approved, answer.md): https://www.youtube.com/watch?v=yLJZXvO_ARU. Public YouTube video titled "Quest by NFQ", checked 2026-09-27.

## Skills & tools
- Main (profile): TypeScript, Node.js, NestJS, React, Next.js, Vue 3
- Data (profile): PostgreSQL, MySQL, MongoDB, DynamoDB, Redis, NATS, BullMQ
- Ops (profile): AWS, Azure, Docker, Kubernetes, Terraform, GitHub Actions, Argo CD, New Relic
- AI companions (profile): Claude, ChatGPT
- Alt builds (profile): PHP, Laravel, Symfony, Python, Flask
- Also on the résumé: Serverless framework, CI/CD, Git, Slack, Jira
- Also from answer.md: Spryker framework (the Scania project)

## Education & certifications (show on site: yes, owner in answer.md)
- Bachelor in Software Application, Ho Chi Minh Vocational College, 2017–2020
- Bachelor in Business Administration, Ton Duc Thang University, 2013–2017
- English: IELTS 6.0, EF SET C1
- Languages shown on the site: **Vietnamese and English** (owner's choice, 2026-09-27)

## Interests (show an "AFK" section: yes, owner in answer.md)
- Profile: Football, Badminton, Swimming, Games, "Tech gossip and "how would you design this?" debates"
- Résumé: Reading, Football, Video games

## Contact & links
- Email (profile): tidi.dev1321@gmail.com
- Email (résumé): [private email removed]
- Telegram (profile): @tidi1321, https://t.me/tidi1321
- GitHub (résumé): https://github.com/tidi-dev
- Phone: on the résumé; deliberately not copied here.
- Shown on the site (owner's choice, 2026-09-27):
  - Email tidi.dev1321@gmail.com: **yes**
  - Telegram @tidi1321: **yes**
  - GitHub: **yes** (default; the owner did not object)
  - Email [private email removed]: **no**
  - Phone: **no**
  - Location "Ho Chi Minh City, Vietnam": **yes**, on the résumé and the site (Contact and search metadata). Owner's choice, 2026-09-28.

## Site preferences
- Domain (owner, answer.md): **daiho.dev** (owned; its DNS is on Cloudflare, checked 2026-09-27)
- Language: **English only** (owner's choice, 2026-09-27)
- Theme: **follow the system, with a toggle** (owner, answer.md)
- Analytics: **none** (owner, answer.md)
- Stack: **Next.js confirmed** (owner, answer.md)
- Hosting: **decide later** (owner, 2026-09-28)
- Code repository: **do not push for now**; local git only (owner, 2026-09-28)
- RPG/quest theme: **subtle, one signature moment.** A professional, fast-to-scan layout, with quest vocabulary in a few labels plus one memorable game-like interaction. (Owner's choice, 2026-09-27.)
- Project diagrams (owner's choice, 2026-09-27): **yes, high-level only.** Drawn solely from the owner's own descriptions, with no client internals, internal service names or real data. Covers CyberRock chip auth and lifecycle, the Quest v1 → v2 migration, and the botmivivi ledger.
- Résumé download (owner, answer.md): **yes**. "dont reuse … DaiHo Resume.pdf, help me to gen a new one". A new PDF will be generated from `info.md`, without the phone number and the reference.

## Approved copy
New wording and depictions approved by the owner for the site. The build renders these verbatim.

| Key | Text | Approved |
|---|---|---|
| hero.cta | Bring me a pain point | 2026-09-28 (C1, row 1) |
| hero.sentence | Officially a full-stack developer, though I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable. | 2026-09-28 (C1, row 2: keep the owner's line as written) |
| resume.link | Résumé | 2026-09-28 (C1, row 3: hero link, and the Contact row term) |
| resume.contact-link | PDF, {size} | 2026-09-28 (C1, row 3: Contact link text; {size} is computed from the file at build, e.g. "96 KB") |
| a11y.theme-toggle | Dark theme | 2026-09-28 (C1, row 4: the toggle's accessible name; `aria-pressed` carries the state) |
| a11y.menu-button | Menu | 2026-09-28 (C1, row 4) |
| a11y.nav | Main | 2026-09-28 (C1, row 4: the navigation landmark's label) |
| a11y.skip-link | Skip to content | 2026-09-28 (C1, row 4) |
| format.period | {YYYY-MM} to {YYYY-MM} · {YYYY-MM} to present | 2026-09-28 (C1, row 11: e.g. "2024-03 to present", "2020-12 to 2024-03", "2026-08 to present") |
| depiction.bench | A host sends a challenge, the chip answers, the response returns, verdict "genuine"; a counterfeit chip fails after the challenge. | 2026-09-28 (C1, row 6: accurate) |
| depiction.cyberrock-drawing | Manufacturing → the field, with supplier exports as an output and a full audit trail underneath; the proof runs the field → challenge-response auth (token, host, mutual, daisy-chain and secure-boot attestation) → genuine. | 2026-09-28 (C1, row 7: accurate) |
| bench.run | Run the handshake | 2026-09-28 (C2, row 5) |
| bench.toggle | Counterfeit chip | 2026-09-28 (C2, row 5: constant label; `aria-pressed` carries the state) |
| bench.verdict-rejected | rejected | 2026-09-28 (C2, row 5: pairs with the owner's "genuine") |
| botmivivi.facts | Users: 10 · Customers: 646 · Orders: 2,951 · in the first 2 months · Impact: 90% less time, 80% fewer errors | 2026-09-28 (C2, row 10: compact set; labels "Users", "Customers", "Orders", "Impact"; "in the first 2 months" qualifies customers and orders. Not shown on the site: purchase receipts and import/export figures) |
| quest.users | ~300 users in Ha Noi, Da Nang, Sai Gon, Can Tho | 2026-09-28 (C2, row 12: as the owner wrote it; facts label "Users") |
| lemonswan.one-liner | A dating platform in Germany for singles with serious intentions. | 2026-09-28 (C2, row 12) |
| scania.one-liner | An e-commerce platform selling trucks, built for a German company. | 2026-09-28 (C2, row 12) |
| quest.drawing.carried | users, quest collection, award, status | 2026-09-28 (C2, row 8: the owner's note, with "uers" corrected to "users") |
| botmivivi.drawing.replaced-label | Replaced manual steps | 2026-09-28 (C2, row 9) |
| video.name | Watch Quest by NFQ | 2026-09-28 (C2, row 16: the facade's accessible name) |
| video.caption | Opens the YouTube player. | 2026-09-28 (C2, row 16) |
| avatar.caption | Illustrated avatar of TiDi coding, gaming, playing football and drinking coffee | 2026-09-28 (C3, row 13: shown as the visible caption; the `img` takes `alt=""`) |
| resume.summary | = hero.sentence | 2026-09-28 (C3, row 15: the résumé summary uses the approved hero line, not the old résumé summary) |
| meta.title | Dai Ho Trong (TiDi), Full-stack Developer | 2026-09-28 (C3, row 17: 41 characters) |
| meta.description | I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable. | 2026-09-28 (C3, row 17: 158 characters) |
| lists.scope | Site: the five profile skill groups and the profile AFK list. PDF only: Serverless framework, CI/CD, Git, Slack, Jira, Spryker framework, Reading. | 2026-09-28 (C3, row 14) |
| label.languages | Languages | 2026-09-28 (C3, row 14) |
| contact.location-label | Location | 2026-09-28 (C3, row 18) |
| not-found.heading | Nothing here | 2026-09-28 (C3, row 17) |
| not-found.link | Back to TiDi | 2026-09-28 (C3, row 17) |
| og.alt | Dai Ho Trong (TiDi), Full-stack Developer, with a drawing of a chip handshake | 2026-09-28 (C3, extra) |
| resume.file | tidi-resume.pdf | 2026-09-28 (C3, extra) |
| resume.title | TiDi, Résumé | 2026-09-28 (C3, extra: the PDF document title) |
| a11y.drawing-steps | Pattern: short numbered steps built from the approved depictions and the owner's phrases, e.g. "1. The host sends a challenge. 2. The chip sends back a response. 3. Verdict: genuine." | 2026-09-28 (C3, pattern approval. The main session records each exact step string here when it is drafted in Phases 4–8, under this approval) |
| a11y.steps.bench | 1. The host sends a challenge. 2. The chip sends back a response. 3. Verdict: genuine. | 2026-09-28 (under a11y.drawing-steps; source: depiction.bench) |
| a11y.steps.cyberrock | 1. The chip lifecycle runs from manufacturing to the field. 2. Supplier exports leave the lifecycle as an output. 3. A full audit trail runs underneath the whole lifecycle. 4. In the field, challenge-response auth (token, host, mutual, daisy-chain and secure-boot attestation) proves the device is genuine before anything trusts it. | 2026-09-28 (under a11y.drawing-steps; source: depiction.cyberrock-drawing and Projects → CyberRock) |
| a11y.steps.quest | 1. v1 ran on Lambda, EventBridge and DynamoDB. 2. The data moved from DynamoDB to MySQL with ~5 min of downtime, carrying users, quest collection, award and status. 3. v2 was built on NestJS, Prisma and MySQL. | 2026-09-28 (under a11y.drawing-steps; source: Quest technologies, Five-Minute Window, quest.drawing.carried) |
| a11y.steps.botmivivi | 1. Every order, return and payment moves the balance in the same transaction. 2. Replaced manual steps: creating order, write report, customer debt, inventory. | 2026-09-28 (under a11y.drawing-steps; source: botmivivi debt ledger and the owner's "replace manual step from …" line, kept verbatim to match the drawing labels) |

## Open questions
(None. New questions will surface during copy drafting.)

## Not included
- **References:** the résumé lists a former manager with a phone number and email. This is third-party personal data: not copied, and never published unless both the owner and the reference agree.
- **Availability status:** owner in answer.md, "no need to add this".
- **Writing, talks, open source, testimonials:** the owner left this blank (2026-09-27).
- **What the owner liked or disliked about https://tiendinh.dev/:** skipped.
- **CyberRock hard-problem story and public link:** skipped.
- **botmivivi link and screenshots:** internal app.
- **Résumé photo:** not provided as a file.
- **Travel and photography as interests:** declined (owner, 2026-09-27), even though the avatar shows them.
- **Scania dates and further stack:** not provided.
