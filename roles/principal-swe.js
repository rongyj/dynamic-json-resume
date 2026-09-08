/**
 * Role profile: principal-swe
 *
 * Full-detail view for Principal / Staff Software Engineer roles (~9 pages).
 *
 * Content comes from resume.json (the master); this file carries only the
 * selection and the prose that is specific to this role. Build with:
 *   node build-resume.js principal-swe --pdf
 */

module.exports = {
    name: "principal-swe",
    output: "resume-principal-swe.json",
    html: "resume-principal-swe.html",
    pdf: "YongjunRong-Principal-Software-Engineer.pdf",
    summaryTags: ["PrincipalSWE"],

    summary: "Hands-on principal-level software engineer with deep backend and distributed-systems experience: designing, building and operating production services in Java/Spring Boot, Python and TypeScript/Node.js, from contract-first microservices on OpenAPI to event-driven systems on Kafka, MQ and AWS serverless. Currently owns the reference architecture and much of the implementation for an on-demand application platform serving hundreds of developers across more than 80 product teams at a global bank - the Spring Boot provisioning backend, the ECS/EKS and Istio service-mesh design, and the observability, secrets and TLS standards every onboarding service inherits. Four years building production GenAI systems on top of that: RAG over ChromaDB/Milvus, multi-agent orchestration with AutoGen, concurrent LLM invocation, and FastAPI services other engineering teams consumed rather than rebuilt. Earlier, lead architect and lead implementer of a commercial multi-cloud cost analytics platform on Spring Boot/ClickHouse, lead software engineer on Oracle's cloud integration connectivity SDK, and the author of Barclays' group-wide Microservices Architecture Handbook. Works day to day in Claude Code, GitHub Copilot and Cursor, sets the practice for how his teams use them, and packages recurring platform work as agent skills and subagents behind an MCP server. Operates at principal scope: sets the standards, writes the reference implementation, and mentors the engineers who extend it. US Citizen; fluent English, native Chinese.",

    skills: [
        "Languages: Java, Python, TypeScript/JavaScript, Kotlin, Go, SQL, Bash, Terraform HCL.",
        "Backend and distributed systems: Spring Boot, FastAPI, Node.js; contract-first microservices on OpenAPI; event-driven architecture, CQRS, event sourcing; Kafka, IBM MQ, RabbitMQ, EventBridge/SQS/SNS; ClickHouse, PostgreSQL, DynamoDB; PySpark and Databricks.",
        "AWS and platform engineering: ECS/Fargate, EKS, Lambda, Step Functions, ALB, Route 53, ACM, RDS, S3, IAM/OIDC/IRSA, Secrets Manager, KMS; Istio service mesh with mesh-wide mTLS; multi-tenant isolation and quotas. Azure AKS and GCP exposure.",
        "Infrastructure as code: Terraform and Terragrunt module libraries, DRY multi-environment configuration; Puppet, Chef, Ansible; CI/CD on Jenkins, Bamboo and Bitbucket pipelines.",
        "GenAI engineering: RAG over ChromaDB and Milvus, embeddings and retrieval tuning, multi-agent orchestration (AutoGen), prompt engineering, async concurrent LLM invocation, model-backed APIs on FastAPI.",
        "AI-assisted engineering: Claude Code, GitHub Copilot and Cursor daily; recurring work automated as agent skills, subagents and MCP servers; sets the team's trust and review boundaries for generated code.",
        "Engineering practice: Clean Architecture, SOLID, JUnit with Docker test containers, design and code review; Dynatrace, Splunk, Prometheus/Grafana/Jaeger, CloudWatch; JVM heap and GC tuning.",
        "Technical leadership: authored Barclays' group-wide Microservices Architecture Handbook, chaired a ~30-member technology strategy working group setting invest/divest positions across ~200 products, and mentors engineers on service mesh, IaC and agentic workflows.",
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
            projects: [
                {
                    title: "On Demand Environment (ODE) backend (Jav",
                    highlights: [
                        "Architected the backend infrastructure w",
                        "Built the Java Spring Boot backend that ",
                        "Ran workloads on ECS Fargate to take EC2",
                        "Automated ALB listener and target-group ",
                        "Provisioned RDS instances with per-servi",
                        "Made provisioning idempotent and repeata",
                        "Drove the team's AI-assisted development",
                        "Held generated code to the build, the te",
                        "Turned the repetitive half of platform d",
                    ],
                    leaderships: [
                        "Designed the On Demand Environment as a ",
                        "Set the reusable Terraform module contra",
                    ],
                },
                {
                    title: "EKS Service Mesh (Istio) on-demand frame",
                    highlights: [
                        "Designed and implemented the multi-tenan",
                        "Developed the automation framework for d",
                        "Enforced mTLS mesh-wide in STRICT mode f",
                        "Configured Istio VirtualServices and Des",
                        "Built the mesh observability stack (Prom",
                        "Implemented mesh policies for authorizat",
                        "Designed the multi-namespace isolation s",
                        "Drafted and refactored mesh and Terrafor",
                    ],
                    leaderships: [
                        "Led the architecture and implementation ",
                        "Mentored platform and development teams ",
                    ],
                },
                {
                    title: "Design and implement AWS Secrets (ASM) s",
                    highlights: [
                        "Designed and implemented the Terraform m",
                        "Developed the Terraform resources creati",
                        "Integrated AWS SDK and Spring Cloud AWS ",
                        "Enforced encryption at rest with AWS KMS",
                    ],
                },
                {
                    title: "Proprietary Environment As Code (EAC/IAC",
                    highlights: [
                        "Self-taught the firm's proprietary Envir",
                        "Became the team's EAC subject-matter exp",
                        "Used AI coding assistants to reverse-eng",
                        "Set the team's working practice for AI-a",
                        "Built an MCP server exposing the platfor",
                        "Packaged the team's recurring runbooks a",
                    ],
                    leaderships: [
                        "Became the team's go-to expert on an und",
                        "Mentored the team on AI-assisted develop",
                        "Moved the team from ad-hoc assistant use",
                    ],
                },
                {
                    title: "Design and implement Splunk and Dynatrac",
                    highlights: [
                        "Architected the Splunk Universal Forward",
                        "Instrumented Java Spring Boot microservi",
                        "Built the reusable Terraform module that",
                        "Delivered Splunk dashboards and Dynatrac",
                        "Automated first-pass incident triage wit",
                    ],
                },
            ],
        },
        {
            company: "Biophy",
            projects: [
                {
                    title: "AI-Powered Data Ingestion and Scraping S",
                    highlights: [
                        "Architected a modular data ingestion pip",
                        "Implemented intelligent web scraping cap",
                        "Built the chunking, embedding and upsert",
                        "Designed data transformation layers foll",
                        "Built robust error handling and retry me",
                        "Created automated testing frameworks for",
                    ],
                    leaderships: [
                        "Drove the adoption of Clean Architecture",
                        "Mentored developers on modern software d",
                    ],
                },
                {
                    title: "Custom AWS CloudWatch Alerting System wi",
                    highlights: [
                        "Designed custom CloudWatch metrics and d",
                        "Implemented SQS-based message queuing fo",
                        "Configured SNS topics and subscriptions ",
                        "Built automated response workflows trigg",
                        "Implemented alert correlation and dedupl",
                    ],
                },
            ],
        },
        {
            company: "McKinsey & Company",
            projects: [
                {
                    title: "Using genAI (openAI) with RAG (ChromaDB,",
                    highlights: [
                        "Prompt engineering and tuning to generat",
                        "Designed the context-window management s",
                        "Built concurrent inference orchestration",
                        "Tuned the retrieval layer rather than on",
                        "Implement FastAPI API to expose source t",
                        "Design and document the local developmen",
                        "Paired the generation service with IDE-l",
                        "Closed the generate-test-repair loop: a ",
                    ],
                    leaderships: [
                        "Spearheaded the integration of genAI and",
                        "Introduced AI-assisted development into ",
                    ],
                },
                {
                    title: "Using genAI (openAI) with multi-agents t",
                    highlights: [
                        "Core Contributors to genAI system to mig",
                        "Contribute to develop multi-agents genAI",
                        "Built the RAG layer that accelerated COB",
                        "Indexed the mainframe dependency graph -",
                        "Designed the human-in-the-loop step arou",
                        "Designed the agent workflow itself - ana",
                    ],
                    leaderships: [
                        "Drove the integration of multi-agent gen",
                    ],
                },
                {
                    title: "Migration/Refactoring of Mainframe (IBM ",
                    highlights: 'all',
                },
            ],
        },
        {
            company: "Yotascale",
            projects: [
                {
                    title: "Lead Architect and Lead Implementation E",
                    highlights: [
                        "Introduce and Build Microservice Design ",
                        "Design and develop Cost Analytics/Lens N",
                        "Design and implement dynamic metadata dr",
                        "Implement Junit test cases with local do",
                        "Develop common multiple DBMS (ClickHouse",
                        "Delivered cost allocation, showback and ",
                        "Established the FinOps model inside the ",
                        "Onboarded the engineering teams onto the",
                    ],
                    leaderships: [
                        "Introduced and enforced microservice des",
                        "Mentored engineers in infrastructure-as-",
                    ],
                },
            ],
        },
        {
            company: "Gigster Inc.",
            projects: [
                {
                    title: "Images manipulation/detection software e",
                    highlights: [
                        "Design and implement AWS infrastructure ",
                        "Design and implement fully automated AWS",
                        "Develop terraform scripts/modules to dyn",
                        "Develop terraform templates to deploy Ra",
                    ],
                },
            ],
        },
        {
            company: "Barclays",
            projects: [
                {
                    title: "Delivery Lead for strategic distributed ",
                    highlights: [
                        "Owned end-to-end architecture for the gr",
                        "Drive technology transformation from on-",
                        "Establish group-wide distributed system ",
                        "Build PoC and Reference Architecture for",
                        "Evaluate around 200 existing products/te",
                        "Create the architecture handbook for Mic",
                    ],
                    leaderships: [
                        "Chaired a ~30-member cross-functional wo",
                        "Authored the group-wide Microservices Ar",
                        "Drove the transformation agenda - on-pre",
                    ],
                },
                {
                    title: "Group-wide Cloud Adoption for Contact Ce",
                    highlights: [
                        "Build python automation tools to access ",
                        "Using python boto3 to build tools to dyn",
                        "Defined and designed cloud strategy and ",
                        "Assess ~500 on-premises applications to ",
                    ],
                },
            ],
        },
        {
            company: "Oracle",
            projects: [
                {
                    title: "Cloud Enterprise Applications Integratio",
                    highlights: [
                        "Designed and implemented the WSDL regene",
                        "Designed and implemented new APIs for th",
                        "Dynamically and Programmatically generat",
                        "Programmatically manipulate the single W",
                        "Programmatically handle the anonymous Co",
                        "Train and transfer knowledge for the WSD",
                    ],
                },
                {
                    title: "Oracle Fusion Applications (FA) Business",
                    highlights: [
                        "Design and implement the business event ",
                        "Design and Implement the Business Event ",
                        "Programmatically manipulate the payload ",
                        "Programmatically replace the xsi:anyType",
                    ],
                    leaderships: [
                        "Architected a business event connector f",
                        "Drove the adoption of event-driven patte",
                    ],
                },
                {
                    title: "Docker Swarm/Compose/Stack CD/CI Test En",
                    highlights: [
                        "Designed and setup complex Docker contai",
                        "Designed and built the pool of Docker Cl",
                        "Developed docker-compose.yml files with ",
                    ],
                },
            ],
        },
        { literal: {
          "start-date": "Aug.,1996",
          "end-date": "Apr., 2014",
          "position": "<span class=\"career-list\"><span class=\"career-item\"><span class=\"career-co\">Comcast T&amp;P<span class=\"career-yr\"> 2010-2014</span></span><span class=\"career-role\">Sr. DevOps / Infra Automation Eng.</span></span><span class=\"career-item\"><span class=\"career-co\">Boomi<span class=\"career-yr\"> 2006-2010</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Vantage Learning<span class=\"career-yr\"> 2006</span></span><span class=\"career-role\">Sr. System Engineer Manager</span></span><span class=\"career-item\"><span class=\"career-co\">Texas Tech University<span class=\"career-yr\"> 2002-2006</span></span><span class=\"career-role\">Programmer/Analyst, Unix SysAdmin</span></span><span class=\"career-item\"><span class=\"career-co\">Sun Microsystems China<span class=\"career-yr\"> 2000-2002</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">IBM China R&amp;D<span class=\"career-yr\"> 1998-2000</span></span><span class=\"career-role\">Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Taiji Computers<span class=\"career-yr\"> 1996-1997</span></span><span class=\"career-role\">System / Network Engineer</span></span></span>",
          "position-header": "Senior Software Engineer / Senior DevOps & Infrastructure Automation Engineer / Systems Engineer",
          "company": {
            "name": "Earlier career",
            "city": "USA",
            "country": "China"
          },
          "achievements": "Eighteen years of hands-on software, platform and integration engineering preceding the cloud-native and GenAI work above. At Comcast, designed the AutoBuild system that built and released 200+ microservice projects from a dependency graph, taking release cycles from days to hours, and ran the Gerrit/Bamboo/Nexus estate on Pacemaker/HAProxy clusters with Puppet and Capistrano automation. At Boomi - one of the first iPaaS products - built the SOA connector framework with synchronous and asynchronous messaging and the clustered production cloud platform on AWS EC2/S3, including distributed caching, Apache Solr indexing at millions of transactions per day, and JVM heap and GC tuning. Earlier: a 100+ server data centre and large-scale SOA e-learning architecture at Vantage Learning; cross-realm Kerberos/LDAP single sign-on and Globus grid computing at Texas Tech University alongside an MS in Computer Science; and enterprise Java, JMS, online payments and Jiro/Jini storage-management systems at Sun Microsystems China and IBM China R&D.",
          "technologies": [
            "Java/J2EE",
            "SOA / EAI / iPaaS",
            "JMS / messaging",
            "CI/CD (Bamboo, Jenkins, Maven)",
            "Puppet/Capistrano",
            "AWS EC2/S3",
            "Apache Solr",
            "JVM & GC tuning",
            "Linux HA clustering",
            "Kerberos/LDAP/SSO"
          ],
          "projects": [
            {
              "item-projects": {
                "title": "Comcast AutoBuild: dependency-graph build and release automation for 200+ microservices",
                "description": "Directed-acyclic-graph driven build, branch and release automation across 200+ repositories with Git/SVN/Maven, taking release cycles from days to hours, plus the Gerrit/Bamboo/Nexus estate on Pacemaker/HAProxy clusters and configuration managed by Puppet and Capistrano."
              }
            },
            {
              "item-projects": {
                "title": "Boomi AtomSphere iPaaS: SOA connector framework and production cloud platform on AWS",
                "description": "Connector framework with synchronous and asynchronous messaging for desktop, ERP and SaaS integration, plus the clustered production platform on EC2/S3 including distributed caching, Solr indexing at millions of transactions per day and JVM heap/GC tuning."
              }
            },
            {
              "item-projects": {
                "title": "Enterprise Java, messaging and storage-management systems at Sun Microsystems China and IBM China R&D",
                "description": "J2EE architecture and JMS prototypes for remote-learning and B2B platforms at Sun Microsystems China; credit-card online payment system and a Jiro/Jini-based storage-management system at IBM China Research and Development Lab."
              }
            },
            {
              "item-projects": {
                "title": "Kerberos/LDAP single sign-on, Globus grid computing and large-scale Unix infrastructure",
                "description": "Cross-realm Kerberos KDC, OpenLDAP and PAM single sign-on across Unix and Windows at Texas Tech University; OGSA/OGSI grid deployment with PKI/X.509 security; NIS+ to LDAP migration; and a 100+ server data centre with SOA e-learning architecture at Vantage Learning."
              }
            }
          ]
        } },
    ],
};
