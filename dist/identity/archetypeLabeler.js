/**
 * Continuous-node lexicon. Three bins per node:
 *   low  → position ≤ 2.5
 *   mid  → 2.5 < position < 3.5  (only contributes when top-1 salient)
 *   high → position ≥ 3.5
 */
export const POSITION_LEXICON = {
    MAT: { low: "Redistributionist", mid: "Mixed-Economy", high: "Free-Marketeer" },
    CD: { low: "Progressive", mid: "Hinge", high: "Traditionalist" },
    CU: { low: "Assimilationist", mid: "Civic-Pluralist", high: "Pluralist" },
    MOR: { low: "Particularist", mid: "Civic", high: "Universalist" },
    PRO: { low: "Consequentialist", mid: "Pragmatic", high: "Procedural" },
    COM: { low: "Principled", mid: "Practical", high: "Dealmaker" },
    ZS: { low: "Positive-Sum", mid: "Realist", high: "Combative" },
    ONT_H: { low: "Essentialist", mid: "Tempered", high: "Malleabilist" },
    ONT_S: { low: "Anti-Institutional", mid: "Reformist", high: "Institutional" },
    PF: { low: "Detached", mid: "Engaged-Civic", high: "Partisan" },
    TRB: { low: "Inclusivist", mid: "Civic", high: "Tribal" },
    ENG: { low: "Tuned-Out", mid: "Casual", high: "Mobilized" },
};
/** EPS categorical labels, indexed 0-5. */
export const EPS_LEXICON = [
    "Empiricist", "Institutionalist", "Traditionalist", "Intuitionist", "Autonomous", "Nihilist",
];
/** AES categorical labels, indexed 0-5. */
export const AES_LEXICON = [
    "Statesman", "Technocrat", "Pastoral", "Authentic", "Fighter", "Visionary",
];
/** Moral-circle scope adjectives — when a single scope has clear excess. */
export const MORAL_CIRCLE_SCOPE_LEXICON = {
    national: "Nationalist",
    religious: "Religious-Communitarian",
    ethnic_racial: "Ethnic-Communitarian",
    class: "Class-Conscious",
    gender: "Gender-Identitarian",
    ideological: "Partisan-Communitarian",
};
// ──────────────────────────────────────────────────────────────────────────────
// Threshold constants
// ──────────────────────────────────────────────────────────────────────────────
const SALIENCE_THRESHOLD = 2.5; // node enters label only if sal ≥ this
const POSITION_LOW_MAX = 2.5; // pos ≤ this → low bin
const POSITION_HIGH_MIN = 3.5; // pos ≥ this → high bin
const MAX_LABEL_TOKENS = 3;
const MORAL_CIRCLE_SCOPE_EXCESS_MIN = 20; // a scope needs this much excess to count
const MORAL_CIRCLE_UNIVERSAL_MIN = 70; // universal must be at least this for "Universalist"
// ──────────────────────────────────────────────────────────────────────────────
// Tokenize a respondent's live state
// ──────────────────────────────────────────────────────────────────────────────
function continuousBin(pos) {
    if (pos <= POSITION_LOW_MAX)
        return "low";
    if (pos >= POSITION_HIGH_MIN)
        return "high";
    return "mid";
}
export function tokenizeRespondent(state) {
    const entries = [];
    // Continuous nodes
    if (state.continuous) {
        for (const [node, n] of Object.entries(state.continuous)) {
            if (!n || typeof n.salience !== "number")
                continue;
            if (!(node in POSITION_LEXICON))
                continue;
            const bin = continuousBin(n.expectedPos ?? 3);
            const lex = POSITION_LEXICON[node];
            const token = bin === "low" ? lex.low : bin === "high" ? lex.high : lex.mid;
            entries.push({ node, bin, token, salience: n.salience, isCategorical: false });
        }
    }
    // Categorical EPS
    const eps = state.categorical?.EPS;
    if (eps && Array.isArray(eps.catDist)) {
        const topIdx = argmax(eps.catDist);
        if (topIdx >= 0 && topIdx < EPS_LEXICON.length) {
            entries.push({
                node: "EPS",
                bin: EPS_LEXICON[topIdx],
                token: EPS_LEXICON[topIdx],
                salience: eps.salience ?? 0,
                isCategorical: true,
            });
        }
    }
    // Categorical AES
    const aes = state.categorical?.AES;
    if (aes && Array.isArray(aes.catDist)) {
        const topIdx = argmax(aes.catDist);
        if (topIdx >= 0 && topIdx < AES_LEXICON.length) {
            entries.push({
                node: "AES",
                bin: AES_LEXICON[topIdx],
                token: AES_LEXICON[topIdx],
                salience: aes.salience ?? 0,
                isCategorical: true,
            });
        }
    }
    // Moral circle: emit a token when intensity is meaningful or universal is high.
    const mc = state.moralCircle;
    if (mc) {
        const universal = mc.universalAffinity ?? 50;
        const scopes = mc.scopedAffinities ? Object.entries(mc.scopedAffinities)
            .filter(([, v]) => typeof v === "number")
            .map(([scope, v]) => ({ scope, excess: Math.max(0, v - universal) })) : [];
        const maxScope = scopes.length ? scopes.reduce((a, b) => a.excess > b.excess ? a : b) : null;
        if (maxScope && maxScope.excess >= MORAL_CIRCLE_SCOPE_EXCESS_MIN) {
            const adj = MORAL_CIRCLE_SCOPE_LEXICON[maxScope.scope];
            if (adj) {
                entries.push({
                    node: "MORAL_CIRCLE",
                    bin: maxScope.scope,
                    token: adj,
                    salience: Math.min(3, mc.intensity03 ?? 0),
                    isCategorical: true,
                });
            }
        }
        else if (universal >= MORAL_CIRCLE_UNIVERSAL_MIN) {
            entries.push({
                node: "MORAL_CIRCLE",
                bin: "universal",
                token: "Universalist",
                salience: Math.min(3, (universal - 50) / 16.67), // 50→0, 100→3
                isCategorical: true,
            });
        }
    }
    return entries;
}
// ──────────────────────────────────────────────────────────────────────────────
// Tokenize an archetype centroid (used for merger-table generation)
// ──────────────────────────────────────────────────────────────────────────────
export function tokenizeArchetype(arch) {
    const entries = [];
    for (const [node, n] of Object.entries(arch.nodes)) {
        if (!n)
            continue;
        if (n.kind === "continuous") {
            if (!(node in POSITION_LEXICON))
                continue;
            const bin = continuousBin(n.pos);
            const lex = POSITION_LEXICON[node];
            const token = bin === "low" ? lex.low : bin === "high" ? lex.high : lex.mid;
            entries.push({ node, bin, token, salience: n.sal ?? 0, isCategorical: false });
        }
        else if (n.kind === "categorical" && node === "EPS") {
            const topIdx = argmax(n.probs);
            if (topIdx >= 0 && topIdx < EPS_LEXICON.length) {
                entries.push({
                    node: "EPS", bin: EPS_LEXICON[topIdx], token: EPS_LEXICON[topIdx],
                    salience: n.sal ?? 0, isCategorical: true,
                });
            }
        }
        else if (n.kind === "categorical" && node === "AES") {
            const topIdx = argmax(n.probs);
            if (topIdx >= 0 && topIdx < AES_LEXICON.length) {
                entries.push({
                    node: "AES", bin: AES_LEXICON[topIdx], token: AES_LEXICON[topIdx],
                    salience: n.sal ?? 0, isCategorical: true,
                });
            }
        }
    }
    // Archetype moral-circle: prefer the explicit moralCircle field if present.
    const mc = arch.moralCircle;
    if (mc) {
        const universal = mc.universalAffinity ?? 50;
        const scopes = Object.entries(mc.scopedAffinities ?? {})
            .filter(([, v]) => typeof v === "number")
            .map(([scope, v]) => ({ scope, excess: Math.max(0, v - universal) }));
        const maxScope = scopes.length ? scopes.reduce((a, b) => a.excess > b.excess ? a : b) : null;
        if (maxScope && maxScope.excess >= MORAL_CIRCLE_SCOPE_EXCESS_MIN) {
            const adj = MORAL_CIRCLE_SCOPE_LEXICON[maxScope.scope];
            if (adj) {
                entries.push({
                    node: "MORAL_CIRCLE", bin: maxScope.scope, token: adj,
                    salience: 3, // archetype-level: treat as fully salient
                    isCategorical: true,
                });
            }
        }
        else if (universal >= MORAL_CIRCLE_UNIVERSAL_MIN) {
            entries.push({
                node: "MORAL_CIRCLE", bin: "universal", token: "Universalist",
                salience: 3,
                isCategorical: true,
            });
        }
    }
    return entries;
}
// ──────────────────────────────────────────────────────────────────────────────
// Selection: top-N salient with the mid-drop rule for non-top-1 entries
// ──────────────────────────────────────────────────────────────────────────────
export function selectLabelTokens(entries) {
    // 2026-05-12 (revised v2 — bug fix): the label is built from the
    // respondent's TOP-3 MOST SALIENT nodes. If rank-2 or rank-3 landed in the
    // mid bin, drop that token but DO NOT backfill from rank-4+. Backfilling
    // pulls in nodes the respondent isn't actually salient on, which produces
    // misleading labels (e.g., a respondent whose top-3 are ONT_S/MAT/CU-mid
    // would get MOR from rank-4 inserted, mapping to "Liberal Internationalist"
    // even though MOR isn't in the top-3 salience set).
    //
    // Tie-break: continuous tokens by |position-3| (more-extreme first), then
    // categoricals after equal-salience continuous, then alphabetically.
    const sorted = [...entries].sort((a, b) => {
        if (b.salience !== a.salience)
            return b.salience - a.salience;
        const distA = a.isCategorical ? 0 : Math.abs(positionFromBin(a.bin) - 3);
        const distB = b.isCategorical ? 0 : Math.abs(positionFromBin(b.bin) - 3);
        if (distB !== distA)
            return distB - distA;
        return a.node.localeCompare(b.node);
    });
    // Only consider the top-3 candidates. Mid-drop at rank 2/3 reduces the
    // emitted token count rather than backfilling from further down.
    const candidates = sorted.slice(0, MAX_LABEL_TOKENS);
    const picked = [];
    for (let i = 0; i < candidates.length; i++) {
        const e = candidates[i];
        if (picked.length === 0) {
            picked.push(e); // top-1 always emits, even when mid
        }
        else if (!e.isCategorical && e.bin === "mid") {
            continue; // drop mid at rank 2/3 — do not backfill
        }
        else {
            picked.push(e);
        }
    }
    return picked;
}
function positionFromBin(bin) {
    if (bin === "low")
        return 1.5;
    if (bin === "high")
        return 4.5;
    if (bin === "mid")
        return 3;
    return 3;
}
// ──────────────────────────────────────────────────────────────────────────────
// Signature key for merger-table lookup
// ──────────────────────────────────────────────────────────────────────────────
export function signatureOf(tokens) {
    return tokens
        .map(t => `${t.node}:${t.bin}`)
        .sort()
        .join("|");
}
/**
 * Algorithm (revised 2026-05-12, per Sam):
 *   Lexicon composition is the DEFAULT. Merger lookup is a "save-a-word"
 *   overlay — it only fires when an exact 2-token or 3-token signature
 *   appears in the curated merger table. No partial / lossy / leftover-prefix
 *   matches; those produced output like "Dealmaker Tribal Insurgent" which
 *   sounded worse than the natural lexicon composition.
 *
 *   Flow:
 *     1. Compose lexicon directly from the tokens (top-N joined by space).
 *     2. If the full signature has a merger entry, swap to that.
 *     3. If a 2-subset (top-2) has a merger entry AND the 3rd token is
 *        meaningful, prepend the 3rd token to the merger name.
 *     4. Else use the lexicon composition.
 */
