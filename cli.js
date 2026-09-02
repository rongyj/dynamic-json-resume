#!/usr/bin/env node

var commander = require('commander');
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
//var pdf = require('jspdf');
var pkg = require('./package.json');
var verifier = require('./lib/verifier');
var extraManager = require('./lib/extraItemsManager');
var utils = require('./lib/utils');
var converter = require('./lib/converterJsonResumeFormat');

var program = require('commander');

var Handlebars = require('handlebars');
const btoa = require('btoa');

program
    .version(pkg.version)

program
    .command('export <path_json>')
    .option('--remove-leaderships', 'Remove the leaderships section from all projects')
    .option('-t, --template <template>', 'Path to the mustache template file')
    .option('-o, --output <output>', 'Output PDF file location')
    .option('-c, --css <css>', 'Path to the CSS file')
    .option('-g, --gen-tags <tags>', 'Tags to filter projects (e.g., full, short, USA, Java, etc.)')
    .description(`Export a PDF resume from the provided JSON file.

Arguments:
  <path_json>           Path to the JSON resume file

Options:
  --remove-leaderships  Remove the leaderships section from all projects
  -t, --template        Path to the mustache template file
  -o, --output          Output PDF file location
  -c, --css             Path to the CSS file
  -g, --gen-tags        Tags to filter projects (e.g., full, short, USA, Java, etc.)

Examples:
  $ ./cli.js export ./resume.json
  $ ./cli.js export ./resume.json --gen-tags full
  $ ./cli.js export ./resume.json --gen-tags short --template ./templates/resume.tpl --output resume.pdf --css static/css/base.css
  $ ./cli.js export ./resume.json --gen-tags full --remove-leaderships
`)
    .action(function(path_json, cmdObj) {
        const removeLeaderships = cmdObj.removeLeaderships === true;
        const template = cmdObj.template;
        const output = cmdObj.output;
        const css = cmdObj.css;
        const genTags = cmdObj.genTags;
        
        createHtml(path_json, genTags, template, css, function(err, html, resumeJson) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            createPdf(html, output, (error) => {
                if (error) {
                    console.error(error, '`createPdf` errored out');
                    process.exit(1);
                }
            });
        }, removeLeaderships);
    });

const createPdf = (html, pdf_location, callback) => {
    // Required lazily: only PDF export needs puppeteer, so a broken/absent browser
    // install can never stop exportToHtml / exportToPlainText from working.
    const puppeteer = require('puppeteer');
    (async() => {
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
            `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`, { waitUntil: 'networkidle0' },
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
            preferCSSPageSize: false,
            margin: {
                top: '15mm',
                bottom: '10mm',
                right: '10mm',
                left: '5mm',
            },
            displayHeaderFooter: true,
            headerTemplate: "<div/>",
            footerTemplate: '<div style="font-size:8px; width:100%; text-align:right; padding-right:20px;"><span class="pageNumber"></span> of <span class="totalPages"></span></div>',
        });

        console.log("pdf file is created at " + _path);

        await browser.close();
    })()
    .then(callback)
        .catch(callback);

};

function createHtml(path_json, resume_gen_tags, temp_location, css_file_location, callback, noLeaderships) {
    var template_location = __dirname + "/templates/" + "resume.tpl";
    if (temp_location)
        template_location = temp_location;
    fs.readFile(template_location, 'utf-8', function(err, data) {
        if (err) {
            console.log(err);
            return callback(err, null, null);
        } else {
            var templateContent = data;
            fs.readFile(__dirname + '/' + path_json, 'utf-8', function(err, data) {
                if (err) {
                    console.log(err);
                    return callback(err, null, null);
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
                            return callback(err, null, null);
                        }

                        data += "#extra {display: none;}"

                        var head = "<head><style>" + data + "</style></head>";
                        templateContent = head + templateContent;

                        resumeJson.resume["original"] = originalResumeJson.resume;
                        
                        // Apply primary filters based on gen-tags
                        if (resume_gen_tags && resume_gen_tags.includes("short")) {
                            utils.removeProjectsHighlights(resumeJson);
                        }
                        
                        if (resume_gen_tags && resume_gen_tags.includes("FullStack")) {
                            var expectTags = ["Java", "JavaScript", "FullStack"];
                            utils.filterProjects(resumeJson, expectTags);
                        }
                        
                        // Apply custom tag filtering (for tags like Java, Python, etc.)
                        if (resume_gen_tags && resume_gen_tags != "full" && !resume_gen_tags.includes("USA") && !resume_gen_tags.includes("table") && !resume_gen_tags.includes("AICloud") && !resume_gen_tags.includes("short") && !resume_gen_tags.includes("FullStack")) {
                            var expectTags = resume_gen_tags.split(',');
                            utils.filterProjects(resumeJson, expectTags);
                        }
                        
                        // Apply USA filtering (can be combined with other formats)
                        if (resume_gen_tags && resume_gen_tags.includes("USA")) {
                            utils.removeNonUSACompanies(resumeJson);
                        }
                        
                        // Apply AI/Cloud filtering (can be combined with other formats)
                        if (resume_gen_tags && resume_gen_tags.includes("AICloud")) {
                            utils.removeNonAICloudCompanies(resumeJson);
                        }
                        
                        // Apply table format filtering (can be combined with other filters)
                        if (resume_gen_tags && resume_gen_tags.includes("table")) {
                            // For table format, keep work experience but remove detailed projects
                            // and hobby projects, but keep summaries for the summary view
                            // delete resumeJson.resume.hobbies["hobby-projects"];
                            // delete resumeJson.resume.hobbies["hobby-items"];
                        }
                        
                        if (noLeaderships) {
                            utils.removeLeaderships(resumeJson);
                        }
                        var html = mustache.to_html(templateContent, { "resume": resumeJson.resume });
                        callback(null, html, resumeJson);
                    });
                }
            });
        }
    });
}

