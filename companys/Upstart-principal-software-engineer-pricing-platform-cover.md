# Cover letter — Upstart, Principal Software Engineer, Pricing Platform

**Yongjun Rong**
Cherry Hill, NJ · rongyj@hotmail.com · 856-408-4027
[linkedin.com/in/rongyongjun](https://www.linkedin.com/in/rongyongjun/) · US Citizen

---

Dear Upstart Hiring Team,

I am applying for the Principal Software Engineer role on the pricing platform. The problem as described — moving from tightly coupled sequential workflows to modular capabilities reused across loan products, on Tier 0 services where latency, throughput and financial correctness are all non-negotiable — is a shape I have worked in repeatedly, most directly as the lead architect of a commercial multi-cloud cost analytics platform.

At Yotascale I owned both the product architecture and the AWS platform under it: design-first microservices on ClickHouse and PostgreSQL computing unit-cost, allocation and showback numbers across enterprise customers' multi-account estates, with rightsizing recommendations on top. Cost attribution has the same unforgiving property as pricing — the number has to be correct and it has to be explainable after the fact, and a plausible-looking wrong answer is worse than a slow one. Getting that right across three clouds meant clarifying ownership and configuration boundaries first, because the coupling was organizational before it was technical.

The model-to-production boundary is the other half of my recent work. At McKinsey I built FastAPI services that exposed model-backed capabilities as internal APIs other engineering teams consumed rather than rebuilt, which is precisely the boundary you are describing between ML scientists and production pricing systems — a stable contract on one side, freedom to iterate on the other. At Intuitive.ai I now own the reference architecture for a platform serving hundreds of developers across more than 80 product teams, where reducing operational burden through failure isolation, observability standards and limited blast radius is the daily job rather than a project.

Two things to be straight about. Rust and Go are not in my working set — my daily languages are Java, Python and TypeScript, with Kotlin reachable — so on your runtime-choice question I would be arguing from principles and reading, not from having shipped in them. And I have not worked in consumer lending; the financial-correctness instinct comes from banking and cloud cost systems, not from pricing credit products.

Sincerely,
Yongjun Rong
