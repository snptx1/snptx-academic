# Application status

`application-status.json` is the single public data source for the Djordjevic,
Elston, Yu and Huang referee pages. Each page checks this file on load, every
60 seconds while visible, and when the tab becomes visible again. Publish data
changes with the site to update all four pages. This does not connect to the
application portals or infer completion from a local document or uploaded CV.

The initial 66 milestones are `unknown`, pending confirmation of their current
status. A page-level audit does not establish a whole-application milestone.

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
5. `submitted`: application submission confirmed.
6. `references_submitted`: all required letters confirmed received by the portal.

These are independent checkpoints. Letters may arrive before application submission.
The static HTML keeps the full program list and milestone headings visible without
JavaScript. If a refresh fails, the page retains its last loaded data and reports
the failure. No browser-local status editing is provided: updates belong in this
shared source so all referees see the same information.
