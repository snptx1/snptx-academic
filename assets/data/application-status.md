# Application status

`application-status.json` supplies shared application milestones and the Yu and Huang
referee pages. Referee-specific letter receipts are kept in
`application-status-djordjevic.json` and `application-status-elston.json`, selected
by each page's `data-source`. A receipt update for one referee must change only
that referee's file. When updating common application milestones, keep those
milestones synchronized across all three data files.

Each page checks its source on load, every 60 seconds while visible, and when the
tab becomes visible again. Publish data changes with the site to update the
corresponding pages. This does not connect to application portals or infer
completion from a local document or uploaded CV.

The applicant confirmed the current 66 milestone statuses on October 29, 2026.
These statuses are applicant-confirmed, rather than independently audited.
A page-level audit does not establish a whole-application milestone.

For an update, keep program IDs and the six milestone keys unchanged. Set:

- `status`: `complete`, `pending` (verified incomplete), `in_progress`, or `unknown`.
- `checked`: the verification date as `YYYY-MM-DD`. Required for any known status.
- `note`: an optional short public explanation. Do not include private portal links,
  access tokens, applicant identifiers or sensitive application details.
- Top-level `updated`: the date of the most recent status edit, `YYYY-MM-DD`.

Example milestone (illustrative only):

```json
"documents": {
  "status": "in_progress",
  "checked": "2026-10-29",
  "note": "CV uploaded; remaining required documents are being checked."
}
```

Milestone meanings, in display order:

1. `documents`: all required CV, transcript and other supporting uploads complete;
   excludes statements and recommendation letters.
2. `reference_requests`: all required recommender invitations actually sent by the portal;
   an email agreement to write a letter does not establish this milestone.
3. `statements`: every required SOP, personal statement and written response finalized
   and entered or uploaded.
4. `portal_ready`: all applicant inputs and required pre-submission checks complete.
   Do not infer this from completion of individual content pages.
5. `references_submitted`: this referee's letter confirmed received by the portal.
6. `submitted`: application submission confirmed.

These are independent checkpoints. Letters may arrive before application submission.
The static HTML keeps the full program list and milestone headings visible without
JavaScript. If a refresh fails, the page retains its last loaded data and reports
the failure. No browser-local status editing is provided: updates belong in this
shared source so all referees see the same information.
