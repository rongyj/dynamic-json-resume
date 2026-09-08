/**
 * Shared stage-2 for both capture paths: turn job ids into judged rows.
 *
 * fetch-jobs.js (public search) and fetch-authed.js (personalised search) disagree about
 * where the id list comes from and agree about everything after it, so everything after it
 * lives here — one place to fix when LinkedIn moves the markup.
 */
const { parseDetail } = require('./parse');

const DETAIL = 'https://www.linkedin.com/jobs-guest/jobs/api/jobPosting';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// Not a LinkedIn field. "Direct hiring employer" has no filter, so this is a name-shaped
// guess at staffing firms, consultancies and body shops. It only ever FLAGS a row for the
// user to overrule — it never drops one.
const STAFFING = /\b(staffing|recruit|talent|consult|solutions? group|resourc|placement|search group|headhunt|contract(or|ing)|outsourc|manpower|robert half|teksystems|insight global|apex systems|motion recruitment|jobot|cybercoders|randstad|adecco|kforce|collabera|infosys|wipro|cognizant|hcl ?tech|tata consult|capgemini|accenture|deloitte|mindlance|diverse lynx|synechron|ladders|dice|jobgether|bright vision)\b/i;

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Progress that is readable both on a terminal and in a redirected log. `\r` overwriting
 * only works on a TTY; piped to a file it buffers into one unreadable smear, so fall back
 * to a real line every 10%.
 */
function progress(n, total) {
    if (process.stdout.isTTY) { process.stdout.write(`\r  ${n}/${total}   `); return; }
    const step = Math.max(1, Math.ceil(total / 10));
    if (n === total || n % step === 0) console.log(`  ${n}/${total}`);
}

/** GETs with LinkedIn's throttles in mind. Returns null on 404, exits the process on 999. */
async function get(url, label) {
    for (let attempt = 0; attempt < 3; attempt++) {
        let res;
        try {
            res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } });
        } catch { await sleep(5000 * (attempt + 1)); continue; }
        // 999 is LinkedIn's "we think you are a bot". Backing off does not clear it, so
        // stop rather than hammer — the caller should raise --delay and try later.
        if (res.status === 999) {
            console.error(`\nLinkedIn returned 999 (bot check) on ${label}. Stopping.`);
            console.error('Raise --delay and try again later; do not retry in a tight loop.');
            process.exit(4);
        }
        if (res.status === 429) { await sleep(20000 * (attempt + 1)); continue; }
        if (res.status === 404 || res.status === 410) return null;
        if (!res.ok) { await sleep(5000 * (attempt + 1)); continue; }
        return res.text();
    }
    return null;
}

/**
 * Fills in description, pay, applicant count and criteria for each row, in place.
 * `rows` may be bare {jobId} objects; anything already set from a search card wins over
 * the detail page, which sometimes truncates the title.
 */
async function enrich(rows, { delay = 2500, onProgress = null } = {}) {
    let n = 0, gone = 0;
    for (const row of rows) {
        const html = await get(`${DETAIL}/${row.jobId}`, `detail ${row.jobId}`);
        if (html) {
            const d = parseDetail(html, row.jobId);
            for (const [k, v] of Object.entries(d)) if (row[k] == null && v != null) row[k] = v;
            // parseDetail's own values for these are authoritative even if the card had one.
            Object.assign(row, {
                applicants: d.applicants, applicantsText: d.applicantsText,
                salary: d.salary, description: d.description, offsiteApply: d.offsiteApply,
            });
        } else {
            row.expired = true; gone++;
        }
        row.url = row.url || `https://www.linkedin.com/jobs/view/${row.jobId}`;
        row.likelyStaffing = STAFFING.test(row.company || '');
        Object.assign(row, classifyRemote(row));
        if (onProgress) onProgress(++n, rows.length);
        await sleep(delay);
    }
    return { enriched: rows, expired: gone };
}

