# Clarify Decisions — end-to-end shape

Load this example before the first card or close package when no parent supplies
a confirmed exemplar, or when the required output shape is uncertain. The rules
and slots in `SKILL.md` remain authoritative.

## Card

```text
**architecture** · export generation locus

Thread
- Locked so far: comment API stays stable; posture = Run Spike
- This card: where PDF generation runs
- Still open after: guest export auth · stroke storage · plan quota

Territory
- Export is `POST /api/reviews/:id/export`, session-auth only today.
- Gateway idle timeout is 30s; large reviews with drawings already time out
  similar heavy handlers on the request thread.
- Workers already exist for transcode (`jobs/transcode`); no export job yet.

Where should export generation run?

Why it matters
- Wrong pick rewrites API shape and operations mid-build: queue versus sync
  versus client-only, with a 30s gateway limit on the request thread.

Closes: known-unknown

Criteria (graders)
- A 400-comment export with drawings completes without the gateway 30s kill.
- Unpredictable size stays within an existing operations pattern.

- **Sync in the API request** — gains the smallest API change, but pays by
  holding the request open. It breaks on the known 30s gateway limit and is the
  better fit only if export size can be bounded below that limit.
  Shape
      POST /api/reviews/:id/export  ->  200 { url }   (caller holds the request)
- **Background job on the existing queue** (Recommended) — gains an existing
  long-running operations pattern and survives unpredictable size. It pays for
  job state plus a ready notification; it breaks if the queue cannot preserve
  export authorization context.
  Shape
      POST /api/reviews/:id/export  ->  202 { jobId }
      GET  /api/exports/:jobId      ->  { status, url? }
      jobs/export payload              { reviewId, requestedBy }
- **Client-side only** — gains zero backend work, but pays with restricted
  formats and browser resource use. It breaks supportability for large drawing
  exports and fits only if product scope accepts those limits.
  Shape
      no endpoint; in the browser
      exportReview(review: Review): Blob

Recommendation
- **Pick:** background job on the existing queue.
- **Decisive factors:** the gateway-limit grader rules out sync; the existing
  operations-pattern grader favors the transcode queue already in Territory.
- **Runner-up:** sync is simpler, but loses on the measured 30s boundary.
- **Accepted trade-off:** add job state and a ready notification.
- **Confidence / evidence gap:** high on execution locus; notification UX is
  still unproven.
- **Reopen trigger:** a measured upper bound keeps every supported export below
  30s, or the existing queue cannot carry the caller's authorization context.
```

## Shape on a `data` card — two artifacts, still within the cap

Write the lines that differ, never a whole definition. Measured, three shape
blocks ran eight to eleven lines because an option that altered one table and
added another pasted both in full.

```text
- **Coverage rows on the export record** — …
  Shape
      exports: comment_id drop not null, + range_start, range_end
      export_comments: (export_id, comment_id) pk, both fk
- **Watermark on the reviewer row** — …
  Shape
      reviewers: + exported_through timestamptz
      advanced only after the export completes
```

## Close excerpt when Coverage ON

(Only when `SKILL.md` Production coverage gate is ON and
`references/production-coverage.md` was loaded.)

```text
Success / done signal
- Creators open drafts from Finder without publishing.
- Entitled learners continue reading published courses unchanged.

Boundaries
- Off limits: widen the learner route; treat menu visibility as authz.
- Must keep working: ARCH-3 learner projection; server reauth on mutations.

Spine touch
- Respects: ARCH-3

Coverage final
- Frame Clear · Journey Clear · Contract Clear · Reliability Clear
- Failure Accepted-risk (IC) · Operate Clear · Freeze Clear

Owned unknowns
- none

Accepted risks
- Single-AZ cache miss may elevate latency within the SLO burn; signer: IC.

Operability touch
- Rollback: revert the catalog route feature flag.
- Page: on-call for catalog 5xx burn above the approved threshold.

Is this the shared picture?
```
