#!/usr/bin/env node
/**
 * The local application ledger, and the dedupe that depends on it.
 *
 *   node .../record.js add --file applications/raw/linkedin-<stamp>.json --resume principal-swe
 *   node .../record.js add 4460126625 --resume ai-platform
 *   node .../record.js submitted 4460126625 4454863014     # confirm they were really sent
 *   node .../record.js dedupe --file applications/raw/linkedin-<stamp>.json
 *   node .../record.js list [--pending]
 *
 * WHY THIS EXISTS AT ALL. The JobRight skill can POST /swan/job/apply and make a job stop
 * being recommended. LinkedIn has no such endpoint: its Applied tab only records
 * applications made *through* LinkedIn, so an offsite apply leaves no trace and LinkedIn
 * will keep surfacing the job forever. The ledger is the only thing that can dedupe a
 * future capture, which makes it load-bearing rather than bookkeeping.
 *
 * `actuallySubmitted` stays null until the user says otherwise — same rule as the JobRight
 * skill. A record that claims an application was sent when it was only prepared is worse
 * than no record, because it removes the job from every future capture.
 */
const fs = require('fs');
const path = require('path');
const { titleCore, sameEmployer } = require('./lib/enrich');

// A repost carries a different jobId, so jobId alone cannot keep the ledger clean across
// captures. This is the same identity the dedupe uses: same employer, and a title that
// reduces to the same distinguishing words. Company matching is a scan rather than a map
// lookup because "Cisco" and "Cisco Systems, Inc." must compare equal.
const titleKey = j => [...titleCore(j.title)].sort().join(' ');
const sameRole = (a, b) => !!titleKey(a) && titleKey(a) === titleKey(b) && sameEmployer(a.company, b.company);

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const LEDGER = path.join(ROOT, 'applications', 'applied-linkedin.json');

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const has = n => args.includes('--' + n);
// Job ids given positionally, skipping any number that is really a flag's value.
const bareIds = args.filter((a, i) =>
    i > 0 && /^\d{6,}$/.test(a) && !args[i - 1].startsWith('--'));

const load = () => fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
const save = rows => {
    fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
    fs.writeFileSync(LEDGER, JSON.stringify(rows, null, 1));
};
const today = () => new Date().toISOString().slice(0, 10);

function rowsFromCapture(file) {
    const raw = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'));
    return raw.jobs || (Array.isArray(raw) ? raw : []);
}

if (cmd === 'add') {
    const file = flag('file', null);
    const resume = flag('resume', null);
    const incoming = file
        ? rowsFromCapture(file)
        : bareIds.map(jobId => ({ jobId }));
    if (!incoming.length) { console.error('nothing to add — pass --file or job ids'); process.exit(1); }

    const ledger = load();
    const seen = new Set(ledger.map(r => r.jobId));
    const roles = ledger.filter(r => r.company && r.title);
    let added = 0; const echoes = [];
    for (const j of incoming) {
        if (!j.jobId || seen.has(j.jobId)) continue;
        // Same role, different id — almost always a repost. Report it and skip; the user
        // can force it in with an explicit id if it really is a second opening.
        if (j.company && j.title) {
            const prior = roles.find(r => sameRole(r, j));
            if (prior) { echoes.push({ j, prior }); seen.add(j.jobId); continue; }
        }
        ledger.push({
            jobId: j.jobId,
            company: j.company || null,
            title: j.title || null,
            url: j.url || `https://www.linkedin.com/jobs/view/${j.jobId}`,
            statedPay: j.salary ? j.salary.matched : null,
            applicants: j.applicantsText || null,
            offsiteApply: j.offsiteApply ?? null,
            preparedAt: today(),
            resume,
            // Never inferred. Only `record.js submitted` sets this.
            actuallySubmitted: null,
        });
        seen.add(j.jobId); added++;
        if (j.company && j.title) roles.push(ledger[ledger.length - 1]);
    }
    save(ledger);
    console.log(`added ${added} (ledger now ${ledger.length}); actuallySubmitted=null on all of them`);
    if (echoes.length) {
        console.log(`\nskipped ${echoes.length} as reposts of roles already in the ledger:`);
        for (const e of echoes) console.log(`  [${e.j.jobId}] ${e.j.company} — ${e.j.title}\n      already have [${e.prior.jobId}] ${e.prior.title}`);
    }
    if (added) console.log('Run `record.js submitted <jobId>...` once the user confirms they sent them.');

} else if (cmd === 'submitted') {
    const ledger = load();
    let n = 0;
    for (const r of ledger) if (bareIds.includes(r.jobId)) { r.submittedAt = today(); r.actuallySubmitted = true; n++; }
    save(ledger);
    const missing = bareIds.filter(id => !ledger.some(r => r.jobId === id));
    console.log(`marked ${n} submitted`);
    if (missing.length) console.log(`not in the ledger: ${missing.join(', ')} — add them first`);

} else if (cmd === 'dedupe') {
    const file = flag('file', null);
    if (!file) { console.error('dedupe needs --file <capture json>'); process.exit(1); }
    const ledger = load();
    const seen = new Set(ledger.map(r => r.jobId));
    const roles = ledger.filter(r => r.company && r.title);
    const rows = rowsFromCapture(file);
    // Filter on both identities: the id catches the same posting, the role key catches the
    // same job reposted under a new id.
    const fresh = rows.filter(j => !seen.has(j.jobId) &&
        !(j.company && j.title && roles.some(r => sameRole(r, j))));
    const out = path.resolve(ROOT, file).replace(/\.json$/, '-new.json');
    fs.writeFileSync(out, JSON.stringify({ dedupedAgainst: path.relative(ROOT, LEDGER), count: fresh.length, jobs: fresh }, null, 1));
    console.log(`${rows.length} captured | ${rows.length - fresh.length} already in the ledger | ${fresh.length} new`);
    console.log(`-> ${path.relative(ROOT, out)}`);

} else if (cmd === 'list') {
    const ledger = load();
    const rows = has('pending') ? ledger.filter(r => !r.actuallySubmitted) : ledger;
    rows.forEach(r => console.log(
        `  ${r.actuallySubmitted ? 'sent   ' : 'PREPPED'} ${r.preparedAt}  ${(r.resume || '-').padEnd(18)}${r.company} — ${r.title}`));
    const pending = ledger.filter(r => !r.actuallySubmitted).length;
    console.log(`\n${ledger.length} total, ${pending} prepared but not confirmed sent`);

} else {
    console.log('usage: record.js add|submitted|dedupe|list  [--file <json>] [--resume <role>] [--pending]');
    process.exit(1);
}
