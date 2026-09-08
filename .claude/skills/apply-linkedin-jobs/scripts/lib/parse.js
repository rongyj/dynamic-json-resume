/**
 * Parsers for LinkedIn's logged-out ("guest") job endpoints.
 *
 * Every selector below was confirmed against live responses on 2026-09-07. They are
 * server-rendered Tailwind-ish class names, which change less often than the authenticated
 * SPA's, but they DO change — if a field starts coming back null across every card, the
 * markup moved. Re-dump one response and re-read it rather than loosening the regex until
 * it matches something.
 *
 * Two endpoints, two shapes:
 *
 *   /jobs-guest/jobs/api/seeMoreJobPostings/search?...&start=N
 *       -> a bare <li> list, TEN cards per page (not 25). Carries jobId, title, company,
 *          location, posted date. No applicant count, no salary, no description.
 *
 *   /jobs-guest/jobs/api/jobPosting/<jobId>
 *       -> one job's detail fragment. Carries the description, the applicant caption and
 *          the four "job criteria" rows. This is the ONLY place applicant count lives, so
 *          any filter on "under N applicants" costs one request per job.
 */

const strip = s => s == null ? null
    : s.replace(/<[^>]+>/g, ' ')
       .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
       .replace(/\s+/g, ' ').trim() || null;

const one = (html, re) => { const m = html.match(re); return m ? strip(m[1]) : null; };

