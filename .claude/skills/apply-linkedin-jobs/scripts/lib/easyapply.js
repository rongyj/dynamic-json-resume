/**
 * LinkedIn Easy Apply helpers.
 *
 * READ THIS BEFORE USING ANY OF IT.
 *
 * Two things make Easy Apply different from an employer's ATS form, and both cut the same
 * way:
 *
 *  1. It runs on linkedin.com under the user's own account. LinkedIn's User Agreement
 *     forbids automated access, and enforcement is account restriction — losing the
 *     profile, the network and the job history, not just the application. An employer's
 *     Greenhouse form carries no such stake.
 *  2. It is three to five clicks. There is very little tedium to automate away.
 *
 * So the default is: DO NOT drive Easy Apply. Open the posting in the user's normal
 * browser and let them click through it. Spend the automation on offsite ATS forms
 * instead, where `apply-jobright-jobs/scripts/lib/formfill.js` already works and the
 * account at risk is a throwaway ATS login.
 *
 * What is here is for the case where the user has read the above and asked anyway. The
 * primitives below inspect and fill; `submit` is not implemented and will not be, and
 * `assertNotSubmitting()` exists so a caller cannot reach it by accident.
 *
 * SELECTOR STATUS: the offsite primitives re-exported from formfill.js were confirmed
 * against live ATS forms on 2026-09-04. The Easy Apply selectors below are NOT verified —
 * there was no logged-in LinkedIn session available when this was written. They are the
 * documented aria-labels and match on text as well, but treat the first run as a probe:
 * call describeEasyApply() and read what comes back before filling anything.
 */

const path = require('path');

// The ATS primitives are identical for LinkedIn's offsite postings — the form belongs to
// Greenhouse/Lever/Ashby either way — so share them instead of maintaining a second copy
// that drifts. Both skills live in the same .claude/skills tree.
const formfill = require(path.join(__dirname, '..', '..', '..',
    'apply-jobright-jobs', 'scripts', 'lib', 'formfill'));

const MODAL = '.jobs-easy-apply-modal, [data-test-modal][role=dialog], div[aria-labelledby*="easy-apply"]';

/** Hard stop. Every navigation helper calls this. */
function assertNotSubmitting(label) {
    if (/submit application|submit$/i.test(String(label).trim())) {
        throw new Error(
            'Refusing to click "' + label + '". Submitting is the applicant\'s action, not ' +
            'this script\'s. Leave the modal on the review step and hand it over.');
    }
}

/**
 * Reports the current Easy Apply step without touching it: which fields exist, which are
 * required and empty, and whether the next button is Continue/Review or Submit.
 */
async function describeEasyApply(page) {
    return page.evaluate(sel => {
        const modal = document.querySelector(sel);
        if (!modal) return { open: false };
        const labelOf = e => {
            if (e.id) { const l = document.querySelector(`label[for="${CSS.escape(e.id)}"]`); if (l) return l.innerText.trim().slice(0, 120); }
            let n = e.closest('div,fieldset,li');
            for (let i = 0; i < 4 && n; i++) { const l = n.querySelector('label'); if (l) return l.innerText.trim().slice(0, 120); n = n.parentElement; }
            return (e.getAttribute('aria-label') || e.placeholder || '').slice(0, 120);
        };
        const buttons = [...modal.querySelectorAll('button')]
            .map(b => ({ text: (b.innerText || '').replace(/\s+/g, ' ').trim(),
                         aria: b.getAttribute('aria-label') || '', disabled: b.disabled }))
            .filter(b => b.text || b.aria);
        return {
            open: true,
            // "Contact info", "Resume", "Additional Questions", "Review your application"
            step: (modal.querySelector('h2,h3') || {}).innerText || null,
            progress: (modal.querySelector('progress') || {}).value ?? null,
            atReview: /review your application/i.test(modal.innerText || ''),
            fields: [...modal.querySelectorAll('input:not([type=hidden]),textarea,select')].map(e => ({
                type: e.type || e.tagName, id: e.id || '', name: e.name || '',
                required: e.required || e.getAttribute('aria-required') === 'true',
                value: e.type === 'checkbox' || e.type === 'radio' ? e.checked : (e.value || ''),
                label: labelOf(e).replace(/\s+/g, ' '),
                options: e.tagName === 'SELECT' ? [...e.options].map(o => o.text) : undefined,
            })),
            // LinkedIn shows validation inline; an unanswered required question blocks
            // Continue with no other signal.
            errors: [...modal.querySelectorAll('[class*="error"],[role=alert]')]
                .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 10),
            buttons,
        };
    }, MODAL);
}

