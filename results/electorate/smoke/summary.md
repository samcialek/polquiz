# Vote-Model Smoke Test — 121 Active Archetypes, Uniform Weighted

Each of 121 active archetypes is treated as one voter. No quiz simulation, no posterior sampling — pure centroid signatures fed to `respondentVoteChoice.predictVote`. Compares directional outcome and two-party share against actual results. **This is not a backtest** — uniform-weighted archetypes are not a representative US electorate. It's a sanity check that the voting formula is internally coherent before survey-mapping work begins.

## 2020

**Predicted nearest-candidate winner**: Democratic
**Actual winner**: Biden

| Bucket | Votes | Share of all 118 | Share of turnout | Actual share |
|---|---:|---:|---:|---:|
| Democratic | 63 | 52.1% | 62.4% | 51.3% |
| Republican | 38 | 31.4% | 37.6% | 46.8% |
| Third / Other | 0 | 0.0% | 0.0% | 1.9% |
| Abstain | 20 | 16.5% | — | — |

Turnout rate (archetypes voting / total): 83.5%

## 2024

**Predicted nearest-candidate winner**: Democratic
**Actual winner**: Trump

| Bucket | Votes | Share of all 118 | Share of turnout | Actual share |
|---|---:|---:|---:|---:|
| Democratic | 68 | 56.2% | 59.6% | 48.3% |
| Republican | 46 | 38.0% | 40.4% | 49.8% |
| Third / Other | 0 | 0.0% | 0.0% | 1.9% |
| Abstain | 7 | 5.8% | — | — |

Turnout rate (archetypes voting / total): 94.2%

## Diagnostic Read

**This is a vote-model smoke, not an electorate validation.** Uniform-archetype is not the US electorate; the only thing this artifact validates is that `respondentVoteChoice` runs end-to-end and produces internally coherent outcomes. Do NOT read precision into share numbers.

### Stable Dem-share bias of the strawman

Compare the D-share bias across years:

| Year | Predicted D | Actual D | Bias |
|---|---:|---:|---:|
| 2020 | 62.4% | 51.3% | +11.1pt |
| 2024 | 59.6% | 48.3% | +11.3pt |

If the bias is similar across years, the strawman has a **structural lean** (more left-of-center archetypes than right) — not a year-specific formula failure. A direction flip can happen in a year where the actual margin is smaller than the structural bias, even though the model is behaving the same way.

### What this DOES tell us
- Engine runs without errors / NaN.
- Turnout is plausible (engagement clearing-bar isn't broken).
- The internal consistency check passes — same model produces same-magnitude bias across years.

### What this does NOT tell us
- Whether candidate signatures are right (audit separately).
- Whether era activations are right (audit separately).
- Whether the formula is right at the population level — that requires CES-weighted backtest. If a weighted electorate still shows this size of skew, escalate to mapper / candidate / formula diagnosis.
