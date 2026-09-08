/**
 * Form-filling primitives for ATS application pages, proven against Lever, Ashby,
 * JazzHR, UltiPro and RippleHire on 2026-09-04.
 *
 * Each of these exists because the obvious approach failed in a specific way:
 *
 *   setValue()        - typing into a field does NOT replace its contents. Triple-click
 *                       and Cmd+A both failed to clear; every typed retry concatenated,
 *                       producing "Yongjun RongYongjun RongYongjun Rong". Writing through
 *                       the native value setter and dispatching input/change is the only
 *                       approach that worked, and it also satisfies React-controlled forms.
 *
 *   uploadThenSettle() - order matters more than anything else here. ATS resume parsers
 *                       rewrite identity fields several seconds AFTER upload, clobbering
 *                       anything typed first. Upload, wait for the parser, then fill.
 *
 *   pickTypeahead()   - fields that look like text inputs are often Places/combobox
 *                       widgets that ignore a programmatic value and only commit on a
 *                       real selection. Lever's "Current location" silently stayed empty.
 *
 *   clickChoice()     - "checkboxes" are frequently Yes/No button pairs (Ashby) and
 *                       radios are usually only identifiable by walking up to the
 *                       question text, since the inputs themselves carry no label.
 *
 *   auditAttestations()/resetAttestations()
 *                     - RippleHire's parser silently ticked five "I have read and
 *                       understood" boxes and set gender to "Male" with no instruction
 *                       from the caller. ALWAYS audit after upload, and reset anything
 *                       the applicant did not personally assert.
 */

/** Writes a value the way the page's own JS expects. Returns true if it stuck. */
async function setValue(page, selector, value) {
  return page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value').set;
    setter.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(el, val);
    ['input', 'change', 'blur'].forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));
    return el.value === val;
  }, selector, value);
}

/** Uploads a file, then waits for the ATS resume parser to finish rewriting fields. */
async function uploadThenSettle(page, fileSelector, filePath, { maxWaitMs = 30000 } = {}) {
  const el = await page.$(fileSelector);
  if (!el) throw new Error('file input not found: ' + fileSelector);
  await el.uploadFile(filePath);
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 1500));
    const busy = await page.evaluate(() => /pars|analyz|uploading/i.test(document.body.innerText));
    if (!busy) break;
  }
  await new Promise(r => setTimeout(r, 2500));   // parsers keep writing briefly after the spinner
}

/** Types into a combobox and commits a suggestion matching `wanted`. */
async function pickTypeahead(page, selector, text, wanted) {
  const el = await page.$(selector);
  if (!el) return { ok: false, reason: 'input not found' };
  await el.click();
  await el.type(text, { delay: 100 });
  await new Promise(r => setTimeout(r, 2500));
  const result = await page.evaluate(w => {
    const opts = [...document.querySelectorAll('[role=option], .pac-item, li, [class*=option]')]
      .filter(e => (e.innerText || '').trim());
    const hit = opts.find(e => new RegExp(w, 'i').test(e.innerText));
    if (hit) { hit.click(); return { ok: true, picked: hit.innerText.trim().slice(0, 80) }; }
    return { ok: false, offered: opts.map(e => e.innerText.trim().slice(0, 60)).slice(0, 8) };
  }, wanted);
  await new Promise(r => setTimeout(r, 1000));
  return result;
}

/** Selects an <option> whose text matches a regex. */
async function pickSelect(page, selector, textPattern) {
  const value = await page.evaluate((sel, pat) => {
    const s = document.querySelector(sel);
    if (!s) return null;
    const o = [...s.options].find(x => new RegExp(pat, 'i').test(x.text.trim()));
    return o ? o.value : null;
  }, selector, textPattern);
  if (value === null) return { ok: false };
  await page.select(selector, value);
  return { ok: true, value };
}

/**
 * Answers a radio/button group found by its question text rather than by name, since
 * the inputs are usually unlabelled. Handles both <input type=radio> and button pairs.
 */
async function clickChoice(page, questionPattern, answerPattern) {
  return page.evaluate((qp, ap) => {
    const qre = new RegExp(qp, 'i'), are = new RegExp(ap, 'i');
    // radios grouped by name
    const groups = {};
    document.querySelectorAll('input[type=radio]').forEach(r => (groups[r.name] = groups[r.name] || []).push(r));
    for (const radios of Object.values(groups)) {
      let el = radios[0], q = '';
      for (let i = 0; i < 8 && el; i++) {
        el = el.parentElement; if (!el) break;
        const t = (el.innerText || '').trim();
        if (t.length > 12) { q = t; break; }
      }
      if (qre.test(q)) {
        const hit = radios.find(r => are.test(r.value) || are.test((r.parentElement || {}).innerText || ''));
        if (hit) { hit.click(); hit.dispatchEvent(new Event('change', { bubbles: true })); return { ok: true, via: 'radio' }; }
      }
    }
    // Yes/No button pairs
    const label = [...document.querySelectorAll('label,div,p,legend')]
      .find(e => qre.test(e.innerText || '') && (e.innerText || '').length < 260);
    if (label) {
      let scope = label.parentElement;
      for (let i = 0; i < 4 && scope; i++) {
        const btn = [...scope.querySelectorAll('button,[role=button],label')]
          .find(b => are.test((b.innerText || '').trim()));
        if (btn) { btn.click(); return { ok: true, via: 'button' }; }
        scope = scope.parentElement;
      }
    }
    return { ok: false };
  }, questionPattern, answerPattern);
}

