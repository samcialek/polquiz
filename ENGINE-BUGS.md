# PRISM Engine Bugs — Diagnosed & Resolved 2026-03-30

## Bug #1: Q63 best_worst_battery Infinite Loop ✅ FIXED

### Severity: CRITICAL — broke live quiz for all users

### Symptoms
After the fixed-16 phase, `getNextQuestion()` returns Q63 indefinitely. Every user got stuck after question 15.

### Root Cause
**Stale bundle.** The compiled `dist/prism-engine-bundle.js` was missing the `rankingMap` fallback in two places:

**1. `toQuizQuestion()` — was line 6752 in old bundle**
Source (api.ts) has:
```ts
if (q.bestWorstMap) {
    out.bestWorstItems = Object.keys(q.bestWorstMap);
} else if (q.uiType === "best_worst" && q.rankingMap) {
    out.bestWorstItems = Object.keys(q.rankingMap);  // ← WAS MISSING
}
```

**2. `submitAnswer()` best_worst handler — was line 6803 in old bundle**
Source (api.ts) has:
```ts
const bwItems = q.bestWorstMap ? Object.keys(q.bestWorstMap)
              : q.rankingMap   ? Object.keys(q.rankingMap)  // ← WAS MISSING
              : [];
```

Since Q63 has `rankingMap` but no `bestWorstMap`, the answer was never recorded → `nAnswered` stayed at 15 → `FIXED_16[15]` = Q63 returned forever.

### Fix
- Rebuilt bundle: `npm run build:browser` (compiles TypeScript source which has the correct fallback)
- Bumped cache busters on V2 (`?v=20260330i`) and V3 (`?v=v3d`)
- Uploaded new bundle + HTML to matricesofconfusion.com via FTP
- **Verified:** Programmatic test shows Q63 answers correctly and engine proceeds to Q17+
- **Verified:** Full browser automation completed 55 questions and reached results page

---

## Bug #2: No Max Question Hard Cap ✅ FIXED

### Severity: Medium — quiz could theoretically never end

### Symptoms
If no archetype reached 15% posterior (the late-game stop threshold), the quiz would run through all 76 questions without stopping.

### Fix
Added hard cap at 55 questions in `src/engine/stopRule.ts`:
```ts
const hardCapStop = nAnswered >= 55;
return primaryStop || secondaryStop || ultraConfStop || lateGameStop || hardCapStop;
```
Rebuilt and deployed.

---

## Bug #3: `success_attribution` Rendered as single_choice Instead of Slider ⚠️ NOTED

### Severity: Low — quiz still works, just wrong UI type

### Observation
During browser automation, Q24 `success_attribution` was rendered as `single_choice` but conceptually should be a slider (effort vs. circumstances spectrum). The engine definition determines the UI type — may need to check if the question definition has the right `uiType`.

### Status: Not fixed yet — cosmetic issue, quiz functions correctly

---

## Bug #4: `decision_making_style` Rendered as single_choice Instead of Slider ⚠️ NOTED

### Severity: Low — same as above

### Observation
Q49 `decision_making_style` appeared as single_choice during browser test. Should conceptually be a slider (analysis vs. gut instinct).

### Status: Not fixed yet — cosmetic issue

---

## Bug #5: `ceo_worker_pay_ratio` Rendered as single_choice ⚠️ NOTED

### Severity: Low

### Observation
Q55 `ceo_worker_pay_ratio` appeared as single_choice. Should be a slider (ratio selection).

### Status: Not fixed yet — cosmetic issue

---

## Non-Bug: Q50 `integration_expectations_rewrite` Type Mismatch ✅ NOT A BUG

### What Happened
My test script passed a single string `'civic_participation'` but Q50 expects a ranking array. Engine correctly threw `ranking.forEach is not a function`.

### Resolution
Test script error, not engine bug. Q50 is `uiType: "ranking"` with 5 items.

---

## Deployment Log

| Time (EDT) | Action |
|---|---|
| ~20:45 | Diagnosed Q63 infinite loop via programmatic testing |
| ~20:55 | First bundle rebuild with Q63 fix, uploaded to MoC |
| ~21:00 | Added 55-question hard cap to stopRule.ts |
| ~21:02 | Second bundle rebuild with both fixes, uploaded to MoC |
| ~21:05 | Cache busters bumped: V3 `?v=v3d`, V2 `?v=20260330i` |
| ~21:15 | Full browser automation test: 55 questions → "Administrative Liberal" result ✅ |

## Files Modified

- `src/engine/stopRule.ts` — added `hardCapStop` at 55 questions
- `dist/prism-engine-bundle.js` — rebuilt from source (includes Q63 fix + hard cap)
- `dist/prism-engine-bundle.min.js` — rebuilt from source
- `prism-quiz-v3.html` — cache buster `v3b` → `v3d`
- `quiz-v2-live.html` — cache buster `20260330g` → `20260330i`

## Live URLs

- V3: https://matricesofconfusion.com/prism-quiz-v3.html
- V2: https://matricesofconfusion.com/prism-quiz-v2.html
- Results: https://matricesofconfusion.com/prism-results.html
