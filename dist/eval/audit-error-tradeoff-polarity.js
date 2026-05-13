/**
 * Polarity audit for error-tradeoff questions (Q25, Q27, Q30, Q33).
 *
 * Walks each option and computes implied E[pos] per touched node, then
 * compares to the human-readable semantic intent of that option. Flags
 * any case where the math direction contradicts the option's meaning —
 * the kind of bug the cross-LLM analysis worried about.
 *
 * For each option, we encode the EXPECTED direction (pos high vs pos low)
 * for every node it touches and check the actual likelihood matches.
 */
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
const EXPECTATIONS = [
    // Q25 criminal_trial_error_tradeoff
    {
        qid: 25, optionKey: "convict_innocent",
        semantic: "Convicting an innocent person is the worse error → values due process → PRO HIGH (rule of law)",
        expect: { PRO: "high", MOR: "neutral" },
    },
    {
        qid: 25, optionKey: "free_guilty",
        semantic: "Letting a guilty person go free is the worse error → values outcomes/punishment → PRO LOW",
        expect: { PRO: "low", MOR: "neutral" },
    },
    // Q27 welfare_error_tradeoff (fp = giving to ineligible, fn = denying eligible)
    {
        qid: 27, optionKey: "fp",
        semantic: "False positive (giving benefits to ineligible) is the worse error → strict eligibility → MAT HIGH (free-market) + PRO HIGH",
        expect: { MAT: "high", MOR: "low", PRO: "neutral" },
    },
    {
        qid: 27, optionKey: "fn",
        semantic: "False negative (denying benefits to eligible) is the worse error → generous eligibility → MAT LOW (redistributive) + MOR HIGH",
        expect: { MAT: "low", MOR: "high", PRO: "neutral" },
    },
    // Q30 information_control_error_tradeoff
    {
        qid: 30, optionKey: "allow_harmful",
        semantic: "Allowing harmful speech is the worse error → prefer some censorship → PRO HIGH (institutional restriction)",
        expect: { PRO: "high", COM: "neutral" },
    },
    {
        qid: 30, optionKey: "censor_legitimate",
        semantic: "Censoring legitimate speakers is the worse error → prefer free speech → PRO LOW",
        expect: { PRO: "low", COM: "neutral" },
    },
    // Q33 immigration_enforcement_error_tradeoff
    {
        qid: 33, optionKey: "deport_legal",
        semantic: "Wrongly deporting legal residents is the worse error → procedural restraint, pluralist protection → PRO HIGH + CU HIGH (pluralist)",
        expect: { PRO: "high", CU: "high", ONT_S: "neutral" },
    },
    {
        qid: 33, optionKey: "let_stay_illegal",
        semantic: "Letting undocumented stay is the worse error → strict enforcement, assimilationist → PRO LOW + CU LOW (assimilationist)",
        expect: { PRO: "low", CU: "low", ONT_S: "neutral" },
    },
];
function expectedPosFromLikelihood(lik) {
    if (!lik || lik.length !== 5)
        return null;
    const s = lik.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return null;
    let e = 0;
    for (let i = 0; i < 5; i++)
        e += (i + 1) * (lik[i] / s);
    return e;
}
function classifyDirection(ePos) {
    if (ePos === null)
        return "missing";
    if (ePos < 2.7)
        return "low";
    if (ePos > 3.3)
        return "high";
    return "neutral";
}
let pass = 0;
let fail = 0;
console.log("Error-tradeoff polarity audit\n" + "=".repeat(70));
for (const e of EXPECTATIONS) {
    const q = REPRESENTATIVE_QUESTIONS.find((x) => x.id === e.qid);
    if (!q) {
        console.log(`✗ Q${e.qid} not found in bank`);
        fail++;
        continue;
    }
    const qd = q;
    const oe = qd.optionEvidence;
    const opt = oe?.[e.optionKey];
    if (!opt) {
        console.log(`✗ Q${e.qid}.${e.optionKey} option not found`);
        fail++;
        continue;
    }
    let optPass = true;
    const issues = [];
    for (const [node, expectedDir] of Object.entries(e.expect)) {
        const lik = opt.continuous?.[node]?.pos;
        const ePos = expectedPosFromLikelihood(lik);
        const actualDir = classifyDirection(ePos);
        if (expectedDir === "neutral") {
            // Just don't fail — node may not be encoded
            continue;
        }
        if (actualDir === "missing") {
            issues.push(`${node}: missing (expected ${expectedDir})`);
            optPass = false;
        }
        else if (actualDir !== expectedDir) {
            issues.push(`${node}: actualDir=${actualDir} (E[pos]=${ePos.toFixed(2)}), expected=${expectedDir} — POLARITY MISMATCH`);
            optPass = false;
        }
    }
    if (optPass) {
        console.log(`✓ Q${e.qid}.${e.optionKey} (${e.semantic.split("→")[0].trim()}) — direction matches`);
        pass++;
    }
    else {
        console.log(`✗ Q${e.qid}.${e.optionKey} (${e.semantic})`);
        for (const i of issues)
            console.log(`    - ${i}`);
        fail++;
    }
}
console.log("=".repeat(70));
console.log(`${pass} pass, ${fail} fail`);
if (fail > 0)
    process.exit(1);
//# sourceMappingURL=audit-error-tradeoff-polarity.js.map