---
name: apply-jobright-jobs
description: End-to-end JobRight job-application pipeline. Capture the recommendation feed, filter by match score and estimated compensation, build tailored resumes, pre-fill ATS application forms up to the submit button, and mark jobs applied on JobRight. Use when the user asks to check JobRight, find new job matches, apply to jobs, fill in an application, or build a tailored resume for a posting.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch
---

# JobRight application pipeline

Runs the whole path from "check JobRight" to "forms filled and waiting for you".

**You prepare. The user submits.** Never click Submit, never solve a CAPTCHA, never tick an
attestation, never answer a demographic question, never create an account or handle a
password. `references/ats-playbook.md` explains why each of those is a hard stop, and how
to do everything up to it.

Ask which stages the user wants if it is ambiguous. A bare "check JobRight" usually means
stages 1–3.

---

## 1. Capture the feed

```bash
node .claude/skills/apply-jobright-jobs/scripts/fetch-matches.js --min 95 --headless --max 3000 --delay 1500
```

First run cannot be headless: it opens Chrome on a persistent profile
(`~/.jobright-chrome`) and waits for a manual login, polling `/swan/auth/newinfo`. Never
ask for the password. Exit `2` = headless with no session; exit `3` = login wait expired.
Neither is a bug — the user needs to be at the keyboard.

**Three things that silently corrupt this capture:**

- **`--delay` below ~1000ms trips rate limiting.** The feed returns
  `"Reached risk control limit"` and paging stops early. An earlier run capped at 380 of
  1001 jobs and looked like a complete result.
- **`refresh=true` returns an unranked batch** rendered at a flat `displayScore: 98`. It is
  not a ranking. The script uses `refresh=false`; do not change that.
- **The feed is NOT sorted by match score.** High matches are scattered evenly to the last
  page. There is no shortcut — page to the end. Stop when a page returns 0 rows.

`displayScore` is the match percentage; **98.0 is a display ceiling** shared by many jobs,
so within that band the score ranks nothing. `jobNotes.rankScore` and `retrieve_score` are
internal ranking numbers — not the match.

If every score is 0, the account has no resume uploaded. Say so rather than lowering `--min`.

## 2. Know what the score is measuring

Check `resumeName` in the `/swan/auth/newinfo` payload. **Every match score is computed
against whichever resume the user uploaded to JobRight** — not against the master and not
against the role they want. If the uploaded resume is `resume-ai-platform.pdf`, the feed
skews toward AI/DevOps roles and genuinely better Staff/Principal matches rank lower.

Surface this whenever the ranking looks off. Swapping the uploaded resume re-ranks
everything and is usually higher leverage than any filtering.

## 3. Filter

Dedupe is normally unnecessary — JobRight already excludes applied jobs from
recommendations (verified: zero overlap against 645 applied). To confirm or to build a
local record:

```bash
node .claude/skills/apply-jobright-jobs/scripts/fetch-applied.js
```

POSTs `/swan/job/applied/jobs-v3` with `{cursor, pageSize, applyStatus}`. Use
`pageSize: 20` — larger pages truncate at 200.

**There is no salary field in the payload.** If the user asks for a compensation floor,
say the estimates are yours, show the reasoning per role, and flag the borderline ones.
Level and company matter more than title: staffing firms, consultancies, government
contractors and nonprofits will not reach senior-IC market rates regardless of the title.

Filter on judgment, not just score — a 98% match at a body shop is still a body shop. Flag
non-US-language postings, level mismatches, and roles the user cannot take, then let them
decide.

## 4. Save the job description

Write to `companys/<Company>-<role-slug>.md`, the convention the repo already uses. Include
the apply URL, match score, capture date, and which resume profile applies.

## 5. Build the resume

```bash
node build-resume.js <role> --pdf
```

Never hand-write a resume, never edit a generated `resume-*.json`. See
`references/tailoring.md` for choosing between profiles and writing a new one. Reuse an
existing profile unless the target is a genuinely different job family.

**Do not write a cover letter.** No `-cover.md` file, no letter pasted into a form field,
not even when the posting asks for one — that one the user writes themselves.

**Record gaps plainly.** If the posting wants Go, C#, Pulumi or React and the user's depth
is elsewhere, note it on the queue entry so they can decide whether to apply and what to
say. It surfaces in a screen anyway, and costs less than being caught by it.

## 6. Open the applications

```bash
open "<applyLink>"     # one per job, ~1s apart
```

Use the user's default browser, not the puppeteer profile — the ATS needs *their* accounts
and autofill, not the JobRight session.

## 7. Pre-fill a form

Read `references/ats-playbook.md` first. Then, per job:

1. `describeForm()` — enumerate fields; detect login wall and CAPTCHA before doing anything.
2. `uploadThenSettle()` — resume first, wait for the parser. **This order is not optional.**
3. `setValue()` / `pickSelect()` / `pickTypeahead()` / `clickChoice()` — fill only facts
   derivable from `resume.json`.
4. `auditAttestations()` — **always**, after the upload.
5. `resetAttestations()` — untick anything the parser asserted on the user's behalf.
6. Read every value back. Screenshot. Leave the browser open. Report what remains for them.

Helpers live in `scripts/lib/formfill.js`. Each exists because a simpler approach failed;
the comments say how.

Work authorization is answerable from `resume.json` (`visa: "US Citizen"` → authorized yes,
sponsorship no). Salary expectations, demographics, personality questions and anything
"I have read and understood" are not.

## 8. Mark applied

```bash
node .claude/skills/apply-jobright-jobs/scripts/mark-applied.js --file applications/shortlist.json
node .claude/skills/apply-jobright-jobs/scripts/unapply.js --all-unsubmitted    # reverse
```

`POST /swan/job/apply {jobId, source:0}`; reversed by `/swan/job/unapply {jobId}`. The
script verifies via `/swan/job/apply/count` before and after — a 200 is not proof.

**Warn before marking jobs the user has not actually submitted.** Marking hides them from
recommendations, so an un-submitted job becomes invisible *and* un-applied. Record
`actuallySubmitted: null` in `applications/applied.json` until the user confirms, so the
local record stays honest even when JobRight's does not.

## Files

- `applications/raw/` — captured payloads, gitignored, large
- `applications/queue.md` — submit-ready checklist
- `applications/applied.json` — what this skill marked, and whether it was really submitted
- `companys/<slug>.md` — the job description per job
