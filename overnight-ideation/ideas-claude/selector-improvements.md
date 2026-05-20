# Selector / EIG / stop-rule ideas

**Scope:** The adaptive question selection logic in `src/engine/selectorEIG.ts` and `src/engine/stopRule.ts`. Ideas for what to ask next, when to stop, how to weight question value.

**Each entry must include:**
- The current behavior (quote `selectorEIG.ts` or `stopRule.ts` where applicable)
- The proposed change
- The expected effect (which personas / archetypes improve? which regress?)
- How to measure success (live vs eval split per CLAUDE.md)

**Specific levers to consider:**
- Salience floor (current value? should it raise/lower?)
- Cluster-coverage gating (does the selector spend too long in one cluster?)
- IDP-route triggers (when should the selector pivot to identity-primary calibration?)
- Moral-circle scope-probe gating (currently skips Q232–Q239 when universalAffinity is high — is the threshold right?)
- Stop-rule HARD_CAP (55 in eval path; live `shouldStopEIG` uses different criteria)
- Question-value weighting under wrong-direction posteriors (Sam's prior feedback: when a node is being pulled wrong, probe it more)

---