export function composeLabel(tokens, mergerTable) {
    if (tokens.length === 0) {
        return { label: "Civic Generalist", source: "lexicon", signature: "", tokensUsed: [] };
    }
    const fullSig = signatureOf(tokens);
    const lexicon = tokens.map(t => t.token).join(" ");
    // Try the full-signature merger first.
    if (fullSig in mergerTable) {
        return { label: mergerTable[fullSig], source: "merger-full", signature: fullSig, tokensUsed: tokens };
    }
    // If there are 3 tokens, try the top-2 subset (most-salient pair) only.
    // Skip other 2-subsets — they produced bad partial matches in v0.
    if (tokens.length === 3) {
        const top2 = [tokens[0], tokens[1]];
        const sig2 = signatureOf(top2);
        if (sig2 in mergerTable) {
            const merged = mergerTable[sig2];
            const leftover = tokens[2];
            return {
                label: `${leftover.token} ${merged}`,
                source: "merger-partial",
                signature: sig2,
                tokensUsed: tokens,
            };
        }
    }
    // Lexicon path with compression layer: if any pair of tokens has a
    // compression entry, substitute that pair with one word before joining.
    // POS reorder runs after compression so the final string reads
    // adjectives-first / noun-last. Source is tagged "compression" so the CSV
    // (and downstream tooling) can distinguish a curated single-word
    // substitution from pure lexicon-only composition.
    const compressed = applyCompression(tokens);
    if (compressed) {
        return {
            label: ensureNounAnchor(reorderByPOS(compressed)).map(t => t.token).join(" "),
            source: "compression",
            signature: fullSig,
            tokensUsed: tokens,
        };
    }
    // Pure lexicon default: 1-3 fragment composition with POS reorder + noun anchor.
    return {
        label: ensureNounAnchor(reorderByPOS(tokens)).map(t => t.token).join(" "),
        source: "lexicon",
        signature: fullSig,
        tokensUsed: tokens,
    };
}
// ──────────────────────────────────────────────────────────────────────────────
// Public top-level entry points
// ──────────────────────────────────────────────────────────────────────────────
export function labelForRespondent(state, mergerTable) {
    const entries = tokenizeRespondent(state);
    const tokens = selectLabelTokens(entries);
    return composeLabel(tokens, mergerTable);
}
export function labelForArchetype(arch, mergerTable) {
    const entries = tokenizeArchetype(arch);
    const tokens = selectLabelTokens(entries);
    return composeLabel(tokens, mergerTable);
}
// ──────────────────────────────────────────────────────────────────────────────
// Embedded merger table (used when no external table is passed)
// ──────────────────────────────────────────────────────────────────────────────
/**
 * Default merger table — embedded so the browser bundle works without a
 * separate fetch. Mirrors src/identity/mergerTable.json. When the JSON file
 * changes, re-paste here (or wire a build step).
 */