/** Search-results page -> one row per card. */
function parseCards(html) {
    const out = [];
    // Split on the card wrapper rather than <li>, so stray list markup cannot shift fields
    // from one card onto another.
    const chunks = html.split(/(?=<div class="base-card )/).slice(1);
    for (const c of chunks) {
        const jobId = (c.match(/data-entity-urn="urn:li:jobPosting:(\d+)"/) || [])[1];
        if (!jobId) continue;
        out.push({
            jobId,
            title: one(c, /base-search-card__title"[^>]*>([\s\S]*?)<\//),
            company: one(c, /hidden-nested-link"[^>]*>([\s\S]*?)<\/a>/),
            companyUrl: (c.match(/hidden-nested-link"[^>]*href="([^"?]+)/) || [])[1] || null,
            location: one(c, /job-search-card__location"[^>]*>([\s\S]*?)<\//),
            postedAt: (c.match(/datetime="([^"]+)"/) || [])[1] || null,
            url: `https://www.linkedin.com/jobs/view/${jobId}`,
        });
    }
    return out;
}

/** Detail fragment -> the fields the search card does not carry. */
function parseDetail(html, jobId) {
    const criteria = {};
    for (const m of html.matchAll(
        /description__job-criteria-subheader[^>]*>([\s\S]*?)<\/h3>[\s\S]*?description__job-criteria-text[^>]*>([\s\S]*?)<\/span>/g)) {
        criteria[strip(m[1])] = strip(m[2]);
    }
    const description =
        one(html, /show-more-less-html__markup[^>]*>([\s\S]*?)<\/div>/) ||
        one(html, /description__text[^>]*>([\s\S]*?)<\/section>/);

    // "Be among the first 25 applicants" / "Over 200 applicants" / "87 applicants".
    // LinkedIn buckets this, so treat it as a ceiling, never an exact number.
    const applicantsText = one(html, /num-applicants__caption[^>]*>([\s\S]*?)<\/(?:span|figcaption)>/);
    const applicantsNum = applicantsText ? Number((applicantsText.match(/(\d+)/) || [])[1]) || null : null;

    return {
        jobId,
        title: one(html, /topcard__title[^>]*>([\s\S]*?)<\/h[12]>/),
        company: one(html, /topcard__org-name-link[^>]*>([\s\S]*?)<\/a>/),
        location: one(html, /topcard__flavor topcard__flavor--bullet[^>]*>([\s\S]*?)<\/span>/),
        postedAgo: one(html, /posted-time-ago__text[^>]*>([\s\S]*?)<\/span>/),
        applicantsText,
        applicantsAtMost: /first (\d+)/i.test(applicantsText || '') ? applicantsNum : null,
        applicants: applicantsNum,
        seniority: criteria['Seniority level'] || null,
        employmentType: criteria['Employment type'] || null,
        jobFunction: criteria['Job function'] || null,
        industries: criteria['Industries'] || null,
        // "apply-link-offsite" in the tracking names means the employer's own ATS; its
        // absence means the posting is LinkedIn Easy Apply.
        offsiteApply: /apply-link-offsite/.test(html),
        description,
        salary: parseSalary(description),
    };
}

/**
 * Pulls a pay range out of the description prose.
 *
 * LinkedIn has NO structured salary field on these endpoints — verified 2026-09-07 against
 * a posting whose range ("$142,200.00 - $213,400.00") appeared only as free text mid
 * paragraph, with no ld+json on the public view page either. So this is a regex over prose
 * and it is wrong sometimes: it cannot tell a base range from an OTE, a US range from a
 * second geo's range, or a salary from an unrelated dollar figure. Report it as an
 * extraction, show the matched text, and let the user judge.
 */
function parseSalary(text) {
    if (!text) return null;
    const num = s => {
        let n = parseFloat(s.replace(/[$,]/g, ''));
        // A "k" on a number that is already five figures is not a multiplier — see the
        // MONEY comment below. Guard the arithmetic as well as the match.
        if (/k$/i.test(s.trim()) && n < 10000) n *= 1000;
        return n;
    };
    // The k suffix must not be the first letter of the next word. Without the lookahead,
    // "California Salary Range: $226000 - $414000 KPMG offers…" matched "$414000 K" and
    // reported a $414,000,000 ceiling.
    const MONEY = String.raw`\$\s?\d[\d,]*(?:\.\d+)?(?:\s?[kK](?![a-zA-Z0-9]))?`;
    const RANGE = sep => new RegExp(`(${sep})\\s*(?:-|–|—|to)\\s*(${sep})`);
    // Second chance for ranges written without a dollar sign ("Salary 230,000 - 280,000
    // USD"). Requiring a thousands comma in BOTH numbers is what keeps it from matching
    // prose like "a team of 50 - 100 engineers"; the $-less form is too loose otherwise.
    const BARE = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d+)?`;
    // Non-USD currency codes. A posting that lists several geographies often writes the
    // foreign range with a "$" and the US one without, so taking the first "$" match
    // reported NetApp's Vancouver CAD band as if it were the US salary.
    const FOREIGN = /^\s*(?:CAD|EUR|GBP|AUD|NZD|INR|SGD|CHF|JPY|CNY|MXN|BRL|PLN|SEK|NOK|DKK|ILS|ZAR|HKD)\b/i;
    let m = null;
    for (const cand of text.matchAll(new RegExp(RANGE(MONEY).source, 'g'))) {
        if (FOREIGN.test(text.slice(cand.index + cand[0].length, cand.index + cand[0].length + 8))) continue;
        m = cand; break;
    }
    if (!m) {
        // The $-less form must sit right next to a pay word, not merely somewhere in the
        // same posting. Document-wide co-occurrence read "we serve 10,000 - 20,000
        // customers" as a salary because the page also said "compensation" elsewhere.
        // A pay word must LEAD INTO the number ("Salary: 230,000 - 280,000") or a unit must
        // immediately follow it ("230,000 - 280,000 USD"). A loose window in both
        // directions read "We serve 10,000 - 20,000 customers" as pay whenever the word
        // "compensation" appeared anywhere nearby.
        const LEADIN = /\b(salary|compensation|base pay|pay range|pay band|pay rate|annual(?:ized)? (?:pay|salary)|range)\b[^.\n]{0,20}$/i;
        const UNIT = /^\s*(?:USD|per year|per annum|annually|\/\s?year|a year)\b/i;
        for (const cand of text.matchAll(new RegExp(RANGE(BARE).source, 'g'))) {
            const before = text.slice(Math.max(0, cand.index - 45), cand.index);
            const after = text.slice(cand.index + cand[0].length, cand.index + cand[0].length + 15);
            if (LEADIN.test(before) || UNIT.test(after)) { m = cand; break; }
        }
    }
    if (!m) return null;
    let [min, max] = [num(m[1]), num(m[2])];
    if (!(min > 0) || !(max >= min)) return null;
    // An hourly range read as annual would sail past any six-figure floor.
    const hourly = /\b(?:per hour|hourly|\/\s?hr|an hour)\b/i.test(
        text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60));
    if (hourly) return { min: min * 2080, max: max * 2080, basis: 'hourly', matched: m[0].trim() };
    // Plausibility band for an annual figure. Below $1k it is not a salary; above $10M it
    // is a parse accident, and letting one through would put it at the top of every
    // sorted shortlist.
    if (max < 1000 || max > 10000000) return null;
    return { min, max, basis: 'annual', matched: m[0].trim() };
}

/**
 * Reads filters out of a LinkedIn search URL the user pasted.
 *
 * Both /jobs/search/ and /jobs/search-results/ are accepted. The tracking junk
 * (eBP, refId, trackingId, currentJobId) is dropped — currentJobId is just whichever card
 * happened to be open in the right-hand pane, not part of the search.
 */
function parseSearchUrl(input) {
    const u = new URL(input);
    const q = u.searchParams;
    const filters = {};
    for (const [k, v] of q) if (/^f_/.test(k) || k === 'sortBy') filters[k] = v;
    return {
        keywords: q.get('keywords') || '',
        location: q.get('location') || '',
        geoId: q.get('geoId') || '',
        filters,
        currentJobId: q.get('currentJobId') || null,
        semantic: q.get('origin') === 'SEMANTIC_SEARCH_LANDING_PAGE',
    };
}

module.exports = { parseCards, parseDetail, parseSalary, parseSearchUrl, strip };
