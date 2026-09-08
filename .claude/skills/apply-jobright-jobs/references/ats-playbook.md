# ATS playbook

Findings from filling real applications on 2026-09-04. Everything here was learned by
failing first; treat the rules as load-bearing.

## The one rule that matters most

**Upload the resume, wait for the parser, then fill.** ATS resume parsers rewrite identity
fields several seconds after upload. Anything typed first gets clobbered or concatenated.
Filling before the parse produced `"Yongjun RongYongjun RongYongjun Rong"` and
`"rongyj@hotmail.comrongyj@hotrongyj@hotmail.comail.com"` across three separate attempts.

Use `lib/formfill.js` → `uploadThenSettle()`, then `setValue()`.

## Never do these

- **Never click Submit.** Prepare the packet; the person applying submits it.
- **Never solve a CAPTCHA.** Its purpose is to require a human. Defeating it turns
  automating tedium into circumventing access control. Lever, Ashby and JazzHR all gate
  submission this way.
- **Never tick an attestation.** Anything phrased "I have read and understood…" or
  "I accept the terms…" is a statement the applicant makes, not the assistant.
- **Never answer EEO / demographic questions.** Gender, race, veteran and disability
  self-identification are the applicant's alone, even when the form is happy to take a guess.
- **Never create an account or handle credentials.** Several ATSs wall the form behind a
  login; that is a stop, not an obstacle.

## Audit after every upload

RippleHire's parser silently ticked five attestation checkboxes — including "I have read
and accept the terms of use and privacy policy" — and set gender to "Male", with no
instruction from the script. That form had **no CAPTCHA**, so it was the one that could
have been auto-submitted carrying four false attestations.

Always run `auditAttestations()` after the upload and `resetAttestations()` on anything the
applicant did not personally assert. Report what the parser did.

## Widget traps

| Looks like | Often is | Fix |
|---|---|---|
| Text input | Places / typeahead combobox | `pickTypeahead()` — programmatic values silently do not stick |
| Checkbox | Yes/No button pair | `clickChoice()` — check `aria-pressed`, not `.checked` |
| Radio with a label | Unlabelled input; question is an ancestor's text | `clickChoice()` walks up to find it |

Typing does not replace field contents. Triple-click and Cmd+A both failed to clear.
Use the native value setter (`setValue()`), which also satisfies React-controlled forms.

Always verify by reading values back after writing. Do not assume a write landed.

## Per-platform notes

| ATS | Seen at | Form | Gate |
|---|---|---|---|
| **Lever** | Qvest | Clean, plain inputs, `cards[uuid][fieldN]` for custom questions | Image CAPTCHA on submit |
| **Ashby** | Skimmer | React; ids like `_systemfield_email`, custom questions keyed by uuid | reCAPTCHA; Skimmer also runs Tofu identity/fraud detection |
| **JazzHR** | Pointwest | `resumator-*-value` ids, very predictable | reCAPTCHA; dismiss the cookie banner first or it overlays the form |
| **RippleHire** | CyberProof/UST | Long form, `customN` fields; form behind an "Apply Now" click | No CAPTCHA — **but the parser forges attestations**, see above |
| **UltiPro / UKG** | Presidio | Never reached | Account wall at `signin-us.ultipro.com`; headless also gets an unsupported-browser fallback, so run visibly |
| **LinkedIn** | Damcosoft | Never reached | Login wall (`session_key` / `session_password`) |
| **ZipRecruiter / Workday** | several | Never reached | Account required |

Roughly six in ten postings gate the form behind a login the applicant holds. Of the rest,
most gate submission behind a human check. The realistic ceiling is: everything filled,
person does the verification and the submit.

## Keeping the browser alive

Puppeteer closes the browser when the node process exits, and `browser.disconnect()` alone
proved unreliable — tabs vanished between steps. Hold the process open with
`setInterval(() => {}, 1 << 30)` and write `browser.wsEndpoint()` to a file so a later step
can `puppeteer.connect()` to the same window.

Use a separate `userDataDir` per employer so sessions never cross.