/**
 * Reports every checkbox and demographic select with its current state. Run this AFTER
 * the resume upload — parsers tick things on their own.
 */
async function auditAttestations(page) {
  return page.evaluate(() => {
    const labelOf = e => {
      if (e.id) { const l = document.querySelector(`label[for="${CSS.escape(e.id)}"]`); if (l) return l.innerText.trim(); }
      let n = e.closest('label') || e.parentElement;
      for (let i = 0; i < 3 && n; i++) { const t = (n.innerText || '').trim(); if (t) return t; n = n.parentElement; }
      return '(no label)';
    };
    const DEMOGRAPHIC = /gender|race|ethnic|veteran|disab|self-identif/i;
    return {
      checkboxes: [...document.querySelectorAll('input[type=checkbox]')].map(e => ({
        name: e.name, checked: e.checked, label: labelOf(e).replace(/\s+/g, ' ').slice(0, 110),
      })),
      demographicSelects: [...document.querySelectorAll('select')]
        .filter(s => DEMOGRAPHIC.test(s.name + ' ' + (labelOf(s) || '')))
        .map(s => ({ name: s.name, id: s.id, selectedIndex: s.selectedIndex, text: (s.options[s.selectedIndex] || {}).text })),
    };
  });
}

/**
 * Unticks every checked checkbox and returns demographic selects to their default.
 * Use when a parser has asserted things on the applicant's behalf; the applicant then
 * makes those choices themselves before submitting.
 */
async function resetAttestations(page) {
  return page.evaluate(() => {
    const out = { unticked: [], reset: [] };
    const DEMOGRAPHIC = /gender|race|ethnic|veteran|disab|self-identif/i;
    document.querySelectorAll('input[type=checkbox]').forEach(cb => {
      if (cb.checked) { cb.click(); cb.dispatchEvent(new Event('change', { bubbles: true })); out.unticked.push(cb.name || '(unnamed)'); }
    });
    [...document.querySelectorAll('select')].forEach(s => {
      const lab = s.id ? (document.querySelector(`label[for="${CSS.escape(s.id)}"]`) || {}).innerText || '' : '';
      if (DEMOGRAPHIC.test(s.name + ' ' + lab) && s.selectedIndex !== 0) {
        s.selectedIndex = 0; s.dispatchEvent(new Event('change', { bubbles: true })); out.reset.push(s.name || s.id);
      }
    });
    return out;
  });
}

/** Enumerates the form so the caller can map fields before writing anything. */
async function describeForm(page) {
  return page.evaluate(() => {
    const labelOf = e => {
      if (e.id) { const l = document.querySelector(`label[for="${CSS.escape(e.id)}"]`); if (l) return l.innerText.trim().slice(0, 100); }
      let n = e.closest('div,li,fieldset');
      for (let i = 0; i < 4 && n; i++) { const l = n.querySelector('label'); if (l) return l.innerText.trim().slice(0, 100); n = n.parentElement; }
      return (e.getAttribute('aria-label') || e.placeholder || '').slice(0, 100);
    };
    return {
      url: location.href,
      loginWall: /sign in|log in|password|create an account|register/i.test(document.body.innerText),
      captcha: /captcha|recaptcha|hcaptcha/i.test(document.body.innerHTML),
      fields: [...document.querySelectorAll('input:not([type=hidden]),textarea,select')].map(e => ({
        type: e.type || e.tagName, name: e.name || '', id: e.id || '',
        required: e.required || e.getAttribute('aria-required') === 'true',
        label: labelOf(e).replace(/\s+/g, ' '),
        options: e.tagName === 'SELECT' ? [...e.options].map(o => o.text) : undefined,
      })),
      buttons: [...document.querySelectorAll('button,input[type=submit]')]
        .map(b => (b.innerText || b.value || '').trim()).filter(Boolean).slice(0, 20),
    };
  });
}

module.exports = {
  setValue, uploadThenSettle, pickTypeahead, pickSelect, clickChoice,
  auditAttestations, resetAttestations, describeForm,
};
