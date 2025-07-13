function isArray(elem) {
    return Object.prototype.toString.call(elem) === '[object Array]';
}

function isObject(elem) {
    return Object.prototype.toString.call(elem) === '[object Object]';
}

function generatePlainTextFromJson(_json) {
    var sections = ['contact', 'education', 'work', 'projects', 'skills', 'languages', 'hobbies'];
    var resume = _json['resume'];
    var plainText = "";

    sections.forEach(function(elem, index, array) {
        plainText += elem + "\n";
        plainText += generatePlainTextSection(resume, elem);
    });

    return plainText;
}

function removeHighlights(companies) {
    companies.forEach(function(company, index, array) {
        removeHighlight(company)
    });
}


function removeHighlight(company) {
    var projects = company["item-work"].projects;
    for (var i = projects.length - 1; i >= 0; i--) {
        if (projects[i]) {
            if (projects[i]["item-projects"]) {
                delete projects[i]["item-projects"]
                if (projects[i]["item-projects"]["highlights"]) {
                    //var projTeches = projects[i]["item-projects"]["technologies"];
                    //delete projects[i]["item-projects"]["highlights"];
                }
            }
        }
    }
    // companies.forEach(function(company, index, array) {

    // });
}

function removeProjects(company) {
    var projects = company["item-work"].projects;
    for (var i = projects.length - 1; i >= 0; i--) {
        if (projects[i]) {
            delete projects[i]
        }
    }
}

function removeHighlight(project) {
    if (project["item-projects"]["highlights"]) {
        delete project["item-projects"]["highlights"];
    }
}


function removeHighlights(projects) {
    for (var i = projects.length - 1; i >= 0; i--) {
        if (projects[i]) {
            if (projects[i]["item-projects"]) {
                removeHighlight(projects[i]);
            }
        }
    }
}

function removeProjectsHighlights(_json, companyCount) {

    //Remove highlights in company projects
    var companies = _json.resume.work;
    companies.forEach(function(company, index, array) {
        var projects = company["item-work"].projects;
        if (index > parseInt(companyCount))
            removeHighlights(projects);
    });


    //remove highlights in hobby projects
    var hobbies = _json.resume.hobbies["hobby-projects"]
    removeHighlights(hobbies);

    //console.log(JSON.stringify(_json));
    return _json;
}

function removeProjectsHighlights(_json) {

    //Remove highlights in company projects
    var companies = _json.resume.work;
    companies.forEach(function(company, index, array) {
        var projects = company["item-work"].projects;
        removeHighlights(projects);
    });


    //remove highlights in hobby projects
    var hobbies = _json.resume.hobbies["hobby-projects"]
    removeHighlights(hobbies);

    //console.log(JSON.stringify(_json));
    return _json;
}

function removeNonAICloudCompanies(_json) {
    // Filter to keep only companies with AI and Cloud related experiences
    var companies = _json.resume.work;
    for (var i = companies.length - 1; i >= 0; i--) {
        var company = companies[i];
        var projects = company["item-work"].projects;
        var hasAICloudProject = false;
        
        // Check if any project has AI or Cloud related tags
        for (var j = 0; j < projects.length; j++) {
            var project = projects[j];
            if (project["item-projects"] && project["item-projects"].tags) {
                var tags = project["item-projects"].tags;
                for (var k = 0; k < tags.length; k++) {
                    var tag = tags[k].toLowerCase();
                    // AI related tags
                    if (tag.includes('ai') || tag.includes('genai') || tag.includes('openai') || 
                        tag.includes('rag') || tag.includes('machine learning') || tag.includes('ml') ||
                        tag.includes('vectorstore') || tag.includes('chromadb') || tag.includes('milvus') ||
                        tag.includes('langchain') || tag.includes('autogen') || tag.includes('multi-agent') ||
                        tag.includes('prompt') || tag.includes('llm')) {
                        hasAICloudProject = true;
                        break;
                    }
                    // Cloud related tags
                    if (tag.includes('cloud') || tag.includes('aws') || tag.includes('azure') || 
                        tag.includes('gcp') || tag.includes('kubernetes') || tag.includes('eks') ||
                        tag.includes('aks') || tag.includes('gks') || tag.includes('docker') ||
                        tag.includes('terraform') || tag.includes('infrastructure') || tag.includes('devops') ||
                        tag.includes('microservice') || tag.includes('serverless') || tag.includes('lambda') ||
                        tag.includes('eventbridge') || tag.includes('step function') || tag.includes('sqs') ||
                        tag.includes('sns') || tag.includes('cloudwatch') || tag.includes('dynamodb') ||
                        tag.includes('s3') || tag.includes('ec2') || tag.includes('vpc') ||
                        tag.includes('iam') || tag.includes('rds') || tag.includes('elasticache')) {
                        hasAICloudProject = true;
                        break;
                    }
                }
            }
            
            // Also check technologies array for AI/Cloud related technologies
            if (project["item-projects"] && project["item-projects"].technologies) {
                var technologies = project["item-projects"].technologies;
                for (var k = 0; k < technologies.length; k++) {
                    var tech = technologies[k].toLowerCase();
                    // AI related technologies
                    if (tech.includes('genai') || tech.includes('openai') || tech.includes('langchain') ||
                        tech.includes('rag') || tech.includes('chromadb') || tech.includes('milvus') ||
                        tech.includes('autogen') || tech.includes('multi-agent') || tech.includes('vectorstore') ||
                        tech.includes('pydantic') || tech.includes('jupyter') || tech.includes('pyspark') ||
                        tech.includes('databricks')) {
                        hasAICloudProject = true;
                        break;
                    }
                    // Cloud related technologies
                    if (tech.includes('aws') || tech.includes('azure') || tech.includes('gcp') ||
                        tech.includes('kubernetes') || tech.includes('eks') || tech.includes('aks') ||
                        tech.includes('gks') || tech.includes('docker') || tech.includes('terraform') ||
                        tech.includes('lambda') || tech.includes('eventbridge') || tech.includes('step function') ||
                        tech.includes('sqs') || tech.includes('sns') || tech.includes('cloudwatch') ||
                        tech.includes('dynamodb') || tech.includes('s3') || tech.includes('ec2') ||
                        tech.includes('vpc') || tech.includes('iam') || tech.includes('rds') ||
                        tech.includes('elasticache') || tech.includes('microservice') || tech.includes('serverless')) {
                        hasAICloudProject = true;
                        break;
                    }
                }
            }
            
            if (hasAICloudProject) break;
        }
        
        // Remove companies that don't have AI/Cloud projects
        if (!hasAICloudProject) {
            companies.splice(i, 1);
        }
    }
    return _json;
}

