#!/usr/bin/env node
/**
 * Turns a list of LinkedIn job ids into judged rows, using the stable public endpoints.
 *
 *   node .claude/skills/apply-linkedin-jobs/scripts/fetch-details.js \
 *        --ids applications/raw/linkedin-ids-<stamp>.json \
 *        --min-salary 230000 --max-applicants 100 [--remote-only] [--strict-remote]
 *
 *   node .claude/skills/apply-linkedin-jobs/scripts/fetch-details.js 4460126625 4454863014
 *
 * This is stage 2 of the authenticated path: fetch-authed.js supplies the ids that only a
 * logged-in search can rank, and this reads the facts from markup that does not rotate.
 * It is also how to re-check a shortlist later — an expired posting comes back `expired`.
 */
const fs = require('fs');
const path = require('path');
const { enrich, filterJobs, line, summarizeDropped, progress,
        dedupeJobs, summarizeDuplicates } = require('./lib/enrich');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const RAW = path.join(ROOT, 'applications', 'raw');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const has = n => args.includes('--' + n);

const DELAY = Number(flag('delay', 2500));
const MIN_SALARY = Number(flag('min-salary', 0));
const MAX_APPLICANTS = Number(flag('max-applicants', 0));

let ids = [];
const idsFile = flag('ids', null);
if (idsFile) {
    const raw = JSON.parse(fs.readFileSync(path.resolve(ROOT, idsFile), 'utf8'));
    ids = raw.jobIds || (raw.jobs || []).map(j => j.jobId) || [];
} else {
    // Skip any arg that is a flag's value, or "230000" from --min-salary becomes a job id.
    ids = args.filter((a, i) => /^\d{6,}$/.test(a) && !(i > 0 && args[i - 1].startsWith('--')));
}
ids = [...new Set(ids.filter(Boolean))];
if (!ids.length) { console.error('usage: fetch-details.js --ids <json> | <jobId>...'); process.exit(1); }

(async () => {
    const rows = ids.map(jobId => ({ jobId }));
    console.log(`Fetching ${rows.length} postings (~${Math.max(1, Math.round(rows.length * DELAY / 60000))} min)…`);
    const { expired } = await enrich(rows, {
        delay: DELAY, onProgress: progress,
    });
    console.log('');

    const { kept: filtered, dropped } = filterJobs(rows, {
        minSalary: MIN_SALARY, maxApplicants: MAX_APPLICANTS, excludeStaffing: has('exclude-staffing'),
        remoteOnly: has('remote-only'), allowConditionalRemote: !has('strict-remote'),
    });
    const dup = has('keep-duplicates') ? { jobs: filtered, merges: [], flags: [] } : dedupeJobs(filtered);
    const kept = dup.jobs;

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    fs.mkdirSync(RAW, { recursive: true });
    const out = path.join(RAW, `linkedin-${stamp}.json`);
    fs.writeFileSync(out, JSON.stringify({
        capturedAt: stamp, source: 'ids',
        appliedFilters: { minSalary: MIN_SALARY || null, maxApplicants: MAX_APPLICANTS || null },
        total: rows.length, kept: kept.length, jobs: kept, dropped,
        duplicatesMerged: dup.merges.map(m => ({ kept: m.keep.jobId, dropped: m.drop.jobId, rule: m.rule, detail: m.detail })),
        possibleDuplicates: dup.flags.map(f => ({ a: f.a.jobId, b: f.b.jobId, why: f.why })),
    }, null, 1));

    console.log(`${rows.length} postings | ${kept.length} kept | ${dropped.length} dropped | ${expired} expired`);
    kept.slice(0, 60).forEach(j => console.log(line(j)));
    summarizeDropped(dropped);
    summarizeDuplicates(dup);
    console.log(`\n-> ${path.relative(ROOT, out)}`);
})().catch(e => { console.error(e); process.exit(1); });
