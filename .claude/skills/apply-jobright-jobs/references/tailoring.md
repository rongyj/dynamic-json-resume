# Choosing or writing a role profile

`resume.json` is the master and the only place facts and wording live. A profile in
`roles/*.js` says which employers, projects and bullets a role shows, plus the prose that
is genuinely role-specific: `summary`, `skills`, and any tightened `achievements`.

## Pick before you write

| Target posting | Use |
|---|---|
| AI/ML platform, GenAI, LLM infrastructure | `ai-platform` |
| Same, but the posting wants brevity or a recruiter screen | `ai-platform-short` |
| Principal/Staff/Lead backend, distributed systems, platform | `principal-swe` |
| Same, but short | `principal-swe-short` |

Default to the long form. Use a `-short` variant when the posting asks for 1-2 pages, when
it is a recruiter-first funnel, or when the user says so.

Reusing a profile is almost always right. The pitch changes by job *family*, not by
employer — a Staff Backend role at two different companies wants the same resume.

## When a new profile is warranted

Only when the target is a different job family than all four existing profiles — an
Engineering Manager, a Solutions Architect, a Developer Advocate. Confirm with the user
first, then copy the closest existing profile and edit.

Required keys: `name`, `output`, `html`, `pdf`, `summaryTags`, `summary`, `skills`,
`technologies`, `work`.

## How selection works

Projects and bullets are selected by **leading text**, never by index:

```js
{
    title: "On Demand Environment (ODE) backend (Jav",   // prefix of the master's title
    highlights: [
        "Architected the backend infrastructure w",       // prefix of the master's bullet
        "Built the Java Spring Boot backend that ",
    ],
}
```

A prefix must match exactly one entry. If it matches zero or two, the build fails loudly
naming the role, project and prefix — that is the design, not a bug. Lengthen an ambiguous
prefix; a prefix that stops matching means the master's wording changed, so re-read it and
update the profile rather than working around it.

`'all'` keeps every entry the master has. `[]` drops the list.

## Verify the build

```bash
node build-resume.js <role> --check    # would the output change? writes nothing
node build-resume.js <role> --pdf      # build json + html + pdf
node build-resume.js all --pdf         # rebuild everything
```

`--check` exits non-zero when a generated file is stale. Every build runs
`lib/verifier.js` against the schema and fails rather than emitting an invalid resume.

## The rule that matters

Tailoring means **selecting and re-framing** what the master already says. It never means
adding an achievement, a technology, or a number that is not in `resume.json`. If a
posting wants something genuinely absent from the master and the user has actually done
it, add it to the master first, then select it — that keeps every other resume honest too.
