# LinkedIn capture notes

Everything marked **verified** was confirmed against live responses on 2026-09-07 and the
check is written down so it can be repeated. Everything marked **unverified** was not
reachable without a logged-in session; treat it as a starting guess, not a fact.

## The single most important difference from JobRight

**There is no match score.** JobRight's `displayScore` has no LinkedIn equivalent — nothing
in any payload ranks a posting against the user's resume. So the JobRight pipeline's whole
first filter is gone, and its replacement is the real fields: posting age, applicant count,
stated pay, seniority, and judgment about the employer.

This is a downgrade in convenience and an upgrade in honesty. A JobRight "98% match" was a
display ceiling shared by hundreds of jobs. "61 applicants, posted 2 days ago, $240–299k
stated" actually distinguishes.

## The keyword string is not a filter (verified)

The URL the user pasted was a `SEMANTIC_SEARCH_LANDING_PAGE` whose `keywords` read:

> remote principal or staff software or cloud platform engineer or architect **posted in
> the past week under 100 applications and direct hiring employer with pay rang greater
> than $230k** posted in the past week

None of the bolded text filters anything. It is prose handed to a semantic ranker, and it
carried no `f_*` parameters at all — so LinkedIn applied no date, pay, applicant or
employer-type constraint. Every one of those has to be enforced downstream, and three of
the four can only be enforced by this skill rather than by LinkedIn (see below).

Always check a pasted URL for `f_*` params before trusting that its stated criteria are live.

## Filter parameters

| Param | Meaning | Status |
|---|---|---|
| `f_TPR=r604800` | posted in the last N seconds (`r86400` day, `r259200` 3d, `r604800` week, `r2592000` month) | **verified** — every returned card was inside the window |
| `f_WT=1/2/3` | on-site / remote / hybrid | **verified, and verified NOT to work** — see below. Accepted by LinkedIn, but the results are mostly not remote. Use `--remote-only`. |
| `f_AL=true` | Easy Apply only | accepted; effect unverified |
| `f_E=1..6` | experience level (4 = mid-senior, 5 = director) | accepted; effect unverified |
| `f_JT=F/C/P` | full-time / contract / part-time | accepted; effect unverified |
| `f_SB2=1..9` | salary bucket, **tops out at $200k+** | **unverifiable and useless here** — results rotate (below), so A/B testing ten cards proves nothing, and the top bucket is below a $230k floor anyway |

**A $230k floor cannot be expressed as a LinkedIn filter.** The highest bucket is $200k+.
That is why pay is extracted from the description instead.

## `f_WT=2` does not give you remote jobs (verified)

This is the filter most worth distrusting, because it looks like it works.

The 2026-09-07 capture was taken with `f_WT=2` set. Classifying all 85 survivors by what the
description actually says:

| Verdict | Count |
|---|---|
| states remote | 8 |
| remote but fenced (`conditional`) | 5 |
| states an office cadence (`hybrid`) | 21 |
| never says (`unstated`) | 51 |

So the remote filter returned **21 postings that state an office cadence**, and 51 that say
nothing at all. Passing `--remote` alone is close to passing nothing.

`--remote-only` enforces it downstream from the description, the same way `--min-salary`
enforces pay. `--strict-remote` additionally drops `conditional`.

### Why the classifier is not a substring test

The first version was `/\bremote\b/.test(description + location)` and it was wrong in both
directions. Only 19 of the 85 contained the word at all, and these were among them:

| Posting | Matched text | Actually |
|---|---|---|
| Pinterest | "scheduling and **remote** shuffling" | a Spark term |
| CoreWeave | "test infrastructure, **remote** execution, caching" | a Bazel term |
| PitchBook | "travel may be required to **remote** offices" | the opposite of remote |
| DoorDash | "Jobs Located in NYC or **Remote** Jobs…" | legal boilerplate |
| Stripe (Storage) | "Experience leading partially **remote** teams" | a requirement, not an offer |
| Mastercard | "**Telecommuting** … may be permissible pursuant to company policies" | a hedge |

