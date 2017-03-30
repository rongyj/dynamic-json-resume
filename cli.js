#!/usr/bin/env node

var commander = require('commander');
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var pdf = require('html-pdf');
//var pdf = require('jspdf');
var pkg = require('./package.json');
var verifier = require('./lib/verifier');
var extraManager = require('./lib/extraItemsManager');
var utils = require('./lib/utils');
var converter = require('./lib/converterJsonResumeFormat');

var program = require('commander');

program
  .version(pkg.version)

program
  .command('export <path_json> [resume_gen_tags] [template_location] [pdf_location] [css_file_location]')
  .description('Export a pdf resume from the json resume provided to the given location, applying the css file given')
  .action(function(path_json, resume_gen_tags, temp_location, pdf_location, css_file_location) {
    var template_location = __dirname + "/templates/" + "resume.tpl";
    if(temp_location)
      template_location =temp_location;
    fs.readFile(template_location, 'utf-8', function (err, data) {
  		//fs.readFile(__dirname + "/templates/" + "resume.tpl", 'utf-8', function (err, data) {
			if (err) {
				console.log(err);
				process.exit(1);
			} else {
				var templateContent = data;
				fs.readFile(__dirname + '/' + path_json, 'utf-8', function (err, data) {
					if (err) {
						console.log(err);
						process.exit(1);
					}
			    	var resumeJson = JSON.parse(data);
            if(resume_gen_tags == "short"){
              utils.removeProjectsHighlights(resumeJson);
            }else if(resume_gen_tags == "FullStack"){
              var expectTags= ["Java", "JavaScript", "FullStack"];
              utils.filterProjects(resumeJson,expectTags);
            }else if( resume_gen_tags && resume_gen_tags != "full" ){
              var expectTags= resume_gen_tags.split(',');
              utils.filterProjects(resumeJson,expectTags);
            }

			    	var v = verifier.run(resumeJson);

				    if (templateContent && v) {
				    	var _cssFile = "/static/css/base.css";
				    	if (css_file_location) {
				    		_cssFile = '/' + css_file_location;
				    	}

				    	fs.readFile(__dirname + _cssFile, 'utf-8', function(err, data) {
				    		if (err) {
				    			console.log(err);
				    			process.exit(1);
				    		}

				    		var head = "<head><style>" + data + "</style></head>";
				    		templateContent = head + templateContent;
				    		var html = mustache.to_html(templateContent, {"resume" : resumeJson.resume});


                              /*  jsPdf
                              //var pdf= new jsPDF();

                              //global.window = {document: {createElementNS: () => {return {}} }};
                              //global.navigator = {};
                              //global.btoa = () => {};


                              //let jsPDF = require('jspdf');

                              let pdf = new jsPDF();
                              let jQuery = require('jquery');
                              var htmlDom= jQuery.parseHTML(html);
                              pdf.fromHTML(htmlDom);
                              let pdfdata = pdf.output();
                              pdf.text(html);
                              var finalPdfLocation = '/resume.pdf';

                              if (pdf_location) {
                                finalPdfLocation = '/' + pdf_location;
                              }
                              var _path = process.cwd() + finalPdfLocation;
                              //pdf.save(_path);

                              fs.writeFileSync(_path, pdfdata);

                              delete global.window;
                              delete global.navigator;
                              delete global.btoa;
                              */




							pdf.create(html, {
								width: '297mm',
								height: '400mm',
							},
							function(err, buffer) {
								if (err) {
									console.log(err);
									process.exit(1);
								} else {
									try {

										var finalPdfLocation = '/resume.pdf';

										if (pdf_location) {
											finalPdfLocation = '/' + pdf_location;
										}
										var _path = process.cwd() + finalPdfLocation;
										fs.writeFileSync(_path, buffer);
									} catch (err) {
    									console.log("Problem writing " + _path + " : " + err.message)
									    process.exit(1);
									}
								}
							});

				    	});
					}
			    });
			}
		});
    });

