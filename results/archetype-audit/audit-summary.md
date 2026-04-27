# Archetype Audit Summary (Phase A — coding-rubric audit against archetypes.ts)

**Date:** 2026-04-26
**Auditor pass:** Phase A archetype-side audit, applying the candidate-coding rubric (`results/candidate-audit/rubric.md`) to per-archetype encodings in `src/config/archetypes.ts`. Priority on ONT_S, ONT_H, MOR, CU per user direction.
**Output CSV:** `results/archetype-audit/audit.csv`

---

## Totals

- **Total archetypes audited:** 124 entries (121 active + 3 deactivated 019 / 023 / 025).
- **HIGH:** 5 archetypes (4.1%).
- **MEDIUM:** 15 archetypes (12.1%).
- **LOW:** 104 archetypes (83.8%, including 6 identity-primary 141-146 and 3 deactivated rows).

The conservative-bias instruction was followed: many cases that read as plausible miscodings to vibes were held LOW because the archetype name *can* be construed as consistent with the coding under one reading (e.g., "Heritage Guardian" with MOR=2 is the right *spatial-scope* answer even if it feels too high vs. a klan-tier MOR=1).

---

## Top 5 HIGH-confidence archetypes (by total priority-node delta)

1. **032 Hamiltonian Technocrat** — ONT_S=3 → 5. Hamilton is *the* rubric anchor for ONT_S=5 ("Hamilton, FDR New Dealers, Progressive-era state-builders"). A literal Hamilton-named archetype mid-coded on the dimension Hamilton anchors is a direct rubric-cite miscoding. Single-priority-node by 2 points with strongest possible evidence.

2. **094 Hard-State Manager** — ONT_S=1 → 4. The name explicitly asserts state-institutional capacity ("Hard-State"); the encoding flips it to institutional nihilism. PRO=5 (rules-bound) is consistent with managerial authoritarianism but is incoherent with ONT_S=1. Pattern A archetype-side: name implies institutional belief but coding is institutional-nihilist.

3. **081 Heritage Guardian** — MOR=2 currently (under spatial-scope reading is plausible) but combination with TRB=5 anti:low + CU=1 anti:high signals a klan-tier entry where MOR=1 would fit better. Marked HIGH because the Pattern B *inverse* applies: the encoding may be reading "heritage" as wide-cultural-concern when the practiced scope is in-group only. Recommend MOR=1 if intended ethno-national, or move TRB / CU to less-extreme positions if intended cultural-only.

4. **014 Activist Progressive** — ONT_S=2 → 4. Pattern A archetype-side flagship: name explicitly says "Activist Progressive" but ONT_S=2 codes them as institutional nihilists. Progressives in the rubric tradition (Bryan, La Follette, FDR institutional-reformers) anchor ONT_S=4. PRO=2 (anti-procedural) is borderline-defensible — activists may bend procedure — but ONT_S must move.

5. **012 Class-War Leftist** — CU=2 → 4, MOR=3 → 4, ONT_H=1 → 4. Three-priority-node move. CU=2 (uniformity-leaning) inconsistent with class-war internationalism. MOR=3 (mid-narrow) inconsistent with the universalist-class concern central to the tradition. ONT_H=1 (humans fixed) wrong: class-war Marxists are *the* archetype of believing humans are reshaped by economic structure (high malleability). Old optimism-vs-pessimism reading, not the new malleability-via-cultivation reading.

---

## Pattern flag counts

- **Pattern A flags (archetype name implies institutional reform but encoded as institutional-nihilist):** 3 archetypes — 014 Activist Progressive, 031 Planetary Steward, 140 Market Green Modernist. Plus implicit Pattern A in 032 Hamiltonian Technocrat and 094 Hard-State Manager (flagged via ONT_S delta but not the formal Y flag).
- **Pattern B flags (rhetorical-universalism vs practiced-narrow-scope):** 0 archetypes formally. Several MEDIUM rows (050 Traditionalist Moralist, 072 Blackstone Conservative, 083 Closed Traditionalist) are *Pattern B inverse* — traditional moral content read as wide moral scope rather than moral content not affecting spatial scope — but they are not the classic Jefferson-style universalist-rhetoric-vs-slaveholding pattern.
- **MOR-as-CD content trap (Y flag):** 2 archetypes formally — 007 Solidarist Reformer (CD likely intended mid not 5), 012 Class-War Leftist (MOR likely intended wide not narrow). Several LOW rows additionally flagged in evidence_note.

