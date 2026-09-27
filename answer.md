Needed before design directions

1. Name on the site. Lead with "Dai Ho Trong", "TiDi", or both (for example, TiDi as the brand with your full name beside it)? Should "Daniel" appear? Do you want the Vietnamese spelling with diacritics anywhere?
- both, "Daniel" appear, want the Vietnamese spelling with diacritics
2. Headline and titles. Both files say "Full-stack Developer", but you say you spend most of your time on the backend. Keep it, or use a backend-leaning wording in your own words? What were your official job titles at Sunbytes and NFQ Asia? Was "Tech lead" your title, or your role on Quest?
- Full-stack Developer
3. Availability. Are you open to new roles, freelance, or both right now? Remote only, EU hours, relocation?
- no need to add this
4. Images. Can you add ava.PNG and banner.svg to this folder, or tell me which GitHub repo holds them so I can fetch them? Should the site use the illustrated avatar, the photo from your résumé, or both?
- added
5. Confidentiality. For CyberRock, botmivivi and Quest, what can be shown publicly: names, descriptions, high-level architecture diagrams, screenshots?
- for Quest, attach this link https://www.youtube.com/watch?v=yLJZXvO_ARU
6. The reference. What drew you to tiendinh.dev, and is there anything about it you'd avoid?
- skip
To make the projects rich

- CyberRock:
  - How big is the team, and which parts did you personally design (the attestation flows, chip lifecycle, anomaly detection)?
  > 8 people, end to end solution design, chip authentication and lifecycle
  - The résumé says "millions of serial chips". Can you be more specific? How many services are there?
  > 13 services with both azure and aws
  - One hard problem you solved, and a public link if there is one.
  > skip
- Quest:
  - How many developers did you lead, and how many people used Quest?
  > 8 juniors, ~300 users in Ha Noi, Da Nang, Sai Gon, Can Tho
  - What hurt in v1 that made a rebuild necessary?
  > overkill when using serverless and nosql (dynamodb), too many dependencies, workaround solution to ensure the data consistency, depend on a third-party service: HRMS, aws billing due to lamda function
  - How much data moved in the roughly 5-minute migration?
  > all data from v1 since switch from nosql to mysql, the big challenge is the data consistency, map each uers with its quest collection, with award and status
  - Any before/after numbers (cost, speed, incidents, deploy time)?
  > incident that lambda function, cause the high billing
- botmivivi:
  - Is it your own product or a client project, and since when has it been live?
  > my own product for my family business. live since August 2026
  - How many users, and what volume (orders or tonnage per month)?
  > 10 users, internal app, after 2 months, 646 customers, 2951 orders,325 purchase receipt, 107786 import, 89945 export
  - What did it replace (spreadsheets, paper)? Any measurable impact, such as payroll time saved or pricing errors caught?
  > replace manual step from creating order, write report, customer debt, inventory, etc. save 90% of time, 80% of errors
  - A link, or screenshots with dummy data?
  > internal app, so can not show any link
- Lemonswan: Which features or screens did you build? Is it OK to link the public site?
> https://lemonswan.com/, matching logic and UI design
- More: GitHub repos worth featuring, open-source work, the topics of your NFQ knowledge-sharing sessions, any writing, and recommendations you're allowed to quote.

Quick confirmations

- Was Lemonswan an NFQ Asia project, and which month did you join NFQ? yes, join march 2020
- Your profile lists "E-commerce" and "HRMS" among your domains. Which projects are those? Is any project missing from both files?
> Ecommerce is Scania, which selling cars, using Spryker framework. HRMS is a part of Quest project
- Show both degrees and your IELTS 6.0 / EF SET C1 results? Which languages do you speak besides English? yes
- Offer a résumé download? I'd suggest a trimmed version without your phone number and the reference. yes, dont reuse /Users/tidi/tidi/portfolio/DaiHo Resume.pdf, help me to gen a new one
- Include a small "AFK" section (football, badminton, swimming, games, reading)? yes
- Do you own a domain for the site? Light, dark, or follow the system with a toggle? No analytics, or a privacy-friendly one? Is the Next.js proposal OK (it's already in your main stack)? 
> yes (daiho.dev), follow the system with a toggle, no analytics, yes, yes
