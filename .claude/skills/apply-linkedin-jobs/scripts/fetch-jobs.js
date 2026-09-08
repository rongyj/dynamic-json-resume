#!/usr/bin/env node
/**
 * Captures a LinkedIn job search so the apply-linkedin-jobs skill can read it.
 *
 *   node .claude/skills/apply-linkedin-jobs/scripts/fetch-jobs.js \
 *        --url "<a LinkedIn search URL you pasted>" \
 *        --posted week --min-salary 230000 --max-applicants 100
 *
 *   node .claude/skills/apply-linkedin-jobs/scripts/fetch-jobs.js \
 *        --keywords "principal platform engineer" --location "United States" --remote
 *
 *   --remote     sets LinkedIn's f_WT=2. NOT sufficient on its own — see --remote-only.
 *   --remote-only  drops every posting the description does not state is remote.
 *                  Keeps `conditional` (remote but fenced) and reports it separately.
 *   --strict-remote  also drops `conditional`.
 *
 * Uses LinkedIn's logged-out endpoints, so it needs no session, no password and no browser
 * profile, and it cannot put the user's account at risk. That is a deliberate trade: it
 * sees the public pool rather than their personalised or semantic-search ranking. Use
 * fetch-authed.js when the personalised ranking is the point.
 *
 * Two stages by necessity. The search endpoint returns TEN cards a page carrying only
 * id/title/company/location/date. Applicant count and pay live ONLY on the per-job detail
 * fragment, so filtering on those costs one request per job — hence --max and --delay.
 *
 * Exit codes: 1 usage/fatal, 4 blocked by LinkedIn (999 bot check).
 */
const fs = require('fs');
const path = require('path');
const { parseCards, parseSearchUrl } = require('./lib/parse');
const { get, enrich, filterJobs, line, summarizeDropped, collapseReposts, progress, sleep,
        dedupeJobs, summarizeDuplicates } = require('./lib/enrich');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const RAW = path.join(ROOT, 'applications', 'raw');
const SEARCH = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const has = n => args.includes('--' + n);

const POSTED = { day: 'r86400', '3days': 'r259200', week: 'r604800', month: 'r2592000' };
const MAX = Number(flag('max', 400));
// The search endpoint A/B-rotates its results: two identical requests returned ZERO
// overlapping ids (verified 2026-09-07), and a union saturates after the second round.
// So sweep each offset twice; more than that buys nothing but rate limit.
const ROUNDS = Number(flag('rounds', 2));
const DELAY = Number(flag('delay', 2500));
const MIN_SALARY = Number(flag('min-salary', 0));
const MAX_APPLICANTS = Number(flag('max-applicants', 0));
const DETAILS = !has('no-details');

function buildSearchUrl(spec, start) {
    const u = new URL(SEARCH);
    if (spec.keywords) u.searchParams.set('keywords', spec.keywords);
    if (spec.location) u.searchParams.set('location', spec.location);
    if (spec.geoId) u.searchParams.set('geoId', spec.geoId);
    for (const [k, v] of Object.entries(spec.filters)) u.searchParams.set(k, v);
    u.searchParams.set('start', String(start));
    return u.toString();
}

