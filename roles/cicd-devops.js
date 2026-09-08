/**
 * Role profile: cicd-devops
 *
 * Full-detail view for CI/CD, release-engineering and DevOps systems-engineering roles
 * (ManTech System Engineer (CI/CD), and anything else that leads with pipelines, release
 * automation, DevSecOps controls and deployment tooling rather than with AI platform work
 * or with backend product engineering).
 *
 * Why this is not a variant of `ai-platform` or `principal-swe`: both of those collapse
 * Oracle and Comcast into the "Earlier career" block, and that is exactly where the
 * deepest CI/CD evidence in the master lives - the AutoBuild dependency-graph release
 * system across 200+ repositories, the Bamboo/Jenkins cluster estate, the Gerrit/Nexus/
 * Artifactory HA platform, and the Docker Swarm/Compose CI environments built for
 * Oracle's connector teams. This profile promotes both to full employers.
 *
 * Content comes from resume.json (the master); this file carries only the selection and
 * the prose that is specific to this role. Build with:
 *   node build-resume.js cicd-devops --pdf
 */

module.exports = {
    name: "cicd-devops",
    output: "resume-cicd-devops.json",
    html: "resume-cicd-devops.html",
    pdf: "YongjunRong-CICD-Systems-Engineer.pdf",
    summaryTags: ["CICD"],

    summary: "Hands-on systems and DevOps engineer with twenty-five years building the build, release and deployment machinery other engineers depend on. Designed and owned end-to-end CI/CD at scale: a dependency-graph (DAG) driven AutoBuild system that built, branched, tagged and released more than 200 microservice repositories at Comcast, cutting release cycles from days to hours, on a clustered Bamboo and Jenkins estate with Gerrit, Nexus and Artifactory run behind Pacemaker/HAProxy failover. Fifteen years of Infrastructure as Code from Puppet, Chef and Capistrano through Terraform and Terragrunt module libraries, and deep shell and scripting automation in Bash, Ruby, Python and Perl. Currently principal architect for an on-demand application platform at a global bank, where more than 200 microservices onboard onto a paved road that provisions environments in hours instead of weeks and inherits its secrets, TLS and observability controls by default rather than by discipline - the DevSecOps half of pipeline design. Oracle-ecosystem background from three years as a lead software engineer on Oracle's cloud integration connectivity SDK and Java connectors for SOA Suite and Integration Cloud Service, including Docker Swarm/Compose CI environments built on Oracle Cloud VMs. Sets standards as well as builds them: authored Barclays' group-wide architecture handbooks and chaired a technology strategy working group setting invest and divest positions across roughly 200 products, and mentors the engineers who extend what he writes. US Citizen; fluent English, native Chinese.",

    skills: [
        "CI/CD pipeline design and administration: end-to-end pipelines on Jenkins and Bamboo, clustered controllers with multiple remote build agents, complex job and task chains with event and trigger dependencies across 200+ microservice projects; pipeline integration with Git/Gerrit, Maven repositories, Jira and Confluence through their CLIs and REST APIs.",
        "Release engineering and deployment automation: dependency-graph (DAG) driven build, branch, tag and release orchestration across 200+ repositories; automated dependency-version resolution through the Maven versions plugin and repository REST APIs; Capistrano deployment tasks promoting microservice stacks through Dev/QA/Staging/Prod; BOM-driven artifact release gating.",
        "Version control at scale: Git and Gerrit administration, cross-server repository migration, Git history rewriting for performance, branch locking during release windows, Gerrit hooks for issue-tracker integration, plus Subversion; OpenID and Crowd/LDAP single sign-on for the SCM estate.",
        "Shell and automation scripting: Bash, Ruby, Python and Perl for build, release, provisioning and diagnostic automation - error handling and logging frameworks, XMLRPC clients, repository replication, circular-dependency checkers run as nightly CI jobs.",
        "DevSecOps and security controls in the delivery path: AWS Secrets Manager and KMS to keep credentials out of repositories and images, least-privilege IAM with OIDC/IRSA, mesh-wide mTLS on Istio, automated TLS certificate issuance and Route 53/ACM wiring, per-tenant isolation and quotas.",
        "Infrastructure as Code and configuration management: Terraform and Terragrunt versioned module libraries with DRY multi-environment configuration; Puppet, Chef, Ansible and Capistrano; code-driven provisioning of full environments including networking, IAM, DNS, certificates and data stores.",
        "Cloud and container platforms: AWS ECS/Fargate, EKS, Lambda, Step Functions, EventBridge, ALB, Route 53, ACM, RDS, S3; Docker, Docker Compose, Swarm and Stack, Kubernetes and Helm; Oracle Cloud VMs, Azure AKS and GCP exposure.",
        "Linux systems engineering: high-availability clustering with Pacemaker, Corosync, keepalived and HAProxy; GFS2 over SAN multipath, DRBD, LVM; bare-metal provisioning with PXE/TFTP/DHCP and Cobbler; Kerberos and LDAP single sign-on; JVM heap and GC tuning.",
        "Databases in the delivery path: Oracle DB (JDBC configuration, RCU descriptive schema definitions for tables/sequences with primary and foreign keys, Artifactory clustering over RAC), PostgreSQL master/slave clusters, MySQL, ClickHouse, DynamoDB; SQL day to day.",
        "Observability and diagnostics: Splunk, Dynatrace, Prometheus/Grafana/Jaeger, CloudWatch; purpose-built metrics pipelines on Graphite/jmxtrans/statsd for JVM, Jetty and Linux; heap and GC analysis with the JVM tooling.",
        "AI-assisted engineering: Claude Code, GitHub Copilot and Cursor daily; recurring platform work - service onboarding, environment triage, incident first-pass - packaged as agent skills and subagents behind an MCP server over the platform's own APIs; sets the team's trust and review boundaries for generated code.",
        "Standards and mentoring: authored Barclays' group-wide Microservices Architecture Handbook, chaired a ~30-member technology strategy working group setting invest/divest positions across ~200 products, designed the code and branching conventions developers followed for AutoBuild, and led and trained the teams that maintained it.",
    ],

    technologies: [
        {
            "daily-programming-language": [
                "Bash",
                "Python",
                "Terraform",
                "Ruby",
                "Java",
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
            technologies: ["CI/CD", "IaC", "Terraform", "AWS ECS/EKS", "Istio Service Mesh", "AWS Secrets Manager", "TLS Certificate", "Splunk/Dynatrace", "AI-assisted development (Claude Code, GitHub Copilot, Cursor)"],
            projects: [
                {
                    title: "On Demand Environment (ODE) backend (Jav",
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
                    title: "Proprietary Environment As Code (EAC/IAC",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "Comcast T&P",
            technologies: ["Jenkins", "Bamboo", "Git/Gerrit", "Subversion", "Maven", "Nexus/Artifactory", "Puppet", "Capistrano", "Ruby/Bash/Perl/Python", "Linux HA (Pacemaker/HAProxy/keepalived)", "Docker/CoreOS"],
            projects: [
                {
                    title: "Continuous Integration (CI) and Continuo",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "AutoBuild System for Build/Release more t",
                    highlights: [
                        "Design and implement the whole AutoBuild",
                        "Implement build dependency graph (direct",
                        "Design and implement the branching/taggi",
                        "Using ruby and bash scripts wraps multip",
                        "Detect and update the dependency version",
                        "Developed ruby/bash scripts to lock/unlo",
                        "Design and implement the error handling ",
                        "Design code standards and rule to follow",
                        "Develop bamboo scripts using bamboo comm",
                        "Install and configure Bamboo, Nexus, Art",
                        "Refactoring autoBuild to adapt to much l",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Configuration management and deployment a",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Automation scripts and tools for DevOps",
                    highlights: [
                        "Develop migration tools to migrate git r",
                        "Develop scripts to find the largest comm",
                        "Develop Gerrit/git hooks for rally and j",
                        "Develop multiple automation tools using ",
                        "Developed tools to automatically build t",
                        "Developed maven circular dependency chec",
                        "Developed Nexus replication scripts from",
                        "Maintain configuration management tool C",
                        "Using Puppet to automate the system leve",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "Linux HA for Git Repo(Gerrit) and Maven ",
                    highlights: [
                        "Design Linux HA master/slave failover cl",
                        "Configure pacemaker/corosync/cman for tw",
                        "Setup and configure  keepalived and hapr",
                        "Developed HAProxy initd scripts to autom",
                        "Setup Gerrit cluster over SAN and Postgr",
                        "Setup Artifactory Cluster over SAN and R",
                        "Setup Nexus Cluster via replication scri",
                        "Setup Gerrit OpenID authentication with ",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    title: "SDLC process management and junior team m",
                    highlights: [
                        "Help to design and identify the build/re",
                        "Design standard development and code sta",
                        "Lead small team to develop autoBuild sys",
                        "Administration the SCM/CI/Maven Repos cl",
                        "Research and design github enterprise br",
                        "Train and guide new team member",
                        "Troubleshooting build/release and config",
                    ],
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "Oracle",
            technologies: ["Docker Swarm/Compose/Stack", "Oracle Cloud VMs", "WebLogic", "Oracle SOA Suite / Integration Cloud Service", "Java/J2EE", "Oracle RCU / DB schema", "CI/CD test environments"],
            projects: [
                {
                    title: "Docker Swarm/Compose/Stack CD/CI Test En",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
                {
                    // The WSDL/XSD generation detail is irrelevant to a CI/CD role; keep the
                    // Oracle-stack, schema and cross-team enablement evidence.
                    title: "Cloud Enterprise Applications Integratio",
                    highlights: [
                        "Designed and implemented new APIs for th",
                        "Design and test Oracle RCU DB descriptiv",
                        "Worked together with different connector",
                        "Train and transfer knowledge for the WSD",
                    ],
                    leaderships: 'all',
                    tags: undefined,
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
                    title: "Custom AWS CloudWatch Alerting System wi",
                    highlights: 'all',
                    leaderships: 'all',
                    tags: undefined,
                },
            ],
        },
        {
            company: "McKinsey & Company",
            technologies: ["Terraform", "AWS EventBridge/Lambda/Step Functions/SQS/SNS", "EKS", "IBM MQ", "Event Driven Architecture (EDA)", "Databricks/pyspark", "AI-assisted development (GitHub Copilot, Cursor)"],
            projects: [
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
                {
                    title: "Images manipulation/detection software ev",
                    retitle: "Fully automated AWS EKS platform provisioned end to end in Terraform/Terragrunt",
                    redescribe: "AWS infrastructure for Node.js microservices and event-driven workloads on EKS, provisioned entirely from a Terraform/Terragrunt IaC repository - ALB ingress controller, IAM/OIDC service-account roles, Helm-deployed RabbitMQ and PostgreSQL, Route 53 zones with TLS certificate validation, and S3/SFTP backing services.",
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
          "end-date": "Oct., 2010",
          "position": "<span class=\"career-list\"><span class=\"career-item\"><span class=\"career-co\">Boomi<span class=\"career-yr\"> 2006-2010</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Vantage Learning<span class=\"career-yr\"> 2006</span></span><span class=\"career-role\">Sr. System Engineer Manager</span></span><span class=\"career-item\"><span class=\"career-co\">Texas Tech University<span class=\"career-yr\"> 2002-2006</span></span><span class=\"career-role\">Programmer/Analyst, Unix SysAdmin</span></span><span class=\"career-item\"><span class=\"career-co\">Sun Microsystems China<span class=\"career-yr\"> 2000-2002</span></span><span class=\"career-role\">Sr. Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">IBM China R&amp;D<span class=\"career-yr\"> 1998-2000</span></span><span class=\"career-role\">Software Engineer</span></span><span class=\"career-item\"><span class=\"career-co\">Taiji Computers<span class=\"career-yr\"> 1996-1997</span></span><span class=\"career-role\">System / Network Engineer</span></span></span>",
          "position-header": "Senior Software Engineer / Systems Engineering Manager / Unix Systems Administrator",
          "company": {
            "name": "Earlier career",
            "city": "USA",
            "country": "China"
          },
          "achievements": "Fourteen years of platform, build and systems engineering preceding the DevOps and cloud work above. At Boomi - one of the first iPaaS products - built the SOA connector framework and the clustered production cloud platform on AWS EC2/S3 and managed data centres, set up the development, build, release and deployment environments for QA, Staging and Production on Maven, Subversion and TeamCity with Ant and shell release scripts, and tuned JVM heap and GC for Apache Solr indexing at millions of transactions per day. Ran a 100+ server data centre at Vantage Learning. At Texas Tech University, administered networked Unix estates (Solaris, AIX, Mac OS X, Linux) with cross-realm Kerberos and OpenLDAP single sign-on, Veritas NetBackup and RAID disk arrays, and migrated NIS/NIS+ to LDAP, alongside an MS in Computer Science. Earlier still, enterprise Java and J2EE delivery at Sun Microsystems China and IBM China R&D, and IBM RS/6000 production support plus large-scale Cisco network design at Taiji Computers.",
          "technologies": [
            "Java/J2EE",
            "Maven/Subversion/TeamCity",
            "Ant / shell release scripting",
            "AWS EC2/S3",
            "Linux/Solaris/AIX administration",
            "Kerberos/LDAP/SSO",
            "JVM & GC tuning",
            "Apache Solr",
            "MySQL"
          ],
          "projects": [
            {
              "item-projects": {
                "title": "Boomi AtomSphere iPaaS: build/release environments and the production cloud platform",
                "description": "Development, build, release and deployment environments for QA, Staging and Production on Maven, Subversion and TeamCity with Ant and Unix shell release scripts, plus the clustered production platform on EC2/S3 including distributed caching, Solr indexing at millions of transactions per day and JVM heap/GC tuning."
              }
            },
            {
              "item-projects": {
                "title": "Unix estate administration, Kerberos/LDAP single sign-on and grid computing",
                "description": "Networked Solaris, AIX, Mac OS X and Linux servers with cross-realm Kerberos KDC, OpenLDAP and PAM single sign-on, Veritas NetBackup over RAID disk arrays, and an NIS/NIS+ to LDAP migration for the computer science research and teaching labs."
              }
            },
            {
              "item-projects": {
                "title": "Enterprise Java/J2EE delivery and infrastructure engineering",
                "description": "J2EE systems around iPlanet Application Server, Directory Server and Message Queue at Sun Microsystems China and IBM WebSphere at IBM China R&D; IBM RS/6000 and disk-array production support and large-scale Cisco router and switch network design at Taiji Computers."
              }
            }
          ]
        } },
    ],
};
