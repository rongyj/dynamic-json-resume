#!/usr/bin/env node
/**
 * Builds a role-targeted resume from resume.json (the master) plus a role profile.
 *
 *   node build-resume.js <role> [--pdf] [--html] [--check]
 *   node build-resume.js all --pdf
 *
 * Roles live in roles/*.js. The generated resume-<role>.json is a build artifact:
 * edit the master or the profile, never the generated file.
 *
 *   --html   also render the HTML named by the profile
 *   --pdf    also render the HTML and the PDF named by the profile
 *   --check  build in memory and report whether the output would change (writes nothing)
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { buildRole, stats, ROOT } = require('./lib/roleBuilder');

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const requested = args.filter(a => !a.startsWith('--'));

const available = fs.readdirSync(path.join(ROOT, 'roles'))
    .filter(f => f.endsWith('.js')).map(f => f.replace(/\.js$/, '')).sort();

if (!requested.length) {
    console.log('usage: node build-resume.js <role|all> [--html] [--pdf] [--check]');
    console.log('roles: ' + available.join(', '));
    process.exit(1);
}

const roles = requested[0] === 'all' ? available : requested;
const unknown = roles.filter(r => !available.includes(r));
if (unknown.length) {
    console.error('unknown role(s): ' + unknown.join(', ') + '\navailable: ' + available.join(', '));
    process.exit(1);
}

let changed = 0;
for (const role of roles) {
    const profile = require(path.join(ROOT, 'roles', role + '.js'));
    const doc = buildRole(profile);
    const json = JSON.stringify(doc, null, 4) + '\n';
    const outPath = path.join(ROOT, profile.output);
    const previous = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : null;
    const s = stats(doc);
    const same = previous === json;

    if (flags.has('--check')) {
        console.log(`${role}: ${same ? 'up to date' : 'WOULD CHANGE'} (${profile.output})`);
        if (!same) changed++;
        continue;
    }

    fs.writeFileSync(outPath, json);
    console.log(`${role}: ${profile.output} | ${s.employers} employers, ${s.projects} projects, ` +
                `${s.bullets} bullets, ${s.skills} skills${same ? '' : ' (changed)'}`);

    if (flags.has('--html') || flags.has('--pdf')) {
        execFileSync('node', ['cli.js', 'exportToHtml', profile.output, '--gen-tags', 'full',
                              '-o', profile.html], { cwd: ROOT, stdio: 'pipe' });
        console.log(`    -> ${profile.html}`);
    }
    if (flags.has('--pdf')) {
        execFileSync('node', ['cli.js', 'export', profile.output, '--gen-tags', 'full',
                              '-o', profile.pdf], { cwd: ROOT, stdio: 'pipe' });
        console.log(`    -> ${profile.pdf}`);
    }
}

if (flags.has('--check') && changed) process.exit(1);