/**
 * Decides whether a posting is actually remote.
 *
 * WHY THIS IS NOT A SUBSTRING TEST. The previous version was
 * `/\bremote\b/.test(description + location)`, and it was wrong in both directions —
 * verified 2026-09-08 against the 85-job capture from the day before:
 *
 *   - Pinterest "…scheduling and remote shuffling"        -> a Spark term, not a work mode
 *   - CoreWeave "…build systems, test infrastructure, remote execution, caching"
 *                                                          -> a Bazel term, not a work mode
 *   - PitchBook "travel may be required to remote offices" -> the OPPOSITE of a remote job
 *   - DoorDash  "Notice to Applicants for Jobs Located in NYC or Remote Jobs…" -> boilerplate
 *   - Stripe    "Experience leading partially remote and distributed teams" -> a requirement
 *
 * Only 19 of those 85 contained the word at all, and roughly a third of the 19 were noise
 * like the above — so the flag was worse than useless. It is the same failure `parseSalary`
 * already learned from: a bare token needs an anchor. Every pattern below ties "remote" to
 * the ROLE or to where the WORKER sits, never to a technical noun.
 *
 * Returns { remoteMode, remoteEvidence } where remoteMode is one of:
 *   remote      — the posting says the job is remote
 *   conditional — remote, but fenced (Stripe's 35-miles-from-an-office rule; DriveWealth's
 *                 six named metros). Kept separately because it is genuinely remote for
 *                 some applicants and not for others, and only the applicant knows which.
 *   hybrid      — a stated office cadence
 *   onsite      — remote explicitly ruled out
 *   unstated    — the common case: the posting simply never says
 *
 * `unstated` is NOT `onsite`, exactly as "no pay range stated" is not "pays too little".
 * It is reported as its own bucket so a filter can never quietly convert silence into a no.
 */
