---
name: apply-linkedin-jobs
description: End-to-end LinkedIn job-application pipeline. Capture a LinkedIn job search (public or logged-in), filter by posting age, stated pay and applicant count, build tailored resumes, and pre-fill ATS application forms up to the submit button. Use when the user pastes a LinkedIn jobs URL, or asks to search LinkedIn, check LinkedIn job matches, apply to a LinkedIn posting, or build a tailored resume for one.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch
---

# LinkedIn application pipeline

The sibling of `apply-jobright-jobs`, for postings that come from LinkedIn instead. Stages
3–6 are the same work as that skill and reuse its references and its form primitives
directly. Stages 0–2 and 7 are where LinkedIn genuinely differs, and that is most of what
this file is about.

**You prepare. The user submits.** Never click Submit, never solve a CAPTCHA, never tick an
attestation, never answer a demographic question, never create an account or handle a
password. `../apply-jobright-jobs/references/ats-playbook.md` explains why each is a hard
stop and how to do everything up to it.

Ask which stages the user wants if it is ambiguous. A pasted LinkedIn URL usually means
stages 1–3.

Read `references/linkedin-notes.md` before trusting any capture. It separates what was
verified against live responses from what is still a guess.

---

## 0. What LinkedIn does not give you

Say this once, early, rather than letting the user infer it from thin results:

- **No match score.** Nothing ranks a posting against their resume. JobRight's
  `displayScore` has no equivalent, so filtering is on posting age, stated pay, applicant
  count and judgment.
- **No pay filter above $200k.** LinkedIn's top salary bucket is `$200k+`. A $230k floor
  cannot be expressed as a search filter and has to be extracted from the description text.
- **No "direct hiring employer" filter.** It is a name-shaped guess, flagged not enforced.
- **Prose in `keywords` filters nothing.** A semantic-search URL whose keywords say
  "under 100 applications … pay greater than $230k" applies none of it. Check a pasted URL
  for `f_*` params and tell the user which of their stated criteria are actually live.

## 1. Capture

**Public path — default. No login, no session, no risk to the account:**

```bash
node .claude/skills/apply-linkedin-jobs/scripts/fetch-jobs.js \
  --url "<the LinkedIn search URL the user pasted>" \
  --posted week --remote --remote-only --min-salary 230000 --max-applicants 100
```

**`--remote` alone does not give you remote jobs.** It sets `f_WT=2`, which LinkedIn accepts
and then largely ignores: an 85-job capture taken with it held 21 postings stating an office
cadence and 51 stating nothing. `--remote-only` enforces it from the description instead, the
same way `--min-salary` enforces pay. Add `--strict-remote` to also drop `conditional`
postings — remote-but-fenced, like Stripe's 35-miles-from-an-office rule.

Or without a URL: `--keywords "principal platform engineer" --location "United States"`.

`--url` reads `keywords`, `location`, `geoId` and any `f_*` filters out of the pasted link
and drops the tracking junk (`eBP`, `refId`, `trackingId`, `currentJobId` — that last one
is just whichever card was open in the right-hand pane, not part of the search).

**Authenticated path — only when the personalised or semantic ranking is the point:**

```bash
node .claude/skills/apply-linkedin-jobs/scripts/fetch-authed.js --url "<search url>"
node .claude/skills/apply-linkedin-jobs/scripts/fetch-details.js \
  --ids applications/raw/linkedin-ids-<stamp>.json --min-salary 230000 --max-applicants 100
```

First run cannot be headless: it opens Chrome on `~/.linkedin-chrome` and waits for a
manual login and any 2FA. Never ask for the password. Exit `2` = headless with no session;
exit `3` = login wait expired; exit `5` = no ids found. None are bugs — the user needs to
be at the keyboard.

`fetch-authed.js` deliberately harvests **only job ids**, then hands them to the public
parsers. The reasoning is in `references/linkedin-notes.md` and it is load-bearing: don't
"improve" it by parsing Voyager payloads.

**Three things that silently corrupt a capture:**

- **The endpoint rotates results.** Two identical requests returned zero overlapping ids.
  One pass is a sample, not an enumeration — hence `--rounds 2` (the union saturates there;
  a third round is wasted requests). Never A/B two ten-card responses to test a filter.
- **Page size is 10, not 25**, and the pool ends near 1000.
- **HTTP 999 is the bot check** and backing off does not clear it. The scripts exit `4`.
  Raise `--delay` and come back later; do not loop.

## 2. Read the filter report, not just the survivors

`--remote-only` and `--min-salary` both drop postings for *absence of evidence*, and each
reports that separately — `remote not stated in the posting` and `no pay range stated`. On the
2026-09-07 capture those were 51 and 47 of 85 respectively. **Relay both counts.** Silence is
not a no, and treating it as one throws away most of the pool.

Remote verdicts print on every row as `[remote]`, `[remote?]` (conditional), `[hybrid]` or
nothing (unstated), whether or not you filtered on them — because `f_WT=2` returns plenty of
on-site work and an unmarked row would read as remote by default.

`--min-salary` drops every posting that states no range, and **that is not the same as
paying under the floor** — most large employers omit pay outside the states that mandate
it. The scripts print a grouped `dropped:` summary for this reason. Always relay the
"no pay range stated" count; often the right move is a second run without the floor.

Extracted pay is a regex over prose and it is wrong sometimes — it cannot tell base from
OTE, or a US range from a second geography's. The matched substring is recorded; show it
when a number is doing real work in a decision.

Applicant counts are buckets ("Be among the first 25", "Over 200"). Treat them as ceilings.

