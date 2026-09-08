/**
 * Role profile: principal-swe-short
 *
 * Submission-length view for Principal / Staff Software Engineer roles (~5 pages).
 *
 * Content comes from resume.json (the master); this file carries only the
 * selection and the prose that is specific to this role. Build with:
 *   node build-resume.js principal-swe-short --pdf
 */

module.exports = {
    name: "principal-swe-short",
    output: "resume-principal-swe-short.json",
    html: "resume-principal-swe-short.html",
    pdf: "YongjunRong-Principal-Software-Engineer-short.pdf",
    summaryTags: ["PrincipalSWE"],

    summary: "Hands-on principal-level software engineer: designs, builds and operates production backend services in Java/Spring Boot, Python and TypeScript/Node.js - contract-first microservices on OpenAPI, event-driven systems on Kafka, MQ and AWS serverless, multi-tenant container platforms on ECS/EKS with Istio and mesh-wide mTLS. Owns the reference architecture and much of the implementation for an on-demand application platform serving hundreds of developers across 80+ product teams at a global bank, plus four years shipping production GenAI systems - RAG over ChromaDB/Milvus, multi-agent orchestration with AutoGen, concurrent LLM invocation, FastAPI services other teams consumed rather than rebuilt. Works day to day in Claude Code, GitHub Copilot and Cursor, and packages recurring platform work as agent skills and subagents behind an MCP server. Previously lead architect and implementer of a commercial multi-cloud cost analytics platform, lead software engineer on Oracle's cloud integration connectivity SDK, and author of Barclays' group-wide Microservices Architecture Handbook. US Citizen.",

    skills: [
        "Languages: Java, Python, TypeScript/JavaScript, Kotlin, Go, SQL, Bash, Terraform HCL.",
        "Backend and distributed systems: Spring Boot, FastAPI, Node.js; contract-first microservices on OpenAPI; event-driven architecture, CQRS, event sourcing; Kafka, IBM MQ, EventBridge/SQS/SNS; ClickHouse, PostgreSQL, PySpark/Databricks.",
        "AWS and platform: ECS/Fargate, EKS, Lambda, Step Functions, RDS, S3, IAM/OIDC, Secrets Manager, KMS; Istio with mesh-wide mTLS; multi-tenant isolation; Terraform/Terragrunt module libraries.",
        "GenAI engineering: RAG over ChromaDB and Milvus, retrieval tuning, multi-agent orchestration (AutoGen), prompt engineering, async LLM invocation, model-backed APIs on FastAPI.",
        "AI-assisted engineering: Claude Code, GitHub Copilot and Cursor daily; recurring work automated as agent skills, subagents and MCP servers; sets the team's trust and review boundaries for generated code.",
        "Practice and leadership: Clean Architecture, SOLID, JUnit with test containers, code review; Dynatrace, Splunk and Prometheus debugging, JVM tuning; authored Barclays' group-wide Microservices Architecture Handbook and chaired a ~30-member technology strategy working group.",
    ],

    technologies: [
        {
            "daily-programming-language": [
                "Java",
                "Python",
                "TypeScript/JavaScript",
                "Terraform",
                "SQL",
                "Bash"
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
            achievements: "Hands-on principal architect and engineer for the on-demand application platform used by hundreds of developers across more than 80 product teams. Owns the Java Spring Boot provisioning backend, the ECS/EKS and Istio service-mesh reference architecture, the Terraform module library behind it, and the observability, secrets and TLS standards every onboarding service inherits. Cut new-service environment provisioning from weeks to hours and onboarded more than 200 microservices onto the paved road. Set the team's AI-assisted development practice on Claude Code, GitHub Copilot and Cursor, and automated recurring platform work - service onboarding, environment triage, incident first-pass - as agent skills and subagents backed by an MCP server over the platform's own APIs.",
            projects: [
                {
                    title: "On Demand Environment (ODE) backend (Jav",
                    highlights: [
                        "Architected the backend infrastructure w",
                        "Made provisioning idempotent and repeata",
                        "Drove the team's AI-assisted development",
                    ],
                },
                {
                    title: "EKS Service Mesh (Istio) on-demand frame",
                    highlights: [
                        "Designed and implemented the multi-tenan",
                        "Enforced mTLS mesh-wide in STRICT mode f",
                    ],
                },
                {
                    title: "Proprietary Environment As Code (EAC/IAC",
                    highlights: [
                        "Set the team's working practice for AI-a",
                        "Built an MCP server exposing the platfor",
                        "Packaged the team's recurring runbooks a",
                    ],
                },
            ],
        },
        {
            company: "Biophy",
            achievements: "Hands-on director of cloud architecture for an AI-powered healthcare platform. Led the retrieval corpus pipeline behind the product's RAG system - multi-source ingestion and scraping, chunking and embedding, deduplication and data-quality controls on Python/Django/Pydantic with LangChain, structured under Clean Architecture and SOLID so it stayed testable as sources multiplied - and built a custom CloudWatch alerting system on EventBridge, Lambda, SQS and SNS.",
            projects: [
                {
                    title: "AI-Powered Data Ingestion and Scraping S",
                    highlights: [
                        "Implemented intelligent web scraping cap",
                        "Built the chunking, embedding and upsert",
                    ],
                },
            ],
        },
        {
            company: "McKinsey & Company",
            achievements: "Built GenAI platform capability for enterprise modernization engagements: retrieval systems over ChromaDB/Milvus, multi-agent orchestration with AutoGen, and FastAPI services exposing model-backed capabilities as internal APIs other engineering teams consumed rather than rebuilt. Separately migrated and refactored mainframe event-driven systems onto AWS serverless (EventBridge, Lambda, Step Functions, SQS/SNS, EKS) with a Spring Boot schema-translating router.",
            projects: [
                {
                    title: "Using genAI (openAI) with RAG (ChromaDB,",
                    highlights: [
                        "Prompt engineering and tuning to generat",
                        "Tuned the retrieval layer rather than on",
                        "Closed the generate-test-repair loop: a ",
                    ],
                },
                {
                    title: "Using genAI (openAI) with multi-agents t",
                    highlights: [
                        "Designed the human-in-the-loop step arou",
                        "Designed the agent workflow itself - ana",
                    ],
                },
                {
                    title: "Migration/Refactoring of Mainframe (IBM ",
                    highlights: [
                        "Develop SpringBoot EKS router to convert",
                    ],
                },
            ],
        },
        {
            company: "Yotascale",
            achievements: "Lead architect and lead implementation engineer for a commercial multi-cloud (AWS/Azure/GCP) cost analytics, optimization and management platform - design-first Spring Boot microservices on ClickHouse and PostgreSQL, plus the AWS platform (EKS/Istio/Terraform/Terragrunt) they ran on.",
            projects: [
                {
                    title: "Lead Architect and Lead Implementation E",
                    highlights: [
                        "Introduce and Build Microservice Design ",
                        "Design and develop Cost Analytics/Lens N",
                        "Delivered cost allocation, showback and ",
                    ],
                },
            ],
        },
        {
            company: "Gigster Inc.",
            achievements: "Architected and implemented the AWS platform behind an image manipulation and detection evaluation product: Node.js microservices and event-driven workloads on EKS, with the entire stack provisioned from a Terraform/Terragrunt repository.",
            projects: [
                {
                    title: "Images manipulation/detection software e",
                    highlights: [],
                },
            ],
        },
        {
            company: "Barclays",
            achievements: "Delivery lead for the group's strategic distributed-systems technology domain - microservices, event-driven architecture, message transport, integration and stream processing - and lead architect for cloud adoption across Contact Center, Merchant Services and Fraud.",
            projects: [
                {
                    title: "Delivery Lead for strategic distributed ",
                    highlights: [
                        "Establish group-wide distributed system ",
                        "Evaluate around 200 existing products/te",
                        "Create the architecture handbook for Mic",
                    ],
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
