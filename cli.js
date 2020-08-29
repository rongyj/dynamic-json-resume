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

var Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const btoa = require('btoa');

program
	.version(pkg.version)

program
	.command('export <path_json> [resume_gen_tags] [template_location] [pdf_location] [css_file_location]')
	.description('Export a pdf resume from the json resume provided to the given location, applying the css file given')
	.action(function (path_json, resume_gen_tags, temp_location, pdf_location, css_file_location) {
		createHtml(path_json, resume_gen_tags, temp_location, css_file_location, function (err, html) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			createPdf(html, pdf_location, (error) => {
				if (error) {
					console.error(error, '`createPdf` errored out');
					callback(error);
				}
			});
		});

	});

const createPdf = (html, pdf_location, callback) => {
	(async () => {
		const puppeteerLaunchArgs = [];

		if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
			puppeteerLaunchArgs.push('--no-sandbox');
		}


		const browser = await puppeteer.launch({
			args: puppeteerLaunchArgs,
			//headless:false,
			//product: 'chrom',
			//executablePath: "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
			//executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
		});
		const page = await browser.newPage();

		await page.emulateMediaType(
			({ margin: '0 0 0 0', mediaType: 'print' } && 'print') ||
			'screen',
		);
		await page.goto(
			`data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`,
			{ waitUntil: 'networkidle0' },
		);

		var finalPdfLocation = '/resume.pdf';

		if (pdf_location) {
			finalPdfLocation = '/' + pdf_location;
		}
		var _path = process.cwd() + finalPdfLocation;

		await page.pdf({
			path: _path,
			format: 'Letter',
			printBackground: true,
			preferCSSPageSize: true,
			margin: {
				top: '50px',
				bottom: '45px',
				right: '40px',
			},
			displayHeaderFooter: true,
			headerTemplate: "<div/>",
			footerTemplate: "<table style=\"width:100%; font-size:10px; \"><tr><td style=\"width:33.333%;text-align:left;\"></td><td style=\"width:33.333%; text-align:center;vertical-align:bottom; \">Yongjun Rong</td><td style=\"width:33.333%; text-align:right;vertical-align:bottom; padding-right:20px;\" class=\"pageNumber\"></td></tr></table>",
		});

		console.log("pdf file is created at " + _path);

		await browser.close();
	})()
		.then(callback)
		.catch(callback);

};

function createHtml(path_json, resume_gen_tags, temp_location, css_file_location, callback) {
	var template_location = __dirname + "/templates/" + "resume.tpl";
	if (temp_location)
		template_location = temp_location;
	fs.readFile(template_location, 'utf-8', function (err, data) {
		if (err) {
			console.log(err);
			return callback(err, null);
			//process.exit(1);
		} else {
			var templateContent = data;
			fs.readFile(__dirname + '/' + path_json, 'utf-8', function (err, data) {
				if (err) {
					console.log(err);
					return callback(err, null);
					//process.exit(1);
				}
				var resumeJson = JSON.parse(data);
				var originalResumeJson = JSON.parse(data);
				var v = verifier.run(resumeJson);

				if (templateContent && v) {
					var _cssFile = "/static/css/base.css";
					if (css_file_location) {
						_cssFile = '/' + css_file_location;
					}

					fs.readFile(__dirname + _cssFile, 'utf-8', function (err, data) {
						if (err) {
							console.log(err);
							return callback(err, null);
							//process.exit(1);
						}

						data += "#extra {display: none;}"

						var head = "<head><style>" + data + "</style></head>";
						templateContent = head + templateContent;

						resumeJson.resume["original"] = originalResumeJson.resume;
						if (resume_gen_tags == "short") {
							utils.removeProjectsHighlights(resumeJson);
						} else if (resume_gen_tags == "USA") {
							utils.removeNonUSACompanies(resumeJson);
						}
						else if (resume_gen_tags == "FullStack") {
							var expectTags = ["Java", "JavaScript", "FullStack"];
							utils.filterProjects(resumeJson, expectTags);
						} else if (resume_gen_tags == "table") {
							delete resumeJson.resume.work;
							delete resumeJson.resume.hobbies["hobby-projects"];
						} else if (resume_gen_tags && resume_gen_tags != "full") {
							var expectTags = resume_gen_tags.split(',');
							utils.filterProjects(resumeJson, expectTags);
						}
						var html = mustache.to_html(templateContent, { "resume": resumeJson.resume });
						callback(null, html);
					});
				}
			});
		}
	});
}