export const DEFAULT_MERGER_TABLE = {
    "MAT:low|ONT_S:high": "Institutional Leftist",
    "MAT:high|ONT_S:high": "Institutional Conservative",
    "MAT:low|MORAL_CIRCLE:universal": "Rawlsian Reformer",
    "MAT:low|MORAL_CIRCLE:class": "Class-War Leftist",
    "MAT:low|COM:low": "Jacobin Egalitarian",
    "MAT:low|CD:low|MORAL_CIRCLE:national": "Progressive Civic Nationalist",
    "MAT:low|CD:low": "Progressive Leftist",
    "MAT:high|CD:high": "Conservative",
    "CD:high|MORAL_CIRCLE:national": "Heritage Guardian",
    "CD:high|MORAL_CIRCLE:religious": "Religious Traditionalist",
    "MAT:high|CD:high|ZS:high": "Combative Conservative",
    "MAT:low|ZS:high": "Combative Leftist",
    "MAT:low|AES:Fighter": "Insurgent Equalizer",
    "MAT:high|AES:Fighter": "Combative Populist",
    "CD:high|AES:Fighter": "Heritage Firebrand",
    "AES:Statesman|ONT_S:high": "Statesman Institutionalist",
    "AES:Technocrat|ONT_S:high": "Technocratic Optimizer",
    "AES:Visionary|ONT_S:low": "Visionary Insurgent",
    "AES:Visionary|MAT:low": "Visionary Progressive",
    "EPS:Empiricist|ONT_S:high": "Evidence-Based Institutionalist",
    "EPS:Empiricist|MAT:low": "Evidence-Based Progressive",
    "EPS:Traditionalist|CD:high": "Civic Traditionalist",
    "EPS:Intuitionist|AES:Fighter": "Gut-Politics Fighter",
    "COM:high|ONT_S:high": "Burkean Steward",
    "COM:low|ONT_S:low": "Disaffected Contrarian",
    "MAT:low|ONT_H:high": "Constructivist Progressive",
    "CD:high|ONT_H:low": "Essentialist Traditionalist",
    "CU:high|MORAL_CIRCLE:universal": "World-Minded Reformer",
    "CU:high|MOR:high": "Principled Cosmopolitan",
    "CD:high|CU:low": "Communitarian Traditionalist",
    "MAT:low|PF:high": "Loyal Democrat",
    "MAT:high|PF:high": "Loyal Republican",
    "AES:Fighter|PF:high": "Militant Partisan",
    "CD:high|ENG:low": "Quiet Traditionalist",
    "ENG:low|MAT:low": "Comfortable Bystander",
    "MORAL_CIRCLE:gender": "Identity-Group Activist",
    "MORAL_CIRCLE:ethnic_racial": "Identity-Group Activist",
    "CU:high|MAT:low|ONT_S:high": "Institutional Leftist",
    "MAT:low|ONT_S:high|PRO:high": "Procedural Institutional Leftist",
    "COM:high|MAT:low|ONT_S:high": "Pragmatic Institutional Leftist",
    "CD:low|CU:high|MAT:low": "Cosmopolitan Progressive",
    "CD:low|MAT:low|MOR:high": "Rawlsian Reformer",
    "CD:high|MAT:high|ONT_S:high": "Institutional Conservative",
    "CD:high|MAT:high|MORAL_CIRCLE:religious": "Religious Right",
    "CD:high|CU:low|MORAL_CIRCLE:national": "Heritage Guardian",
    "MAT:low|ONT_S:high|ZS:low": "Pluralist Structuralist",
    "CU:high|MAT:low|MOR:high": "Cosmopolitan Reformer",
    "AES:Fighter|MAT:low|MORAL_CIRCLE:class": "Class-War Fighter",
    "AES:Statesman|MAT:low|ONT_S:high": "Statesman Institutional Leftist",
    "AES:Statesman|MAT:high|ONT_S:high": "Statesman Institutional Conservative",
    "EPS:Empiricist|MAT:low|ONT_S:high": "Evidence-Based Institutional Leftist",
    "EPS:Empiricist|MAT:high|ONT_S:high": "Evidence-Based Institutional Conservative",
    "CU:high|MAT:low|MORAL_CIRCLE:universal": "Cosmopolitan Reformer",
    // Expansion pass 2 — three-token iconic mergers
    "MAT:low|MOR:high|ONT_S:high": "Liberal Internationalist",
    "MAT:high|CD:high|COM:high": "Continuity Conservative",
    "COM:low|ONT_S:low|PF:low": "Anarchist",
    "MAT:low|MOR:high|MORAL_CIRCLE:religious": "Christian Socialist",
    "AES:Statesman|MAT:low|MOR:high": "FDR-Style Statesman",
    "MAT:high|EPS:Empiricist|AES:Technocrat": "Neoliberal Wonk",
    // ──────────────────────────────────────────────────────────────────────
    // Expansion pass 3 (2026-05-12) — second-opinion review pass.
    // 47 iconic 2-3 token merger names drawn from established political
    // vocabulary (classical liberal, neoliberal, anarcho-capitalist, etc.).
    // ──────────────────────────────────────────────────────────────────────
    "CD:low|MAT:high|PRO:high": "Classical Liberal",
    "CD:low|MAT:high|ONT_S:high": "Neoliberal",
    "CD:low|MAT:high|ONT_S:low": "Anarcho-Capitalist",
    "MAT:high|ONT_S:low|PRO:low": "Anarcho-Capitalist",
    "CD:high|MAT:low|MORAL_CIRCLE:national": "National Populist",
    "CD:high|MAT:low|MORAL_CIRCLE:religious": "Christian Democrat",
    "CD:high|MAT:low|ONT_S:high": "Paternalist Conservative",
    "CD:high|MAT:high|MORAL_CIRCLE:national": "National Conservative",
    "CD:high|CU:low|MORAL_CIRCLE:religious": "Integralist",
    "CD:low|MAT:low|ONT_S:high": "Bull Moose Progressive",
    "MAT:low|MORAL_CIRCLE:class|ONT_H:high": "Marxist",
    "MAT:low|MORAL_CIRCLE:class|ONT_S:low": "Syndicalist",
    "COM:low|MAT:low|MORAL_CIRCLE:class": "Vanguardist",
    "COM:low|ENG:high|MAT:low": "Vanguardist",
    "CD:low|MAT:low|MORAL_CIRCLE:gender": "Socialist Feminist",
    "CD:low|MORAL_CIRCLE:ethnic_racial|PRO:high": "Civil-Rights Liberal",
    "CD:low|MAT:high|MORAL_CIRCLE:universal": "Cosmopolitan Liberal",
    "CD:low|CU:high|MAT:high": "Cosmopolitan Capitalist",
    "CD:high|MAT:high|PRO:high": "Constitutional Conservative",
    "CD:high|PF:high|ZS:high": "Culture Warrior",
    "CD:low|PF:high|ZS:high": "Movement Progressive",
    "CD:high|MAT:low|PF:high": "Yellow Dog Democrat",
    "MAT:mid|ONT_S:high|PRO:high": "Good-Government Reformer",
    "EPS:Institutionalist|ONT_S:high|PRO:high": "Good-Government Reformer",
    "AES:Pastoral|MAT:low|MOR:high": "Eco-Socialist",
    "AES:Pastoral|CD:low|MAT:low": "Green Progressive",
    "AES:Visionary|CD:low|MAT:low": "Utopian Socialist",
    "AES:Visionary|MAT:high|ONT_S:low": "Techno-Libertarian",
    "MAT:high|ONT_S:high|PRO:high": "Hamiltonian",
    "CD:low|COM:high|MAT:high": "Rockefeller Republican",
    "AES:Visionary|CD:high|MAT:high": "Reaganite",
    "CD:high|MAT:high|ONT_S:low": "Goldwater Conservative",
    "CD:high|MORAL_CIRCLE:national|ONT_S:low": "Paleoconservative",
    "MAT:low|MORAL_CIRCLE:religious|ONT_S:low": "Distributist",
    "CD:high|COM:high|MAT:low": "One-Nation Conservative",
    "MAT:low|MORAL_CIRCLE:national|ONT_S:high": "New Dealer",
    "AES:Fighter|MORAL_CIRCLE:national|ZS:high": "Jacksonian",
    "EPS:Institutionalist|MAT:high|ONT_S:high": "Hamiltonian",
};
/**
 * Compression table — token PAIR → ONE word.
 *
 * Different from the merger table:
 *   merger:      signature → iconic multi-word name (preserves "Institutional Leftist")
 *   compression: signature → single-word semantic substitute (combines two ideas)
 *
 * Compression runs inside the lexicon path only. If the full signature has a
 * merger hit, the merger wins. Otherwise the composer scans the token list for
 * a compressible pair, substitutes with one word, and joins remaining tokens.
 *
 * Keep signatures sorted alphabetically (same format as merger table).
 */
