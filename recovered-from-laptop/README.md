# Recovered From Laptop / Forensic Reconstruction

Created: 2026-04-05
Recovered by: desktop OpenClaw instance
Target repo: `C:\Users\Sam\Desktop\polmodel-clean`

## What this folder is
This is a forensic reconstruction of likely laptop-origin or yesterday-origin PRISM archetype work, assembled from:
- current desktop repo git history
- current `src/config/archetypes.ts`
- local audit/debug outputs left in the repo
- current OpenClaw session artifacts visible on desktop

## Important constraint
I could **not** directly read the laptop user directory (`C:\Users\samci\.openclaw\...`) from this desktop instance. So this is not a raw laptop disk extraction. It is a provenance-labeled reconstruction from the best available local evidence.

## Confidence model
- **High**: directly supported by git commit history and current checked-in files
- **Medium**: supported by local audit/output artifacts but not directly tied to a single commit
- **Low**: inferred from surrounding context or naming discussions

## Main conclusion
The missing exact names Sam remembered (for example things like `Black Voter` / `White Grievance Voter`) were **not recovered as exact current archetype names** from the desktop repo. What *was* recovered is:
- a strong identity-based archetype cluster already present in current `archetypes.ts`
- evidence of audit-day merges/renames on Apr 3
- local decision/audit artifacts explaining semantic review choices

See:
- `recovered-archetype-cluster-current.md`
- `recovered-commit-21a535b-archetype-diff.md`
- `recovered-audit-artifacts-summary.md`
- `gap-list.md`