program
    .command('exportToHtml <path_json>')
    .option('--remove-leaderships', 'Remove the leaderships section from all projects')
    .option('-t, --template <template>', 'Path to the mustache template file')
    .option('-o, --output <output>', 'Output HTML file location')
    .option('-c, --css <css>', 'Path to the CSS file')
    .option('-g, --gen-tags <tags>', 'Tags to filter projects (e.g., full, short, USA, AICloud, Java, etc.)')
    .description(`Export an HTML resume from the provided JSON file.

Arguments:
  <path_json>           Path to the JSON resume file

Options:
  --remove-leaderships  Remove the leaderships section from all projects
  -t, --template        Path to the mustache template file
  -o, --output          Output HTML file location
  -c, --css             Path to the CSS file
  -g, --gen-tags        Tags to filter projects (e.g., full, short, USA, AICloud, Java, etc.)

Examples:
  $ ./cli.js exportToHtml ./resume.json
  $ ./cli.js exportToHtml ./resume.json --gen-tags full
  $ ./cli.js exportToHtml ./resume.json --gen-tags short
  $ ./cli.js exportToHtml ./resume.json --gen-tags USA
  $ ./cli.js exportToHtml ./resume.json --gen-tags AICloud
  $ ./cli.js exportToHtml ./resume.json --gen-tags USA,AICloud
  $ ./cli.js exportToHtml ./resume.json --gen-tags short,USA
  $ ./cli.js exportToHtml ./resume.json --gen-tags short,AICloud
  $ ./cli.js exportToHtml ./resume.json --gen-tags Java
  $ ./cli.js exportToHtml ./resume.json --gen-tags FullStack
  $ ./cli.js exportToHtml ./resume.json --gen-tags full --template ./templates/table.tpl
  $ ./cli.js exportToHtml ./resume.json --gen-tags USA --template ./templates/table.tpl
  $ ./cli.js exportToHtml ./resume.json --gen-tags AICloud --template ./templates/table.tpl
  $ ./cli.js exportToHtml ./resume.json --gen-tags USA,AICloud --template ./templates/table.tpl
  $ ./cli.js exportToHtml ./resume.json --gen-tags short,USA --template ./templates/table.tpl
  $ ./cli.js exportToHtml ./resume.json --gen-tags full --remove-leaderships
  $ ./cli.js exportToHtml ./resume.json --gen-tags USA --remove-leaderships
  $ ./cli.js exportToHtml ./resume.json --gen-tags AICloud --remove-leaderships
  $ ./cli.js exportToHtml ./resume.json --gen-tags USA,AICloud --remove-leaderships
  $ ./cli.js exportToHtml ./resume.json --gen-tags short,USA --remove-leaderships
  $ ./cli.js exportToHtml ./resume.json --gen-tags full --template ./templates/resume.tpl --output resume-no-leaderships.html --remove-leaderships
`)
    .action(function(path_json, cmdObj) {
        const removeLeaderships = cmdObj.removeLeaderships === true;
        const template = cmdObj.template;
        const output = cmdObj.output;
        const css = cmdObj.css;
        const genTags = cmdObj.genTags;
        
        createHtml(path_json, genTags, template, css, function(err, html, resumeJson) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            var outputLocation = '/resume.html';
            if (output) {
                outputLocation = '/' + output;
            }
            outputLocation = process.cwd() + outputLocation;
            fs.writeFile(outputLocation, html, function(err) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
                console.log("HTML file is created at " + outputLocation);
            });
        }, removeLeaderships);
    });