export const COMPRESSION_TABLE = {
    // Ideology axes (economy × culture)
    "CD:low|MAT:low": "Leftist",
    "CD:high|MAT:high": "Conservative",
    "CD:low|MAT:high": "Libertarian",
    "CD:high|MAT:low": "Populist-Left",
    // Economy × moral circle width
    "MAT:low|MOR:high": "Internationalist",
    "MAT:low|MOR:low": "Class-Particularist",
    "MAT:high|MOR:low": "Tribal-Capitalist",
    // Economy × institutions
    "MAT:high|ONT_S:low": "Free-Market-Disruptor",
    "MAT:low|ONT_S:low": "Anti-Capitalist-Radical",
    // Cultural axes (continuity × pluralism)
    "CD:high|CU:high": "Conservative-Pluralist",
    "CD:low|CU:high": "Cosmopolitan",
    "CD:high|CU:low": "Communitarian",
    "CD:low|CU:low": "Progressive-Unifier",
    // Cultural × moral circle
    "CU:high|MOR:low": "Provincial-Pluralist",
    "CU:low|MOR:high": "Civic-Universalist",
    // Process axes (procedure × compromise)
    "COM:high|PRO:high": "Establishment",
    "COM:low|PRO:low": "Insurgent",
    "COM:high|PRO:low": "Negotiator",
    "COM:low|PRO:high": "Hard-Liner",
    // Process × institutions
    "ONT_S:high|PRO:high": "Bureaucratic",
    "ONT_S:low|PRO:low": "Outsider",
    "COM:high|ONT_S:high": "Statesman-Style",
    "COM:low|ONT_S:low": "Antagonist",
    // Worldview (zero-sum × human nature)
    "ONT_H:low|ZS:high": "Hobbesian",
    "ONT_H:high|ZS:low": "Utopian",
    "MOR:high|ZS:low": "Idealist",
    "MOR:low|ZS:high": "Hard-Realist",
    // Worldview × institutions
    "ONT_H:high|ONT_S:high": "Social-Engineer",
    "ONT_H:low|ONT_S:low": "Reactionary",
    "ONT_S:high|ZS:low": "Cooperator",
    "ONT_S:low|ZS:high": "Cynic",
    // Conflict-style
    "AES:Fighter|ZS:high": "Militant",
    "AES:Fighter|COM:low": "Combatant",
    "AES:Fighter|MAT:high": "Populist-Right",
    "AES:Fighter|CD:high": "Reactionary-Firebrand",
    // Style × engagement
    "AES:Statesman|PF:high": "Loyal-Statesman",
    "AES:Technocrat|EPS:Empiricist": "Wonk",
    "AES:Visionary|MOR:high": "Prophet",
    "AES:Pastoral|CD:high": "Hearth-Conservative",
    "AES:Authentic|PF:high": "Plain-Partisan",
    // Epistemic × institutions
    "EPS:Empiricist|ONT_S:high": "Evidence-Institutionalist",
    "EPS:Empiricist|ONT_S:low": "Skeptic",
    "EPS:Traditionalist|ONT_S:high": "Custom-Institutionalist",
    "EPS:Intuitionist|ONT_S:low": "Gut-Outsider",
    "EPS:Autonomous|MAT:high": "Self-Reliant",
    "EPS:Nihilist|ZS:high": "Cynic",
    // Moral-circle scope compressions
    "MAT:low|MORAL_CIRCLE:national": "Civic-Nationalist-Left",
    "MAT:high|MORAL_CIRCLE:national": "Civic-Nationalist-Right",
    "MORAL_CIRCLE:national|PF:high": "Patriot-Partisan",
    "MORAL_CIRCLE:class|AES:Fighter": "Class-Fighter",
    "MORAL_CIRCLE:religious|CD:high": "Religious-Conservative",
    "MORAL_CIRCLE:universal|MAT:low": "Solidarist",
    "MORAL_CIRCLE:universal|CU:high": "Cosmopolite",
    // Engagement modifiers
    "ENG:low|MAT:high": "Quiet-Conservative",
    "ENG:low|CD:low": "Disengaged-Progressive",
    "ENG:high|PF:high": "Activist-Partisan",
    // ──────────────────────────────────────────────────────────────────────
    // Expansion pass 2 (2026-05-12) — iconic political-identity pairs that
    // the lexicon-only path was rendering awkwardly. Hyphenated compounds
    // count as one "word" in the token sequence.
    // ──────────────────────────────────────────────────────────────────────
    // Economy × compromise / dealmaker axis
    "COM:high|MAT:low": "Social-Democrat",
    "COM:high|MAT:high": "Pragmatic-Conservative",
    "COM:low|MOR:high": "Doctrinaire-Idealist",
    "COM:high|ZS:low": "Conciliator",
    // Economy × moral circle
    "MAT:high|MOR:high": "Globalist",
    "MAT:low|MORAL_CIRCLE:religious": "Liberation-Theologian",
    // Institutional reform / theocrat
    "MOR:high|ONT_S:high": "Reformer",
    "MOR:high|PRO:high": "Constitutionalist",
    "MOR:high|ONT_H:high": "Humanist",
    "MORAL_CIRCLE:religious|ONT_S:high": "Theocrat",
    // Conflict-style × moral circle
    "AES:Fighter|MOR:high": "Crusader",
    "AES:Fighter|MORAL_CIRCLE:national": "Patriot-Firebrand",
    "AES:Fighter|MORAL_CIRCLE:religious": "Religious-Firebrand",
    // Statesman archetypes
    "AES:Statesman|EPS:Traditionalist": "Old-Guard",
    "AES:Statesman|EPS:Institutionalist": "Mandarin",
    "AES:Statesman|MAT:high": "Tory",
    "AES:Statesman|MOR:high": "Internationalist-Statesman",
    // Visionary archetypes
    "AES:Visionary|MAT:high": "Mogul",
    "AES:Visionary|ONT_S:high": "Institutional-Visionary",
    "AES:Visionary|EPS:Empiricist": "Tech-Visionary",
    // Authentic / folk register
    "AES:Authentic|MAT:low": "Folk-Progressive",
    "AES:Authentic|MAT:high": "Folk-Conservative",
    // Engagement-driven activist roles
    "ENG:high|MAT:low": "Activist-Leftist",
    "ENG:high|MAT:high": "Activist-Conservative",
    "ENG:high|CD:low": "Activist-Progressive",
    // Continuity / cultural axis
    "CD:high|COM:high": "Continuity-Conservative",
    "CD:low|MOR:high": "Universalist-Progressive",
    // Identity-scope × institutional
    "MORAL_CIRCLE:class|PF:high": "Class-Partisan",
    "MORAL_CIRCLE:national|PRO:high": "Patriot-Institutionalist",
    "MORAL_CIRCLE:national|COM:high": "Patriot-Pragmatist",
    // ──────────────────────────────────────────────────────────────────────
    // Expansion pass 3 (2026-05-12) — second-opinion review pass.
    // 62 additional 2-token compressions drawn from established political
    // vocabulary. Mostly non-collision; where a sig already had an entry
    // (Heritage Guardian, Tech-Visionary), the original is kept.
    // ──────────────────────────────────────────────────────────────────────
    // Civic-republican / civic axes
    "CU:low|MORAL_CIRCLE:national": "Civic-Republican",
    "CU:high|MAT:high": "Cosmopolitan Capitalist",
    // Market / class compressions
    "MAT:high|COM:low": "Market-Fundamentalist",
    "MAT:low|ZS:low": "Social Liberal",
    "MAT:high|MORAL_CIRCLE:class": "Producerist",
    "MORAL_CIRCLE:class|ZS:high": "Class-Warrior",
    // Gender / feminism
    "CD:low|MORAL_CIRCLE:gender": "Feminist",
    "MAT:low|MORAL_CIRCLE:gender": "Socialist Feminist",
    "MORAL_CIRCLE:gender|PRO:high": "Rights Feminist",
    // Ethnic-racial
    "MORAL_CIRCLE:ethnic_racial|PRO:high": "Civil-Rights Liberal",
    "CD:low|MORAL_CIRCLE:ethnic_racial": "Civil-Rights Progressive",
    "CU:high|MORAL_CIRCLE:ethnic_racial": "Multiculturalist",
    // Religious axes
    "CD:low|MORAL_CIRCLE:religious": "Religious Progressive",
    "CU:low|MORAL_CIRCLE:religious": "Confessionalist",
    "CU:high|MORAL_CIRCLE:religious": "Interfaith-Pluralist",
    "EPS:Traditionalist|MORAL_CIRCLE:religious": "Confessionalist",
    "EPS:Traditionalist|MORAL_CIRCLE:national": "National Conservative",
    // EPS pairings
    "EPS:Institutionalist|PRO:high": "Legalist",
    "COM:high|EPS:Institutionalist": "Establishmentarian",
    "EPS:Empiricist|MAT:high": "Market Wonk",
    "EPS:Empiricist|PRO:high": "Rule-of-Law Wonk",
    "EPS:Autonomous|PF:low": "Independent",
    "EPS:Nihilist|AES:Visionary": "Accelerationist",
    "EPS:Nihilist|ONT_S:low": "Accelerationist",
    // AES pairings
    "AES:Visionary|ONT_H:high": "Futurist",
    "AES:Technocrat|MAT:low": "Social Planner",
    "AES:Technocrat|MAT:high": "Market Technocrat",
    "AES:Pastoral|MAT:low": "Agrarian Populist",
    "AES:Pastoral|MAT:high": "Agrarian Conservative",
    "AES:Pastoral|MORAL_CIRCLE:national": "Heartland Populist",
    "AES:Authentic|MORAL_CIRCLE:national": "Plainspoken Patriot",
    "AES:Fighter|CD:low": "Progressive Firebrand",
    "AES:Fighter|MORAL_CIRCLE:gender": "Feminist Firebrand",
    "AES:Fighter|MORAL_CIRCLE:ethnic_racial": "Civil-Rights Firebrand",
    "AES:Statesman|CD:low": "Liberal Statesman",
    // Partisan / movement
    "PF:high|ZS:high": "Party Warrior",
    "CD:high|ZS:high": "Culture Warrior",
    "CD:low|PF:high": "Movement Progressive",
    "CD:high|PF:high": "Movement Conservative",
    "PF:low|PRO:high": "Mugwump",
    // Engagement-activist compressions
    "ENG:low|PF:low": "Apolitical Voter",
    "ENG:high|MORAL_CIRCLE:class": "Labor Activist",
    "ENG:high|MORAL_CIRCLE:religious": "Faith Activist",
    "ENG:high|MORAL_CIRCLE:ethnic_racial": "Civil-Rights Activist",
    "ENG:high|MORAL_CIRCLE:national": "Patriot Activist",
    // Cultural / procedural
    "CD:low|PRO:high": "Civil-Libertarian",
    "CD:high|PRO:high": "Constitutional Conservative",
    "CD:low|COM:low": "Doctrinaire Progressive",
    "CD:high|COM:low": "Doctrinaire Conservative",
    "CD:low|COM:high": "Liberal Pragmatist",
    "COM:high|PF:high": "Party Regular",
    "COM:low|PF:high": "Party Loyalist",
    "ENG:high|PRO:high": "Civic Activist",
    "ENG:high|PRO:low": "Direct-Action Activist",
    "COM:low|ENG:high": "Movement Activist",
    "ENG:low|PRO:high": "Civic Bystander",
    // Tribal / sectarian
    "TRB:low|ZS:low": "Bridge-Builder",
    "TRB:high|ZS:high": "Sectarian",
    "MORAL_CIRCLE:religious|ZS:high": "Sectarian",
    "MORAL_CIRCLE:religious|TRB:high": "Sectarian",
    "MORAL_CIRCLE:national|TRB:high": "Ultra-Nationalist",
    // Autonomous / nihilist
    "EPS:Autonomous|PRO:low": "Maverick",
    "AES:Authentic|EPS:Autonomous": "Maverick",
    "EPS:Nihilist|PF:low": "Alienated Voter",
    "ENG:low|EPS:Nihilist": "Alienated Bystander",
    // Statesman variants
    "AES:Statesman|COM:high": "Consensus Statesman",
    "AES:Statesman|PRO:high": "Constitutional Statesman",
    "AES:Statesman|MORAL_CIRCLE:national": "Patriotic Statesman",
    // Technocrat variants
    "AES:Technocrat|PRO:high": "Good-Government Technocrat",
    "AES:Technocrat|COM:high": "Policy Broker",
    "AES:Technocrat|ZS:low": "Policy Optimizer",
    // Pastoral / preacher
    "AES:Pastoral|MORAL_CIRCLE:religious": "Country Preacher",
    // Intuitionist / moral
    "EPS:Intuitionist|MOR:high": "Moral Idealist",
    "CD:high|EPS:Intuitionist": "Moral Traditionalist",
    "COM:high|EPS:Traditionalist": "Customary Pragmatist",
};
// ──────────────────────────────────────────────────────────────────────────────
// Part-of-speech tagging for lexicon ordering
// ──────────────────────────────────────────────────────────────────────────────
/**
 * Hand-coded POS overrides for tokens where suffix detection is unreliable
 * (compounds, ambiguous suffixes, common-noun confusions). Anything not in
 * here falls through to suffix heuristics in posRank().
 *   0 = pure adjective (Procedural, Combative)
 *   1 = adjective-leaning (Civic, Institutional)
 *   3 = noun-leaning (Conservative, Progressive — used both ways)
 *   4 = strong noun (Consequentialist, Statesman)
 */
