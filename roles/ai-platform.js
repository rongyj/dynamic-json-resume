/**
 * Role profile: ai-platform
 *
 * Full-detail view for AI platform / GenAI infrastructure roles (~8 pages).
 *
 * Content comes from resume.json (the master); this file carries only the
 * selection and the prose that is specific to this role. Build with:
 *   node build-resume.js ai-platform --pdf
 */

module.exports = {
    name: "ai-platform",
    output: "resume-ai-platform.json",
    html: "resume-ai-platform.html",
    pdf: "YongjunRong-ai-platform.pdf",
    summaryTags: ["AIPlatform"],

    summary: "Platform architect and hands-on engineer who builds the shared infrastructure AI applications run on. Four years delivering production GenAI systems - RAG over ChromaDB/Milvus, multi-agent orchestration with AutoGen, prompt engineering and tuning, concurrent LLM invocation, model-backed services behind FastAPI - on top of fifteen years of Infrastructure as Code and multi-tenant AWS container platforms (ECS/EKS, Istio service mesh with mesh-wide mTLS, versioned Terraform/Terragrunt module libraries). At McKinsey, built the GenAI platform capability that accelerated mainframe modernization for enterprise clients: COBOL to Java and BMS/JSF/JSP to React through multi-agent pipelines, plus LLM-generated PySpark/Databricks pipeline code shipped with generated unit tests. Now owns the reference architecture for an on-demand application platform serving hundreds of developers at a global bank. Sets the team's AI-assisted development practice there, and packages recurring platform work as agent skills and subagents behind an MCP server. Brings the governance half as well: authored group-wide architecture handbooks, set invest/divest positions on ~200 technologies, and architected a commercial multi-cloud cost analytics and optimization platform - directly transferable to token accounting, cost attribution and quota enforcement for shared AI infrastructure. US Citizen; fluent English, native Chinese.",

    skills: [
        "GenAI platform: RAG over ChromaDB and Milvus - corpus curation, OpenAI embeddings, HNSW-indexed collections, chunk and top-k tuning, embedding refresh on source change; multi-agent orchestration (AutoGen); prompt engineering; concurrent async LLM invocation; model-backed APIs on FastAPI.",
        "Agentic automation: agent skills and subagents for recurring engineering work; MCP servers exposing platform APIs to coding agents; multi-agent pipelines with hand-off contracts, retry, escalation and human-review gates.",
        "AI-assisted development: Claude Code, GitHub Copilot and Cursor daily; team practice for what generated code is trusted with and the review it has to pass.",
        "AI-assisted modernization: COBOL to Java and BMS/JSF/JSP to React through multi-agent and RAG pipelines; LLM-generated PySpark/Databricks code shipped with generated unit tests.",
        "AWS platform architecture: multi-tenant ECS/EKS, Istio with mesh-wide mTLS, serverless event-driven systems (EventBridge, Lambda, Step Functions, SQS/SNS), self-service environment provisioning. Azure AKS and GCP exposure.",
        "Infrastructure as code: Terraform and Terragrunt module libraries, DRY multi-environment configuration, IaC-provisioned EKS, IAM/OIDC/IRSA, Route 53, ACM, RDS, secrets; Puppet, Chef, Ansible.",
        "Security, observability and cost: Secrets Manager and KMS, least-privilege IAM, per-tenant quotas, TLS/mTLS; Splunk, Dynatrace, Prometheus/Grafana/Jaeger/Kiali, CloudWatch; FinOps allocation, showback, unit-cost metrics, rightsizing.",
        "Distributed systems and languages: event-driven architecture, CQRS, event sourcing, Kafka streams, design-first microservices on OpenAPI, Databricks/PySpark; Python, Java/Spring Boot, TypeScript/Node.js, Terraform, Bash.",
        "Technical leadership: group-wide architecture handbooks at Barclays, a ~30-member technology strategy working group, a ~500-application cloud migration readiness assessment; mentors engineers on IaC, service mesh, prompt engineering and agentic workflows.",
    ],

    technologies: [
        {
            "daily-programming-language": [
                "Python",
                "Terraform",
                "TypeScript/JavaScript",
                "Java",
                "Bash",
                "SQL"
            ]
        }
    ],

    hobbies: {
        "hobby-items": [
            {
                "item-hobbies": {
                    "name": "Pickleball",
                    "additional-info": " ~4.0 player"
                }
            },
            {
                "item-hobbies": {
                    "name": "IoT or Robot programming",
                    "additional-info": "Have iRobot and MIPOSaur at home. Programming against iRobot create SDK and MIPOSaur SDK."
                }
            },
            {
                "item-hobbies": {
                    "name": "Playing with cutting-edge technologies",
                    "additional-info": "genAI/Autogen/Multiagents, Docker, Go, Kafka, Kubernetes and Amazon CloudFormation, JavaScript, AngularJS, ReactiveJS, Node.js"
                }
            }
        ]
    },

    work: [
        {
            company: "Intuitive.ai",
            technologies: ["IaC","Terraform","AWS/EKS/Service Mesh/Istio","TLS Certificate","AI-assisted development (Claude Code, GitHub Copilot, Cursor)","AI agents / MCP / agentic workflow automation"],
            projects: [
                {
                    title: "On Demand Environment (ODE) backend (Jav",
                    highlights: [
                        "Architected the backend infrastructure w",
                        "Designed and implemented reusable Terraf",
                        "Built the Java Spring Boot backend that ",
                        "Ran workloads on ECS Fargate to take EC2",
                        "Automated ALB listener and target-group ",
                        "Provisioned RDS instances with per-servi",
                        "Kept Dev/Test/Prod configuration DRY beh",
                        "Made provisioning idempotent and repeata",
                        "Drove the team's AI-assisted development",
                        "Turned the repetitive half of platform d",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Design and implement Splunk and Dynatrac",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Design and implement AWS Secrets (ASM) s",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "EKS Service Mesh (Istio) on-demand frame",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Proprietary Environment As Code (EAC/IAC",
                    retitle: "Agentic automation of platform operations: MCP server, agent skills and subagents",
                    redescribe: "Automated the recurring operational work on the on-demand application platform - service onboarding, environment provisioning failures, IAM and TLS triage, incident first-pass - as reusable agent skills and subagents. An MCP server exposes the platform's environment and provisioning APIs to the coding agents that run them. Built on the firm's proprietary Environment as Code (EAC) platform, self-taught to subject-matter-expert level with no formal training or vendor support.",
                    highlights: [
                        "Used AI coding assistants to reverse-eng",
                        "Set the team's working practice for AI-a",
                        "Built an MCP server exposing the platfor",
                        "Packaged the team's recurring runbooks a",
                    ],
                    leaderships: [
                        "Mentored the team on AI-assisted develop",
                        "Moved the team from ad-hoc assistant use",
                    ],
                    technologies: ["MCP","AI agents / subagents","Environment as Code (EAC)","Terraform","AWS ECS","AWS EKS","AWS IAM","TLS / Certificate Management","CI/CD"],
                    tags: ["AIPlatform","AI Agents","MCP","Platform Engineering","Mentoring"],
                },
            ],
        },
        {
            company: "Biophy",
            projects: [
                {
                    title: "Comprehensive Infrastructure as Code (Ia",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "AI-Powered Data Ingestion and Scraping S",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "McKinsey & Company",
            technologies: ["genAI/openAI/Langchain/RAG/Multi-agents/prompts tuning","VectorStore/ChromaDB/Milvus","Python/Flask/FastAPI/Pydantic/Jupyter","Databricks/pyspark","Typescript/JavaScript/NodeJs","Event Driven Architecture (EDA)","Terraform","Microservices","Java/SpringBoot/NodeJs/Python/Flask/FastAPI","EventBridge/CloudWatch/Lambda/Step Functions","DynamoDB/RDS/Oracle","Docker/K8s/EKS/AKS","Json Schema","JOI","OpenAPI/Swagger","AI-assisted development (GitHub Copilot, Cursor)"],
            projects: [
                {
                    title: "Using genAI (openAI) with RAG (ChromaDB,",
                    highlights: 'all',
                    leaderships: [
                        "Spearheaded the integration of genAI and",
                        "Mentored engineers on advanced prompt en",
                        "Established robust local development and",
                    ],
                    tags: undefined,
                },
                {
                    title: "Using genAI (openAI) with multi-agents t",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Migration/Refactoring of Mainframe (IBM ",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "Yotascale",
            projects: [
                {
                    title: "Lead Architect and Lead Implementation E",
                    highlights: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "Gigster Inc.",
            projects: [
                { literal: {
                  "title": "AWS EKS platform for Node.js microservices and event-driven workloads",
                  "description": "AWS architecture for Node.js microservices and event-driven workloads on EKS, fully provisioned through Terraform/Terragrunt with ALB ingress controller, IAM/OIDC service-account roles and Helm-deployed dependencies."
                } },
            ],
        },
        {
            company: "Barclays",
            projects: [
                {
                    title: "Delivery Lead for strategic distributed ",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Group-wide Cloud Adoption for Contact Ce",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        { literal: {
          "start-date": "Apr.,1996",
          "end-date": "Jun., 2017",
          "position": "<span class=\"career-list\"><span class=\"career-item\"><span class=\"career-co\">Oracle<span class=\"career-yr\"> 2014-2017</span></span><span class=\"career-role\">Lead Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Comcast<span class=\"career-yr\"> 2010-2014</span></span><span class=\"career-role\">Sr. DevOps / Infra Automation Eng.</span></span><span class=\"career-item\"><span class=\"career-co\">Boomi<span class=\"career-yr\"> 2006-2010</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Vantage Learning<span class=\"career-yr\"> 2006</span></span><span class=\"career-role\">Sr. System Engineer Manager</span></span><span class=\"career-item\"><span class=\"career-co\">Texas Tech University<span class=\"career-yr\"> 2002-2006</span></span><span class=\"career-role\">Programmer/Analyst, Unix SysAdmin</span></span><span class=\"career-item\"><span class=\"career-co\">Sun Microsystems China<span class=\"career-yr\"> 2000-2002</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">IBM China R&amp;D<span class=\"career-yr\"> 1998-2000</span></span><span class=\"career-role\">Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Taiji Computers<span class=\"career-yr\"> 1996-1997</span></span><span class=\"career-role\">System / Network Engineer</span></span></span>",
          "position-header": "Lead Software Engineer / Senior DevOps & Infrastructure Engineer / Systems Engineer",
          "company": {
            "name": "Earlier career",
            "city": "USA",
            "country": "China"
          },
          "achievements": "Twenty-one years of platform, automation and integration engineering preceding the current cloud-native and GenAI work. At Oracle, built the cloud integration connectivity SDK and Java connectors joining SOA Suite and Integration Cloud Service to SaaS and on-premises applications, and pioneered Docker Swarm/Compose CI environments for the connector teams. At Comcast, designed the AutoBuild system that built and released 200+ microservice projects from a dependency graph, cutting release cycles from days to hours, and ran the Gerrit/Bamboo/Nexus estate on Pacemaker/HAProxy clusters with Puppet and Capistrano automation. Earlier: the SOA connector framework and production cloud platform at Boomi - one of the first iPaaS products - on AWS EC2/S3 and managed data centres, including JVM/GC tuning and Apache Solr indexing at millions of transactions per day; a 100+ server data centre at Vantage Learning; Kerberos/LDAP single sign-on and Globus grid computing at Texas Tech University alongside an MS in Computer Science; and enterprise Java, payments and storage-management systems at Sun Microsystems China and IBM China R&D.",
          "technologies": [
            "Java/J2EE",
            "SOA / EAI / iPaaS",
            "Docker Swarm/Compose",
            "CI/CD (Bamboo, Jenkins, Maven)",
            "Puppet/Capistrano",
            "AWS EC2/S3",
            "Linux HA clustering",
            "JVM & GC tuning",
            "Kerberos/LDAP/SSO"
          ],
          "projects": [
            {
              "item-projects": {
                "title": "Oracle cloud integration connectivity SDK, Java connectors and Docker CI environments",
                "description": "SDK and plugin framework linking Oracle SOA Suite and Integration Cloud Service to SaaS and on-premises enterprise applications, with Docker Swarm/Compose/Stack CI test environments built for geographically distributed connector teams."
              }
            },
            {
              "item-projects": {
                "title": "Comcast AutoBuild: dependency-graph release automation for 200+ microservices",
                "description": "Directed-acyclic-graph driven build, branch and release automation across 200+ repositories, reducing release cycles from days to hours, with the Gerrit/Bamboo/Nexus estate on Pacemaker/HAProxy clusters and configuration managed by Puppet and Capistrano."
              }
            },
            {
              "item-projects": {
                "title": "Boomi AtomSphere iPaaS: connector framework and production cloud platform on AWS",
                "description": "SOA connector framework with synchronous/asynchronous messaging, plus the clustered production platform on EC2/S3 including distributed caching, Solr indexing at millions of transactions per day and JVM heap/GC tuning."
              }
            },
            {
              "item-projects": {
                "title": "Kerberos/LDAP single sign-on, Globus grid computing and enterprise Java delivery",
                "description": "Cross-realm Kerberos KDC, OpenLDAP and PAM single sign-on across Unix and Windows at Texas Tech University; OGSA/OGSI grid deployment with PKI/X.509 security; J2EE architecture at Sun Microsystems China and IBM China R&D."
              }
            }
          ]
        } },
    ],
};