const REMOTE_YES = [
    /\b(?:100%|fully|entirely|permanently)\s+remote\b/i,
    /\bremote[- ]first\b/i,
    // Not "Work From Anywhere Month/Week/Day" — Homebase lists that as a benefit while
    // requiring Tuesdays and Wednesdays in the office.
    /\bwork from anywhere\b(?!\s+(?:month|week|day))/i,
    /\btelecommut/i,
    /\b(?:this|the)\s+(?:role|position|job|opportunity)\s+(?:is|will be|can be)\s+(?:fully\s+|100%\s+)?remote\b/i,
    /\bremote\s*\(\s*(?:us|usa|united states|u\.s\.|regardless of location|remote)/i,
    /\bremote\s*[-–—]\s*(?:us|usa|united states|u\.s\.)\b/i,
    /\b(?:us|usa|u\.s\.)[\s-]remote\b/i,
    /\bremote\s+(?:anywhere|role|position|opportunity|employee|worker|workplace|job)\b/i,
    /\bopen to hiring a remote\b/i,
    // Only when it is THIS role. Patreon's posting says "Candidates hired into
    // remote-eligible roles are not expected to meet the same requirements" as generic
    // policy, while the role itself is "in-office 3 days per week on a hybrid work
    // model". The bare form read that as a remote job. A title saying so is handled
    // separately, below, and is trustworthy.
    /\b(?:this|the)\s+(?:role|position|job)\s+(?:is|are)\s+(?:also\s+)?remote[- ]eligible\b/i,
    /\b(?:primary )?work location .{0,40}?\bremote\b/i,
    /\bnot required to live within commuting distance\b/i,
    /\bremote\s+(?:in|within|across)\s+the\s+(?:us|u\.s\.|united states)\b/i,
    // Stripe: "This role is available either in an office or a remote location (35+ miles
    // ... from a Stripe office)". Genuinely remote-eligible, under a "Hybrid work at
    // Stripe" heading — which is why YES+HYBRID resolves to `conditional` and not to
    // either extreme.
    /\bavailable (?:either )?in an office or a remote location\b/i,
];
// A stated office cadence. "hybrid" alone counts; the rest catch postings that describe
// the cadence without ever using the word.
const REMOTE_HYBRID = [
    /\bhybrid\b/i,
    /\b\d\s*(?:\+\s*)?days?\s*(?:a|per)\s*week\s*(?:in|at|from|onsite|on-site)/i,
    /\bin[- ]office\s+\d/i,
    /\brequired in office\b/i,
    /\bmust (?:be|work)\s+(?:on[- ]?site|in[- ]the[- ]office|in office)\b/i,
    /\bon[- ]?site\s+\d\s*days?/i,
];
// Kills a remote claim outright.
const REMOTE_NO = [
    /\bcannot accommodate remote\b/i,
    /\bnot a remote\b/i,
    /\bno remote work\b/i,
    /\bremote work is not\b/i,
    /\b(?:this|the)\s+(?:role|position)\s+is not remote\b/i,
    /\bremote work is not (?:available|offered|an option)\b/i,
];

// Boilerplate that grants remote work as a possibility rather than as a fact. Mastercard's
// postings carry "Telecommuting and/or working from home may be permissible pursuant to
// company policies" — which classified as `remote` on the first pass and is nothing of the
// sort. A hedge does not erase a remote claim, it demotes it to `conditional`.
const REMOTE_HEDGE = [
    /\bmay be (?:permissible|permitted|available|possible)\b/i,
    /\bat (?:the )?(?:manager|management|company)(?:'s|s')? discretion\b/i,
    /\bsubject to (?:manager |management |business )?approval\b/i,
    /\bpursuant to company polic/i,
];

// Statements so specific about where the worker lives that a nearby "hybrid" cannot demote
// them. Dexcom: "Your location will be a home office; you are not required to live within
// commuting distance of your assigned Dexcom site" — and then, separately, "If you reside
// within commuting distance ... a hybrid working environment MAY be available". That is a
// remote job with an optional office, not a fenced one, and the generic YES+HYBRID rule got
// it backwards.
const REMOTE_DECISIVE = [
    /\bnot required to live within commuting distance\b/i,
    /\byour location will be a home office\b/i,
    /\bremote\s*\(\s*regardless of location/i,
];

function classifyRemote(row) {
    const text = `${row.title || ''}\n${row.location || ''}\n${row.description || ''}`;
    // The location field on its own is decisive when LinkedIn stamps it, and so is the
    // title — "Senior Staff Engineer, AI Compute (Remote Eligible)" is the employer
    // saying it in the one place that cannot be boilerplate about other roles.
    const locRemote = /\bremote\b/i.test(row.location || '');
    const titleRemote = /\bremote\b/i.test(row.title || '');
    const hit = pats => { for (const re of pats) { const m = text.match(re); if (m) return m[0].trim().replace(/\s+/g, ' ').slice(0, 140); } return null; };

    const no = hit(REMOTE_NO);
    const yes = hit(REMOTE_YES);
    const hyb = hit(REMOTE_HYBRID);

    // Both a yes and a fence: Stripe and DriveWealth both read this way, and calling
    // either one flatly "remote" or flatly "hybrid" would be a lie in one direction.
    const hedge = hit(REMOTE_HEDGE);
    const decisive = hit(REMOTE_DECISIVE);
    if (decisive && !no) return { remoteMode: 'remote', remoteEvidence: decisive };
    if (yes && (no || hyb)) return { remoteMode: 'conditional', remoteEvidence: `${yes} || fenced by: ${no || hyb}` };
    if (no) return { remoteMode: 'onsite', remoteEvidence: no };
    if (yes && hedge) return { remoteMode: 'conditional', remoteEvidence: `${yes} || hedged by: ${hedge}` };
    if (yes) return { remoteMode: 'remote', remoteEvidence: yes };
    if (titleRemote) return { remoteMode: 'remote', remoteEvidence: `title: ${row.title}` };
    if (locRemote) return { remoteMode: 'remote', remoteEvidence: `location field: ${row.location}` };
    if (hyb) return { remoteMode: 'hybrid', remoteEvidence: hyb };
    return { remoteMode: 'unstated', remoteEvidence: null };
}

/**
 * Applies the numeric filters. Returns {kept, dropped} with a reason on each dropped row,
 * because "0 results" with no reason is indistinguishable from a broken parser.
 */
function filterJobs(rows, { minSalary = 0, maxApplicants = 0, excludeStaffing = false,
                           remoteOnly = false, allowConditionalRemote = true } = {}) {
    const kept = [], dropped = [];
    for (const j of rows) {
        const mode = j.remoteMode || 'unstated';
        let why = null;
        if (j.expired) why = 'posting no longer public';
        // Remote is checked before pay so the drop summary attributes each posting to the
        // reason the user actually cares about. `unstated` gets its own bucket for the same
        // reason "no pay range stated" does: silence is not a no, and collapsing the two
        // would hide how many postings were discarded on absence of evidence.
        else if (remoteOnly && mode === 'unstated') why = 'remote not stated in the posting';
        else if (remoteOnly && mode === 'hybrid') why = `hybrid: ${j.remoteEvidence}`;
        else if (remoteOnly && mode === 'onsite') why = `remote ruled out: ${j.remoteEvidence}`;
        else if (remoteOnly && mode === 'conditional' && !allowConditionalRemote) why = `remote but fenced: ${j.remoteEvidence}`;
        else if (minSalary && !j.salary) why = 'no pay range stated';
        else if (minSalary && j.salary.max < minSalary) why = `pay tops out at ${Math.round(j.salary.max / 1000)}k`;
        else if (maxApplicants && j.applicants != null && j.applicants > maxApplicants) why = `${j.applicantsText}`;
        else if (excludeStaffing && j.likelyStaffing) why = 'company name looks like an agency';
        (why ? dropped : kept).push(why ? { ...j, droppedBecause: why } : j);
    }
    return { kept, dropped };
}

/** One line per job, aligned, for the terminal. */
function line(j) {
    const pay = j.salary
        ? `$${Math.round(j.salary.min / 1000)}-${Math.round(j.salary.max / 1000)}k${j.salary.basis === 'hourly' ? '*' : ''}`
        : 'pay n/s';
    // Remote mode is shown on every row, not just when filtering on it — `f_WT=2` returns
    // plenty of on-site postings, so a row with no marker would read as remote by default.
    const mode = { remote: '[remote] ', conditional: '[remote?] ', hybrid: '[hybrid] ',
                   onsite: '[onsite] ', unstated: '' }[j.remoteMode || 'unstated'];
    return `  ${pay.padEnd(13)}${String(j.applicantsText || '—').padEnd(34)}` +
           `${mode}${j.likelyStaffing ? '[agency?] ' : ''}${j.company} — ${j.title}`;
}

/**
 * Collapses reposts: the same role frequently appears under several jobIds — LinkedIn
 * lets an employer post per-location and per-ATS-sync, and a search sweep picks up all of
 * them (verified 2026-09-07: one sweep returned "Salesforce — Software Engineering PMTS"
 * and "LinkedIn — Distinguished Software Engineer…" twice each, distinct ids).
 *
 * Keys on company+title, keeps the most recently posted, and records the ids it folded in
 * as `alsoPostedAs` — they are not discarded, because two ids under one title are
 * sometimes genuinely two locations and the user may want the other one.
 */
function collapseReposts(rows) {
    const by = new Map();
    for (const r of rows) {
        const key = `${(r.company || '').toLowerCase()}|${(r.title || '').toLowerCase()}`;
        const prev = by.get(key);
        if (!prev) { by.set(key, r); continue; }
        const [keep, fold] = (r.postedAt || '') > (prev.postedAt || '') ? [r, prev] : [prev, r];
        keep.alsoPostedAs = [...(keep.alsoPostedAs || []), ...(fold.alsoPostedAs || []), fold.jobId];
        by.set(key, keep);
    }
    return [...by.values()];
}

/**
 * Words that carry no distinguishing information in an engineering job title. Stripping
 * them is what lets "Lead Principal Software Engineer, Core Infrastructure" and "Lead
 * Principal Core Infrastructure Engineer" reduce to the same thing while keeping "Staff
 * SWE, Cloud Business Platform" and "Staff SWE, Infrastructure, Google Cloud Compute"
 * apart — the level words are shared by half the postings in any capture.
 */
const GENERIC_TITLE_WORDS = new Set([
    'software', 'engineer', 'engineers', 'engineering', 'developer', 'development',
    'member', 'technical', 'mts', 'sde', 'swe', 'ic',
    'usa', 'us', 'remote', 'hybrid', 'onsite', 'eligible', 'the', 'of', 'and', 'a',
]);

// NOT stripped, deliberately. An early version folded the level words in here, and
// "Walmart — (USA) Principal, Software Engineer" then reduced to the same empty set as
// "Walmart — (USA) Distinguished, Software Engineer" and merged two different levels of a
// job. Level is the most load-bearing word in an engineering title; it stays.
const LEVEL_WORDS = new Set(['senior', 'sr', 'staff', 'principal', 'lead', 'distinguished',
    'director', 'ii', 'iii', 'iv']);

const normCompany = s => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(inc|llc|ltd|plc|corp|corporation|company|co|group|holdings|technologies|technology|tech|labs|global|systems|solutions)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();

/**
 * Whether two company strings name the same employer. Exact match after normalisation is
 * too strict — LinkedIn carries "Cisco", "Cisco Systems, Inc." and "Walmart Global Tech"
 * for what are, for dedupe purposes, one employer.
 *
 * Token-PREFIX rather than substring or shared-token: "cisco" ⊂ "cisco systems" is the
 * same employer, but "american express" and "american airlines" share a first token and
 * are not. Requiring the shorter name to be a leading run of the longer keeps that apart.
 */
function sameEmployer(a, b) {
    const x = normCompany(a).split(' ').filter(Boolean);
    const y = normCompany(b).split(' ').filter(Boolean);
    if (!x.length || !y.length) return false;
    const [short, long] = x.length <= y.length ? [x, y] : [y, x];
    return short.every((t, i) => long[i] === t);
}

/** Title reduced to the words that actually name the role. */
function titleCore(title) {
    return new Set((title || '').toLowerCase()
        .replace(/\(.*?\)/g, ' ')                  // "(10378)", "(Remote US)"
        .replace(/[^a-z0-9]+/g, ' ')
        .split(' ')
        .filter(w => w && w.length > 1 && !GENERIC_TITLE_WORDS.has(w)));
}

const jaccard = (a, b) => {
    // Two titles that both reduce to nothing are unknowable, not identical — refuse to
    // merge rather than guess. Same for one empty and one specific.
    if (!a.size || !b.size) return 0;
    let hit = 0;
    for (const x of a) if (b.has(x)) hit++;
    return hit / (a.size + b.size - hit);
};

const bandOf = j => j.salary ? `${Math.round(j.salary.min)}-${Math.round(j.salary.max)}` : null;

/**
 * Finds jobs that are the same opening posted twice. Runs AFTER enrich(), because both
 * rules lean on the pay band.
 *
 * Two rules, both confirmed against a real capture on 2026-09-07:
 *
 *  1. AGGREGATOR REPOST — same pay band down to the dollar, different company name, one of
 *     which is a job-board reposter. Verified case: "Ladders — Principal Engineer,
 *     Platform Engineering" and "Cisco — Principal Software Engineer" both at
 *     $250,600–$362,600, the Ladders copy describing "a leader in the Telecommunications &
 *     Hardware space" and the same Kubernetes platform team. The direct employer wins.
 *
 *  2. REWORDED REPOST — same employer, and the titles reduce to the same core words.
 *     Verified case: Oracle Nashville posting both "Lead Principal Software Engineer, Core
 *     Infrastructure" and "Lead Principal Core Infrastructure Engineer" at an identical
 *     band.
 *
 * Deliberately NOT a rule: same employer + same band + same city. Microsoft and Google
 * publish one band per level, so that fires on three genuinely different Microsoft CoreAI
 * roles and two different Google teams. Those are reported as `possibleDuplicateOf` for a
 * human to look at, never merged.
 */
function findDuplicates(rows) {
    const merges = [], flags = [];
    const dropped = new Set();

    for (let i = 0; i < rows.length; i++) {
        for (let j = i + 1; j < rows.length; j++) {
            const a = rows[i], b = rows[j];
            if (dropped.has(a.jobId) || dropped.has(b.jobId)) continue;
            const sameCo = sameEmployer(a.company, b.company);
            const band = bandOf(a);
            const sameBand = band && band === bandOf(b);
            const sim = jaccard(titleCore(a.title), titleCore(b.title));

            // Rule 1: aggregator repost.
            if (!sameCo && sameBand && (a.likelyStaffing !== b.likelyStaffing)) {
                const [keep, drop] = a.likelyStaffing ? [b, a] : [a, b];
                merges.push({ keep, drop, rule: 'aggregator repost',
                    detail: `identical band ${band}; "${drop.company}" is a reposter, "${keep.company}" is the employer` });
                dropped.add(drop.jobId);
                continue;
            }
            // Rule 2: same employer, reworded title. Requires corroboration from the band
            // or the location: Oracle posts the same core-infrastructure role at several
            // levels in several cities, and title similarity alone merged an Austin
            // $114k-234k req into a Nashville $135k-306k one.
            const sameLoc = a.location && a.location === b.location;
            const bandsDiffer = bandOf(a) && bandOf(b) && !sameBand;
            const locsDiffer = a.location && b.location && !sameLoc;
            const corroborated = (sameBand || sameLoc) && !(bandsDiffer && locsDiffer);
            if (sameCo && sim >= 0.6 && corroborated) {
                const [keep, drop] = (a.postedAt || '') >= (b.postedAt || '') ? [a, b] : [b, a];
                merges.push({ keep, drop, rule: 'reworded repost',
                    detail: `same employer; titles reduce to the same core (similarity ${sim.toFixed(2)})` });
                dropped.add(drop.jobId);
                continue;
            }
            // Everything else that merely looks suspicious gets flagged, not merged.
            if (sameCo && sameBand && a.location === b.location) {
                flags.push({ a, b, why: `same employer, same band ${band}, same location — but the titles differ` });
            }
        }
    }
    return { merges, flags };
}

/**
 * Applies findDuplicates(). Returns the surviving rows, each carrying `mergedFrom` so no
 * jobId is ever lost, plus the merge log and the flags for reporting.
 */
function dedupeJobs(rows) {
    const { merges, flags } = findDuplicates(rows);
    const dropped = new Map(merges.map(m => [m.drop.jobId, m]));
    const kept = rows.filter(r => !dropped.has(r.jobId));
    for (const m of merges) {
        const survivor = kept.find(r => r.jobId === m.keep.jobId);
        if (survivor) {
            survivor.mergedFrom = [...(survivor.mergedFrom || []),
                { jobId: m.drop.jobId, company: m.drop.company, title: m.drop.title, rule: m.rule }];
        }
    }
    for (const f of flags) {
        const a = kept.find(r => r.jobId === f.a.jobId), b = kept.find(r => r.jobId === f.b.jobId);
        if (a) a.possibleDuplicateOf = [...(a.possibleDuplicateOf || []), f.b.jobId];
        if (b) b.possibleDuplicateOf = [...(b.possibleDuplicateOf || []), f.a.jobId];
    }
    return { jobs: kept, merges, flags };
}

/** Reports what was merged and what merely looks suspicious. */
function summarizeDuplicates({ merges, flags }) {
    if (merges.length) {
        console.log(`\nmerged ${merges.length} duplicate posting(s):`);
        for (const m of merges) {
            console.log(`  kept  [${m.keep.jobId}] ${m.keep.company} — ${m.keep.title}`);
            console.log(`  dropped [${m.drop.jobId}] ${m.drop.company} — ${m.drop.title}`);
            console.log(`          ${m.rule}: ${m.detail}`);
        }
    }
    if (flags.length) {
        console.log(`\n${flags.length} pair(s) look similar but were NOT merged — check if it matters:`);
        for (const f of flags) {
            console.log(`  [${f.a.jobId}] ${f.a.title}`);
            console.log(`  [${f.b.jobId}] ${f.b.title}`);
            console.log(`          ${f.why}`);
        }
    }
}

/**
 * Prints why rows were dropped, grouped. A bare "0 kept" cannot be told apart from a
 * broken parser, and the difference decides whether to loosen a filter or fix the code.
 */
function summarizeDropped(dropped) {
    if (!dropped.length) return;
    const by = {};
    for (const d of dropped) {
        const k = /^pay tops out at/.test(d.droppedBecause) ? 'pay below the floor'
                : /applicant/i.test(d.droppedBecause) ? 'too many applicants'
                : d.droppedBecause;
        (by[k] = by[k] || []).push(d);
    }
    console.log('\ndropped:');
    for (const [reason, rows] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) {
        console.log(`  ${String(rows.length).padStart(3)}  ${reason}`);
    }
}

module.exports = { get, enrich, filterJobs, line, summarizeDropped, collapseReposts, progress, classifyRemote,
    findDuplicates, dedupeJobs, summarizeDuplicates, titleCore, normCompany, sameEmployer, STAFFING, DETAIL, UA, sleep };
