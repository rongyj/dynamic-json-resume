#!/usr/bin/env node
/**
 * Captures your JobRight recommendation feed so the apply-jobs skill can read it.
 *
 *   node .claude/skills/apply-jobright-jobs/scripts/fetch-matches.js [--min 95] [--wait 600]
 *
 * Opens a real Chrome window against a persistent profile at ~/.jobright-chrome and waits
 * for you to log in by hand. This script never sees, asks for or stores a password; the
 * session cookie lives in the profile, so later runs go straight through and can be run
 * headless with --headless.
 *
 * It records the JSON the page's own XHRs return rather than scraping the DOM, because
 * JobRight is a React SPA whose class names change without notice but whose API payloads
 * carry the match score as a real field.
 *
 * Schema, confirmed against a live capture on 2026-09-04. The feed comes back from
 * jobright.ai/swan/recommend/... as result.jobList[], where each entry is:
 *
 *   { displayScore: 95,            <- the "95% match" badge; 0 until a resume is on file
 *     jobResult:     { jobId, jobTitle, jobLocation, applyLink, ... },
 *     companyResult: { companyName, companySize, ... },
 *     jobNotes:      { rankScore, ... } }   <- internal ranking, NOT the match score
 *
 * Note that displayScore sits on the parent while jobTitle sits on the child, and that
 * jobNotes carries several other score-like numbers. Anything that looks for a score and
 * a title on one object, or takes the first score-ish key it finds, gets this wrong.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const RAW = path.join(ROOT, 'applications', 'raw');
const PROFILE = path.join(os.homedir(), '.jobright-chrome');
const FEED = 'https://jobright.ai/jobs/recommend';
const AUTH = 'https://jobright.ai/swan/auth/newinfo';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const MIN = Number(flag('min', 95));
const WAIT_MS = Number(flag('wait', 600)) * 1000;
const HEADLESS = args.includes('--headless');
const PAGE = Number(flag('page-size', 20));   // the feed's own count= value
const MAX = Number(flag('max', 2000));        // hard stop on paging
const SORTS = [0];                             // sortCondition=0 is the full pool; 2 mirrors it
const DELAY = Number(flag('delay', 1500));     // ms between pages; <1s trips risk control

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Pulls jobList entries out of any payload shape that contains one. */
function extract(body, out) {
    if (!body || typeof body !== 'object') return out;
    if (Array.isArray(body)) { body.forEach(b => extract(b, out)); return out; }
    if (Array.isArray(body.jobList)) {
        for (const e of body.jobList) {
            const j = e.jobResult || {};
            const c = e.companyResult || {};
            if (!j.jobId) continue;
            out.push({
                score: typeof e.displayScore === 'number' ? e.displayScore : null,
                jobId: j.jobId,
                title: j.jobTitle,
                company: c.companyName,
                companySize: c.companySize,
                location: j.jobLocation,
                workModel: j.workModel,
                isRemote: j.isRemote,
                seniority: j.jobSeniority,
                minYears: j.minYearsOfExperience,
                employmentType: j.employmentType,
                applicants: j.applicantsCount,
                h1bStatus: j.h1BStatus,
                tags: [].concat(j.recommendationTags || [], j.jobTags || []),
                publishedAt: j.publishTime,
                summary: j.jobSummary,
                responsibilities: j.coreResponsibilities || [],
                applyLink: j.applyLink || j.url,
                url: j.url,
            });
        }
    }
    Object.values(body).forEach(v => extract(v, out));
    return out;
}