function removeNonUSACompanies(_json) {
    // Remove companies that are not in USA
    var companies = _json.resume.work;
    for (var i = companies.length - 1; i >= 0; i--) {
        var company = companies[i];
        var companyCountry = company["item-work"].company.country;
        
        // Remove companies that are not in USA (case-insensitive check)
        if (!companyCountry || !companyCountry.toLowerCase().includes('usa')) {
            companies.splice(i, 1);
        }
    }
    return _json;
}

function filterItemProjects(projects, expectTags) {
    var notContains = [];
    for (var i = projects.length - 1; i >= 0; i--) {
        var projTags = projects[i]["item-projects"].tags;
        var contains = false;
        for (t in expectTags) {
            var tag = expectTags[t];
            if (tag.endsWith("-only")) { //Suffix to include the project only.
                tag = tag.substr(0, tag.indexOf("-"));
            }
            if (Array.isArray(projTags) && projTags.includes(tag)) {
                contains = true;
                break;
            }
        }
        if (!contains) {
            removeHighlight(projects[i]);
            notContains.push(i);
            //projects.splice(i,1);
        }
    }
    if (hasOnly(expectTags)) {
        if (notContains.length != projects.length) {
            for (p in notContains) {
                projects.splice(notContains[p], 1); //remove the projects without "-only" suffix
            }
        } else {
            for (i = projects.length - 1; i >= 0; i--) {
                projects.splice(i, 1);
            }
        }
    }

}

function hasOnly(expectTags) {
    var hasOnly = false;
    for (t in expectTags) {
        if (expectTags[t].endsWith("-only")) {
            hasOnly = true;
            break;
        }
    }
    return hasOnly
}

function filterProjects(_json, expectTags) {
    var companies = _json.resume.work;

    for (var i = companies.length - 1; i >= 0; i--) {
        var company = companies[i];
        var projects = company["item-work"].projects;
        filterItemProjects(projects, expectTags)

        if (hasOnly(expectTags)) {
            var endDate = new Date("1 " + company["item-work"]["end-date"]);
            var lastDate = new Date("06-02-2006")
            if (endDate < lastDate) {
                companies.splice(i, 1);
            }
        }
        //if(projects.length == 0)
        //  companies.splice(index,1);
    }
    filterItemProjects(_json.resume.hobbies["hobby-projects"], expectTags);
    //console.log(JSON.stringify(_json));
    return _json;
}

function generatePlainTextSection(_json, section) {
    var res = "";
    var sectionContent = _json[section];

    if (isArray(sectionContent)) {
        for (var i = 0; i < sectionContent.length; i++) {
            if (isObject(sectionContent[i])) {
                var objKeys = Object.keys(sectionContent[i]);
                if (objKeys.length > 0) {
                    res += generatePlainTextSection(sectionContent[i], Object.keys(sectionContent[i])[0]);
                    res += "\n";
                }
            } else {
                res += sectionContent[i];
                res += "\n";
            }
        }
    } else if (isObject(sectionContent)) {
        var objKeys = Object.keys(sectionContent);
        for (var i = 0; i < objKeys.length; i++) {
            var currentKey = objKeys[i];
            if (currentKey !== 'extra' && currentKey !== 'id') {
                if (isObject(sectionContent[currentKey])) {
                    res += generatePlainTextSection(sectionContent[currentKey], currentKey);
                    res += "\n";
                } else {
                    res += currentKey + ' : ' + sectionContent[currentKey];
                    res += "\n";
                }
            }
        }
    }

    return res;
}

function removeLeaderships(_json) {
    // Remove leaderships from work projects
    var companies = _json.resume.work;
    companies.forEach(function(company) {
        var projects = company["item-work"].projects;
        projects.forEach(function(project) {
            if (project["item-projects"] && project["item-projects"].leaderships) {
                delete project["item-projects"].leaderships;
            }
        });
    });
    // Remove leaderships from hobby projects if present
    if (_json.resume.hobbies && _json.resume.hobbies["hobby-projects"]) {
        _json.resume.hobbies["hobby-projects"].forEach(function(project) {
            if (project["item-projects"] && project["item-projects"].leaderships) {
                delete project["item-projects"].leaderships;
            }
        });
    }
    return _json;
}

module.exports.removeLeaderships = removeLeaderships;

module.exports = {
    isArray: isArray,
    isObject: isObject,
    generatePlainTextFromJson: generatePlainTextFromJson,
    generatePlainTextSection: generatePlainTextSection,
    filterProjects: filterProjects,
    removeProjectsHighlights: removeProjectsHighlights,
    removeNonUSACompanies: removeNonUSACompanies,
    removeNonAICloudCompanies: removeNonAICloudCompanies,
    removeLeaderships: removeLeaderships,
}