Every pattern in `REMOTE_YES` therefore anchors the token to the **role** or to **where the
worker sits**, never to a technical noun — the same lesson `parseSalary()` already learned
about bare `$`-less ranges. `REMOTE_HEDGE` demotes a granted-as-a-possibility claim to
`conditional` rather than accepting it.

**`unstated` is not `onsite`.** It is reported as its own bucket for exactly the reason "no
pay range stated" is: silence is not a no, and 51 of 85 postings are silent. Relay that
count every time, and offer a run without the flag.

### `conditional` exists because two employers made it necessary

- **Stripe** — "This role is available either in an office or a remote location (35+ miles
  from a Stripe office)", under a heading reading "Hybrid work at Stripe". Genuinely remote
  for someone who lives 35 miles out, genuinely not otherwise.
- **DriveWealth** — "If based in Austin, Dallas, Denver, Miami, San Francisco, or Seattle:
  this is a fully remote role… If you're not based in one of the locations listed above,
  this role is not a fit."

Calling either flatly remote or flatly hybrid would be false. The evidence string carries
both halves so the applicant can decide, since only they know where they live.

## Results rotate between identical requests (verified)

Two identical search requests, three seconds apart, returned **zero overlapping job ids**.
A union across repeated rounds saturates quickly: 10 → 18 → 18 → 18 unique over six rounds.

Consequences, all of which the scripts already handle:

- One pass over `start=0,10,20…` is a **sample, not an enumeration**. `--rounds 2` sweeps
  twice and unions; a third round is wasted requests.
- Never compare two ten-card responses to decide whether a filter works. That was how
  `f_SB2` first looked both "working" and "ignored" in the same session.
- Re-running tomorrow legitimately surfaces jobs today's run never saw. Dedupe by `jobId`
  against previous captures rather than assuming a clean sweep.

## Page size is 10, and the pool ends near 1000 (verified)

`start=900` and `start=1000` both returned zero cards; `start=400` still returned ten.

## Pay is free text, never a field (verified)

The public view page carries **no `ld+json`**, and neither endpoint has a compensation
field. On the posting checked, the range appeared only as prose mid-paragraph:

> Primary Level Salary Range: $142,200.00 - $213,400.00

So `parseSalary()` is a regex over the description, and it is wrong sometimes: it cannot
distinguish base from OTE, a US range from a second geography's, or a salary from an
unrelated dollar figure. It records the matched substring so the user can check it.

Two guards in there are not decoration, and removing either reintroduces a bug that was
observed while writing it:

- **A `$`-less range must have a pay word leading into it, or a unit right after it.**
  Accepting any comma'd range that merely shared a document with the word "compensation"
  read *"we serve 10,000 - 20,000 customers"* as a salary of $10k–20k. A window loose in
  both directions also let one sentence's numbers pair with the next sentence's keyword.
- **Hourly ranges are detected before the plausibility floor.** `$85 - $110 per hour` is a
  $177k–229k job; read as annual it is noise that any six-figure filter drops.

**A posting with no stated range is not a posting under the floor.** Most large employers
omit pay outside the states that mandate disclosure, so `--min-salary` silently discards a
lot of good jobs. `filterJobs()` reports those separately as "no pay range stated" for
exactly this reason — surface that number to the user every time.

## Applicant count is a bucket, and costs a request each (verified)

`num-applicants__caption` exists only on the detail fragment, so "under 100 applicants"
means one request per job. The text is bucketed — "Be among the first 25 applicants",
"Over 200 applicants", or a bare "172 applicants" — so `applicantsAtMost` is set only for
the "first N" phrasing. Treat all of it as a ceiling.

## "Direct hiring employer" is not a field

No filter, no flag, nothing in the payload. `STAFFING` in `lib/enrich.js` is a regex over
the company name and it is a **flag, never a drop** — it marks rows `[agency?]` and leaves
them in. It has false positives (any company with "Solutions" in its name) and false
negatives (agencies with invented brand names). The user overrules it.

Note that job-board reposters — "Ladders", "Dice", "Jobot" — show up as the *company* on
LinkedIn cards, hiding the real employer. Those are in the regex.

## Reposts (verified)

