/**
 * Builds a role-targeted resume from the master resume.json plus a role profile.
 *
 * The master is the single source of truth for facts and wording. A role profile
 * (roles/<name>.js) says which employers, projects and bullets that role shows, and
 * carries only the prose that is genuinely role-specific: the summary, the skills
 * list, and any tightened `achievements` lines.
 *
 * Selection is by leading text, never by array index: a profile names a project by a
 * prefix of its title and a bullet by a prefix of its text. Inserting or reordering
 * content in the master therefore cannot silently change what a role selects. A
 * prefix that stops matching - or starts matching two bullets - fails the build with
 * a message naming the role, the project and the prefix, rather than quietly
 * producing the wrong resume.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const clone = o => JSON.parse(JSON.stringify(o));

function loadMaster() {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'resume.json'), 'utf8')).resume;
}

/** Resolves one prefix against a list of strings; must match exactly one. */
function pick(list, prefix, where) {
    const hits = (list || []).filter(s => s.startsWith(prefix));
    if (hits.length === 1) return hits[0];
    throw new Error(
        `${where}: prefix matched ${hits.length} entries (expected 1)\n  prefix: ${JSON.stringify(prefix)}` +
        (hits.length > 1 ? `\n  ambiguous - lengthen the prefix` : `\n  no match - the master wording changed?`)
    );
}

/** 'all' keeps every entry the master has; an array selects by prefix; [] drops the list. */
function selectLines(masterLines, spec, where) {
    if (spec === 'all') return clone(masterLines || []);
    if (!spec || !spec.length) return [];
    return spec.map(p => pick(masterLines, p, where));
}

function findWork(master, company, roleName) {
    const hit = master.work.filter(w => w['item-work'].company.name === company);
    if (hit.length !== 1) {
        throw new Error(`${roleName}: employer ${JSON.stringify(company)} matched ${hit.length} entries in resume.json`);
    }
    return hit[0]['item-work'];
}

function findProject(workItem, titlePrefix, where) {
    const hits = (workItem.projects || []).filter(p => p['item-projects'].title.startsWith(titlePrefix));
    if (hits.length !== 1) {
        throw new Error(`${where}: project prefix matched ${hits.length} projects (expected 1)\n  prefix: ${JSON.stringify(titlePrefix)}`);
    }
    return hits[0]['item-projects'];
}

function buildProject(workItem, spec, where) {
    if (spec.literal) return { 'item-projects': clone(spec.literal) };

    const src = findProject(workItem, spec.title, where);
    const at = `${where} > ${src.title.slice(0, 40)}`;
    const out = {
        title: spec.retitle || src.title,
        description: spec.redescribe || src.description,
    };
    // Key order follows the master so generated files diff cleanly against it.
    const highlights = selectLines(src.highlights, spec.highlights, at);
    if (highlights.length) out.highlights = highlights;
    const technologies = spec.technologies || src.technologies;
    if (technologies) out.technologies = clone(technologies);
    const tags = spec.tags || src.tags;
    if (tags) out.tags = clone(tags);
    const leaderships = selectLines(src.leaderships, spec.leaderships, at);
    if (leaderships.length) out.leaderships = leaderships;
    return { 'item-projects': out };
}

function buildWork(master, spec, roleName) {
    if (spec.literal) return { 'item-work': clone(spec.literal) };

    const src = findWork(master, spec.company, roleName);
    const where = `${roleName} > ${spec.company}`;
    const out = {
        'start-date': src['start-date'],
        'end-date': src['end-date'],
        position: src.position,
        company: clone(src.company),
        achievements: spec.achievements && spec.achievements !== 'master' ? spec.achievements : src.achievements,
        technologies: spec.technologies && spec.technologies !== 'master'
            ? clone(spec.technologies) : clone(src.technologies),
        projects: (spec.projects || []).map(p => buildProject(src, p, where)),
    };
    if (src['position-header']) out['position-header'] = src['position-header'];
    return { 'item-work': out };
}

function buildRole(profile) {
    const master = loadMaster();
    const section = (spec, key) => (spec === 'master' || spec === undefined ? clone(master[key]) : clone(spec));

    const resume = {
        contact: section(profile.contact, 'contact'),
        education: section(profile.education, 'education'),
        work: (profile.work || []).map(w => buildWork(master, w, profile.name)),
        summaries: [{ summary: profile.summary, tags: profile.summaryTags || [profile.name] }],
        skills: clone(profile.skills),
        technologies: section(profile.technologies, 'technologies'),
        languages: section(profile.languages, 'languages'),
        hobbies: section(profile.hobbies, 'hobbies'),
    };

    const verifier = require('./verifier');
    if (!verifier.run({ resume: clone(resume) })) {
        throw new Error(`${profile.name}: failed lib/verifier.js`);
    }
    return { resume };
}

function stats(doc) {
    const work = doc.resume.work;
    return {
        employers: work.length,
        projects: work.reduce((n, w) => n + w['item-work'].projects.length, 0),
        bullets: work.reduce((n, w) => n + w['item-work'].projects.reduce((m, p) =>
            m + (p['item-projects'].highlights || []).length +
                (p['item-projects'].leaderships || []).length, 0), 0),
        skills: doc.resume.skills.length,
    };
}

module.exports = { buildRole, loadMaster, stats, ROOT };
