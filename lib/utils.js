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

function removeHighlights(companies){
  companies.forEach(function(company, index, array) {
    var projects=company["item-work"].projects;
    for(var i=projects.length-1;i>=0;i--){
      if(projects[i]){
        if(projects[i]["item-projects"]){
          if(projects[i]["item-projects"]["highlights"]){
            var projTeches=projects[i]["item-projects"]["technologies"];
            delete projects[i]["item-projects"]["highlights"];
          }
        }
      }
    }
  });
}

function removeHighlight(project){
  if(project["item-projects"]["highlights"]){
    delete project["item-projects"]["highlights"];
  }
}

function removeHighlights(projects){
    for(var i=projects.length-1;i>=0;i--){
      if(projects[i]){
        if(projects[i]["item-projects"]){
          removeHighlight(projects[i]);
        }
      }
    }
}

function removeProjectsHighlights(_json) {

  //Remove highlights in company projects
	var companies = _json.resume.work;
  companies.forEach(function(company, index, array) {
    var projects=company["item-work"].projects;
    removeHighlights(projects);
  });


  //remove highlights in hobby projects
  var hobbies= _json.resume.hobbies["hobby-projects"]
  removeHighlights(hobbies);

  //console.log(JSON.stringify(_json));
	return _json;
}

function filterItemProjects(projects, expectTags){
  for(var i=projects.length-1;i>=0;i--){
    var projTags = projects[i]["item-projects"].tags;
    var contains=false;
    for(t in expectTags) {
      if(Array.isArray(projTags) && projTags.includes(expectTags[t])){
        contains=true;
        break;
      }
    }
    if(!contains){
      removeHighlight(projects[i]);
      //projects.splice(i,1);
    }
  }
}

function filterProjects(_json,expectTags) {
	var companies = _json.resume.work;

	companies.forEach(function(company, index, array) {
    var projects=company["item-work"].projects;
    filterItemProjects(projects,expectTags)
    //if(projects.length == 0)
    //  companies.splice(index,1);
	});
  filterItemProjects(_json.resume.hobbies["hobby-projects"],expectTags);
  //console.log(JSON.stringify(_json));
	return _json;
}

function generatePlainTextSection(_json, section) {
	var res = "";
	var sectionContent = _json[section];

	if (isArray(sectionContent)) {
		for (var i=0; i<sectionContent.length; i++) {
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
		for (var i=0; i<objKeys.length; i++) {
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



module.exports = {
	isArray: isArray,
	isObject: isObject,
	generatePlainTextFromJson: generatePlainTextFromJson,
	generatePlainTextSection: generatePlainTextSection,
  filterProjects: filterProjects,
  removeProjectsHighlights:removeProjectsHighlights
}
