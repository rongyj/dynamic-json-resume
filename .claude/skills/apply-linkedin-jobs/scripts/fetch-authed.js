#!/usr/bin/env node
/**
 * Captures a LinkedIn search that only exists when logged in — personalised ranking,
 * semantic search, "in your network", saved searches.
 *
 *   node .claude/skills/apply-linkedin-jobs/scripts/fetch-authed.js \
 *        --url "<the search URL from your browser>" [--max 250] [--headless]
 *
 * Opens a real Chrome on a persistent profile at ~/.linkedin-chrome and waits for a manual
 * login. This script never sees, asks for or stores a password.
 *
 * DESIGN NOTE — why this script does so little.
 *
 * It harvests ONLY job IDs. Everything else (description, pay, applicant count, seniority)
 * is then read from the logged-out endpoints via fetch-jobs.js, whose parsers are pinned to
 * server-rendered markup confirmed on 2026-09-07.
 *
 * That split is deliberate. The authenticated page is a React SPA fed by Voyager GraphQL
 * whose query ids and response shapes rotate without notice, so any parser written against
 * it is stale on a timetable. A job ID is the one thing in that payload that cannot change
 * shape. So: use the session for the thing only the session can do — the ranking — and
 * read the facts from the stable surface.
 *
 * It also means a LinkedIn markup change degrades to "found fewer ids", not to silently
 * wrong salaries.
 *
 * Exit codes: 2 headless with no session, 3 login wait expired, 5 no ids found.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const RAW = path.join(ROOT, 'applications', 'raw');
const PROFILE = path.join(os.homedir(), '.linkedin-chrome');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const HEADLESS = args.includes('--headless');
const MAX = Number(flag('max', 250));
const WAIT_MS = Number(flag('wait', 600)) * 1000;
const DELAY = Number(flag('delay', 4000));   // authed paging is watched much more closely
const URL_IN = flag('url', null);

if (!URL_IN) { console.error('usage: fetch-authed.js --url "<linkedin search url>"'); process.exit(1); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Every distinct jobPosting id anywhere in a blob of JSON or HTML. */
function harvestIds(text, into) {
    for (const m of String(text).matchAll(/urn:li:(?:fsd_)?jobPosting:(\d{6,})/g)) into.add(m[1]);
    for (const m of String(text).matchAll(/["']jobPostingId["']\s*:\s*["']?(\d{6,})/g)) into.add(m[1]);
    for (const m of String(text).matchAll(/data-job-id=["'](\d{6,})/g)) into.add(m[1]);
    for (const m of String(text).matchAll(/\/jobs\/view\/(?:[a-z0-9-]*-)?(\d{6,})/g)) into.add(m[1]);
    return into;
}

(async () => {
    const puppeteer = require(path.join(ROOT, 'node_modules', 'puppeteer'));
    fs.mkdirSync(RAW, { recursive: true });

    const browser = await puppeteer.launch({
        headless: HEADLESS, userDataDir: PROFILE,
        defaultViewport: null, args: ['--start-maximized'],
    });
    const page = (await browser.pages())[0] || await browser.newPage();

    const ids = new Set();
    const payloads = [];
    page.on('response', async res => {
        const u = res.url();
        if (!/linkedin\.com\/voyager|\/jobs-guest\//.test(u)) return;
        try {
            const body = await res.text();
            harvestIds(body, ids);
            if (/voyager/.test(u) && /job/i.test(u)) payloads.push({ url: u.slice(0, 300), bytes: body.length });
        } catch { /* stream already consumed */ }
    });

    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});

    // Ask the page itself, rather than guessing from the DOM: the feed only renders for a
    // signed-in member, and /login redirects away when a session exists.
    const loggedIn = async () => page.evaluate(() =>
        !/\/(login|checkpoint|authwall|uas)\b/.test(location.pathname) &&
        !document.querySelector('input[name="session_password"]')).catch(() => false);

    if (!await loggedIn()) {
        if (HEADLESS) {
            console.error('\nNot logged in, and --headless cannot show you a login screen.');
            console.error('Run once without --headless to establish the session.');
            await browser.close(); process.exit(2);
        }
        console.log('\n  Not logged in. Please log in in the Chrome window that just opened.');
        console.log('  No password is ever read by this script; the session is saved to');
        console.log('  ' + PROFILE + ' so this is a one-time step.');
        console.log('  Complete any 2FA / "is this you" checkpoint by hand.\n');
        const until = Date.now() + WAIT_MS;
        let ok = false;
        while (Date.now() < until) {
            await sleep(3000);
            if (await loggedIn()) { ok = true; break; }
            const left = Math.round((until - Date.now()) / 1000);
            if (left % 30 < 3) console.log(`  ...waiting for login (${left}s left)`);
        }
        if (!ok) { console.error('\nStill not logged in. Nothing captured.'); await browser.close(); process.exit(3); }
        console.log('\n  Login detected.\n');
    } else {
        console.log('Session already authenticated.\n');
    }

    // Page by rewriting &start=; the results list is virtualised, so scrolling alone leaves
    // most cards unrendered and un-harvested.
    const base = new URL(URL_IN);
    ['currentJobId', 'eBP', 'refId', 'trackingId'].forEach(k => base.searchParams.delete(k));
    for (let start = 0; start < MAX; start += 25) {
        base.searchParams.set('start', String(start));
        const before = ids.size;
        await page.goto(base.toString(), { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
        // Scroll the results pane so lazy cards render and their XHRs fire.
        for (let i = 0; i < 6; i++) {
            await page.evaluate(() => {
                const pane = document.querySelector('.jobs-search-results-list, [class*="scaffold-layout__list"]') || document.scrollingElement;
                pane.scrollBy(0, pane.clientHeight || 800);
            }).catch(() => {});
            await sleep(900);
        }
        harvestIds(await page.content(), ids);
        console.log(`  start=${start}: +${ids.size - before} (${ids.size} total)`);
        if (ids.size === before) break;          // page added nothing: end of results
        await sleep(DELAY);
    }

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const out = path.join(RAW, `linkedin-ids-${stamp}.json`);
    fs.writeFileSync(out, JSON.stringify({
        capturedAt: stamp, source: 'authenticated', searchUrl: URL_IN,
        count: ids.size, jobIds: [...ids], voyagerCalls: payloads.slice(0, 40),
    }, null, 1));

    console.log(`\n${ids.size} job ids -> ${path.relative(ROOT, out)}`);
    if (!ids.size) {
        console.log('\nNo ids found. Either the search returned nothing, or LinkedIn changed the');
        console.log('markup AND the urn format. Re-run without --headless and look at the page.');
        await browser.close(); process.exit(5);
    }
    console.log('\nNext: pull the facts for these ids from the stable public endpoints:');
    console.log(`  node .claude/skills/apply-linkedin-jobs/scripts/fetch-details.js --ids ${path.relative(ROOT, out)} \\`);
    console.log('       --min-salary 230000 --max-applicants 100');
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