One sweep returned "Salesforce — Software Engineering PMTS" and "LinkedIn — Distinguished
Software Engineer, Systems Infrastructure" twice each, under distinct jobIds.
`collapseReposts()` keys on company+title, keeps the newest, and records the folded ids as
`alsoPostedAs` rather than discarding them — sometimes two ids really are two locations.

## Duplicates come in three shapes (verified)

`collapseReposts()` runs before the detail fetch and catches only exact company+title
repeats. `dedupeJobs()` runs after it, and needs the pay band, so it cannot run earlier.

| Shape | Example seen 2026-09-07 | Handling |
|---|---|---|
| Identical company + title, different ids | "Salesforce — Software Engineering PMTS" ×2 | merged by `collapseReposts()` |
| Aggregator repost | "Ladders — Principal Engineer, Platform Engineering" and "Cisco — Principal Software Engineer", both `$250,600–$362,600`; the Ladders copy says "a leader in the Telecommunications & Hardware space" and describes the same Splunk Kubernetes platform team | merged, **direct employer wins** |
| Reworded repost | Oracle Nashville posting both "Lead Principal Software Engineer, Core Infrastructure" and "Lead Principal Core Infrastructure Engineer" at the same band | merged, newest kept |

Merged rows are never lost: the survivor carries `mergedFrom` with the folded jobIds.

### What is deliberately NOT merged

**Same employer + same band + same city is not a duplicate signal.** Microsoft and Google
publish one band per level, so that rule fired on three genuinely different Microsoft
CoreAI roles and two different Google teams. Those get `possibleDuplicateOf` and a printed
warning; a human decides.

Three guards exist because each one caught a real mis-merge while this was being written:

- **Level words are not generic.** Folding `principal`/`staff`/`distinguished`/`lead` into
  the stopword list made "Walmart — (USA) Principal, Software Engineer" and "Walmart —
  (USA) Distinguished, Software Engineer" both reduce to the empty set and merge. Level is
  the most load-bearing word in an engineering title.
- **Two empty title cores are unknowable, not equal.** `jaccard()` returns 0, not 1, when
  either side reduces to nothing.
- **A reworded repost needs the band or the location to agree.** Title similarity alone
  merged Oracle's Austin `$114.6k–234.6k` req into its Nashville `$135.2k–306.4k` one.

### Employer names need prefix matching, not equality

LinkedIn carries "Cisco", "Cisco Systems, Inc." and "Walmart Global Tech" for what is one
employer. `sameEmployer()` compares normalised name **tokens as a prefix**: "cisco" ⊂
"cisco systems" matches, while "american express" and "american airlines" — which share a
first token — do not.

## Easy Apply vs offsite (verified)

`apply-link-offsite` in the detail fragment's tracking names means the employer's own ATS;
its absence means LinkedIn Easy Apply. Exposed as `offsiteApply`.

**Prefer the offsite ones for automation.** See the header of `lib/easyapply.js`: driving
Easy Apply means automating linkedin.com under the user's own account, against their User
Agreement, where the penalty is losing the profile and network — to save three clicks. An
employer's Greenhouse form has no such stake and far more tedium.

## Rate limiting

HTTP **999** is LinkedIn's bot check. Backing off does not clear it, so `get()` exits with
code 4 rather than retrying — raise `--delay` and come back later. **429** is an ordinary
throttle and is retried with backoff.

The default `--delay 2500` on the public endpoints held up across several hundred requests
in one session. The authenticated path defaults to 4000 because a logged-in session is
watched far more closely and the thing at risk is the user's account.

## Why the authenticated script harvests only ids

`fetch-authed.js` pulls job ids and nothing else; `fetch-details.js` then reads the facts
from the public endpoints. The authenticated page is a React SPA over Voyager GraphQL whose
query ids and response shapes rotate without notice, so any parser aimed at it goes stale
on a timetable. A job id is the one thing in that payload whose shape cannot change.

The session is used only for what the session uniquely provides — the personalised and
semantic ranking — and the facts come from the stable surface. A LinkedIn markup change
then degrades to "found fewer ids" instead of "silently wrong salaries".
