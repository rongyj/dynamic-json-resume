# Cover letter — GitHub, Staff Software Engineer, CoPilot Agent Platform

**Yongjun Rong**
Cherry Hill, NJ · rongyj@hotmail.com · 856-408-4027
[linkedin.com/in/rongyongjun](https://www.linkedin.com/in/rongyongjun/) · US Citizen

---

Dear GitHub Hiring Team,

I am applying for the Staff Software Engineer role on the CoPilot Agent platform. Secure, durable, globally scalable infrastructure for autonomous software-development agents is a narrow intersection — agent orchestration on one side, multi-tenant platform engineering on the other — and it happens to be exactly where the last four years of my work sit.

At McKinsey I built the GenAI platform capability behind enterprise modernization work: a multi-agent system that migrated mainframe applications to modern stacks, with RAG for context-aware transformation, and a separate RAG-backed system that generated PySpark and Databricks pipeline code with its own unit tests. Those pipelines needed hand-off contracts between agents, retry and escalation paths, and human-review gates, because unattended code generation against a real client codebase fails in ways a prototype never shows you. I scaled the retrieval layer behind a call-centre chatbot copilot from a single-node prototype to a persistent, concurrently queried vector store as the corpus and the user base grew.

The durability and isolation half is my current job. At Intuitive.ai with JPMorgan Chase I own the ECS/EKS and Istio reference architecture for a platform serving hundreds of developers, with per-tenant isolation, least-privilege IAM, Secrets Manager and mesh-wide mTLS as defaults rather than options. I also set the team's AI-assisted development practice and packaged recurring platform work — service onboarding, environment triage, incident first-pass — as agent skills and subagents behind an MCP server over the platform's own APIs. Running agents against production systems safely is a permissions and blast-radius problem before it is a model problem.

One gap worth stating: my working languages are Java, Python and TypeScript. Go and Ruby are readable to me but not in my daily set, and I would be learning GitHub's stack on the job. I would rather you weigh that now than discover it in a screen.

Sincerely,
Yongjun Rong
