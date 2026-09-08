#!/usr/bin/env node
/**
 * Regression tests for the parsing this skill's filtering depends on.
 *
 *   node .claude/skills/apply-linkedin-jobs/scripts/test-parse.js
 *
 * Every case below is here because it once produced a WRONG answer against real LinkedIn
 * text, not because it seemed like a good idea. Salary parsing in particular has broken
 * three separate ways; run this after touching parse.js or enrich.js.
 */
const { parseSalary, parseSearchUrl } = require('./lib/parse');
const { titleCore, sameEmployer, dedupeJobs, classifyRemote } = require('./lib/enrich');

let pass = 0, fail = 0;
const eq = (got, want, label) => {
    const ok = JSON.stringify(got) === JSON.stringify(want);
    ok ? pass++ : fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}` + (ok ? '' : `\n        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`));
};
const pay = t => { const r = parseSalary(t); return r ? `${r.basis} ${Math.round(r.min)}-${Math.round(r.max)}` : null; };

console.log('— parseSalary —');
eq(pay('Primary Level Salary Range: $142,200.00 - $213,400.00'), 'annual 142200-213400', 'plain $ range with cents');
eq(pay('Compensation: $230k-$280k'), 'annual 230000-280000', 'k suffix');
eq(pay('Base pay $150K to $200K annually'), 'annual 150000-200000', 'K suffix with "to"');
eq(pay('Range $242,634—$499,541 USD'), 'annual 242634-499541', 'em-dash separator');
eq(pay('Pay: $85 - $110 per hour depending on experience'), 'hourly 176800-228800', 'hourly annualised at 2080h');

// Once reported a $414,000,000 ceiling: "\s?[kK]?" ate the K of "KPMG".
eq(pay('California Salary Range: $226000 - $414000 KPMG offers a package.'), 'annual 226000-414000', 'k suffix must not eat a following word');
eq(pay('Range: $180000 - $240000 Kubernetes experience required'), 'annual 180000-240000', 'same trap, "Kubernetes"');

// Once reported the Vancouver CAD band as the US salary.
eq(pay('The target salary range for this position is 227,800 - 338,800 USD and for Vancouver, Canada $225,250 - $291,500 CAD.'),
   'annual 227800-338800', 'skips a foreign-currency range in favour of USD');
eq(pay('UK range £90,000 - £120,000 GBP; US range $200,000 - $260,000 USD'), 'annual 200000-260000', 'ignores non-$ foreign range');

// The $-less form: needs a pay word leading in, or a unit right after.
eq(pay('Compensation $200,000 - 280,000 USD on an annualized basis.'), 'annual 200000-280000', '$-less range with USD unit');
eq(pay('The Pay Range For This Role Is 245,000 - 285,000 USD per year'), 'annual 245000-285000', '$-less range with pay lead-in');
// Once read "we serve 10,000 - 20,000 customers" as a salary.
eq(pay('Our compensation philosophy is generous. We serve 10,000 - 20,000 customers daily.'), null, 'co-occurrence alone is not a salary');
eq(pay('We are a team of 50 - 100 engineers'), null, 'headcount is not a salary');
eq(pay('Join 5,000 - 6,000 colleagues worldwide'), null, 'no pay word, no unit');
eq(pay('We serve 10,000 - 20,000 customers. Salary 240,000 - 300,000.'), 'annual 240000-300000', 'picks the range the pay word introduces');
eq(pay('Equity grants from $5 to $10 available'), null, 'below the plausibility floor');
eq(pay(''), null, 'empty'); eq(pay(null), null, 'null');

console.log('\n— titleCore / sameEmployer —');
eq([...titleCore('Lead Principal Software Engineer, Core Infrastructure')].sort(), ['core', 'infrastructure', 'lead', 'principal'], 'strips role nouns, keeps level');
eq([...titleCore('(USA) Principal, Software Engineer')], ['principal'], 'level survives; parenthetical dropped');
// Folding level words in once merged Principal into Distinguished.
eq(titleCore('(USA) Distinguished, Software Engineer').has('distinguished'), true, 'distinguished is not generic');
eq(sameEmployer('Cisco', 'Cisco Systems, Inc.'), true, 'token-prefix employer match');
eq(sameEmployer('Walmart', 'Walmart Global Tech'), true, 'suffix noise stripped');
eq(sameEmployer('American Express', 'American Airlines'), false, 'shared first token is not a match');
eq(sameEmployer('Google', 'Alphabet'), false, 'unrelated');

console.log('\n— dedupeJobs —');
const J = (jobId, company, title, min, max, location, likelyStaffing = false) =>
    ({ jobId, company, title, location, likelyStaffing, salary: { min, max, basis: 'annual', matched: '' } });
let r = dedupeJobs([
    J('1', 'Cisco', 'Principal Software Engineer', 250600, 362600, 'San Jose, CA'),
    J('2', 'Ladders', 'Principal Engineer - Platform Engineering', 250600, 362600, 'United States', true),
]);
eq(r.jobs.map(j => j.jobId), ['1'], 'aggregator repost merged, direct employer kept');

r = dedupeJobs([
    J('3', 'Oracle', 'Lead Principal Software Engineer, Core Infrastructure', 135200, 306400, 'Nashville, TN'),
    J('4', 'Oracle', 'Lead Principal Core Infrastructure Engineer', 135200, 306400, 'Nashville, TN'),
]);
eq(r.jobs.length, 1, 'reworded repost merged');

// Once merged an Austin req into a Nashville one on title similarity alone.
r = dedupeJobs([
    J('5', 'Oracle', 'Principal Core Infrastructure Engineer', 114600, 234600, 'Austin, TX'),
    J('6', 'Oracle', 'Lead Principal Core Infrastructure Engineer', 135200, 306400, 'Nashville, TN'),
]);
eq(r.jobs.length, 2, 'different band AND city blocks a merge');

// Once merged two different levels because both titles reduced to nothing.
r = dedupeJobs([
    J('7', 'Walmart', '(USA) Principal, Software Engineer', 156000, 312000, 'Bellevue, WA'),
    J('8', 'Walmart Global Tech', '(USA) Distinguished, Software Engineer', 156000, 312000, 'Bellevue, WA'),
]);
eq(r.jobs.length, 2, 'Principal and Distinguished are different jobs');

// Microsoft/Google publish one band per level — flag, never merge.
r = dedupeJobs([
    J('9', 'Google', 'Staff Software Engineer, Infrastructure, Google Cloud Compute', 207000, 300000, 'Sunnyvale, CA'),
    J('10', 'Google', 'Staff Software Engineer, Cloud Business Platform', 207000, 300000, 'Sunnyvale, CA'),
]);
eq(r.jobs.length, 2, 'same band + city + differing titles is not a merge');
eq(r.flags.length, 1, '…but it is flagged for a human');

console.log('\n— parseSearchUrl —');
const u = parseSearchUrl('https://www.linkedin.com/jobs/search-results/?currentJobId=445&keywords=staff+engineer&f_TPR=r604800&origin=SEMANTIC_SEARCH_LANDING_PAGE&trackingId=abc');
eq(u.keywords, 'staff engineer', 'keywords');
eq(u.filters, { f_TPR: 'r604800' }, 'f_* filters kept, tracking dropped');
eq(u.semantic, true, 'semantic landing page detected');

console.log('\n— classifyRemote —');
// Every string below is real text from the 2026-09-07 capture. The first five all scored
// "remote" under the original /\bremote\b/ substring test, and none of them are remote jobs.
const mode = description => classifyRemote({ description, location: '', title: '' }).remoteMode;

eq(mode('…compute engines, job management, resource management, scheduling and remote shuffling'),
   'unstated', 'Pinterest: "remote shuffling" is a Spark term, not a work mode');
eq(mode('Deep expertise in build systems, test infrastructure, CI/CD, remote execution, caching'),
   'unstated', 'CoreWeave: "remote execution" is a Bazel term');
eq(mode('Limited corporate travel may be required to remote offices or other business meetings'),
   'unstated', 'PitchBook: travel TO remote offices is the opposite of a remote job');
eq(mode('Notice to Applicants for Jobs Located in NYC or Remote Jobs Associated With Office in NYC'),
   'unstated', 'DoorDash: NYC hiring-notice boilerplate');
eq(mode('Experience leading partially remote and distributed teams'),
   'unstated', 'Stripe: a requirement of the candidate, not an offer');

// True positives, each phrased differently enough to have needed its own pattern.
eq(mode('We are a globally distributed, remote-first team building developer tools'),
   'remote', 'Docker: remote-first');
eq(mode('Capital One is open to hiring a Remote Employee for this opportunity'),
   'remote', 'Capital One: open to hiring a Remote Employee');
eq(mode('This globally distributed, fully remote team develops core storage technologies'),
   'remote', 'Elastic: fully remote');
eq(mode('Job Location The primary work location for this role is remote anywhere in the U.S.'),
   'remote', 'Envestnet: primary work location is remote');
eq(mode('This is a full time US REMOTE role with no sponsorship available'),
   'remote', 'Oracle: US REMOTE');

// A hedge grants remote as a possibility. It is not a remote job, and it is not nothing.
eq(mode('Telecommuting and/or working from home may be permissible pursuant to company policies'),
   'conditional', 'Mastercard: hedged boilerplate demotes to conditional');

// Genuinely fenced: remote for some applicants, not for others.
eq(mode('Hybrid work at Stripe. This role is available either in an office or a remote location (35+ miles from a Stripe office)'),
   'conditional', 'Stripe: remote-or-office resolves to conditional, not hybrid');
eq(mode('If based in Austin, Dallas, Denver, Miami, San Francisco, or Seattle: This is a fully remote role. If you are not based in one of the locations listed above, we cannot accommodate remote work outside these locations'),
   'conditional', 'DriveWealth: fully remote inside six metros only');

// A benefit named "Work From Anywhere Month" is not a work mode — this one read as remote
// on the first pass while the posting required two fixed days in the office.
eq(mode('Work Your Way: Work From Anywhere Month + meeting-free weeks yearly. Our Hybrid Rhythm: Tuesdays and Wednesdays are our required in-office days'),
   'hybrid', 'Homebase: "Work From Anywhere Month" is a perk, not remote work');

// …and the converse: a decisive statement about where the worker lives outranks a nearby
// "hybrid", which was offered here only as an option for people who live close by.
eq(mode('Remote Workplace: Your location will be a home office; you are not required to live within commuting distance of your assigned Dexcom site. If you reside within commuting distance a hybrid working environment may be available'),
   'remote', 'Dexcom: home office beats an optional hybrid');

eq(mode('You will collaborate with engineers across three offices'),
   'unstated', 'silence is unstated, never onsite');

// From the 2026-09-08 remote-only re-run.
eq(classifyRemote({ description: 'Patreon operates under a hybrid work model. This role can be based in San Francisco or New York and open to those who are able to be in-office 3 days per week on a hybrid work model. Candidates hired into remote-eligible roles are not expected to meet the same requirements',
                    title: '', location: '' }).remoteMode,
   'hybrid', 'Patreon: "remote-eligible roles" is policy about OTHER roles');
eq(classifyRemote({ description: 'Coinbase is a remote-first, but not remote-only company',
                    title: '', location: '' }).remoteMode,
   'remote', 'Coinbase: remote-first with offices is still a remote job');
eq(classifyRemote({ description: 'Design and operate large-scale compute infrastructure.',
                    title: 'Senior Staff Engineer, AI Compute (Remote Eligible)', location: 'McLean, VA' }).remoteMode,
   'remote', 'a title saying Remote Eligible is trustworthy where body boilerplate is not');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