(async () => {
    const puppeteer = require(path.join(ROOT, 'node_modules', 'puppeteer'));
    fs.mkdirSync(RAW, { recursive: true });

    const browser = await puppeteer.launch({
        headless: HEADLESS, userDataDir: PROFILE,
        defaultViewport: null, args: ['--start-maximized'],
    });
    const page = (await browser.pages())[0] || await browser.newPage();

    const payloads = [];
    page.on('response', async res => {
        const url = res.url();
        if (!/jobright/i.test(url)) return;
        if (!/json/i.test(res.headers()['content-type'] || '')) return;
        try { payloads.push({ url, body: await res.json() }); } catch { /* not JSON after all */ }
    });

    console.log('Opening ' + FEED);
    await page.goto(FEED, { waitUntil: 'networkidle2', timeout: 120000 }).catch(() => {});

    // Ask the site itself whether the session is authenticated, rather than guessing from
    // the DOM. Polling means the wait ends the moment login lands, not on a fixed timer.
    const loggedIn = async () => page.evaluate(async u => {
        try { const r = await fetch(u, { credentials: 'include' }); return !!(await r.json())?.result?.logined; }
        catch { return false; }
    }, AUTH).catch(() => false);

    if (!await loggedIn()) {
        if (HEADLESS) {
            console.error('\nNot logged in, and --headless cannot show you a login screen.');
            console.error('Run once without --headless to establish the session.');
            await browser.close(); process.exit(2);
        }
        console.log('\n  Not logged in. Please log in in the Chrome window that just opened.');
        console.log('  No password is ever read by this script; the session is saved to');
        console.log('  ' + PROFILE + ' so this is a one-time step.\n');
        const until = Date.now() + WAIT_MS;
        let ok = false;
        while (Date.now() < until) {
            await sleep(3000);
            if (await loggedIn()) { ok = true; break; }
            const left = Math.round((until - Date.now()) / 1000);
            if (left % 30 < 3) console.log(`  ...waiting for login (${left}s left)`);
        }
        if (!ok) {
            console.error('\nStill not logged in after the wait. Nothing captured. Re-run when ready.');
            await browser.close(); process.exit(3);
        }
        console.log('\n  Login detected. Loading your recommendations...\n');
    } else {
        console.log('Session already authenticated.\n');
    }

    // Page the recommendation API directly instead of relying on scroll. The feed's own
    // lazy-loading only fired position=0, which silently capped every capture at the first
    // page. Running fetch() inside the page context reuses the authenticated cookie.
    payloads.length = 0;
    console.log('Paging the recommendation API...');
    for (const sort of SORTS) {
        const pages = await page.evaluate(async (sc, max, count, delay) => {
            const out = [];
            for (let pos = 0; pos < max; pos += count) {
                const u = `https://jobright.ai/swan/recommend/list/jobs?refresh=false` +
                          `&sortCondition=${sc}&position=${pos}&count=${count}&syncRerank=false`;
                // JobRight rate-limits deep paging with "reach job list limit". That is a
                // throttle, not the end of the data, so back off and retry rather than stop.
                let body = null;
                for (let attempt = 0; attempt < 3; attempt++) {
                    try { body = await (await fetch(u, { credentials: 'include' })).json(); }
                    catch (e) { body = null; }
                    if (body && body.result && typeof body.result !== 'string') break;
                    body = null;
                    await new Promise(r => setTimeout(r, 15000 * (attempt + 1)));
                }
                if (!body) break;
                out.push({ url: u, body });
                const n = (body && body.result && body.result.jobList || []).length;
                if (n < count) break;                       // last page
                await new Promise(r => setTimeout(r, delay));
            }
            return out;
        }, sort, MAX, PAGE, DELAY).catch(() => []);
        const got = pages.reduce((n, p) => n + ((p.body?.result?.jobList) || []).length, 0);
        console.log(`  sortCondition=${sort}: ${pages.length} pages, ${got} rows`);
        payloads.push(...pages);
    }

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    fs.writeFileSync(path.join(RAW, `payloads-${stamp}.json`), JSON.stringify(payloads, null, 2));

    const byId = new Map();
    for (const j of extract({ payloads }, [])) {
        const prev = byId.get(j.jobId);
        if (!prev || (j.score || 0) > (prev.score || 0)) byId.set(j.jobId, j);
    }
    const all = [...byId.values()].sort((a, b) => (b.score || 0) - (a.score || 0));
    const scored = all.filter(j => typeof j.score === 'number' && j.score > 0);
    const matches = scored.filter(j => j.score >= MIN);

    const outPath = path.join(RAW, `matches-${stamp}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ capturedAt: stamp, min: MIN, total: all.length, matches }, null, 2));

    console.log(`${payloads.length} payloads | ${all.length} jobs | ${scored.length} scored | ${matches.length} at >= ${MIN}%`);
    matches.slice(0, 40).forEach(m => console.log(`  ${String(m.score).padStart(3)}%  ${m.company} - ${m.title} (${m.location})`));
    console.log(`-> ${path.relative(ROOT, outPath)}`);
    if (scored.length && !matches.length) {
        console.log(`\nTop score was ${scored[0].score}%. Lower --min to see more.`);
    }
    if (all.length && !scored.length) {
        console.log('\nJobs came back but every displayScore was 0 - JobRight scores against');
        console.log('your uploaded resume, so check that your profile has one.');
    }
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