const POS_OVERRIDES = {
    // Adjective-leaning continuous-node tokens
    "Procedural": 0, "Pragmatic": 0, "Combative": 0, "Practical": 0,
    "Principled": 0, "Detached": 0, "Tempered": 0, "Authentic": 0,
    "Pastoral": 0, "Autonomous": 0, "Casual": 0, "Mobilized": 0,
    "Tuned-Out": 0, "Tribal": 0, "Anti-Institutional": 0, "Engaged-Civic": 0,
    "Class-Conscious": 0, "Bureaucratic": 0, "Hobbesian": 0, "Utopian": 0,
    "Civic": 1, "Institutional": 1,
    // Hybrid words used as nouns in political-identity context
    "Progressive": 3, "Conservative": 3, "Liberal": 3, "Cosmopolitan": 3,
    "Reactionary": 3, "Pluralist": 3, "Realist": 3,
    // Compound nouns
    "Mixed-Economy": 3, "Hinge": 4, "Positive-Sum": 2, "Civic-Pluralist": 3,
    "Free-Marketeer": 4, "Dealmaker": 4,
    "Civic-Universalist": 4, "Provincial-Pluralist": 3,
    "Conservative-Pluralist": 3, "Communitarian": 4, "Internationalist": 4,
    "Populist-Left": 4, "Populist-Right": 4, "Libertarian": 4, "Leftist": 4,
    "Solidarist": 4, "Cosmopolite": 4, "Class-Particularist": 4,
    "Tribal-Capitalist": 4, "Free-Market-Disruptor": 4,
    "Anti-Capitalist-Radical": 4, "Progressive-Unifier": 4,
    "Establishment": 4, "Insurgent": 4, "Negotiator": 4, "Hard-Liner": 4,
    "Outsider": 4, "Statesman-Style": 4, "Antagonist": 4,
    "Idealist": 4, "Hard-Realist": 4, "Social-Engineer": 4, "Cooperator": 4,
    "Cynic": 4, "Militant": 4, "Combatant": 4, "Reactionary-Firebrand": 4,
    "Loyal-Statesman": 4, "Wonk": 4, "Prophet": 4, "Hearth-Conservative": 4,
    "Plain-Partisan": 4, "Evidence-Institutionalist": 4, "Skeptic": 4,
    "Custom-Institutionalist": 4, "Gut-Outsider": 4, "Self-Reliant": 0,
    "Civic-Nationalist-Left": 4, "Civic-Nationalist-Right": 4,
    "Patriot-Partisan": 4, "Class-Fighter": 4, "Religious-Conservative": 4,
    "Quiet-Conservative": 4, "Disengaged-Progressive": 4, "Activist-Partisan": 4,
    // Categorical-leaning items
    "Religious-Communitarian": 4, "Ethnic-Communitarian": 4,
    "Gender-Identitarian": 4, "Partisan-Communitarian": 4,
    // Expansion pass 2 compressed outputs
    "Social-Democrat": 4, "Pragmatic-Conservative": 4, "Doctrinaire-Idealist": 4,
    "Conciliator": 4, "Globalist": 4, "Liberation-Theologian": 4,
    "Reformer": 4, "Constitutionalist": 4, "Humanist": 4, "Theocrat": 4,
    "Crusader": 4, "Patriot-Firebrand": 4, "Religious-Firebrand": 4,
    "Old-Guard": 4, "Mandarin": 4, "Tory": 4, "Internationalist-Statesman": 4,
    "Mogul": 4, "Institutional-Visionary": 4, "Tech-Visionary": 4,
    "Folk-Progressive": 4, "Folk-Conservative": 4,
    "Activist-Leftist": 4, "Activist-Conservative": 4, "Activist-Progressive": 4,
    "Continuity-Conservative": 4, "Universalist-Progressive": 4,
    "Class-Partisan": 4, "Patriot-Institutionalist": 4, "Patriot-Pragmatist": 4,
    // Expansion pass 3 (second-opinion review)
    "Classical Liberal": 4, "Neoliberal": 4, "Anarcho-Capitalist": 4,
    "National Populist": 4, "Christian Democrat": 4, "Paternalist Conservative": 4,
    "National Conservative": 4, "Integralist": 4, "Bull Moose Progressive": 4,
    "Marxist": 4, "Syndicalist": 4, "Vanguardist": 4, "Socialist Feminist": 4,
    "Civil-Rights Liberal": 4, "Cosmopolitan Liberal": 4, "Cosmopolitan Capitalist": 4,
    "Constitutional Conservative": 4, "Culture Warrior": 4, "Movement Progressive": 4,
    "Yellow Dog Democrat": 4, "Good-Government Reformer": 4,
    "Eco-Socialist": 4, "Green Progressive": 4, "Utopian Socialist": 4,
    "Techno-Libertarian": 4, "Hamiltonian": 4, "Rockefeller Republican": 4,
    "Reaganite": 4, "Goldwater Conservative": 4, "Paleoconservative": 4,
    "Distributist": 4, "One-Nation Conservative": 4, "New Dealer": 4, "Jacksonian": 4,
    // Compression outputs
    "Civic-Republican": 4, "Market-Fundamentalist": 4, "Social Liberal": 4,
    "Producerist": 4, "Class-Warrior": 4, "Feminist": 4, "Rights Feminist": 4,
    "Civil-Rights Progressive": 4, "Multiculturalist": 4, "Religious Progressive": 4,
    "Confessionalist": 4, "Interfaith-Pluralist": 4, "Legalist": 4,
    "Establishmentarian": 4, "Market Wonk": 4, "Rule-of-Law Wonk": 4,
    "Independent": 4, "Accelerationist": 4, "Futurist": 4, "Social Planner": 4,
    "Market Technocrat": 4, "Agrarian Populist": 4, "Agrarian Conservative": 4,
    "Heartland Populist": 4, "Plainspoken Patriot": 4, "Progressive Firebrand": 4,
    "Feminist Firebrand": 4, "Civil-Rights Firebrand": 4, "Liberal Statesman": 4,
    "Party Warrior": 4, "Movement Conservative": 4, "Mugwump": 4,
    "Apolitical Voter": 4, "Labor Activist": 4, "Faith Activist": 4,
    "Civil-Rights Activist": 4, "Patriot Activist": 4, "Civil-Libertarian": 4,
    "Doctrinaire Progressive": 4, "Doctrinaire Conservative": 4, "Liberal Pragmatist": 4,
    "Party Regular": 4, "Party Loyalist": 4, "Civic Activist": 4,
    "Direct-Action Activist": 4, "Movement Activist": 4, "Civic Bystander": 4,
    "Bridge-Builder": 4, "Sectarian": 4, "Ultra-Nationalist": 4,
    "Maverick": 4, "Alienated Voter": 4, "Alienated Bystander": 4,
    "Consensus Statesman": 4, "Constitutional Statesman": 4, "Patriotic Statesman": 4,
    "Good-Government Technocrat": 4, "Policy Broker": 4, "Policy Optimizer": 4,
    "Country Preacher": 4, "Moral Idealist": 4, "Moral Traditionalist": 4,
    "Customary Pragmatist": 4,
};
export function posRank(token) {
    if (token in POS_OVERRIDES)
        return POS_OVERRIDES[token];
    const last = (token.split("-").pop() ?? token).toLowerCase();
    // Noun suffixes
    if (/(?:ist|crat|man|ee[rt]|eer|aire|ant|arch|gogue|cyte|naut)$/.test(last))
        return 4;
    // Adjective suffixes
    if (/(?:al|ed|ous|ic|ive|ory|ish)$/.test(last))
        return 0;
    // Fallback (mid): treat as a soft noun so it ends up in the noun group.
    return 3;
}
/**
 * Hard rule (per Sam, 2026-05-12): the LAST word of every label must be a
 * noun. If a label ends in an adjective (POS ≤ 1) after composition + POS
 * reorder, substitute that final word with its registered noun form here.
 * Identity mappings (e.g. "Detached" → "Detached") explicitly say "this adj
 * is acceptable as a noun-like standalone" — Sam's judgment.
 */
