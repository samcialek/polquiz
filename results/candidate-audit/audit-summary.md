# Candidate Audit Summary (Phase 3)

**Date:** 2026-04-26
**Auditor pass:** Phase 3 of candidate-audit roadmap (rubric authored Phase 2)
**Output CSV:** `results/candidate-audit/audit.csv`

## Totals

- **Total rows audited:** 141 (35 + 21 + 21 + 12 + 52). Note: task brief said 142; the actual on-disk count is 141. No rows skipped.
- **HIGH:** 12 (8.5%)
- **MEDIUM:** 24 (17.0%)
- **LOW:** 82 (58.2%)
- **ALREADY-FIXED:** 23 (16.3%)

## Pattern Counts

- **Pattern A flags (anti-establishment ≠ anti-institutional):** 12 rows. Most are pre-flagged Pattern-B-aligned cases where coding correctly captures particularist platforms (Breckinridge, Seymour, Thurmond, Wallace 1968, Trump 2016/2020/2024, Fillmore). Three are genuine Pattern A miscodings still uncorrected: **Weaver 1892, Bryan 1896/1900/1908, H. Wallace 1948** (ONT_S only — PRO defensible as third-party crusader).
- **Pattern B flags (rhetorical universalism ≠ practiced moral scope):** 7 rows. All are slaveholder-era Virginia Dynasty candidates with rhetorical-universalism overread: **Washington 1789/1792, Madison 1808/1812, Monroe 1816/1820, Hancock 1880**.

## Top 10 HIGH-confidence rows by total node-deltas

Approximate delta counts from proposed columns:

1. **Cox 1920** — 9 nodes proposed (MAT 1→2, CD 1→3, CU 5→4, MOR 5→4, PRO 2→4, COM 1→3, ZS 1→2, ONT_S 1→4, plus side-flags). Forgotten Wilsonian-heir coded as if every position were maximal.
2. **Davis 1924** — 6+ nodes proposed (MAT 1→4, CD 1→3, CU 5→3, MOR 5→3, ONT_S 2→4 plus PF/COM tweaks). Conservative Wall Street Bourbon Democrat coded as max-progressive.
3. **Hancock 1880** — 4 nodes proposed (MAT 1→4, CD 1→3, CU 5→3, MOR 5→3). Apolitical Democratic war hero coded as max-progressive.
4. **Bryan 1908** — 4 nodes proposed (PRO 2→4, ONT_S 2→4, EPS 3→2 traditionalist, AES 5→2 pastoral). Year-specificity test failure on AES (rubric explicitly flagged).
5. **Bryan 1896** — 3 nodes proposed (PRO 2→4, ONT_S 1→4, EPS 3→2). Pattern A flagship case named in rubric.
6. **Bryan 1900** — 3 nodes proposed (PRO 2→4, ONT_S 1→4, EPS 3→2). Same as 1896.
7. **TR 1912** — 2 nodes proposed (PRO 2→3, ONT_S 2→5). Direct rubric special-case violation.
8. **Weaver 1892** — 2 nodes proposed (PRO 2→4, ONT_S 1→4). Populist-Party founder coded as anti-systemic.
9. **Madison 1808** — 3 nodes proposed (MAT 2→4, CU 4→2, MOR 4→2). Pattern B slaveholder + Jeffersonian-agrarian MAT.
10. **Monroe 1816** — 3 nodes proposed (MAT 2→4, CU 4→2, MOR 4→2). Same Pattern B as Madison.

(Madison 1812 and Monroe 1820 round out the top 12 with similar 3-node deltas.)

## Systematic patterns observed beyond Pattern A and B

1. **All-extremes coding for "the candidate who lost"** — A recurring artifact: Pinckney 1804/1808, King 1816, Scott 1852, McClellan 1864, Hancock 1880, Hughes 1916, Cox 1920, Davis 1924, Dewey 1944, Landon 1936 (already corrected). Multiple files contain explicit `// Push extreme` comments that suggest a *deliberate* but rubric-incompatible "make the loser maximally far from the winner on every axis" technique. This pattern operates orthogonally to Pattern A/B and accounts for ~10 of the 24 MEDIUM flags. **Recommend a Phase 4-or-5 follow-up auditing all candidates whose comments contain "Push extreme" or "Maximum X" phrases.**

