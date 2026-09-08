/**
 * Role profile: performance-eng
 *
 * Full-detail view for Performance / Reliability Engineer roles - the ones that lead with
 * profiling, tracing, instrumentation, root-cause analysis, latency and throughput work
 * and SLO definition, rather than with AI platform delivery, backend product engineering
 * or release automation.
 *
 * Why this is not a variant of the other profiles: the deepest performance evidence in
 * the master sits at Boomi - JVM heap and GC tuning against production out-of-memory,
 * Solr indexing at millions of transactions per day via work-stealing, response-time
 * vibration diagnosed from collected statistics, MySQL lock-timeout and isolation-level
 * work, and OS-level IO and CPU investigation with vmstat/iostat/sar - and every other
 * profile collapses Boomi into the "Earlier career" block. This one promotes Boomi and
 * Comcast (the purpose-built Graphite/jmxtrans/statsd metrics platform for JVM, Jetty and
 * Linux) to full employers, and leads the modern half with Dynatrace distributed tracing
 * and the Prometheus/Grafana/Jaeger mesh observability stack.
 *
 * Content comes from resume.json (the master); this file carries only the selection and
 * the prose that is specific to this role. Build with:
 *   node build-resume.js performance-eng --pdf
 */

module.exports = {
    name: "performance-eng",
    output: "resume-performance-eng.json",
    html: "resume-performance-eng.html",
    pdf: "YongjunRong-Performance-Engineer.pdf",
    summaryTags: ["PerformanceEng"],

    summary: "Individual-contributor systems engineer who finds out why production is slow and then fixes it at the layer that actually causes it. Twenty-five years of root-cause work across the stack: JVM heap and GC tuning against recurring production out-of-memory, Apache Solr indexing scaled to millions of transactions a day with a work-stealing design, response-time vibration diagnosed from collected latency statistics rather than guessed at, MySQL table-lock timeouts traced to the wrong isolation level, and filesystem IO and CPU contention investigated with vmstat, iostat, sar and benchmark harnesses. Builds the instrumentation as well as reading it - designed a purpose-built metrics platform on Graphite, jmxtrans, statsd and metricsd with custom UDP collectors in Java and Scala to get deep JVM and OS visibility that off-the-shelf tooling did not provide, and today instruments Spring Boot services with Dynatrace OneAgent injected at JVM startup, delivering distributed tracing that cut mean time to resolution on cross-service latency, plus the Prometheus/Grafana/Jaeger/Kiali golden-signal stack behind an Istio mesh. Holds interactive query latency on multi-terabyte datasets in ClickHouse, and raised inference pipeline throughput against a rate-limited API through asyncio concurrency rather than more hardware. Currently principal architect for an on-demand application platform serving hundreds of developers at a global bank, where the observability, secrets and TLS standards every service inherits are his. Comfortable in ambiguity and at both altitudes: authored group-wide architecture handbooks and chaired a technology strategy working group across roughly 200 products, and still writes the Python, Java and Terraform. US Citizen; fluent English, native Chinese.",

    skills: [
        "Performance root-cause analysis: JVM heap and garbage-collection tuning against production out-of-memory, new- and old-generation analysis with visualVM, jmap and jstat, heap-dump capture automated into the defect workflow; response-time vibration diagnosed from collected statistics; database lock-timeout and isolation-level investigation.",
        "Profiling, tracing and instrumentation: Dynatrace OneAgent injected at JVM startup through customized Dockerfiles for APM and distributed tracing; Jaeger and Kiali for mesh-level traces; Splunk for correlated log analysis; purpose-built metrics collectors over UDP where existing tooling could not reach the JVM and OS internals.",
        "Observability platforms built from scratch: a unified monitoring system on Graphite, gdash, metricsd, statsd, jmxtrans and god for Jetty, JVM and Linux, with custom UDP metrics connectors written in Java and Scala and dashboard templates generated from configuration; Prometheus/Grafana/Jaeger golden-signal dashboards delivered to product teams as a platform default.",
        "Throughput and latency engineering: work-stealing design for an Apache Solr indexing cluster sustaining millions of transactions per day; distributed caching with ehcache to take read traffic off the database; a dynamic HTTP polling algorithm that removed request-storm behaviour from the front end; comet and Jetty continuation asynchronous long-polling; asyncio concurrent inference orchestration that raised pipeline throughput without exceeding API rate limits.",
        "OS and infrastructure internals: filesystem IO, CPU and memory contention analysis with vmstat, iostat, top and sar plus dbench/unixbench benchmark harnesses; disk IO tuning by partition layout; Linux HA clustering with Pacemaker, keepalived and HAProxy; GFS2 over SAN multipath, DRBD and LVM; bare-metal provisioning and storage/RAID configuration.",
        "Data-layer performance: interactive query latency held on multi-terabyte datasets in ClickHouse; PostgreSQL master/slave clustering; MySQL tuning and clustering research; Oracle DB and RAC-backed clustering; vector-store collection sizing and partitioning to keep retrieval latency flat as a corpus grows.",
        "Distributed systems at scale: multi-tenant AWS ECS/EKS container platforms, Istio service mesh with mesh-wide mTLS, event-driven architecture on Kafka, IBM MQ, EventBridge, Lambda, Step Functions and SQS/SNS; contract-first microservices on OpenAPI; CQRS and event sourcing.",
        "Cost as a performance dimension: architected and implemented a commercial multi-cloud cost analytics, allocation and rightsizing platform; reduced Splunk indexed volume and its licence cost through logback tuning; established a FinOps model with unit-cost metrics inside a product organization.",
        "Languages and runtimes: Java and Spring Boot, Python (asyncio, FastAPI), TypeScript/Node.js, Bash, Ruby, Scala, SQL, Terraform HCL; JVM internals day to day, and Python concurrency in production GenAI services.",
        "AI-assisted engineering: Claude Code, GitHub Copilot and Cursor daily; automated first-pass incident triage as an agent that pulls a failing service's Splunk logs and Dynatrace traces and correlates them across the call path; recurring platform work packaged as agent skills and subagents behind an MCP server.",
        "Working across teams under ambiguity: partnered with application teams to run down complex performance problems using distributed tracing, authored Barclays' group-wide Microservices Architecture Handbook, chaired a ~30-member technology strategy working group setting invest/divest positions across ~200 products, and onboarded engineering teams onto platform defaults they had not asked for.",
    ],

    technologies: [
        {
            "daily-programming-language": [
                "Java",
                "Python",
                "Bash",
                "SQL",
                "Terraform",
                "TypeScript/JavaScript"
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
            technologies: ["Dynatrace APM / distributed tracing", "Splunk", "Prometheus/Grafana/Jaeger/Kiali", "JVM instrumentation", "AWS ECS/EKS", "Istio Service Mesh", "Terraform", "AI-assisted development (Claude Code, GitHub Copilot, Cursor)"],
            projects: [
                {
                    title: "Design and implement Splunk and Dynatrac",
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
                    title: "On Demand Environment (ODE) backend (Jav",
                    highlights: [
                        "Architected the backend infrastructure w",
                        "Ran workloads on ECS Fargate to take EC2",
                        "Built the Java Spring Boot backend that ",
                        "Made provisioning idempotent and repeata",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "Boomi Inc.",
            technologies: ["JVM heap & GC tuning", "visualVM/jmap/jstat", "Apache Solr", "ehcache distributed cache", "Jetty / comet continuation", "MySQL tuning", "vmstat/iostat/sar", "AWS EC2/S3", "Java/J2EE"],
            projects: [
                {
                    title: "Cloud Platform/Infrastructure Design and",
                    retitle: "Production cloud platform performance: JVM/GC tuning, Solr throughput and response-time diagnosis",
                    redescribe: "The clustered production platform behind one of the first iPaaS products, and the performance work that kept it up: heap and garbage-collection tuning against recurring out-of-memory, an Apache Solr indexing cluster carrying millions of transactions a day on a work-stealing design, distributed caching to take read load off the database, a polling algorithm that removed request-storm behaviour from the front end, and response-time vibration diagnosed from collected statistics rather than guessed at.",
                    highlights: [
                        "Design, implement and troubleshooting Apac",
                        "Using Sun JVM troubleshooting utilities (v",
                        "Tuning heap size and GC algorithm paramete",
                        "Collect response time statistics data to d",
                        "Using Unix vmstat, top,...etc. to investig",
                        "Using worker-stealing algorithm to design ",
                        "Design distributed cache system using ehca",
                        "Design and implement the dynamic http poll",
                        "Using comet, jetty continuation to design ",
                        "Research and proto-type cluster solutions ",
                        "Research and proto-type MySQL clustering t",
                        "Setup newrelic monitoring environment",
                        "Plan, Design and setup the clustering SOA ",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Amazon EC2 and S3 SOA HA Environment",
                    retitle: "High-availability SOA cluster on AWS EC2/S3: timeout, lock-contention and cache tuning",
                    highlights: [
                        "Troubleshooting timeout and performance pr",
                        "Troubleshooting MySQL 5.x  performance (ta",
                        "Configure distributed cache for the HA clu",
                        "Setup Apache httpd load balancer (mod_prox",
                        "Troubleshooting EC2 instance network and A",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Research virtualization technology and im",
                    retitle: "OS-level performance diagnosis and IO tuning on virtualized infrastructure",
                    highlights: [
                        "Using top, vmstat, iostat and sar and some",
                        "Tuning Disk I/O performance via distributi",
                        "Adding new hard disk to Logic Volume Group",
                        "Upgrade Dell and LSI RAID Controller BIOS ",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Boomi  On-Demand Business Integration Clo",
                    retitle: "iPaaS integration platform: concurrency, messaging and distributed caching",
                    highlights: [
                        "Multiple threads concurrent subsystem desi",
                        "Design and implement distributed cache in ",
                        "Design and implement synchronous/asynchron",
                        "Design and deploy the load balancing and c",
                        "Deploy SOA system in Amazon's EC2 and S3",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "Comcast T&P",
            technologies: ["Graphite/gdash/metricsd/statsd", "jmxtrans", "JVM & Jetty metrics", "Java/Scala UDP collectors", "Splunk", "Linux HA (Pacemaker/HAProxy/keepalived)", "Ruby/Bash/Perl/Python"],
            projects: [
                {
                    title: "Performance Monitoring System for Jetty,",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Linux HA for Git Repo(Gerrit) and Maven ",
                    retitle: "High-availability Linux clustering for the SCM and artifact-repository estate",
                    highlights: [
                        "Design Linux HA master/slave failover clus",
                        "Configure pacemaker/corosync/cman for two-",
                        "Setup and configure  keepalived and haprox",
                        "Developed HAProxy initd scripts to automat",
                        "Setup Distributed filesystem GFS2 over SAN",
                        "Setup PostgreSQL master/slave cluster over",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Automation scripts and tools for DevOps",
                    retitle: "Diagnostic and repository-performance automation",
                    highlights: [
                        "Develop scripts to find the largest commit",
                        "Developed automation tools to create Rally",
                        "Developed maven circular dependency checki",
                        "Migrated Solr from Single-core to multi-co",
                        "Developed bash scripts to launch python sc",
                    ],
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
                    retitle: "Multi-cloud cost analytics platform: interactive query latency over multi-terabyte datasets",
                    highlights: [
                        "Delivered cost allocation, showback and ri",
                        "Design and develop Cost Analytics/Lens Nav",
                        "Develop common multiple DBMS (ClickHouse a",
                        "Design and implement dynamic metadata driv",
                        "Introduce and Build Microservice Design Fi",
                        "Implement Junit test cases with local dock",
                        "Established the FinOps model inside the pr",
                        "Onboarded the engineering teams onto the d",
                    ],
                    tags: undefined,
                },
            ],
        },
        {
            company: "McKinsey & Company",
            technologies: ["Python/asyncio/FastAPI", "ChromaDB/Milvus", "OpenAI API", "Databricks/pyspark", "AWS EventBridge/Lambda/Step Functions", "IBM MQ", "EKS"],
            projects: [
                {
                    title: "Using genAI (openAI) with RAG (ChromaDB,",
                    retitle: "Concurrent inference orchestration and retrieval tuning for a code-generation platform",
                    highlights: [
                        "Built concurrent inference orchestration o",
                        "Prompt engineering and tuning to generate ",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Using genAI (openAI) with multi-agents t",
                    retitle: "Retrieval-layer scaling for a multi-agent modernization platform",
                    highlights: [
                        "Sized and partitioned collections per appl",
                    ],
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
            company: "Barclays",
            projects: [
                {
                    title: "Delivery Lead for strategic distributed ",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        { literal: {
          "start-date": "Apr.,1996",
          "end-date": "Feb., 2025",
          "position": "<span class=\"career-list\"><span class=\"career-item\"><span class=\"career-co\">Biophy<span class=\"career-yr\"> 2025</span></span><span class=\"career-role\">Director of Cloud Architecture</span></span><span class=\"career-item\"><span class=\"career-co\">Gigster<span class=\"career-yr\"> 2020</span></span><span class=\"career-role\">Infrastructure / DevOps Architect</span></span><span class=\"career-item\"><span class=\"career-co\">Oracle<span class=\"career-yr\"> 2014-2017</span></span><span class=\"career-role\">Lead Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Vantage Learning<span class=\"career-yr\"> 2006</span></span><span class=\"career-role\">Sr. System Engineer Manager</span></span><span class=\"career-item\"><span class=\"career-co\">Texas Tech University<span class=\"career-yr\"> 2002-2006</span></span><span class=\"career-role\">Programmer/Analyst, Unix SysAdmin</span></span><span class=\"career-item\"><span class=\"career-co\">Sun Microsystems China<span class=\"career-yr\"> 2000-2002</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">IBM China R&amp;D<span class=\"career-yr\"> 1998-2000</span></span><span class=\"career-role\">Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Taiji Computers<span class=\"career-yr\"> 1996-1997</span></span><span class=\"career-role\">System / Network Engineer</span></span></span>",
          "position-header": "Director of Cloud Architecture / Lead Software Engineer / Systems and Network Engineer",
          "company": {
            "name": "Other roles",
            "city": "USA",
            "country": "China"
          },
          "achievements": "The remaining employers, summarized rather than expanded because their work is less directly about performance. At Biophy, director of cloud architecture for an AI healthcare platform - the retrieval corpus pipeline behind its RAG system, the AWS estate brought under Terraform/Terragrunt to the Well-Architected Framework, and a custom CloudWatch alerting system on EventBridge, Lambda, SQS and SNS. At Gigster, a fully automated AWS EKS platform for Node.js microservices provisioned end to end in Terraform/Terragrunt. At Oracle, lead software engineer on the cloud integration connectivity SDK and Java connectors joining SOA Suite and Integration Cloud Service to enterprise applications, including cache and pagination APIs for the persistence layer and Docker Swarm/Compose CI environments. Earlier: a 100+ server data centre at Vantage Learning; networked Unix estates with cross-realm Kerberos and OpenLDAP single sign-on, Veritas NetBackup and RAID arrays at Texas Tech University alongside an MS in Computer Science; and enterprise Java, payments and storage-management systems at Sun Microsystems China and IBM China R&D, plus IBM RS/6000 production support and large-scale Cisco network design at Taiji Computers.",
          "technologies": [
            "Terraform/Terragrunt",
            "AWS EKS / CloudWatch / EventBridge",
            "Python/Django/LangChain",
            "Java/J2EE",
            "Docker Swarm/Compose",
            "Linux/Solaris/AIX administration",
            "Kerberos/LDAP/SSO",
            "Cisco routing and switching"
          ],
          "projects": [
            {
              "item-projects": {
                "title": "Biophy: RAG corpus pipeline, Terraform-managed AWS estate and custom CloudWatch alerting",
                "description": "Multi-source retrieval corpus ingestion on Python/Django/Pydantic with LangChain under Clean Architecture, the existing AWS estate imported and redesigned to the Well-Architected Framework in Terraform/Terragrunt, and an event-driven alerting system on EventBridge, Lambda, SQS and SNS."
              }
            },
            {
              "item-projects": {
                "title": "Oracle: cloud integration connectivity SDK, caching APIs and Docker CI environments",
                "description": "SDK and plugin framework linking Oracle SOA Suite and Integration Cloud Service to SaaS and on-premises applications, including cache and pagination APIs for the backend persistence layer, with Docker Swarm/Compose/Stack CI test environments on Oracle Cloud VMs, Amazon EC2 and local hypervisors."
              }
            },
            {
              "item-projects": {
                "title": "Unix estate administration, Kerberos/LDAP single sign-on and enterprise Java delivery",
                "description": "Networked Solaris, AIX, Mac OS X and Linux servers with cross-realm Kerberos KDC, OpenLDAP and PAM single sign-on, Veritas NetBackup over RAID disk arrays and an NIS/NIS+ to LDAP migration; J2EE architecture at Sun Microsystems China and IBM WebSphere systems at IBM China R&D."
              }
            }
          ]
        } },
    ],
};
