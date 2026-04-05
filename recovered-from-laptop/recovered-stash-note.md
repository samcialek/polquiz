# Recovered stash note

Source: `git stash list`
Recovered: 2026-04-05
Confidence: High

## Stash present
- `stash@{0}: On master: pre-build-check-onts`

## Meaning
There is at least one local stash in the desktop repo, which means not all prior working changes were necessarily committed.

## Limitation
A direct `git stash show -p stash@{0}` invocation failed due to PowerShell/glob parsing in this run, so the stash contents themselves are **not yet recovered** in this package.

## Next strict step if needed
Run one of these directly in repo context:
- `git stash show -p "stash@{0}"`
- `git show "stash@{0}"`

That could reveal additional uncommitted work related to the ONT_S period.