(async () => {
    const urlArg = flag('url', null);
    const spec = urlArg
        ? parseSearchUrl(urlArg)
        : { keywords: flag('keywords', ''), location: '', geoId: '', filters: {}, semantic: false };

    // An explicit --location beats whatever the pasted URL carried; a semantic-search URL
    // often carries none at all, which would otherwise search the whole world.
    const locArg = flag('location', null);
    if (locArg) spec.location = locArg;
    if (!spec.location) spec.location = 'United States';

    if (has('remote')) spec.filters.f_WT = '2';
    // f_WT=2 is accepted by LinkedIn but does not deliver remote-only results: of an 85-job
    // capture taken with it on 2026-09-07, only 8 postings actually stated remote work and
    // 21 stated an office cadence. Say so rather than letting the flag imply otherwise.
    if (has('remote') && !has('remote-only')) {
        console.log('note: --remote sets f_WT=2, which LinkedIn accepts but does not enforce —');
        console.log('      a capture taken with it returned 21 hybrid and 51 unstated of 85.');
        console.log('      Add --remote-only to drop everything not stated remote.\n');
    }
    if (has('easy-apply')) spec.filters.f_AL = 'true';
    const posted = flag('posted', null);
    if (posted) {
        if (!POSTED[posted]) { console.error('--posted must be one of: ' + Object.keys(POSTED).join(', ')); process.exit(1); }
        spec.filters.f_TPR = POSTED[posted];
    }
    if (!spec.keywords) { console.error('Need --keywords, or a --url that carries keywords.'); process.exit(1); }

    if (spec.semantic) {
        console.log('NOTE: that is a semantic-search landing page. Its keywords are prose LinkedIn');
        console.log('      interprets loosely — they are NOT filters. Anything in the keyword text');
        console.log('      about pay, applicant count or posting age is being ignored by LinkedIn.');
        console.log('      Pass --posted / --min-salary / --max-applicants to apply them for real.\n');
    }
    console.log(`keywords : ${spec.keywords.slice(0, 120)}${spec.keywords.length > 120 ? '…' : ''}`);
    console.log(`location : ${spec.location || '(any)'}`);
    console.log(`filters  : ${Object.keys(spec.filters).length ? JSON.stringify(spec.filters) : '(none)'}\n`);

    // ---- stage 1: page the search endpoint (10 per page) ------------------------------
    const byId = new Map();
    for (let round = 1; round <= ROUNDS; round++) {
        const atRoundStart = byId.size;
        for (let start = 0; start < MAX; start += 10) {
            const html = await get(buildSearchUrl(spec, start), `search start=${start}`);
            if (html === null) break;
            const cards = parseCards(html);
            cards.forEach(c => byId.has(c.jobId) || byId.set(c.jobId, c));
            process.stdout.write(`\r  round ${round}/${ROUNDS}  start=${start}  ${byId.size} unique   `);
            // An empty page is the end of the pool (it caps near 1000), not an error.
            if (cards.length === 0) break;
            await sleep(DELAY);
        }
        console.log('');
        if (round > 1 && byId.size === atRoundStart) break;   // rotation exhausted
    }
    const raw = [...byId.values()];
    const jobs = has('keep-duplicates') ? raw : collapseReposts(raw);
    console.log(`${raw.length} unique ids` +
        (raw.length !== jobs.length ? `, ${jobs.length} distinct roles after collapsing reposts` : '') + '.\n');
    if (!jobs.length) { console.log('Nothing matched. Loosen the filters or widen --location.'); return; }

    // ---- stage 2: per-job detail ------------------------------------------------------
    if (DETAILS) {
        console.log(`Fetching detail for ${jobs.length} jobs (~${Math.max(1, Math.round(jobs.length * DELAY / 60000))} min)…`);
        await enrich(jobs, { delay: DELAY, onProgress: progress });
        console.log('');
    }

    const { kept: filtered, dropped } = filterJobs(jobs, {
        minSalary: MIN_SALARY, maxApplicants: MAX_APPLICANTS, excludeStaffing: has('exclude-staffing'),
        remoteOnly: has('remote-only'), allowConditionalRemote: !has('strict-remote'),
    });

    // Dedupe AFTER filtering, so a survivor is always a job that actually passed. Running
    // it first can drop the reposted copy and then lose the original to a filter, leaving
    // neither. Needs the pay band, so it cannot run before enrich() either.
    const dup = has('keep-duplicates')
        ? { jobs: filtered, merges: [], flags: [] }
        : dedupeJobs(filtered);
    const kept = dup.jobs;

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    fs.mkdirSync(RAW, { recursive: true });
    const out = path.join(RAW, `linkedin-${stamp}.json`);
    fs.writeFileSync(out, JSON.stringify({
        capturedAt: stamp, source: 'guest', spec,
        appliedFilters: { minSalary: MIN_SALARY || null, maxApplicants: MAX_APPLICANTS || null },
        total: jobs.length, kept: kept.length, jobs: kept, dropped,
        duplicatesMerged: dup.merges.map(m => ({ kept: m.keep.jobId, dropped: m.drop.jobId, rule: m.rule, detail: m.detail })),
        possibleDuplicates: dup.flags.map(f => ({ a: f.a.jobId, b: f.b.jobId, why: f.why })),
    }, null, 1));

    console.log(`${jobs.length} jobs | ${kept.length} kept | ${dropped.length} filtered out` +
        (dup.merges.length ? ` | ${dup.merges.length} merged as duplicates` : ''));
    kept.slice(0, 40).forEach(j => console.log(line(j)));
    summarizeDropped(dropped);
    summarizeDuplicates(dup);

    const noPay = dropped.filter(d => d.droppedBecause === 'no pay range stated').length;
    if (noPay) {
        console.log(`\n${noPay} were dropped only because the posting states no range. That is NOT the`);
        console.log('same as paying under the floor — most big employers omit it outside the states');
        console.log('that mandate it. Re-run without --min-salary to see them.');
    }
    console.log(`\n-> ${path.relative(ROOT, out)}`);
})().catch(e => { console.error(e); process.exit(1); });