const ADJECTIVE_NOUN_FORM = {
    // Continuous lexicon adjectives
    "Procedural": "Proceduralist",
    "Pragmatic": "Pragmatist",
    "Combative": "Combatant",
    "Practical": "Pragmatist",
    "Principled": "Idealist",
    "Detached": "Detached", // Sam: works as standalone
    "Tempered": "Realist",
    "Pastoral": "Folk-Voice",
    "Casual": "Casual Voter",
    "Mobilized": "Activist",
    "Tuned-Out": "Bystander",
    "Tribal": "Tribalist",
    "Anti-Institutional": "Outsider",
    "Engaged-Civic": "Engaged-Civic", // Sam: works as compound
    "Civic": "Civic-Minded Citizen",
    "Institutional": "Institutionalist",
    // Categorical adjectives
    "Autonomous": "Free-Thinker",
    "Authentic": "Plain-Talker",
    // Compression outputs that are adjectives
    "Bureaucratic": "Bureaucrat",
    "Hobbesian": "Hobbesian-Realist",
    "Utopian": "Utopian-Idealist",
    "Class-Conscious": "Class-Activist",
    "Self-Reliant": "Individualist",
};
/**
 * Apply the noun-anchor rule to a token list. If the last token has POS ≤ 1
 * (adjective-leaning) AND a registered noun form exists, swap the token's
 * display string with the noun form. No-op when the last token is already a
 * noun or no substitute is registered.
 */