/**
 * Advances one step. Refuses to press Submit. Returns the step it landed on so the caller
 * can loop until `atReview` and then stop.
 */
async function advance(page) {
    const before = await describeEasyApply(page);
    if (!before.open) return { ok: false, reason: 'no Easy Apply modal open' };
    const next = before.buttons.find(b =>
        !b.disabled && /continue to next step|review your application|^next$|^review$|^continue$/i.test(b.aria || b.text));
    if (!next) {
        const submit = before.buttons.find(b => /submit application/i.test(b.aria || b.text));
        if (submit) return { ok: false, reason: 'at the submit step — stopping, this one is the user\'s', step: before.step };
        return { ok: false, reason: 'no continue button found', buttons: before.buttons };
    }
    assertNotSubmitting(next.aria || next.text);
    await page.evaluate((sel, want) => {
        const modal = document.querySelector(sel);
        const b = [...modal.querySelectorAll('button')]
            .find(x => ((x.getAttribute('aria-label') || '') + '|' + (x.innerText || '')).includes(want));
        if (b) b.click();
    }, MODAL, (next.aria || next.text).slice(0, 30));
    await new Promise(r => setTimeout(r, 1800));
    const after = await describeEasyApply(page);
    return { ok: true, from: before.step, to: after.step, atReview: after.atReview, errors: after.errors };
}

/**
 * Fills only what resume.json can answer, inside the modal. Anything it cannot derive is
 * returned in `unanswered` for the user — that includes every salary expectation, every
 * "how many years of X", every attestation and every EEO question.
 */
async function fillFromResume(page, resume) {
    const state = await describeEasyApply(page);
    if (!state.open) return { ok: false, reason: 'no Easy Apply modal open' };

    const basics = resume.basics || {};
    const known = [
        [/first name/i, (basics.name || '').split(' ')[0]],
        [/last name|surname/i, (basics.name || '').split(' ').slice(1).join(' ')],
        [/email/i, basics.email],
        [/mobile|phone/i, (basics.phone || '').replace(/[^\d+]/g, '')],
        [/city|location/i, [basics.location?.city, basics.location?.region].filter(Boolean).join(', ')],
    ];

    const filled = [], unanswered = [];
    for (const f of state.fields) {
        if (f.type === 'checkbox' || f.type === 'radio') { unanswered.push(f.label); continue; }
        const hit = known.find(([re, v]) => re.test(f.label) && v);
        if (!hit) { if (f.required && !f.value) unanswered.push(f.label); continue; }
        // Built in node, not the browser — there is no CSS.escape here, and LinkedIn's
        // field ids are full of characters a bare `#id` selector cannot carry.
        const sel = f.id ? `#${f.id.replace(/([^\w-])/g, '\\$1')}`
                  : f.name ? `[name="${f.name.replace(/"/g, '\\"')}"]`
                  : null;
        if (!sel) { unanswered.push(f.label); continue; }
        const ok = await formfill.setValue(page, sel, hit[1]).catch(() => false);
        (ok ? filled : unanswered).push(f.label);
    }
    // The parser and LinkedIn's own "remember my answers" both pre-tick things. Same rule
    // as any ATS: audit, and reset anything the applicant did not personally assert.
    const audit = await formfill.auditAttestations(page);
    return { ok: true, step: state.step, filled, unanswered, audit };
}

module.exports = { ...formfill, describeEasyApply, advance, fillFromResume, assertNotSubmitting, MODAL };