program
  .command('exportToHtml <path_json> [resume_gen_tags] [template_location] [html_location] [css_file_location] ')
  .description('Export an html resume from the json resume provided to the given location,'+
  'applying the css file given, also will choose the right projects based on the specified tags'+
  'Example: exportToHtml ./resume-schema.json full|short|[any tags defined in the projects]'+
  'Example: ./cli.js exportToHtml ./resume-schema.json short'+
  'Example: ./cli.js exportToHtml ./resume-schema.json devops'+
  'Example: ./cli.js exportToHtml ./resume-schema.json Java'+
  'Example: ./cli.js exportToHtml ./resume-schema.json FullStack'+
  'Example: ./cli.js exportToHtml ./resume-schema.json full ./templates/table.tpl')
  .action(function(path_json, resume_gen_tags, temp_location, html_location, css_file_location) {
      var template_location = __dirname + "/templates/" + "resume.tpl";
      if(temp_location)
        template_location =temp_location;
  		fs.readFile(template_location, 'utf-8', function (err, data) {
			if (err) {
				console.log(err);
				process.exit(1);
			} else {
				var templateContent = data;
				fs.readFile(__dirname + '/' + path_json, 'utf-8', function (err, data) {
					if (err) {
						console.log(err);
						process.exit(1);
					}
			    	var resumeJson = JSON.parse(data);
            var originalResumeJson = JSON.parse(data);
			    	var v = verifier.run(resumeJson);

				    if (templateContent && v) {
				    	var _cssFile = "/static/css/base.css";
				    	if (css_file_location) {
				    		_cssFile = '/' + css_file_location;
				    	}

				    	fs.readFile(__dirname + _cssFile, 'utf-8', function(err, data) {
				    		if (err) {
				    			console.log(err);
				    			process.exit(1);
				    		}

				    		data += "#extra {display: none;}"

				    		var head = "<head><style>" + data + "</style></head>";
				    		templateContent = head + templateContent;

                resumeJson.resume["original"]=originalResumeJson.resume;
                if(resume_gen_tags == "short"){
                  utils.removeProjectsHighlights(resumeJson);
                }else if(resume_gen_tags == "FullStack"){
                  var expectTags= ["Java", "JavaScript", "FullStack"];
                  utils.filterProjects(resumeJson,expectTags);
                }else if(resume_gen_tags == "table") {
                  delete resumeJson.resume.work;
                  delete resumeJson.resume.hobbies["hobby-projects"];
                }else if( resume_gen_tags && resume_gen_tags != "full" ){
                  var expectTags= resume_gen_tags.split(',');
                  utils.filterProjects(resumeJson,expectTags);
                }
				    		var html = mustache.to_html(templateContent, {"resume" : resumeJson.resume});

				    		var outputLocation = '/resume.html';

				    		if (html_location) {
				    			outputLocation = '/' + html_location;
				    		}

				    		outputLocation = process.cwd() + outputLocation;
				    		fs.writeFile(outputLocation, html, function(err) {
				    			if (err) {
				    				console.log(err);
									process.exit(1);
				    			}
				    		});
				    	});
					}
			    });
			}
		});
    });

program
  .command('exportToPlainText <path_json> [output_location]')
  .description('Export a text file resume from the json resume provided to the given location')
  .action(function(path_json, output_location) {
		fs.readFile(__dirname + '/' + path_json, 'utf-8', function (err, data) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
	    	var resumeJson = JSON.parse(data);
	    	var v = verifier.run(resumeJson);

		    if (v) {
		    	var outputLocation = '/resume.txt';

    			if (output_location) {
    				outputLocation = '/' + output_location;
    			}

		    	outputLocation = process.cwd() + outputLocation;
		    	var textFileContent = utils.generatePlainTextFromJson(resumeJson);
		    	fs.writeFile(outputLocation, textFileContent, function(err) {
		    		if (err) {
		    			console.log(err);
						process.exit(1);
		    		}
		    	});
			}
		});
    });

program
	.command('generateFromJsonResume <path_json> [output_location]')
	.description('Generate a json from a json-resume file')
	.action(function(path_json, output_location) {
		fs.readFile(__dirname + '/' + path_json, 'utf-8', function(err, data) {
			if (err) {
				console.log(err);
				process.exit(1);
			}

			var asJsonResume = JSON.parse(data);
			var generatedJson = converter.parseJsonResumeFormat(asJsonResume);

			if (output_location) {
				converter.writeGeneratedJsonToFile(__dirname + '/' + output_location, generatedJson);
			} else {
				converter.writeGeneratedJsonToFile('converted.json', generatedJson);
			}
		});
	});

program.parse(process.argv);
