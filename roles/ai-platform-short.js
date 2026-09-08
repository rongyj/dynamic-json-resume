/**
 * Role profile: ai-platform-short
 *
 * Submission-length view for AI platform / GenAI infrastructure roles (~5 pages).
 *
 * Content comes from resume.json (the master); this file carries only the
 * selection and the prose that is specific to this role. Build with:
 *   node build-resume.js ai-platform-short --pdf
 */

module.exports = {
    name: "ai-platform-short",
    output: "resume-ai-platform-short.json",
    html: "resume-ai-platform-short.html",
    pdf: "YongjunRong-ai-platform-short.pdf",
    summaryTags: ["AIPlatform"],

    summary: "Platform architect and hands-on engineer who builds the shared infrastructure AI applications run on. Four years shipping production GenAI systems - RAG over ChromaDB/Milvus with curated, HNSW-indexed retrieval corpora, multi-agent orchestration with AutoGen, prompt engineering, model-backed services on FastAPI - on fifteen years of Infrastructure as Code and multi-tenant AWS platforms (ECS/EKS, Istio with mesh-wide mTLS, versioned Terraform/Terragrunt modules). Built the GenAI capability behind mainframe modernization at McKinsey; now owns the reference architecture for an on-demand platform serving hundreds of developers at a global bank. Packages recurring platform work there as agent skills and subagents behind an MCP server. Also architected a commercial multi-cloud cost platform - directly transferable to token accounting and quota enforcement for shared AI infrastructure. US Citizen.",

    skills: [
        "GenAI platform: RAG over ChromaDB and Milvus - corpus curation, embeddings, HNSW-indexed collections, chunk and top-k tuning; multi-agent orchestration (AutoGen); prompt engineering; async LLM invocation; model-backed APIs on FastAPI.",
        "Agentic automation: agent skills and subagents for recurring platform work; MCP servers over platform APIs; multi-agent pipelines with hand-off contracts, retry and human-review gates. Claude Code, GitHub Copilot and Cursor daily.",
        "AI-assisted modernization: COBOL to Java and BMS/JSF/JSP to React via multi-agent and RAG pipelines; LLM-generated PySpark/Databricks code with generated unit tests.",
        "AWS platform: multi-tenant ECS/EKS, Istio with mesh-wide mTLS, serverless event-driven systems (EventBridge, Lambda, Step Functions, SQS/SNS), self-service environment provisioning.",
        "Infrastructure as code: Terraform/Terragrunt module libraries, DRY multi-environment configuration, IaC-provisioned EKS, IAM/OIDC, Route 53, ACM, RDS, secrets.",
        "Security, observability and cost: Secrets Manager/KMS, least-privilege IAM, per-tenant quotas; Splunk, Dynatrace, Prometheus/Grafana/Jaeger; FinOps allocation, unit-cost metrics, rightsizing. Python, Java/Spring Boot, TypeScript, Terraform, Bash.",
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
                    "name": "Playing with cutting-edge technologies",
                    "additional-info": "genAI/Autogen/Multiagents, Docker, Go, Kafka, Kubernetes and Amazon CloudFormation, JavaScript, AngularJS, ReactiveJS, Node.js"
                }
            }
        ]
    },

    work: [
        {
            company: "Intuitive.ai",
            achievements: "Hands-on principal architect for the on-demand application platform used by hundreds of developers across more than 80 product teams. Owns the ECS/EKS and Istio service-mesh reference architecture, the Terraform module library behind it, and the observability, secrets and TLS standards every onboarding service inherits. Cut new-service environment provisioning from weeks to hours and onboarded more than 200 microservices onto the paved road. Set the team's AI-assisted development practice and automated recurring platform work as agent skills and subagents backed by an MCP server over the platform's own APIs.",
            technologies: ["IaC","Terraform","AWS/EKS/Service Mesh/Istio","TLS Certificate","AI-assisted development (Claude Code, GitHub Copilot, Cursor)","AI agents / MCP / agentic workflow automation"],
            projects: [
                {
                    title: "On Demand Environment (ODE) backend (Jav",
                    highlights: [
                        "Architected the backend infrastructure w",
                        "Built the Java Spring Boot backend that ",
                        "Made provisioning idempotent and repeata",
                        "Turned the repetitive half of platform d",
                    ],
                    technologies: ["Java","Spring Boot","AWS ECS","AWS Fargate","AWS ALB","Amazon Route 53"],
                    tags: undefined,
                },
                {
                    title: "Design and implement Splunk and Dynatrac",
                    highlights: [
                        "Built the reusable Terraform module that",
                        "Delivered Splunk dashboards and Dynatrac",
                    ],
                    technologies: ["Splunk Universal Forwarder (UF)","Dynatrace OneAgent","AWS ECS","Java","Spring Boot","Terraform"],
                    tags: undefined,
                },
                {
                    title: "EKS Service Mesh (Istio) on-demand frame",
                    highlights: [
                        "Designed and implemented the multi-tenan",
                        "Developed the automation framework for d",
                        "Enforced mTLS mesh-wide in STRICT mode f",
                    ],
                    technologies: ["AWS EKS","Istio Service Mesh","Kubernetes","Terraform","TLS/mTLS","Envoy Proxy"],
                    tags: undefined,
                },
                {
                    title: "Proprietary Environment As Code (EAC/IAC",
                    retitle: "Agentic automation of platform operations: MCP server, agent skills and subagents",
                    redescribe: "Automated the recurring operational work on the on-demand application platform - service onboarding, environment provisioning failures, IAM and TLS triage, incident first-pass - as reusable agent skills and subagents. An MCP server exposes the platform's environment and provisioning APIs to the coding agents that run them. Built on the firm's proprietary Environment as Code (EAC) platform, self-taught to subject-matter-expert level with no formal training or vendor support.",
                    highlights: [
                        "Built an MCP server exposing the platfor",
                        "Packaged the team's recurring runbooks a",
                    ],
                    technologies: ["MCP","AI agents / subagents","Environment as Code (EAC)","Terraform","AWS ECS","AWS EKS","AWS IAM","TLS / Certificate Management","CI/CD"],
                    tags: ["AIPlatform","AI Agents","MCP","Platform Engineering","Mentoring"],
                },
            ],
        },
        {
            company: "Biophy",
            achievements: "Hands-on director of cloud architecture for an AI-powered healthcare platform. Led the retrieval corpus pipeline behind the product's RAG system - multi-source ingestion and scraping, chunking and embedding, deduplication and data-quality controls on Python/Django/Pydantic with LangChain - and brought the live AWS estate under Terraform/Terragrunt.",
            technologies: ["IaC","Terraform/Terragrunt","AWS/EC2/EBS/S3/VPC/ALB/Security/R53/IAM/Secrets Manager/Lambda/CloudWatch/EventBridge/SQS/SNS","Python/DJango/Pydantic","openAI API/LangChain","SOLID Principles"],
            projects: [
                {
                    title: "AI-Powered Data Ingestion and Scraping S",
                    highlights: [
                        "Architected a modular data ingestion pip",
                        "Built the chunking, embedding and upsert",
                        "Created automated testing frameworks for",
                    ],
                    tags: undefined,
                },
            ],
        },
        {
            company: "McKinsey & Company",
            achievements: "Built GenAI platform capability for enterprise modernization: curated retrieval corpora over ChromaDB/Milvus, multi-agent orchestration with AutoGen, and FastAPI services exposing model-backed capabilities as internal APIs other teams consumed rather than rebuilt. Scaled the retrieval layer behind a call-centre chatbot copilot from single-node prototype to a persistent, concurrently queried vector store. Also migrated complex mainframe event-driven systems onto AWS serverless (EventBridge, Lambda, Step Functions, SQS/SNS, EKS).",
            technologies: ["genAI/openAI/Langchain/RAG/Multi-agents/prompts tuning","VectorStore/ChromaDB/Milvus","Python/Flask/FastAPI/Pydantic/Jupyter","Databricks/pyspark","Typescript/JavaScript/NodeJs","Event Driven Architecture (EDA)","AI-assisted development (GitHub Copilot, Cursor)"],
            projects: [
                {
                    title: "Using genAI (openAI) with RAG (ChromaDB,",
                    highlights: [
                        "Prompt engineering and tuning to generat",
                        "Curated the retrieval corpus from the en",
                        "Tuned the retrieval layer rather than on",
                        "Operated the vector store as shared infr",
                        "Closed the generate-test-repair loop: a ",
                    ],
                    technologies: ["Langchain/VectorStore/ChromaDB/Milvus","genAI/openAI","RAG","Python/Pydantic/Asyncio/Flask/FastAPI/Debugpy","Typescript/JavaScript/NodeJs","Microservice"],
                    tags: undefined,
                },
                {
                    title: "Using genAI (openAI) with multi-agents t",
                    highlights: [
                        "Contribute to develop multi-agents genAI",
                        "Built the RAG layer that accelerated COB",
                        "Indexed the mainframe dependency graph -",
                        "Designed the agent workflow itself - ana",
                    ],
                    technologies: ["Langchain/VectorStore/ChromaDB/Milvus","genAI/openAI","RAG","Agents/Multi-agents/Autogen","Python/FastAPI","Typescript/JavaScript/NodeJs"],
                    tags: undefined,
                },
                {
                    title: "Migration/Refactoring of Mainframe (IBM ",
                    highlights: [
                        "Develop SpringBoot EKS router to convert",
                        "Design and implement the monitoring terr",
                    ],
                    technologies: ["Java/SpringBoot","Terraform","Microservice","Java/JavaScript","EKS","AWS/EventBridge/CloudWatch/Lambda"],
                    tags: undefined,
                },
            ],
        },
        {
            company: "Yotascale",
            achievements: "Lead architect and lead implementation engineer for a multi-cloud (AWS/Azure/GCP) cost analytics and optimization platform - the FinOps layer giving enterprise customers unit-cost visibility, allocation/showback and rightsizing across multi-account cloud estates. Owned the product architecture and the AWS platform it ran on.",
            technologies: ["OpenAPI/Swagger","Microservice","Java/Kotlin/SpringBoot","Kubernetes/EKS/AKS","Istio","Terraform"],
            projects: [
                {
                    title: "Lead Architect and Lead Implementation E",
                    highlights: [
                        "Delivered cost allocation, showback and ",
                        "Established the FinOps model inside the ",
                        "Stood up the entire AWS platform as code",
                    ],
                    technologies: ["Cloud Cost Analytics/Optimization/Management","OpenAPI/Swagger","Microservice","Java/Kotlin/Python","Spring/SpringBoot/Flask","Kubernetes/EKS/AKS/GKE"],
                    tags: undefined,
                },
            ],
        },
        {
            company: "Gigster Inc.",
            achievements: "Technical infrastructure and DevOps architect: AWS architecture for Node.js microservices and event-driven workloads on EKS, fully provisioned through Terraform/Terragrunt with ALB ingress, IAM/OIDC and Helm-deployed dependencies.",
            technologies: ["Microservice","NodeJs","Kubernetes/EKS","Terraform","RabbitMQ/ActiveMQ","Docker"],
            projects: [
                { literal: {
                  "title": "AWS EKS platform for Node.js microservices and event-driven workloads"
                } },
            ],
        },
        {
            company: "Barclays",
            achievements: "VP, lead architect for the group's distributed-systems domain and cloud adoption. Set group-wide architecture and technology strategy, issued invest/divest positions on ~200 products, authored the group-wide Microservices Architecture Handbook, and led cloud strategy for Contact Center, Merchant Services and Fraud including a ~500-application migration readiness assessment.",
            technologies: ["Terraform","CQRS","Event Store","Event Driven Architecture (EDA)","Kafka/ActiveMQ/IBM MQ","Kafka Stream"],
            projects: [
                {
                    title: "Delivery Lead for strategic distributed ",
                    highlights: [
                        "Evaluate around 200 existing products/te",
                        "Create the architecture handbook for Mic",
                    ],
                    technologies: ["Technology strategic Design and Stewardship","Distributed system","Domain Driven Design","Microservice","ACID/BASE","(Event) Stream /Batch Processing"],
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
          "achievements": "Twenty-one years of platform, automation and integration engineering before the current cloud-native and GenAI work: the cloud connectivity SDK and Docker-based CI environments at Oracle; AutoBuild dependency-graph release automation for 200+ microservices and the SCM/CI estate on Linux HA clusters at Comcast; the connector framework and production cloud platform at Boomi, one of the first iPaaS products; a 100+ server data centre at Vantage Learning; Kerberos/LDAP single sign-on and Globus grid computing at Texas Tech alongside an MS in Computer Science; and enterprise Java, payments and storage systems at Sun Microsystems China and IBM China R&D.",
          "technologies": [
            "Java/J2EE",
            "SOA / EAI / iPaaS",
            "Docker Swarm/Compose",
            "CI/CD (Bamboo, Jenkins, Maven)",
            "Puppet/Capistrano",
            "AWS EC2/S3"
          ],
          "projects": [
            {
              "item-projects": {
                "title": "Oracle cloud connectivity SDK, Java connectors and Docker CI environments"
              }
            },
            {
              "item-projects": {
                "title": "Comcast AutoBuild: dependency-graph release automation for 200+ microservices"
              }
            },
            {
              "item-projects": {
                "title": "Boomi AtomSphere iPaaS: connector framework and production cloud platform on AWS"
              }
            },
            {
              "item-projects": {
                "title": "Kerberos/LDAP single sign-on, Globus grid computing and enterprise Java (Texas Tech, Sun, IBM)"
              }
            }
          ]
        } },
    ],
};