program
	.command('exportToHtml <path_json> [resume_gen_tags] [template_location] [html_location] [css_file_location] ')
	.description('Export an html resume from the json resume provided to the given location,' +
		'applying the css file given, also will choose the right projects based on the specified tags' +
		'Example: exportToHtml ./resume-schema.json full|short|[any tags defined in the projects]' +
		'Example: ./cli.js exportToHtml ./resume-schema.json short' +
		'Example: ./cli.js exportToHtml ./resume-schema.json USA' +
		'Example: ./cli.js exportToHtml ./resume-schema.json devops' +
		'Example: ./cli.js exportToHtml ./resume-schema.json Java' +
		'Example: ./cli.js exportToHtml ./resume-schema.json FullStack' +
		'Example: ./cli.js exportToHtml ./resume-schema.json full ./templates/table.tpl')
	.action(function (path_json, resume_gen_tags, temp_location, html_location, css_file_location) {
		createHtml(path_json, resume_gen_tags, temp_location, css_file_location, function (err, html) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			var outputLocation = '/resume.html';

			if (html_location) {
				outputLocation = '/' + html_location;
			}

			outputLocation = process.cwd() + outputLocation;
			fs.writeFile(outputLocation, html, function (err) {
				if (err) {
					console.log(err);
					process.exit(1);
				}
				console.log("HTML file is created at " + outputLocation);
			});
			
		});

	});

program
	.command('exportToPlainText <path_json>  <resume_gen_tags> [output_location]')
	.description('Export a text file resume from the json resume provided to the given location' +
		'Example: ./cli.js exportToPlainText ./resume-schema.json full')
	.action(function (path_json, resume_gen_tags, output_location) {
		fs.readFile(__dirname + '/' + path_json, 'utf-8', function (err, data) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			var resumeJson = JSON.parse(data);
			//var originalResumeJson = JSON.parse(data);
			var v = verifier.run(resumeJson);
			if (v) {
				//resumeJson.resume["original"]=originalResumeJson.resume;
				if (resume_gen_tags == "short") {
					utils.removeProjectsHighlights(resumeJson);
				} else if (resume_gen_tags == "FullStack") {
					var expectTags = ["Java", "JavaScript", "FullStack"];
					utils.filterProjects(resumeJson, expectTags);
				} else if (resume_gen_tags == "table") {
					delete resumeJson.resume.work;
					delete resumeJson.resume.hobbies["hobby-projects"];
				} else if (resume_gen_tags && resume_gen_tags != "full") {
					var expectTags = resume_gen_tags.split(',');
					utils.filterProjects(resumeJson, expectTags);
				}

				var outputLocation = '/resume.txt';

				if (output_location) {
					outputLocation = '/' + output_location;
				}

				outputLocation = process.cwd() + outputLocation;
				var textFileContent = utils.generatePlainTextFromJson(resumeJson);
				fs.writeFile(outputLocation, textFileContent, function (err) {
					if (err) {
						console.log(err);
						process.exit(1);
					}
				});
			}
		});
	});

program
	.command('generateFromJsonResume <path_json>  [output_location]')
	.description('Generate a json from a json-resume file')
	.action(function (path_json, output_location) {
		fs.readFile(__dirname + '/' + path_json, 'utf-8', function (err, data) {
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
