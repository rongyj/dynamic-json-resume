#!/usr/bin/env node
/**
 * Marks jobs as applied on JobRight so they stop being recommended.
 *
 *   node .claude/skills/apply-jobright-jobs/scripts/mark-applied.js --file applications/shortlist.json
 *   node .claude/skills/apply-jobright-jobs/scripts/mark-applied.js <jobId> [<jobId> ...]
 *
 * --file takes a JSON array of objects carrying at least {jobId}; --dry-run lists without writing.
 *
 * Endpoint: POST /swan/job/apply {jobId, source:0}
 * Reverse:  POST /swan/job/unapply {jobId}   (see unapply.js)
 *
 * Verifies by reading /swan/job/apply/count before and after, because a 200 response is
 * not proof the count moved.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const DRY = args.includes('--dry-run');

let jobs = [];
const file = flag('file', null);
if (file) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'));
  const list = Array.isArray(raw) ? raw : (raw.matches || raw.jobs || []);
  jobs = list.filter(j => j.jobId).map(j => ({ jobId: j.jobId, company: j.company || '', title: (j.title || '').slice(0, 45) }));
} else {
  jobs = args.filter(a => !a.startsWith('--') && a.length > 8).map(id => ({ jobId: id, company: '', title: '' }));
}
if (!jobs.length) {
  console.log('usage: mark-applied.js --file <json> | <jobId>...  [--dry-run]');
  process.exit(1);
}

(async () => {
  if (DRY) {
    console.log(`DRY RUN — would mark ${jobs.length}:`);
    jobs.forEach(j => console.log(`   ${j.jobId}  ${j.company} — ${j.title}`));
    return;
  }
  const pup = require(path.join(ROOT, 'node_modules', 'puppeteer'));
  const b = await pup.launch({ headless: true, userDataDir: path.join(os.homedir(), '.jobright-chrome') });
  const p = (await b.pages())[0] || await b.newPage();
  await p.goto('https://jobright.ai/jobs/recommend', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await new Promise(r => setTimeout(r, 3000));

  const count = () => p.evaluate(async () => {
    try { return (await (await fetch('https://jobright.ai/swan/job/apply/count', { credentials: 'include' })).json()).result; }
    catch { return null; }
  });

  const before = await count();
  console.log('applied BEFORE: ' + (before && before.applied));

  const results = await p.evaluate(async list => {
    const out = [];
    for (const j of list) {
      let ok = false, err = null;
      try {
        const r = await fetch('https://jobright.ai/swan/job/apply', {
          method: 'POST', credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jobId: j.jobId, source: 0 }),
        });
        const jr = await r.json();
        ok = !!jr.success; err = jr.errorMsg || null;
      } catch (e) { err = String(e); }
      out.push({ ...j, ok, err });
      await new Promise(r => setTimeout(r, 1000));   // under ~1s/req trips rate limiting
    }
    return out;
  }, jobs);

  results.forEach(r => console.log(`  ${r.ok ? 'OK  ' : 'FAIL'} ${r.company} — ${r.title}${r.err ? ' | ' + r.err : ''}`));
  await new Promise(r => setTimeout(r, 2000));
  const after = await count();
  const moved = (after && +after.applied) - (before && +before.applied);
  console.log(`\napplied AFTER:  ${after && after.applied}  (moved ${moved >= 0 ? '+' : ''}${moved}, expected +${results.filter(r => r.ok).length})`);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