program
    .command('exportToPlainText <path_json>')
    .option('--remove-leaderships', 'Remove the leaderships section from all projects')
    .option('-o, --output <output>', 'Output text file location')
    .option('-g, --gen-tags <tags>', 'Tags to filter projects (e.g., full, short, USA, AICloud, Java, etc.)')
    .description(`Export a plain text resume from the provided JSON file.

Arguments:
  <path_json>           Path to the JSON resume file

Options:
  --remove-leaderships  Remove the leaderships section from all projects
  -o, --output          Output text file location
  -g, --gen-tags        Tags to filter projects (e.g., full, short, USA, AICloud, Java, etc.)

Examples:
  $ ./cli.js exportToPlainText ./resume.json --gen-tags full
  $ ./cli.js exportToPlainText ./resume.json --gen-tags short --output resume.txt
  $ ./cli.js exportToPlainText ./resume.json --gen-tags USA
  $ ./cli.js exportToPlainText ./resume.json --gen-tags USA --output usa-resume.txt
  $ ./cli.js exportToPlainText ./resume.json --gen-tags AICloud
  $ ./cli.js exportToPlainText ./resume.json --gen-tags AICloud --output ai-cloud-resume.txt
  $ ./cli.js exportToPlainText ./resume.json --gen-tags USA,AICloud
  $ ./cli.js exportToPlainText ./resume.json --gen-tags USA,AICloud --output usa-ai-cloud-resume.txt
  $ ./cli.js exportToPlainText ./resume.json --gen-tags full --remove-leaderships
`)
    .action(function(path_json, cmdObj) {
        const removeLeaderships = cmdObj.removeLeaderships === true;
        const output = cmdObj.output;
        const genTags = cmdObj.genTags;
        
        fs.readFile(__dirname + '/' + path_json, 'utf-8', function(err, data) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            var resumeJson = JSON.parse(data);
            var v = verifier.run(resumeJson);
            if (v) {
                if (removeLeaderships) {
                    utils.removeLeaderships(resumeJson);
                }
                if (genTags && genTags.includes("short")) {
                    utils.removeProjectsHighlights(resumeJson);
                }
                
                if (genTags && genTags.includes("FullStack")) {
                    var expectTags = ["Java", "JavaScript", "FullStack"];
                    utils.filterProjects(resumeJson, expectTags);
                }
                
                // Apply custom tag filtering (for tags like Java, Python, etc.)
                if (genTags && genTags != "full" && !genTags.includes("USA") && !genTags.includes("table") && !genTags.includes("AICloud") && !genTags.includes("short") && !genTags.includes("FullStack")) {
                    var expectTags = genTags.split(',');
                    utils.filterProjects(resumeJson, expectTags);
                }
                
                // Apply USA filtering (can be combined with other formats)
                if (genTags && genTags.includes("USA")) {
                    utils.removeNonUSACompanies(resumeJson);
                }
                
                // Apply AI/Cloud filtering (can be combined with other formats)
                if (genTags && genTags.includes("AICloud")) {
                    utils.removeNonAICloudCompanies(resumeJson);
                }
                
                // Apply table format filtering (can be combined with other filters)
                if (genTags && genTags.includes("table")) {
                    // For table format, keep work experience but remove detailed projects
                    // and hobby projects, but keep summaries for the summary view
                    // delete resumeJson.resume.hobbies["hobby-projects"];
                    // delete resumeJson.resume.hobbies["hobby-items"];
                }
                var outputLocation = '/resume.txt';
                if (output) {
                    outputLocation = '/' + output;
                }
                outputLocation = process.cwd() + outputLocation;
                var textFileContent = utils.generatePlainTextFromJson(resumeJson);
                fs.writeFile(outputLocation, textFileContent, function(err) {
                    if (err) {
                        console.log(err);
                        process.exit(1);
                    }
                    console.log("Text file is created at " + outputLocation);
                });
            }
        });
    });

program
    .command('generateFromJsonResume <path_json> [output_location]')
    .description(`Generate a JSON resume from a json-resume file.

Arguments:
  <path_json>           Path to the json-resume file
  [output_location]     (Optional) Output file location

Examples:
  $ ./cli.js generateFromJsonResume ./resume-schema.json
  $ ./cli.js generateFromJsonResume ./resume-schema.json converted.json
`)
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