---

## Direct answers to user-flagged gap questions

### Q1. Is there a "left-economic + right-cultural" gap in the archetype space?

**Yes, partially. The archetype that comes closest is 045 Rooted Social Reformer (MAT=1, CD=4, CU=3, MOR=3), but it does not exactly capture the Bryan/Weaver agrarian-populist coalition because:**

The agrarian-populist signature should be:
- **MAT=1** (left-economic redistributionist / silver / anti-Bank). ✓ matched by 045 Rooted Social Reformer, partially by 046 Pastoral Leftist (MAT=2), 049 Moral Egalitarian (MAT=1), 050 Traditionalist Moralist (MAT=2).
- **CD=4-5** (traditional/restorationist on social direction — biblical, gendered family, providential). 045 has CD=4 ✓; 046 also CD=4 ✓; 050 CD=5 ✓; 049 CD=4 ✓.
- **CU=2** (assimilationist, civic-religious shared-creed, "one America" agrarian Protestantism). All four candidates currently sit at CU=3 (mid) under the broadened-CU framing; **none** carry the CU=2 that genuine agrarian populism implied (a shared Protestant agrarian way-of-life).
- **MOR=2-3** (narrow practiced scope — concern for the agrarian common man, not for urban immigrants or non-whites). Bryan's record is mid-MOR; 045 has MOR=3 ✓; 050 MOR=5 *wrong* (Pattern B inverse — traditional moral *content* read as wide scope); 046 MOR=5 *wrong*.
- **ONT_S=4** (institutional reformer who uses institutions hard — Bryan's anchor in the rubric). 045 ONT_S=3 mid-low; 046 ONT_S=3; 049 ONT_S=2; 050 ONT_S=3. **None** carry ONT_S=4. This is the major gap.
- **EPS=traditionalist (idx 2)** (biblical authority, "providential democracy"). 045 EPS mixed [0.14, 0.33, 0.33, ...]; 046 EPS traditionalist-dominant (0.60); 049 traditionalist-dominant (0.60); 050 traditionalist-dominant (0.60). ✓ generally fine.
- **AES=pastoral (idx 2) / fighter (idx 4)** for the populist Bryan-1908 mode; visionary (idx 5) for Bryan-1896 mode. 045 AES pastoral 0.62; 046 pastoral 0.62; 049 pastoral 0.62; 050 pastoral 0.62. ✓ all heavily pastoral.

**The closest existing archetype is 045 Rooted Social Reformer**, but it has CU=3 rather than CU=2, ONT_S=3 rather than ONT_S=4, and CD=4 rather than CD=5 (full agrarian-restorationist). The combination of all five priority misses (CD-low, CU-mid, MOR-OK, ONT_S-low, EPS-mixed) means **no single archetype currently sits cleanly at the agrarian-populist coalition intersection**.

**Recommendation (not for application in this audit; user sign-off required):**
- *Option A — recoding existing.* Pull 045 Rooted Social Reformer to (CD=5, CU=2 sal=2, ONT_S=4 sal=2, EPS shifting to traditionalist-dominant). This sharpens 045 into the clean agrarian-populist fit. Cost: 045 stops covering generic "rooted progressive."
- *Option B — recoding 046.* 046 Pastoral Leftist currently has MOR=5 (almost certainly Pattern B inverse — pastoral leftists are not abolitionist-universalist). Drop MOR to 3, drop CU to 2, drop CD to 5, raise ONT_S to 4. Renames to "Agrarian Populist" or "Populist Traditionalist." This is the cleanest fix because 046 is already the archetype with the highest CD that pairs MAT-low.
- *Option C — add new.* Add a 6th archetype in the left-economic/cultural-traditional cluster (~ID 044, vacated). Cost: increases archetype count.

The **H. Wallace 1948** finding (separately) is unrelated to this gap because H. Wallace is left-economic + culturally *liberal* (CD=1, CU=5, MOR=5) — the opposite quadrant.

### Q2. Is the H. Wallace 1948 anchor-set noise from miscoded left-internationalists?

**Yes, partially. ONT_S undercoding across the cosmopolitan-left cluster is the dominant pattern.**

Comparing the post-correction H. Wallace 1948 signature (MAT=1, CU=5, MOR=5, ONT_S=4, AES=visionary) against each archetype:

| ID | Archetype | MAT | CD | CU | MOR | ONT_S | Issues |
|----|-----------|-----|----|-----|-----|-------|--------|
| 012 | Class-War Leftist | 1 | 1 | **2** | **3** | 2 | CU/MOR/ONT_H all flagged HIGH |
| 021 | Principled Cosmopolitan | 2 | 1 | 5 | 5 | **3** | ONT_S undercoded MEDIUM |
| 023 | Rights Cosmopolitan (DEACT) | 2 | 1 | 4 | 5 | 3 | ONT_S undercoded; deactivated |
| 024 | Ethical Internationalist | 1 | 1 | 5 | 5 | **3** | ONT_S undercoded LOW (sal also low) |
| 025 | World-Minded Reformer (DEACT) | 1 | 2 | 5 | 5 | 2 | ONT_S=2 (deactivated, not load-bearing) |
| 026 | Cosmopolitan Pragmatist | 2 | 1 | 5 | 3 | 3 | MOR=3 plausible (pragmatic) |
| 027 | Popperian Liberal | 2 | 2 | 3 | 2 | 3 | CU/MOR both flagged MEDIUM |
| 028 | Global Caretaker | 2 | 1 | 5 | 5 | 3 | ONT_S undercoded |
| 029 | Liberationist Progressive | 1 | 1 | 5 | 5 | 3 | ONT_S OK (PRO=1 + revolutionary mode) |
| 031 | Planetary Steward | 1 | 1 | 5 | 5 | **1** | Pattern A flagged MEDIUM — should be 3-4 |
| 033 | Systems Modernizer | 2 | 1 | 5 | 4 | 4 | ✓ correct |
| 037 | Fabian Modernizer | 1 | 3 | 4 | 4 | 4 | ✓ correct |
| 056 | Institutional Leftist | 2 | 4 | 4 | 4 | 4 | ✓ correct (CD=4 unusual) |
| 069 | Bleeding-Heart Libertarian | 4 | 2 | 4 | 5 | 4 | ✓ but MAT=4 makes anchor distance low |
| 140 | Market Green Modernist | 4 | 1 | 5 | 4 | **1** | Pattern A flagged MEDIUM |

**Pattern.** The H. Wallace anchor-set noise is real and is driven primarily by **ONT_S undercoding across the cosmopolitan-left cluster**. The institutional-builder cluster (033, 037, 056) is correctly coded ONT_S=4 and matches H. Wallace 1948's institutional-reformer signature; the *named* cosmopolitans (021, 024, 028) sit at ONT_S=3, which under-rewards H. Wallace's institutional commitment vs. (e.g.) a Bleeding-Heart Libertarian who happens to be coded ONT_S=4. The fact that **069 Bleeding-Heart Libertarian** wins H. Wallace's anchor competition is because ONT_S=4 is the dominant signal in H. Wallace's profile, and only one of the cosmopolitan-left archetypes (013 Radical Leveler aside) carries it correctly.

**Recommendation:**
- Move 021 Principled Cosmopolitan ONT_S from 3 → 4 (rubric-anchor consistent: principled cosmopolitans use international institutions hard).
- Move 024 Ethical Internationalist ONT_S from 3 → 4 (institutional internationalist = UN tradition).
- Move 028 Global Caretaker ONT_S from 3 → 4 (institutional global-care = WHO / Marshall Plan tradition).
- Move 031 Planetary Steward ONT_S from 1 → 3-4 (Pattern A — climate-action stewardship is institutional, not nihilist).
- Move 140 Market Green Modernist ONT_S from 1 → 4 (Pattern A — market-environmental = institutional-mechanism reform).
- Fix 012 Class-War Leftist CU/MOR/ONT_H per HIGH-flag.

After these fixes the cosmopolitan-left cluster will have 6+ archetypes correctly at the H. Wallace 1948 institutional-internationalist intersection, distributed across MAT/CD positions. The **Bleeding-Heart Libertarian** anchor win should resolve.

---

## Systematic patterns observed

1. **ONT_S undercoded across "principled" / "cosmopolitan" / "internationalist" archetypes.** Roughly 6-8 archetypes carry ONT_S=3 where the rubric anchor for institutional-reformer-internationalists (Hamilton/FDR/H. Wallace/post-war liberals) is 4-5. This is the dominant systematic miscoding and the source of the H. Wallace anchor noise. Likely an artifact of the older "system broken vs system working" framing — pre-ADR-010 reframe — that read principled critique as institutional skepticism.

2. **MOR-as-CD content trap (archetype-side, parallel to the McGovern 1972 inversion in the candidate audit).** Several traditional/conservative archetypes have MOR=4-5 (max wide) where the rubric-correct value is MOR=2-3 (narrow practiced scope): 050 Traditionalist Moralist, 072 Blackstone Conservative, 083 Closed Traditionalist, 046 Pastoral Leftist (mostly), 137 Moral Crusader. These read traditional moral *content* as wide moral *scope*. The reverse direction — progressive archetypes mis-coded MOR=1-2 — is rarer in archetype space than in candidate space, with 010 Bread-and-Butter Progressive (MOR=2) the main candidate. Total Pattern-MOR-as-CD: ~5 MEDIUM/LOW flags; 1 HIGH (012 Class-War Leftist).

3. **ONT_H reframe partially applied.** ADR-010 (2026-04-26) reframed ONT_H from optimism-vs-pessimism to malleability-via-cultivation. Inline comments confirm bulk corrections to traditional-religious archetypes (070, 071, 072, 073, 081, 082, 083, 086, 087, 088, 089) raising ONT_H to 4. But the reframe was *not* applied to leftist archetypes whose old ONT_H reading was "optimism": 010 BBP (still ONT_H=4 — happens to be correct under both framings), 012 Class-War Leftist (ONT_H=1 — was "pessimist about humans under capitalism", under malleability framing should be 4 since class-warriors believe humans transformable by economic structure).

4. **CU broadening reframe partially applied.** Inline comments confirm CU 2→3 bumps for 040, 042, 043, 045, 046, 048, 049, 060, 070, 086, 088, 089, 107, 113, 129, 134. But the cosmopolitan-cluster CU values were not re-examined for the reverse direction (whether some "CU=5 max-pluralist" archetypes should actually be CU=4 mid-pluralist when they're really civic-pluralist not radical-multicultural).

5. **Salience inflation in a few "anchor" archetypes.** 027 Popperian Liberal carries EPS sal=3 (max), 032 Hamiltonian sal=3 (max), 033 Systems Modernizer ONT_S sal=3, 089 Integral Traditionalist sal=3, 105 Combative Populist AES sal=3 — these are intentionally high salience for anchor archetypes. The pattern is consistent and not flagged.

6. **PRO=1 over-applied to "anti-establishment but reformist" archetypes.** Several archetypes have PRO=1 where PRO=2-3 would fit: 065 Opportunity Liberal (PRO=1 anti-procedural, MEDIUM flag), 067 Free-Exchange Modernist (PRO=1, MEDIUM flag), 135 Disruptive Cosmopolitan (PRO=1, MEDIUM flag). All three are coded as if "non-bureaucratic" means "anti-procedural" but the rubric distinguishes outcome-focused-bureaucracy-skeptical (PRO=3) from outright rule-breaking (PRO=1).

---

## Categorical (EPS / AES) observations

EPS / AES distributions broadly reflect archetype names, and only a handful of issues stand out:

- **046 Pastoral Leftist EPS traditionalist-dominant (0.60).** Consistent with name. AES pastoral 0.62 sal=3 (max-confidence). Consistent.
- **037 Fabian Modernizer EPS empiricist-leaning (0.25 emp, 0.58 inst, sal=2).** Should ideally be more institutionalist-dominant (Fabian = expert-administrative tradition), but the distribution is OK.
- **027 Popperian Liberal EPS empiricist 0.62 sal=3 (max-confidence).** Strong. Consistent with Popper / falsificationism.
- **090 Hobbesian Guardian AES probs [0.60, 0.10, 0.04, 0.06, 0.14, 0.06] sal=1.** Statesman-dominant. Plausible (Hobbesian = sovereign-as-Leviathan, formal). Possibly fighter-leaning (idx 4) given the dark-realism — but 0.60 statesman is defensible.
- **105 Combative Populist AES fighter 0.63 sal=3.** Strong fit.
- **108 Passive Cynic, 113 Disaffected Contrarian, 114 Political Nihilist** — all carry EPS nihilist-dominant (0.60 / 0.55 / 0.73). Consistent with the inline comment that 2026-04-23 reinstated these specifically as nihilist-EPS coverage.
- **No obviously-wrong "Traditionalist named with empiricist-dominant EPS" or "Visionary named with statesman-dominant AES" observed.** The categorical layer has been hand-tuned and is internally consistent.

One borderline case: **011 Jacobin Egalitarian EPS intuitionist 0.58 + autonomous 0.19** — Jacobin tradition is more autonomous-rationalist (Rousseau / general-will) than intuitionist; could swap to autonomous-dominant. LOW flag, not raised in CSV.

---

## "Wanted to flag HIGH but evidence felt thin" (second-pass review candidates)

- **031 Planetary Steward** — currently MEDIUM. ONT_S=1 anti-institutional with anti:high is hard to reconcile with the Marshall-Plan / IPCC institutional-builder model that "Planetary Steward" implies. Bumped to MEDIUM rather than HIGH because the archetype could be intended as deep-green / eco-anarchist (in which case ONT_S=1 is correct), but the name reads more like institutional-care.

- **140 Market Green Modernist** — currently MEDIUM. ONT_S=1 is contradictory to "Market" + "Modernist" (both imply institutional-mechanism faith). A second pass should bump to HIGH if the user's read is "no, this is an institutional-mechanism archetype, not an eco-anarchist."

- **079 National Developmentalist** — currently MEDIUM. ONT_S=1 + ONT_H=2 inconsistent with "developmentalist" (which historically anchors at ONT_S=5: Hamilton, Lee Kuan Yew, post-war Japan / South Korea). Bumped to MEDIUM rather than HIGH because the archetype could be intended as nativist-not-developmentalist (i.e., the "national" overrides the "developmentalist") — but the rubric's institutional-capacity reading would push HIGH.

- **027 Popperian Liberal MOR=2** — currently MEDIUM. Open-society liberalism is moral-universalist; MOR=2 (narrow) reads as wrong. Held MEDIUM because Popperian liberalism's *individual-rights-first* framing can be construed as "moral concern bounded by individual sphere" rather than a wide-out-group concern. The rubric calls for spatial scope, and Popper's spatial scope was wide.

- **072 Blackstone Conservative MOR=5** — currently LOW (MOR-as-CD-content note in evidence). Common-law conservatism is hierarchical/in-group oriented, and MOR=5 reads as wrong direction (should be MOR=3-4). Held LOW because Blackstone's natural-law universalism does support a wide moral scope on rhetoric grounds — but practiced scope was narrower (English-common-law-and-Christian-tradition). Possible Pattern B if "Blackstone" = English-tradition-only.

- **083 Closed Traditionalist MOR=4** — currently LOW. A "Closed Traditionalist" should logically be MOR=2-3 (narrow). Held LOW because the user explicitly noted MOR=4-5 may also be defensible if the archetype's traditionalism is theology-of-universal-love type. Worth a second look.

---

## Files

- CSV: `C:\Users\Sam\Desktop\polmodel-clean\results\archetype-audit\audit.csv`
- This summary: `C:\Users\Sam\Desktop\polmodel-clean\results\archetype-audit\audit-summary.md`