In the printed table a `*` after a pay range means it was stated hourly and annualised at
2080 h — check it before quoting it as a salary.

## 2b. Duplicates

The scripts dedupe in two passes and report both. Exact company+title repeats are folded
before the detail fetch; after it, `dedupeJobs()` merges **aggregator reposts** (identical
pay band, one company is a job board — the direct employer wins) and **reworded reposts**
(same employer, titles reduce to the same core words, corroborated by band or location).
Survivors carry `mergedFrom`, so no jobId is lost. `--keep-duplicates` disables both.

What it will *not* merge is same-employer/same-band/same-city pairs whose titles differ —
Microsoft and Google publish one band per level, so that fires on genuinely different
teams. Those print as "look similar but were NOT merged" and carry `possibleDuplicateOf`.
**Relay that list**; it is the one place a human has to make the call.

Across captures, dedupe against the ledger — `record.js` matches on jobId *and* on
employer+title-core, so a repost under a new id is caught too:

```bash
node .claude/skills/apply-linkedin-jobs/scripts/record.js dedupe --file <capture>.json
```

Filter on judgment, not just numbers — flag agency reposters (`[agency?]`, and note that
Ladders/Dice/Jobot appear as the *company*, hiding the real employer), level mismatches,
and roles the user cannot take. Then let them decide.

## 3. Save the job description

Write to `companys/<Company>-<role-slug>.md`, the convention the repo already uses. Include
the apply URL, the LinkedIn jobId, stated pay, applicant count, capture date, and which
resume profile applies. The description is already in the capture JSON — don't re-fetch it.

## 4. Build the resume

```bash
node build-resume.js <role> --pdf
```

Never hand-write a resume, never edit a generated `resume-*.json`. See
`../apply-jobright-jobs/references/tailoring.md` for choosing between profiles and writing
a new one. Reuse an existing profile unless the target is a genuinely different job family.

**Do not write a cover letter.** No `-cover.md`, no letter pasted into a form field, not
even when the posting asks for one — that one the user writes themselves.

**Record gaps plainly.** If the posting wants Go, C#, Pulumi or React and the user's depth
is elsewhere, note it on the queue entry. It surfaces in a screen anyway.

## 5. Open the applications

```bash
open "https://www.linkedin.com/jobs/view/<jobId>"    # one per job, ~1s apart
```

Use the user's default browser, not the puppeteer profile — the ATS needs *their* accounts
and autofill.

## 6. Pre-fill a form

Check `offsiteApply` on the row first; it decides which of two paths applies.

**`offsiteApply: true` — the employer's own ATS.** Identical to the JobRight pipeline.
Read `../apply-jobright-jobs/references/ats-playbook.md`, then per job:

1. `describeForm()` — enumerate fields; detect login wall and CAPTCHA before anything else.
2. `uploadThenSettle()` — resume first, wait for the parser. **This order is not optional.**
3. `setValue()` / `pickSelect()` / `pickTypeahead()` / `clickChoice()` — fill only facts
   derivable from `resume.json`.
4. `auditAttestations()` — **always**, after the upload.
5. `resetAttestations()` — untick anything the parser asserted on the user's behalf.
6. Read every value back. Screenshot. Leave the browser open. Report what remains.

`scripts/lib/easyapply.js` re-exports all of these from the JobRight skill, so require that
one module and get both sets.

**`offsiteApply: false` — LinkedIn Easy Apply.** Default to **not automating it**. Open the
posting and let the user click through: it is three to five clicks, and driving it means
automating linkedin.com under their own account against the User Agreement, where the
penalty is the profile and the network rather than one application. That trade is bad.

If the user has heard that and still wants it, `describeEasyApply()`, `advance()` and
`fillFromResume()` are there. `advance()` throws rather than pressing Submit, and the Easy
Apply selectors are **unverified** — call `describeEasyApply()` and read the output before
filling anything.

Work authorization is answerable from `resume.json` (`visa: "US Citizen"` → authorized yes,
sponsorship no). Salary expectations, demographics, personality questions and anything
"I have read and understood" are not.

## 7. Record it

**LinkedIn has no mark-applied API to call**, and this is a real difference from JobRight,
not an omission. LinkedIn's Applied tab only records applications made *through* LinkedIn;
an offsite apply leaves no trace there, and there is no endpoint to tell it otherwise.

So the record is local, in `applications/applied-linkedin.json`:

```bash
node .claude/skills/apply-linkedin-jobs/scripts/record.js add \
     --file applications/raw/linkedin-<stamp>.json --resume principal-swe
node .claude/skills/apply-linkedin-jobs/scripts/record.js submitted 4460126625   # user confirmed
node .claude/skills/apply-linkedin-jobs/scripts/record.js list --pending
```

`add` is idempotent and always writes `actuallySubmitted: null`; only `submitted` sets it,
and only when the user says so — exactly as the JobRight skill does. A record claiming an
application was sent when it was merely prepared is worse than no record, because it hides
the job from every future capture.

Because LinkedIn keeps surfacing jobs it does not know were applied to, dedupe each new
capture against the ledger before shortlisting — nothing else will:

```bash
node .claude/skills/apply-linkedin-jobs/scripts/record.js dedupe \
     --file applications/raw/linkedin-<stamp>.json      # writes …-new.json
```

## Files

- `applications/raw/linkedin-<stamp>.json` — captured jobs, kept and dropped with reasons
- `applications/raw/linkedin-ids-<stamp>.json` — ids from an authenticated sweep
- `applications/applied-linkedin.json` — what this skill prepared, and whether it was sent
- `companys/<slug>.md` — the job description per job