function ensureNounAnchor(tokens) {
    if (tokens.length === 0)
        return tokens;
    const last = tokens[tokens.length - 1];
    if (posRank(last.token) >= 2)
        return tokens;
    const nounForm = ADJECTIVE_NOUN_FORM[last.token];
    if (!nounForm || nounForm === last.token)
        return tokens;
    return [...tokens.slice(0, -1), { ...last, token: nounForm }];
}
/**
 * Reorder tokens so the final label reads adjective-first / noun-last.
 *   1. Adjectives (POS ≤ 1) come first, in salience-descending order (input
 *      order is assumed to be salience-desc already).
 *   2. Nouns (POS ≥ 2) come second, but the MOST salient noun is placed last
 *      as the grammatical anchor — so "Tribal" (adj) + "Consequentialist"
 *      (noun) renders as "Tribal Consequentialist", and a triple like
 *      [Statesman, Universalist, Procedural] in salience-desc renders as
 *      "Procedural Universalist Statesman" (Procedural adj first, Statesman
 *      anchored last).
 */
function reorderByPOS(tokens) {
    const adjs = [];
    const nouns = [];
    for (const t of tokens) {
        if (posRank(t.token) <= 1)
            adjs.push(t);
        else
            nouns.push(t);
    }
    // Reverse nouns so the highest-salience noun (originally first) lands at the
    // tail — the anchor position.
    nouns.reverse();
    return [...adjs, ...nouns];
}
/**
 * Apply compression to a token list: find the first compressible pair (highest-
 * salience pair first), substitute the pair with the single word, return new
 * token-like array. Returns null if no compression applies.
 */
function applyCompression(tokens) {
    if (tokens.length < 2)
        return null;
    // Try every pair, prefer earlier (higher-salience) pairs.
    for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
            const pair = [tokens[i], tokens[j]];
            const sig = signatureOf(pair);
            if (sig in COMPRESSION_TABLE) {
                const compressed = {
                    node: "_COMPRESSED",
                    bin: sig,
                    token: COMPRESSION_TABLE[sig],
                    salience: Math.max(tokens[i].salience, tokens[j].salience),
                    isCategorical: true,
                };
                // Replace tokens[i] and tokens[j] with the compressed entry, preserving rest.
                const remaining = tokens.filter((_, k) => k !== i && k !== j);
                return [compressed, ...remaining];
            }
        }
    }
    return null;
}
/**
 * Browser-friendly wrapper: takes a respondent state (dump shape) and returns
 * just the composed label string. Uses the embedded default merger table.
 */
export function composeArchetypeLabel(state) {
    return labelForRespondent(state, DEFAULT_MERGER_TABLE).label;
}
// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function argmax(arr) {
    let best = -1, bestV = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > bestV) {
            bestV = arr[i];
            best = i;
        }
    }
    return best;
}
//# sourceMappingURL=archetypeLabeler.js.map