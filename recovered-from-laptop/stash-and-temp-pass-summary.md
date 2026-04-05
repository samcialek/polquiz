# Stash and temp/backup forensic pass summary

Recovered: 2026-04-05

## Newly recovered
- `stash@{0}` is substantive and appears to be about **ONT_S / historical-election coding work**, not about missing archetype names.
- Raw preservation note written to:
  - `stash-0-raw.patch`
- Temp/backup/editor-style candidates were enumerated, including:
  - `quiz-v1-backup.html`
  - `quiz-v2-backup.html`
  - `quiz-v2-reverted.html`
  - `temp-quiz.html`
  - `temp-mockup.html`
  - `temp-mockup2.html`
  - `output\prism-quiz-v2-new.html`
  - `output\live-quiz-debug.html`
  - multiple `_debug_*.js` files
- Exact-string grep over these candidate backup/temp artifacts did **not** recover:
  - `Black Voter`
  - `White Grievance Voter`
  - `Grievance Voter`

## Still unverified
- Whether those exact remembered names ever existed in laptop-only scratch files or session transcripts outside the desktop repo.
- Exact stash contents in a clean standalone patch file large enough for full inspection; current preservation is a raw note/classification because tool output was too large to safely inline.

## Most likely explanation
- The stash confirms there was real uncommitted work, but it is aimed at ONT_S historical-election corrections rather than the missing archetype-name question.
- Backup/temp artifact search did not recover the exact remembered labels.
- Combined with previously recovered older artifact names and merge/rename evidence, the most likely explanation is:
  - the exact remembered labels were provisional / laptop-local / discussion-only,
  - or they were renamed before reaching current desktop HEAD,
  - but they are not presently recoverable as exact names from the desktop repo/temp artifacts searched here.

## Actionable conclusion for current PRISM naming
- Keep treating `src\config\archetypes.ts` in desktop `polmodel-clean` as the canonical naming source.
- Keep `recovered-from-laptop\` as the forensic record.
- Do **not** rename current archetypes to remembered labels based on memory alone.
- If stricter proof is ever needed, the next highest-value pass is on the actual laptop machine:
  - inspect `C:\Users\samci\.openclaw\...`
  - inspect editor temp files there
  - inspect laptop repo reflog/stashes directly