2. **MOR-as-CD-content confusion (the McGovern 1972 inversion, recurring)** — Several modern-era Democrats are coded MOR low (1-2) where the underlying signal is *progressive cultural content* (CD axis), not *narrow moral scope* (MOR axis). Affected rows: Mondale 1984 MOR 2, Dukakis 1988 MOR 1, Obama 2012 MOR 2, H. Clinton 2016 MOR 2. Inverse: Wallace 1968 MOR 5 reads segregationist as *traditional moral content* (CD) rather than *narrow practiced scope* (MOR low). McGovern 1972 was already fixed for the same reason; the same bug persists in same-era candidates. Per rubric: "SPATIAL SCOPE ONLY. Progressive-vs-traditional moral content lives in CD."

3. **MOR 1 reserved for klan-tier, but used liberally for Federalists** — Adams 1800, Pinckney 1804, King 1816, Scott 1852, Dewey 1944 all carry MOR 1 ("maximum narrow moral circle — elite governance"). Per rubric, MOR 1 anchor examples are Klan candidates and ethnic-cleansing platforms. Federalist elite-favoring is MOR 2 territory. Each of these is a single-node MEDIUM flag.

4. **ENG used inconsistently for incumbents and reluctant candidates** — Generally well-handled (Taylor 1848 ENG 3 reluctant, Eisenhower 1952 ENG 5 since "running for president is maximum engagement"). One outlier: Parker 1904 ENG 1, justified as "one of the worst campaigns in history" — but the rubric says ENG should rarely fall below 4 for nominees. LOW flag, not raised in CSV.

5. **AES year-specificity tested only on Bryan** — The rubric explicitly calls out Bryan 1896/1900 visionary vs 1908 pastoral. The codebase mechanically applies AES 5 to all three Bryan rows. The same year-specificity test should apply to Trump (intuitionist 2016 vs nihilist 2020 per rubric EPS note), Reagan (visionary 1980 vs ?), FDR (statesman 1940 vs fighter 1936), but those are mostly handled correctly. Only Bryan 1908 AES is flagged HIGH.

6. **Madison/Monroe drift caveat partially observed** — The codebase already drifts ONT_S upward for Madison 1812 (3) and Monroe 1820 (5), consistent with "as they actually use federal institutions, ONT_S can drift up." But MAT/CU/MOR remain locked at the Jeffersonian-template values that the rubric corrects on Jefferson. The Pattern B fix on Jefferson 1796/1800/1804 was not propagated to his successors — this is the dominant HIGH-confidence cluster.

## Rows where I wanted to flag HIGH but evidence felt thin (second-pass candidates)

- **McClellan 1864** — coded all-extremes (MAT 5 / CD 5 / CU 1 / MOR 1) for a moderate Democratic general who *repudiated* his party's peace plank. The current coding is technically defensible if you're coding the *party platform he stood on* rather than the *signal he himself sent*. Rubric says signal = "platform, rhetoric, persona, and known actions in office." McClellan's actions were moderate; his platform was extreme. Flagged MEDIUM but a careful second pass might bump to HIGH.

- **Stevenson 1952 / 1956 MAT 1** — Stevenson was a New Deal liberal but the MAT 1 anchor in the rubric is reserved for Debs / Norman Thomas / Bernie / FDR 1936 / H. Wallace 1948. Stevenson is more comparable to Truman 1948 (MAT 2 anchor). Two rows of single-node off-by-one; flagged MEDIUM but consistently.

- **Wallace 1968 MOR 5** — Almost certainly an inversion bug (MOR low ↔ CD high mix-up), and HIGH evidence for the swap. But because it's a *single* node and the candidate is otherwise correctly Pattern-B-coded, I held to MEDIUM. If the user prefers single-node-with-strong-evidence as HIGH, this row should be promoted.

- **Lincoln 1864 ONT_S 2** — Wartime Lincoln was the paradigmatic institutional-savior; ONT_S 2 reads him as believing the system was broken when his entire war effort was institution-preserving. Rubric anchors place ONT_S 4 for "institutional reformers who use institutions hard." But there's a real argument that his 13th Amendment / habeas corpus suspension counted as "system needs reform" — held MEDIUM.

- **H. Wallace 1948 ONT_S 2** — Rubric explicitly anchors H. Wallace 1948 at ONT_S 4 ("institutional reformers who use institutions hard"). The current coding has him at 2, which would push him toward Debs-style anti-systemic socialism. He was a former VP and Commerce Secretary running on extending New Deal institutions. HIGH on this single point per rubric, but I held MEDIUM because the surrounding coding (PRO 2, third-party walkout) creates ambiguity about whether the encoder meant ONT_S 2 to capture "third-party-vehicle = anti-systemic vibes." A second pass to disambiguate is warranted.
