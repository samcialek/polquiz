/**
 * PRISM v12.5 Scorer - 164 Archetype System (v157)
 *
 * Maps quiz responses to 15 L3 nodes and matches against 164 archetypes.
 * Now includes L1 primitive nodes that influence L3 calculations.
 *
 * v157 CHANGES:
 * - EQUAL WEIGHTS: Removed arbitrary per-question weights (0.7, 0.8, 0.9, etc.)
 * - CROSS-LOAD DISCOUNT: Questions feeding multiple nodes get systematic discounts:
 *   - 1 node: 1.00 weight (full signal)
 *   - 2 nodes: 0.85 weight
 *   - 3 nodes: 0.70 weight
 *   - 4+ nodes: 0.55 weight (diffuse signal)
 * - DEPRECATED PRIMARY_TRAIT_CONFIG: Old primary/secondary system replaced
 * - Added QUESTION_NODE_COUNTS lookup and getCrossLoadDiscount() function
 *
 * v156 CHANGES:
 * - Removed 19 questions from quiz (q42, q76, q24, q78d, q55, q49, q112, q114, q95, q41, q122, q117, q67, q120, q118, q107, q28, q108, q123)
 * - Converted q129 from single-choice to checkbox format
 * - Added CHECKBOX_MAPPINGS for q129_* fields
 *
 * v154 CHANGES:
 * - Added 36 new questions (q93-q128) targeting under-sourced nodes
 * - AES: +6 questions (q93-q98) - was critically under-sourced with only 2
 * - COM: +6 questions (q99-q104) - reinforcing compromise/pragmatism
 * - ONT_S: +6 questions (q105-q110) - system optimism/pessimism
 * - EPS: +6 questions (q111-q116) - empirical vs intuitive epistemics
 * - ONT_H: +6 questions (q117-q122) - human nature optimism/pessimism
 * - PF: +6 questions (q123-q128) - partisan fusion/identity
 * - Added q129-q133 for Progressive Civic Nationalist archetype:
 *   - q129: Civic integration (CU) - distinguishes civic nationalism from restrictionism
 *   - q130: Leadership style (AES) - distinguishes visionary from technocratic
 *   - q131: Coalition building (COM, PF) - bipartisan orientation
 *   - q132: Vision coherence (AES) - worldview vs policy portfolio
 *   - q133: Political pitch (AES) - unified narrative vs issue-by-issue
 * - Added "Progressive Civic Nationalist" archetype (N11) - Ro Khanna type
 *
 * L1 Primitives (NEW):
 * - CAL: Reality Calibration (factual accuracy)
 * - EC: Epistemic Curiosity (novelty-seeking)
 * - DEF: Deference to Authority
 * - ERR: Error Type Preference (FP vs FN bias)
 *
 * L3 Node Clusters:
 * - ENDS: MAT, CD, CU, MOR
 * - MEANS: PRO, EPS, AES, COM
 * - REALITY: ZS, H, ONT_H, ONT_S
 * - SELF: PF, TRB, ENG
 */

// =============================================================================
// L1 PRIMITIVE NODE DEFINITIONS
// =============================================================================

const L1_NODES = {
    CAL: { name: 'Reality Calibration', low: 'Biased perception', high: 'Accurate perception' },
    EC:  { name: 'Epistemic Curiosity', low: 'Familiarity-seeking', high: 'Novelty-seeking' },
    DEF: { name: 'Deference', low: 'Anti-authority', high: 'Authority-accepting' },
    ERR: { name: 'Error Preference', low: 'Risk false negatives', high: 'Risk false positives' }
};

// Calibration facts: actual values for factual questions
// NOTE: Field names updated to match prism_dense_quiz_v3.html
const CALIBRATION_FACTS = {
    q80: 37,        // Top marginal federal income tax rate (actual: 37%)
    q81: 46,        // % prisoners for violent crimes
    q82: 14,        // % foreign-born population
    q83: 32,        // % wealth owned by top 1%
    q84: 97,        // % climate scientists agree on human-caused climate change
    q85: 21,        // % energy from renewables
    q86: 13         // % Americans with food insecurity
};

// Confidence multipliers for calibration scoring
const CONFIDENCE_WEIGHTS = {
    'guess': 0.3,   // Low penalty for being wrong when guessing
    'low': 0.5,
    'medium': 0.8,
    'high': 1.2     // Higher penalty for confident but wrong
};

// L1 → L3 influence mappings: how L1 primitives affect L3 node calculations
// Axis reference: EPS low=empirical/high=intuitive, ZS low=positive-sum/high=zero-sum, ONT_S low=declining/high=thriving
const L1_TO_L3_INFLUENCE = {
    CAL: { EPS: -0.3, ZS: -0.15, ONT_S: 0.1 }, // Well-calibrated → more empirical (lower EPS), less zero-sum, more optimistic
    EC:  { EPS: -0.2, CD: -0.15, AES: 0.1 },   // High curiosity → more empirical, less traditional
    DEF: { PRO: -0.25, H: 0.2 },               // High deference → more rules-bound, more hierarchical
    ERR: { PRO: 0.2, ZS: 0.15 }                // Prefer FP → more outcome-focused, more zero-sum
};

// =============================================================================
// L3 NODE DEFINITIONS
// =============================================================================

const L3_NODES = {
    // ENDS - What You Want
    MAT: { name: 'Material', low: 'Redistribution', high: 'Free Market', cluster: 'ENDS' },
    CD: { name: 'Cultural Defense', low: 'Progressive', high: 'Traditional', cluster: 'ENDS' },
    CU: { name: 'Cultural Uniformity', low: 'Pluralist', high: 'Assimilationist', cluster: 'ENDS' },
    MOR: { name: 'Moral Circle', low: 'Universal', high: 'Particularist', cluster: 'ENDS' },

    // MEANS - How You Get There
    PRO: { name: 'Proceduralism', low: 'Rules-bound', high: 'Outcome-focused', cluster: 'MEANS' },
    EPS: { name: 'Epistemics', low: 'Empirical', high: 'Intuitive', cluster: 'MEANS' },
    AES: { name: 'Aesthetics', low: 'Deliberative', high: 'Inspirational', cluster: 'MEANS' },
    COM: { name: 'Compromise', low: 'Principled', high: 'Pragmatic', cluster: 'MEANS' },

    // REALITY - How You See The World
    ZS: { name: 'Zero-Sum', low: 'Positive-sum', high: 'Zero-sum', cluster: 'REALITY' },
    H: { name: 'Hierarchy', low: 'Egalitarian', high: 'Hierarchical', cluster: 'REALITY' },
    ONT_H: { name: 'Ontology-Human', low: 'Pessimistic', high: 'Optimistic', cluster: 'REALITY' },
    ONT_S: { name: 'Ontology-System', low: 'Declining', high: 'Thriving', cluster: 'REALITY' },

    // SELF - Your Political Identity
    PF: { name: 'Partisan Fusion', low: 'Independent', high: 'Partisan', cluster: 'SELF' },
    TRB: { name: 'Tribalism', low: 'Universalist', high: 'Tribal', cluster: 'SELF' },
    ENG: { name: 'Engagement', low: 'Apolitical', high: 'Engaged', cluster: 'SELF' },

    // NATIONALISM TYPE - How you define national belonging
    // Low = Cosmopolitan (borders don't matter, global citizen)
    // Mid = Civic nationalist (shared values, participation, not ethnicity)
    // High = Ethnic nationalist (blood and soil, cultural homogeneity required)
    NAT: { name: 'Nationalism Type', low: 'Cosmopolitan', high: 'Ethnic', cluster: 'SELF' }
};

// =============================================================================
// CROSS-LOADING WEIGHT SYSTEM (v157)
// =============================================================================
// Questions that feed multiple nodes get discounted weights to prevent
// diffuse questions from dominating the signal. This replaces arbitrary
// per-question weights with a systematic approach based on node count.
//
// Philosophy: A question feeding 4 nodes provides diluted signal to each.
// Single-node questions provide focused signal and get full weight.

const QUESTION_NODE_COUNTS = {
    // 6+ nodes (weight 0.55)
    // 'q43': 8,    // DEPRECATED: was Group identity, now blame attribution (q43a-e)
    'q69': 6,    // Article choice

    // 3 nodes (weight 0.70) — reduced from 6 to increase AES signal strength
    'q130': 3,   // Leadership style (AES, TRB, ZS)
    'q132': 3,   // Leader qualities (AES, PRO, TRB)
    'q133': 3,   // Political pitch (AES, PRO, TRB)

    // 5 nodes (weight 0.55)
    'q29': 5,    // Human progress view
    // 'q115': 5,   // Who should solve problems - REMOVED from quiz

    // 4 nodes (weight 0.55)
    'q2': 4,     // Mind change recall
    // 'q10': 4,    // Factory closing attribution - REMOVED: no HTML
    'q15': 4,    // Free speech vs harm
    'q40': 4,    // Friend voting
    'q38': 4,    // Trade economics
    'q37': 4,    // Threats question
    // 'q44': 4,    // Vicarious shame - REMOVED: no HTML
    'q61': 4,    // Info error tradeoff
    'q62': 4,    // Immigration error tradeoff

    // 3 nodes (weight 0.70)
    'q7': 3,     // Criminal justice A
    'q7b': 3,    // Criminal justice B
    'q9a': 3,    // Children traits A
    'q9b': 3,    // Children traits B
    // 'q11': 3,    // Court ruling response - REMOVED from quiz
    'q35': 3,    // Unjust law response
    // 'q68': 3,    // Political communication style - REMOVED from quiz
    'q73': 3,    // Parents politics
    // 'q76': 3,    // Community homogeneity - REMOVED: no HTML
    // 'q135': 3,   // Political speech preference - REMOVED from quiz
    // 'q96': 3,    // Political ad preference - REMOVED from quiz
    'q94': 2,    // What changed minds (AES, EPS primary; also TRB, MAT secondary)
    'q98': 2,    // Political aesthetics (AES, EPS primary; also TRB secondary)
    'q59': 3,    // Criminal trials error
    'q60': 3,    // Welfare error
    'q63': 3,    // FDA error
    'q64': 3,    // Electoral error

    // 2 nodes (weight 0.85)
    'q1': 2,     // Political identity centrality
    'q58': 2,    // Attribution slider
    // 'q30': 2,    // Rehabilitation belief - REMOVED from quiz (redundant with q27)
    'pro6': 2,   // Legacy PRO slider
    'q65a': 2,   // Dems want best
    'q65b': 2,   // Reps want best
    'q93': 2,    // Elite media accuracy
    'q78e': 2,   // Media diversity
    'q78f': 2,   // Discrimination experience
    'q1b': 2,    // Political content consumption
    // 'q3b': 2,    // Economic policy B - REMOVED: no HTML
    // 'q4': 2,     // Security approach A - REMOVED from quiz (kept q4b)
    'q4b': 2,    // Security approach B
    'q6': 2,     // Climate/energy A
    'q6b': 2,    // Climate/energy B
    // 'q8': 2,     // Governance A - REMOVED from quiz
    // 'q8b': 2,    // Governance B - REMOVED from quiz
    'q13': 2,    // University admissions
    // 'q14': 2,    // Technology adoption - REMOVED: no HTML
    'self4': 2,  // Family conflict
    'q55_conjoint': 2, // Society preference
    'q53': 2,    // Coalition building
    // 'q24': 2,    // Immigration rate - REMOVED: no HTML
    'q25': 2,    // CEO pay ratio
    // 'q26': 2,    // Precautionary principle - REMOVED: no HTML
    'q71': 2,    // Mask mandate
    'q75': 2,    // Religious upbringing
    'q77': 2,    // Childhood safety
    'q110': 2,   // Social progress permanence (ONT_S, PRO)
    'q125': 2,   // Politics at social gatherings (PF, ENG)
    'q_nat_1': 2, // What makes someone truly American (NAT, CU)
};

// Returns the weight discount based on how many nodes a question feeds
// Single-node questions get full weight; multi-node questions get discounted
function getCrossLoadDiscount(qId) {
    const nodeCount = QUESTION_NODE_COUNTS[qId] || 1;
    if (nodeCount === 1) return 1.00;
    if (nodeCount === 2) return 0.85;
    if (nodeCount === 3) return 0.70;
    return 0.55;  // 4+ nodes
}

// =============================================================================
// QUESTION → L3 NODE MAPPINGS
// =============================================================================

// Slider questions: [node, weight, invert?, transform?]
// NOTE: Weight field is now IGNORED - all questions use equal base weight (1.0)
// Cross-loading discount is applied dynamically via getCrossLoadDiscount()
const SLIDER_MAPPINGS = {
    // Page 1: ENDS
    q1: [['PF', 1.0, false], ['ENG', 0.5, false]],  // Political identity centrality

    // Page 2: MEANS
    // NOTE: q17 removed - no HTML field exists
    // NOTE: q24, q25, q26 in MC_MAPPINGS - they are categorical, not sliders!

    // Page 3: REALITY - UPDATED field names to match HTML
    // NOTE: q27 is now recidivism estimate - see below for correct mapping
    q34: [['ZS', 0.9, true]],      // Fixed vs growing pie (inverted: growing pie = low ZS) - was q28
    // NOTE: q29 in MC_MAPPINGS - it's categorical (progress/cycles/illusion)

    // Page 4: SELF
    self1: [['PF', 0.5, false]],   // Views changed over 10 years
    // q40 moved to MC_MAPPINGS - now categorical friend voting question

    // Additional sliders that may exist
    // NOTE: q36 removed - no HTML field exists (was traditional-progressive slider)
    // NOTE: q39 removed - HTML only has q39a-d allocation fields, no q39 slider
    q58: [['ZS', 0.6, false], ['H', 0.4, false]],   // Attribution slider: complex forces (0) vs powerful groups (100)

    // Policy and candidate evaluation
    // q46 removed - question deleted from quiz
    // q46: [['PRO', 0.8, false]],   // Character vs policy: 0=character matters, 100=only policy matters (higher = outcome-focused)
    q57: [['MAT', 0.7, true]],    // Ideal tax rate: 0%=free market, 100%=redistributive (inverted: higher tax = lower MAT)

    // MOR questions - Low=universal, High=particularist
    // q54 is now an allocation (q54a-d) - handled separately in ALLOCATION_MAPPINGS
    // NOTE: q56 uses NON-LINEAR NORMALIZATION (see special handling in scoreQuizToL3Profile)
    // The question offers 10 domestic vs 100 abroad lives, so the scale is inherently skewed:
    // - Choosing 50 means valuing domestic lives 10x more (already quite nationalistic)
    // - Anything over 50 is very nationalistic; we use sqrt() normalization
    q56: [['MOR', 1.0, false, 'sqrt_normalize']],    // Lives trade-off: 0=save abroad (LOW MOR), 100=prioritize citizens (HIGH MOR)

    // Q27: Recidivism estimate (factual belief as proxy for ONT_H)
    // Input: 0-100 (out of 100 violent offenders re-arrested in 5 years)
    // Actual rate ~40. Higher estimates = pessimistic about human change (high ONT_H)
    q27: [['ONT_H', 1.0, true]],    // 0=optimistic (low ONT_H), 100=pessimistic (high ONT_H) - need to center at 40

    // Q30: REMOVED from quiz - redundant with q27 (recidivism estimate)
    // q30: [['ONT_H', 1.0, false], ['CD', 0.5, true]]
};


// Multiple choice mappings: question → { answer: { node: value } }
const MC_MAPPINGS = {
    // Q1b: Political content consumption (behavioral proxy for political identity centrality)
    q1b: {
        '0': { ENG: 15, TRB: 20 },           // Rarely/never
        '1-2': { ENG: 35, TRB: 35 },         // 1-2 days
        '3-4': { ENG: 55, TRB: 50 },         // 3-4 days
        '5-6': { ENG: 75, TRB: 65 },         // 5-6 days
        'daily': { ENG: 90, TRB: 80 }        // Every day
    },

    // Q2: Epistemics - behavioral recall of last mind change
    q2: {
        'data': { EPS: 15, PRO: 30 },        // Changed mind due to data/study
        'conversation': { EPS: 25, COM: 30 },// Changed due to conversation
        'experience': { EPS: 40 },           // Personal experience
        'values': { EPS: 35, PRO: 25 },      // Values conflict realization
        'community': { EPS: 70, TRB: 60 },   // Trusted community figures changed
        'none': { EPS: 85, TRB: 70 }         // Can't recall changing mind
    },

    // Q3/Q3b: Economic policy bundles - REMOVED: no HTML
    // q3: {
    //     'A': { MAT: 25 },  // High taxes, expanded safety net
    //     'B': { MAT: 75 }   // Low taxes, reduced programs
    // },
    // q3b: {
    //     'A': { MAT: 40, PRO: 40 },
    //     'B': { MAT: 35, PRO: 55 }
    // },

    // Q4/Q4b: Security approach (q4 REMOVED from quiz, q4b kept)
    // q4: {
    //     'A': { PRO: 70, ZS: 60 },
    //     'B': { PRO: 30, ZS: 35 }
    // },
    q4b: {
        'A': { PRO: 55, CD: 65 },
        'B': { PRO: 45, CD: 35 }
    },

    // Q5/Q5b: Immigration policy - REMOVED from HTML

    // Q6/Q6b: Climate/energy
    q6: {
        'A': { CD: 25, MAT: 30 },  // Aggressive climate action
        'B': { CD: 65, MAT: 65 }   // Gradual, protect jobs
    },
    q6b: {
        'A': { PRO: 45, MAT: 60 },
        'B': { PRO: 55, MAT: 35 }
    },

    // Q7/Q7b: Criminal justice
    // Added ONT_H: rehabilitation assumes humans can change (optimistic)
    q7: {
        'A': { CD: 25, H: 25, ONT_H: 70 },    // Rehabilitation focus - optimistic about human change
        'B': { CD: 75, H: 75, ONT_H: 30 }     // Punishment focus - pessimistic about human nature
    },
    q7b: {
        'A': { H: 30, CD: 30, ONT_H: 65 },
        'B': { H: 70, CD: 65, ONT_H: 35 }
    },

    // Q8/Q8b: Governance - REMOVED from quiz (PRO redundancy)
    // q8: {
    //     'A': { PRO: 25, COM: 35 },
    //     'B': { PRO: 75, COM: 65 }
    // },
    // q8b: {
    //     'A': { CU: 35, PRO: 30 },
    //     'B': { CU: 65, PRO: 70 }
    // },

    // Q9a/Q9b: Children traits - forced choice pairs (tradition vs autonomy)
    // Classic authoritarianism measure from World Values Survey
    // Added ONT_H: independence implies trust in human autonomy
    q9a: {
        'A': { CD: 25, H: 30, ONT_H: 65 },     // Independence - autonomy, trust in humans
        'B': { CD: 75, H: 70, ONT_H: 40 }      // Respect for elders - humans need guidance
    },
    q9b: {
        'A': { CD: 75, H: 80, ONT_H: 35 },     // Obedience - humans need control
        'B': { CD: 25, H: 20, ONT_H: 70 }      // Self-reliance - trust in human capability
    },

    // Q10: Factory closing attribution - REMOVED: no HTML
    // q10: {
    //     'company': { MAT: 25, H: 40 },
    //     'government': { MAT: 45, PRO: 55 },
    //     'market': { MAT: 70, ZS: 40 },
    //     'workers': { MAT: 80, H: 70 }
    // },

    // Q11: REMOVED from quiz - Court ruling response
    // q11: {
    //     'defer_courts': { PRO: 15, COM: 30, H: 70 },
    //     'negotiate': { PRO: 35, COM: 60, H: 55 },
    //     'reform_court': { PRO: 60, COM: 40, H: 40 },
    //     'emergency': { PRO: 85, COM: 50, H: 25 }
    // },

    // Q13: University admissions (HTML field q13)
    q13: {
        'pure_merit': { H: 70, MOR: 55 },
        'economic_aa': { H: 50, MOR: 40 },
        'quotas': { H: 25, MOR: 25 },
        'lottery': { H: 20, MOR: 30 }
    },

    // Q14: AI/technology adoption - REMOVED: no HTML
    // q14: {
    //     'full_ahead': { CD: 20, ONT_S: 75 },
    //     'gradual': { CD: 45, ONT_S: 55 },
    //     'cautious': { CD: 65, ONT_S: 40 },
    //     'reject': { CD: 80, ONT_S: 25 }  // Note: HTML uses 'reject' not 'block'
    // },

    // Q15: Free speech vs harm (HTML field q15)
    // Added ONT_H: trust humans to handle information; H: trust authority to determine truth
    // Note: CD mapping reflects current political coalitions, may not be ideal
    q15: {
        'allow_full': { PRO: 20, CD: 55, ONT_H: 75, H: 25 },     // Trust humans, distrust authority censors
        'allow_counter': { PRO: 40, CD: 45, ONT_H: 60, H: 35 },
        'restrict': { PRO: 60, CD: 35, ONT_H: 45, H: 55 },
        'cancel': { PRO: 80, CD: 25, ONT_H: 30, H: 70 }          // Distrust humans, trust authority
    },

    // Q29: Human progress view (HTML field q29)
    q29: {
        // Added EPS signal: belief in progress correlates with empirical orientation
        'progress': { ZS: 20, ONT_S: 75, ONT_H: 70, EPS: 25 },
        'cycles': { ZS: 50, ONT_S: 50, ONT_H: 50, EPS: 45 },
        'illusion': { ZS: 75, ONT_S: 30, ONT_H: 35, EPS: 65 }
    },

    // Q30: REMOVED from MC_MAPPINGS - now a slider in HTML (rehabilitation rate belief)
    // Slider mapping added to SLIDER_MAPPINGS: high % = optimistic about human change
    // Old MC mapping kept for reference if needed elsewhere:
    // q30_justice_mc: {
    //     'rehabilitate': { H: 25, ONT_H: 70, CD: 30 },
    //     'some': { H: 50, ONT_H: 50, CD: 50 },
    //     'protect': { H: 75, ONT_H: 30, CD: 70 }
    // },

    // Q40: Friend voting (behavioral proxy for cross-partisan tolerance)
    q40: {
        '0': { TRB: 85, PF: 20 },             // None voted differently - high tribalism
        '10-25': { TRB: 65, PF: 40 },         // 10-25% different
        '25-50': { TRB: 45, PF: 60 },         // 25-50% different
        '50+': { TRB: 25, PF: 80 },           // More than 50% different - low tribalism
        'unknown': { TRB: 40, PF: 50 }        // Don't know - politics less salient
    },

    // Q41: REMOVED - was deleted from quiz

    // Q47: REMOVED - question deleted from quiz
    // q47: {
    //     'support_fully': { PRO: 15, COM: 25 },
    //     'support_reluctant': { PRO: 35, COM: 40 },
    //     'oppose_reluctant': { PRO: 65, COM: 60 },
    //     'oppose_strongly': { PRO: 90, COM: 75 }
    // },

    // Q38: Trade economics (historical framing) - UPDATED with more nuanced options
    q38: {
        'mutual_gain': { ZS: 10, ONT_S: 75, MAT: 60 },    // Positive-sum trade view - ZS widened from 15
        'winner_takes': { ZS: 90, ONT_S: 40, MAT: 50 },   // Zero-sum trade view - ZS widened from 75
        'mixed': { ZS: 45, ONT_S: 55, MAT: 45 },          // Nuanced - sectors differ
        'varied': { ZS: 50, EPS: 60 },                     // Epistemic humility
        'hurt': { ZS: 80, ONT_S: 25, MAT: 30 }            // Anti-trade, protectionist - ZS widened from 70
    },

    // Q94: DUPLICATE REMOVED - q94 is now "What changed minds" (AES question)
    // This mapping had wrong options (positive_sum, tradeoff, zero_sum, depends)
    // Actual HTML options: logical_arguments, compelling_narratives, religious_spiritual, economic_necessity, art_music
    // See corrected q94 mapping in AES section below
    // q94: {
    //     'positive_sum': { ZS: 20, ONT_S: 70 },
    //     'tradeoff': { ZS: 50, ONT_S: 50 },
    //     'zero_sum': { ZS: 85, ONT_S: 25 },
    //     'depends': { ZS: 50, EPS: 55 }
    // },

    // REMOVED: World danger q30 mapping - question doesn't exist in HTML
    // Criminal justice purpose is now q30 (see above)

    // Q37: Threats question (external/internal/both) - now standalone after collision fix
    // Added NAT: external threats correlate with nationalist thinking
    q37: {
        'external': { TRB: 65, CU: 70, NAT: 65 },    // External focus = nationalist framing
        'internal': { TRB: 45, CU: 35, NAT: 40 },    // Internal focus = less nationalist
        'both': { TRB: 55, ZS: 70, NAT: 55 }
    },

    // self4: Family conflict question - separated from q37 to avoid collision
    self4: {
        'quiet': { PF: 40, ENG: 25 },
        'mention': { PF: 50, ENG: 45 },
        'discuss': { PF: 55, ENG: 65 },
        'argue': { PF: 75, ENG: 80 }
    },

    // NOTE: q33 removed - no HTML field exists (was "Engaging with opposing views")

    // Q35: Response to unjust law (PRO, H)
    // Added MOR: subverting unjust law = following universal principles over particular laws
    q35: {
        'compliant': { PRO: 15, H: 75, MOR: 65 },    // Follow local rules = particularist
        'reform': { PRO: 35, H: 55, MOR: 50 },
        'bypass': { PRO: 60, H: 35, MOR: 40 },
        'subvert': { PRO: 85, H: 20, MOR: 25 }       // Follow universal justice = universalist
    },

    // REMOVED: Old q37 mapping (partisan/sacred/etc) - no matching HTML question
    // Values moved to consolidated q37 mapping above

    // Q55_conjoint: Society preference (MAT) - HTML field q55_conjoint
    // Added H: accepting inequality = accepting hierarchy
    q55_conjoint: {
        'A': { MAT: 80, H: 70 },  // High inequality, high average = accept hierarchy
        'B': { MAT: 50, H: 50 },  // Moderate inequality
        'C': { MAT: 20, H: 30 }   // Low inequality, lower average = egalitarian
    },

    // REMOVED: self4 mapping - HTML uses q37 for this question, moved to consolidated q37

    // Q68: REMOVED from quiz - Political communication style (AES oversaturation)
    // q68: {
    //     'deliberative': { AES: 35, EPS: 25 },
    //     'technocratic': { AES: 45, EPS: 20 },
    //     'inspirational': { AES: 75, EPS: 50 },
    //     'combative': { AES: 90, ZS: 70 }
    // },

    // NOTE: q127 removed from quiz - mapping deleted

    // PRO: Judge interpretation - REMOVED: no HTML
    // FIXED v156: Values were inverted - strict following rules = LOW PRO (rules-bound)
    // q49: {
    //     'strict': { PRO: 15 },       // Letter of law = rules-bound = LOW PRO
    //     'spirit': { PRO: 85 }        // Stretch for justice = outcome-focused = HIGH PRO
    // },

    // COM: Coalition building - FIXED: com_coalition → q53 to match HTML
    // purity=principled (low COM), tent=pragmatic (high COM)
    // Added TRB: purity approach is more tribal (us vs them even within coalition)
    q53: {
        'purity': { COM: 15, TRB: 85 },   // Principled, tribal (only true believers) - TRB widened from 65
        'tent': { COM: 85, TRB: 20 }      // Pragmatic, inclusive - TRB widened from 35
    },

    // Q51: REMOVED - question deleted from quiz
    // q51: {
    //     'firm': { COM: 10 },
    //     'acknowledged': { COM: 35 },
    //     'updated': { COM: 70 },
    //     'common_ground': { COM: 95 }
    // },

    // FIX: Field names updated to match HTML after collision fixes

    // q24: Immigration rate preference - REMOVED: no HTML
    // Low immigration preference = assimilationist (high CU), higher NAT
    // High immigration preference = pluralist (low CU), lower NAT (cosmopolitan)
    // q24: {
    //     '0':    { CU: 85, NAT: 70 },      // Significantly reduce = assimilationist, ethnic-lean
    //     '0.5':  { CU: 70, NAT: 60 },      // Reduce somewhat
    //     '1':    { CU: 50, NAT: 50 },      // Current level = moderate
    //     '2':    { CU: 30, NAT: 40 },      // Increase
    //     '3':    { CU: 15, NAT: 25 }       // Significantly increase = pluralist, cosmopolitan
    // },

    // q25: CEO pay ratio acceptance → MAT (Material), H (Hierarchy)
    // Low ratio = egalitarian (low MAT, low H), High/no limit = free market (high MAT, high H)
    // NOTE: Options reordered numerically in HTML (10→50→100→300→no_limit)
    q25: {
        '10':       { MAT: 15, H: 20 },   // 10:1 max = strong egalitarian
        '50':       { MAT: 30, H: 35 },   // 50:1 = leaning egalitarian
        '100':      { MAT: 50, H: 50 },   // 100:1 = moderate
        '300':      { MAT: 70, H: 70 },   // 300:1 (current avg) = accept hierarchy
        'no_limit': { MAT: 90, H: 85 }    // No limit = strong free market
    },

    // q26: Precautionary principle - REMOVED: no HTML
    // Act quickly = rules-bound (high PRO), cautious (low EPS intuitive)
    // Wait for proof = outcome-focused (low PRO), empirical (high EPS)
    // NOTE: 'lower_risk' option removed from quiz; 'never' option now includes "intervention does more harm than good"
    // q26: {
    //     'always':            { PRO: 85, EPS: 20 },   // Act on any potential risk
    //     'depends_reversible':{ PRO: 70, EPS: 35 },   // Act if irreversible harm
    //     'depends_magnitude': { PRO: 50, EPS: 50 },   // Wait for likelihood evidence
    //     'never':             { PRO: 15, EPS: 85 }    // Risks usually overblown, intervention does more harm
    // },

    // =========================================================================
    // PREVIOUSLY UNUSED QUESTIONS - NOW SCORED
    // =========================================================================

    // EC1: Epistemic curiosity - article choice - FIXED: ec1 → q69 to match HTML
    q69: {
        'tradition': { CD: 70, EPS: 60 },        // Proven principles
        'novelty':   { CD: 25, EPS: 30 },        // Bizarre new theory (high curiosity)
        'tribal':    { TRB: 80, PF: 75, ZS: 70 }, // Other side is worse
        'practical': { EPS: 50, AES: 30 }        // Practical tips
    },

    // EC4: Vacation preference (novelty vs familiarity) - FIXED: ec4 → q70 to match HTML
    q70: {
        'familiar': { CD: 65 },   // Prefer familiar = more traditional
        'novel':    { CD: 35 }    // Prefer novel = more progressive
    },

    // D3: Deference - mask mandate acceptance - FIXED: d3 → q71 to match HTML
    q71: {
        'full_support': { PRO: 20, H: 60 },  // Collective action = rules-bound, hierarchical
        'accept':       { PRO: 35, H: 55 },
        'mixed':        { PRO: 50, H: 45 },
        'resent':       { PRO: 65, H: 35 },
        'oppose':       { PRO: 85, H: 20 }   // Anti-mandate = outcome-focused, anti-hierarchy
    },

    // G2: Group identity - which group primary - FIXED: g2_group → q43 to match HTML
    // Added NAT to national and ethnic options
    q43: {
        'family':     { TRB: 55, MOR: 55 },
        'local':      { TRB: 50, CU: 55 },
        'region':     { TRB: 55, CU: 60 },
        'national':   { TRB: 60, CU: 70, NAT: 55 },     // National identity = moderate nationalism
        'religion':   { TRB: 65, CD: 70 },
        'ethnic':     { TRB: 70, MOR: 65, NAT: 75 },    // Ethnic identity = ethnic nationalism
        'profession': { TRB: 40, MAT: 55 },
        'political':  { TRB: 75, PF: 80 },
        'hobby':      { TRB: 35, ENG: 30 }
    },

    // G2_shame: Vicarious shame for group member - REMOVED: no HTML
    // q44: {
    //     'theirs':      { TRB: 20, MOR: 30 },  // Their actions alone = universalist
    //     'mild':        { TRB: 40, MOR: 45 },
    //     'embarrassed': { TRB: 60, MOR: 60 },
    //     'deep':        { TRB: 85, MOR: 75 }   // Deep shame = highly tribal
    // },

    // Problem solvability question - REMOVED: no HTML
    // q_solvable: {
    //     'understand':     { ONT_S: 75, ZS: 35 },    // We understand, just need will
    //     'mixed':          { ONT_S: 55, ZS: 50 },
    //     'misunderstand':  { ONT_S: 35, ZS: 60 },    // Solutions backfire
    //     'too_complex':    { ONT_S: 25, ZS: 70 }     // Too complex = pessimistic
    // },

    // Formative questions - influence baseline dispositions
    // FIXED: f_* → q73-q77 to match HTML
    q73: {  // was f_parent_pol - Parents' political orientation
        'strong_con':  { CD: 60, MAT: 60 },
        'some_con':    { CD: 55, MAT: 55 },
        'mixed':       { CD: 50, MAT: 50 },
        'some_lib':    { CD: 45, MAT: 45 },
        'strong_lib':  { CD: 40, MAT: 40 },
        'apolitical':  { ENG: 30 }
    },

    q74: {  // was f_parent_eng - Parents' political engagement
        'very':     { ENG: 65 },
        'somewhat': { ENG: 55 },
        'minimal':  { ENG: 40 },
        'none':     { ENG: 25 }
    },

    q75: {  // was f_religion - Religious upbringing
        'central':  { CD: 70, TRB: 60 },
        'important':{ CD: 60, TRB: 55 },
        'moderate': { CD: 50, TRB: 45 },
        'minimal':  { CD: 40, TRB: 40 },
        'secular':  { CD: 30, TRB: 35 }
    },

    // q76: was f_community - Childhood community homogeneity - REMOVED: no HTML
    // q76: {
    //     'very_homo': { CU: 70, TRB: 60 },
    //     'some_homo': { CU: 55, TRB: 50 },
    //     'mixed':     { CU: 40, TRB: 40 },
    //     'unaware':   { ENG: 35 }
    // },

    q77: {  // was f_safety - Childhood neighborhood safety
        'very_safe':     { ZS: 30, ONT_S: 70 },
        'mostly_safe':   { ZS: 40, ONT_S: 60 },
        'somewhat_unsafe':{ ZS: 60, ONT_S: 40 },
        'very_unsafe':   { ZS: 75, ONT_S: 25 }
    },

    // =========================================================================
    // NEW QUESTIONS v154 - Addressing Under-Sourced Nodes
    // =========================================================================

    // === AES (Aesthetics) - Deliberative vs Inspirational ===
    // Remaining sources: q12, q94, q98, q130, q132, q133

    // Q135: REMOVED from quiz - AES oversaturation
    // q135: {
    //     'detailed_policy':   { AES: 30, EPS: 20 },
    //     'expert_testimony':  { AES: 40, EPS: 15 },
    //     'personal_stories':  { AES: 65 },
    //     'moral_vision':      { AES: 85 },
    //     'rallying_cry':      { AES: 95, TRB: 20 }
    // },
    q94: {  // "Which has changed more minds throughout history?"
        // Measures belief in rational vs emotional/aesthetic persuasion
        // Added EPS signal: low EPS = empirical, high EPS = intuitive
        'logical_arguments':     { AES: 20, EPS: 25 },   // Values empiricism
        'compelling_narratives': { AES: 70, EPS: 70 },   // Values storytelling (intuitive)
        'religious_spiritual':   { AES: 55, TRB: 30, EPS: 65 },  // Transcendent experience (intuitive)
        'economic_necessity':    { MAT: 60, AES: 35, EPS: 40 },  // Materialist view (moderately empirical)
        'art_music':             { AES: 85, EPS: 80 }    // High aesthetic value (highly intuitive)
    },
    // Q96: REMOVED from quiz - AES oversaturation
    // q96: {
    //     'fact_check':        { AES: 30, EPS: 20 },
    //     'policy_compare':    { AES: 45 },
    //     'testimonial':       { AES: 65 },
    //     'inspirational':     { AES: 85 },
    //     'attack_emotional':  { AES: 95, TRB: 25 }
    // },
    // Q97: REMOVED from quiz - AES oversaturation
    // q97: {
    //     'academic':              { AES: 30 },
    //     'structured':            { AES: 45 },
    //     'town_hall':             { AES: 60 },
    //     'direct_confrontation':  { AES: 80 },
    //     'rally_format':          { AES: 95 }
    // },
    q98: {  // "When political movement develops strong aesthetics..."
        // Measures receptiveness to political aesthetics/symbolism
        // Added EPS signal: skepticism of aesthetics = empirical orientation
        'warning_sign':        { AES: 20, EPS: 30 },   // Skeptical of symbolism (empirical)
        'sometimes_necessary': { AES: 40, EPS: 20 },   // Cautious pragmatist (empirical)
        'neutral_tool':        { AES: 50, EPS: 45 },   // Pure pragmatist (moderate)
        'natural_healthy':     { AES: 65, EPS: 55 },   // Moderate embrace (leaning intuitive)
        'essential_power':     { AES: 90, TRB: 25, EPS: 75 }  // Aesthetics = power (highly intuitive)
    },

    // === COM (Compromise) - Principled vs Pragmatic ===
    // Current sources: 6 - needs reinforcement

    // q99: REMOVED - question deleted from quiz
    // q99: {
    //     'never_legitimizes': { COM: 15 },
    //     'rarely_last_resort': { COM: 35 },
    //     'depends_context': { COM: 50 },
    //     'usually_effective': { COM: 65 },
    //     'always_only_way': { COM: 85 }
    // },
    // q100 removed - redundant COM signal (slider)
    // q101 removed - redundant with q51 behavioral recall
    // q102 removed - redundant COM signal
    // q103 removed - redundant
    // q104 removed - redundant slider

    // === ONT_S (Ontology-System) - Declining vs Thriving ===
    // Current sources: 5 - needs reinforcement

    // q105, q107 removed - no HTML counterpart
    // q107: {  // System strength assessment
    //     'much_weaker':      { ONT_S: 30 },
    //     'similar':          { ONT_S: 50 },
    //     'somewhat_stronger': { ONT_S: 70 },
    //     'flourishing':      { ONT_S: 90 }
    // },
    // q108 converted to multi-select checkbox - now handled via CHECKBOX_MAPPINGS below
    q110: {  // "Social progress achieved in the last century is:"
        // Measures belief in social progress permanence - ONT_S + PRO
        'illusory_superficial':  { ONT_S: 15, PRO: 20 },   // Very skeptical
        'fragile_reversible':    { ONT_S: 35, PRO: 35 },   // Cautious skeptic
        'real_contested':        { ONT_S: 55, PRO: 50 },   // Nuanced - requires defense
        'solid_continue':        { ONT_S: 75, PRO: 70 },   // Optimistic progressive
        'permanent_irreversible': { ONT_S: 90, PRO: 85 }   // Very optimistic
    },

    // === EPS (Epistemics) - Empirical vs Intuitive ===
    // Current sources: 5 - needs reinforcement

    // q111, q112, q114 removed - no HTML counterpart
    // q112: {  // Expert trust basis
    //     'methodology':  { EPS: 30 },
    //     'track_record': { EPS: 45 },
    //     'values_align': { EPS: 65 },
    //     'own_judgment': { EPS: 85 }
    // },
    // q114: {  // Mind change trigger
    //     'new_data':        { EPS: 35 },
    //     'personal_impact': { EPS: 55 },
    //     'trusted_person':  { EPS: 70 },
    //     'deep_reflection': { EPS: 85 }
    // },
    // Q115: REMOVED from quiz - EPS/PRO oversaturation
    // q115: {
    //     'affected_people':   { EPS: 75, H: 20 },
    //     'elected_officials': { EPS: 50, PRO: 60 },
    //     'technical_experts': { EPS: 15, PRO: 45 },
    //     'religious_moral':   { EPS: 85, CD: 70 },
    //     'business_leaders':  { EPS: 55, MAT: 70 }
    // },

    // === ONT_H (Ontology-Human) - Pessimistic vs Optimistic ===
    // Current sources: 7 - needs reinforcement
    // q117, q118, q120, q122, q123 removed - no HTML counterpart
    // q117: {  // Human nature baseline
    //     'self_focused':       { ONT_H: 35 },
    //     'mixed':              { ONT_H: 50 },
    //     'mostly_good':        { ONT_H: 65 },
    //     'fundamentally_good': { ONT_H: 85 }
    // },
    // q118: {  // Trustworthy strangers proportion
    //     'some':       { ONT_H: 35 },
    //     'half':       { ONT_H: 50 },
    //     'most':       { ONT_H: 70 },
    //     'nearly_all': { ONT_H: 90 }
    // },
    // q120: {  // Genuine reform possibility
    //     'rarely':    { ONT_H: 35 },
    //     'sometimes': { ONT_H: 50 },
    //     'often':     { ONT_H: 70 },
    //     'yes':       { ONT_H: 90 }
    // },
    // q122: {  // Competition vs cooperation
    //     'lean_competition':  { ONT_H: 35, ZS: 60 },
    //     'balance':           { ONT_H: 50, ZS: 50 },
    //     'lean_cooperation':  { ONT_H: 65, ZS: 40 },
    //     'cooperation':       { ONT_H: 85, ZS: 25 }
    // },

    // === PF (Partisan Fusion) - Low vs High fusion ===
    // Current sources: 7 - needs reinforcement
    // q123: {  // Political identity importance
    //     'minor':      { PF: 35 },
    //     'notable':    { PF: 50 },
    //     'important':  { PF: 70 },
    //     'essential':  { PF: 90, TRB: 30 }
    // },
    // q124: REMOVED - question deleted from quiz
    // q124: {
    //     'avoid_completely': { PF: 95, TRB: 70 },
    //     'difficult_draining': { PF: 75 },
    //     'work_avoid_topics': { PF: 55 },
    //     'fine_enriching': { PF: 35 },
    //     'actively_seek': { PF: 15, TRB: 20 }
    // },
    q125: {  // "When politics comes up at social gatherings, you typically:"
        // Measures political fusion with social life (PF) and engagement (ENG)
        'avoid_entirely':      { PF: 20, ENG: 15 },     // Avoids mixing politics/social
        'change_subject':      { PF: 35, ENG: 25 },     // Uncomfortable with mixing
        'listen_mostly':       { PF: 50, ENG: 45 },     // Measured engagement
        'share_views':         { PF: 65, ENG: 60 },     // Engaged but civil
        'engage_passionately': { PF: 90, ENG: 85 }      // High political fusion
    },
    // NOTE: q127, q128 removed from quiz - no HTML counterpart
    // q128: {  // Political news consumption - REMOVED: no HTML
    //     'minimal':     { PF: 20, ENG: 15 },
    //     'some':        { PF: 35, ENG: 35 },
    //     'moderate':    { PF: 50, ENG: 55 },
    //     'substantial': { PF: 70, ENG: 75 },
    //     'extensive':   { PF: 90, ENG: 90 }
    // },

    // === NEW QUESTIONS FOR CIVIC NATIONALIST PROGRESSIVE ARCHETYPE ===

    q129: {  // Civic Integration - KEY for distinguishing civic nationalism from restrictionism
        'maintain_full':  { CU: 15 },                    // Pure pluralist
        'own_balance':    { CU: 35 },                    // Mild pluralist
        'civic_values':   { CU: 55 },                    // CIVIC NATIONALIST - integration + heritage
        'american_first': { CU: 75 },                    // Strong assimilationist
        'full_assimilate': { CU: 90 }                    // Maximum assimilationist
    },

    // q_nat_1: What makes someone "truly American" - NAT (Nationalism) primary signal
    // Distinguishes civic nationalism (shared values) from ethnic nationalism (blood/soil)
    // Also feeds CU (Cultural Uniformity) as secondary signal
    q_nat_1: {
        'shared_values':    { NAT: 30, CU: 65 },   // Civic nationalism - shared principles matter most
        'born_raised':      { NAT: 70, CU: 60 },   // Ethnic lean - birthright/ancestry
        'legal_status':     { NAT: 50, CU: 50 },   // Legal formalism - moderate position
        'cultural_adoption': { NAT: 55, CU: 75 },  // Cultural assimilation emphasis
        'none_matters':     { NAT: 15, CU: 20 }    // Cosmopolitan - reject national gatekeeping
    },

    // === LEADERSHIP STYLE QUESTIONS (q130, q132, q133) ===
    // Maps to AES (Aesthetics): Low = Deliberative/Technocratic, High = Inspirational/Visionary
    // Also influences PRO, COM, TRB based on leadership approach

    q130: {  // "The most effective political leaders are those who:"
        // Reduced from 6 nodes to 3 (AES, TRB, ZS) to increase cross-load weight from 0.55x to 0.70x
        'channel_anger':    { AES: 85, TRB: 70, ZS: 65 },    // Fighter-Warrior: emotional, tribal, zero-sum
        'compelling_vision': { AES: 95, ZS: 40 },             // Prophetic-Visionary: positive-sum framing
        'fight_win':        { AES: 75, ZS: 55 },              // Results-focused: "fight" implies adversaries
        'policy_detail':    { AES: 25, ZS: 25 },              // Technocratic: sees positive-sum solutions
        'expert_coalitions': { AES: 30, ZS: 20 }              // Coalition-builder: explicitly positive-sum
    },

    q132: {  // "What matters more in a political leader?"
        // Reduced from 6 nodes to 3 (AES, PRO, TRB) to increase cross-load weight from 0.55x to 0.70x
        'coherent_vision':  { AES: 90, PRO: 40 },            // Prophetic-Visionary: unified narrative
        'gets_results':     { AES: 50, PRO: 75 },            // Pragmatist: outcome-focused
        'expert_team':      { AES: 25, PRO: 45 },            // Technocratic: deliberative
        'fighting_spirit':  { AES: 80, TRB: 75 },            // Fighter-Warrior: tribal
        'right_positions':  { AES: 35, PRO: 30 }             // Principled: deliberative, rules-bound
    },

    q133: {  // "Which political pitch would resonate most with you?"
        // Reduced from 6 nodes to 3 (AES, PRO, TRB) to increase cross-load weight from 0.55x to 0.70x
        'data_driven':      { AES: 20, PRO: 40 },             // Technocratic: highly deliberative
        'enemy_focus':      { AES: 85, TRB: 80 },             // Fighter: tribal, emotional
        'unified_narrative': { AES: 95, PRO: 50 },            // Prophetic-Visionary: highest AES
        'policy_specifics': { AES: 30, PRO: 35 },             // Technocratic: deliberative
        'practical_results': { AES: 45, PRO: 70 }             // Pragmatist: results-focused
    },
};

// Additional slider mappings for previously unused questions
// NOTE: Field names updated to match prism_dense_quiz_v2.html
const ADDITIONAL_SLIDER_MAPPINGS = {
    // Material dimension slider
    mat3: [['MAT', 1.0, true]],  // Wealth inequality concern (high concern = low MAT)
    q57: [['MAT', 1.0, true]],   // What should top tax rate be (HTML field name)

    // Proceduralism sliders - FIXED: Added actual HTML field names q47-q50
    pro4: [['PRO', 0.9, true]],  // Legacy field - may not exist in current HTML
    pro6: [['PRO', 0.4, false], ['CD', 0.3, false]],  // Legacy field

    // NEW PRO sliders matching HTML field names
    // q45 removed - question deleted from quiz
    // q45: [['PRO', 0.9, true]],   // Executive bypass threshold (0=any lead, 100=never) → high value = high PRO
    // q47 moved to MC_MAPPINGS - now categorical scenario question
    // q48 removed - executive bypass question removed from HTML
    q50: [['PRO', 0.9, false]],  // Oppose rule-bending: my side ok(0) vs oppose all(100) → high = high PRO

    // q51 moved to MC_MAPPINGS - now categorical behavioral recall question
    // q52 removed - bill trade-off question removed from HTML

    // Reality perception sliders - FIXED: rea4_* → q65* to match HTML
    q65a: [['ZS', 0.5, true], ['ONT_H', 0.4, false]],   // % Dems want best for country (was rea4_dem_country)
    q65b: [['ZS', 0.5, true], ['ONT_H', 0.4, false]],   // % Reps want best for country (was rea4_rep_country)
    q65c: [['TRB', 0.4, true]],   // % Dems share my values (was rea4_dem_values)
    q65d: [['TRB', 0.4, true]],   // % Reps share my values (was rea4_rep_values)
    // NOTE: q66 removed - question "% news fair" no longer exists in quiz HTML
    q93: [['EPS', 0.5, true], ['ZS', 0.4, true]],  // Elite media (WSJ/Bloomberg/NYT) accuracy estimate

    // Formative sliders - FIXED: q41_* → q78* to match HTML battery
    q78a: [['MAT', 0.3, true]],   // Family finances growing up (was q41_econ)
    // q78b removed - redundant ENG signal
    q78c: [['CD', 0.4, false]],   // Religious upbringing (was q41_rel)
    q78e: [['ZS', 0.5, true], ['MOR', 0.3, true]],    // Media environment diversity: diverse → low ZS, low MOR
    q78f: [['EPS', 0.3, false], ['TRB', 0.3, false]], // Discrimination experience: more → higher TRB (no inversion)

    // Attachment sliders (already correct - q79a/q79b)
    q79a: [['ONT_H', 0.3, false]],  // Maternal warmth → optimistic about humans
    q79b: [['H', 0.3, false]],       // Paternal warmth → moderate hierarchy view

    // =========================================================================
    // NEW SLIDERS v154 - Addressing Under-Sourced Nodes
    // =========================================================================

    // AES slider

    // COM sliders
    // q100 removed - redundant COM signal
    // q104 removed - redundant

    // ONT_S sliders
    // q106 removed - redundant
    // q109 removed - redundant

    // EPS sliders
    // q113 removed - redundant
    // q116 removed - redundant EPS signal

    // ONT_H sliders
    // q119 removed - question deleted from quiz
    // q119: [['ONT_H', 0.9, false]],   // Stranger trust: low (0) vs high (100)
    // q121: [['ONT_H', 0.9, false]],   // Moral progress - REMOVED: no HTML

    // PF slider
    // q126: [['PF', 0.7, false]]       // Political friendship % - REMOVED: no HTML
};

// Error tradeoff mappings: err1-err6 feed into L1 ERR node and also influence L3
// NOTE: Field names updated to match prism_dense_quiz_v2.html (err* → q59-q64)
// ENHANCED v155: Significantly increased signal strength - these are MAJOR signal sources
const ERROR_TRADEOFF_MAPPINGS = {
    // q59: Criminal trials - FP (convict innocent) vs FN (free guilty)
    // Prefer convict innocent = proceduralist (protect rights), anti-hierarchy (distrust authority)
    // Prefer free guilty = outcome-focused, trust authority to catch them later
    q59: {
        fp: { PRO: 15, H: 20, MOR: 35 },   // Protect innocents = strong proceduralism, low hierarchy, universalist
        eq: { PRO: 50, H: 50, MOR: 50 },
        fn: { PRO: 85, H: 80, MOR: 65 }    // Punish guilty = outcome-focused, hierarchical, particularist
    },

    // q60: Welfare - FP (give undeserving) vs FN (deny needy)
    // Question asks "which error is WORSE?"
    // If fp is worse (giving to unqualified) → wants STRICT eligibility → HIGH MAT
    // If fn is worse (denying to needy) → wants GENEROUS benefits → LOW MAT
    q60: {
        fp: { MAT: 85, COM: 20, ONT_H: 30 },   // Giving unqualified is worse = strict eligibility, individualist
        eq: { MAT: 50, COM: 50, ONT_H: 50 },
        fn: { MAT: 15, COM: 80, ONT_H: 70 }    // Denying needy is worse = generous benefits, communitarian, trust humans
    },

    // q61: Information - FP (allow disinfo) vs FN (silence dissent)
    // Question asks "which error is WORSE?"
    // Full psychological profile - this question is rich with signal:
    // - PRO: Process vs outcome orientation
    // - COM: Principled vs pragmatic on free speech
    // - ONT_H: Trust in human discernment ability
    // - H: Trust/distrust of authority to determine truth
    q61: {
        disinfo: { PRO: 80, COM: 75, ONT_H: 30, H: 70 },  // Wants control = outcome-focused, pragmatic, pessimistic about humans, trusts authority
        eq: { PRO: 50, COM: 50, ONT_H: 50, H: 50 },
        silence: { PRO: 20, COM: 25, ONT_H: 70, H: 30 }   // Wants free speech = rules-bound, principled, optimistic about humans, distrusts authority
    },

    // q62: Immigration - FP (deport legal) vs FN (allow illegal)
    // Question asks "which error is WORSE?"
    // If deport_legal is worse (hate wrongly deporting legal people) → pro-immigration, civic → LOW CU, LOW NAT, LOW MOR (universal)
    // If allow_illegal is worse (hate allowing illegals) → restrictionist, ethnic → HIGH CU, HIGH NAT, HIGH MOR (particularist)
    q62: {
        deport_legal: { CU: 20, MOR: 25, ZS: 30, NAT: 30 },   // Deporting legal is worse = pro-immigration, universal moral circle
        eq: { CU: 50, MOR: 50, ZS: 50, NAT: 50 },
        allow_illegal: { CU: 80, MOR: 75, ZS: 70, NAT: 75 }   // Allowing illegal is worse = restrictionist, particularist moral circle
    },

    // q63: FDA - FP (too slow/safe) vs FN (too fast/risky)
    // Question asks "which error is WORSE?"
    // If too_slow is worse (blocking good treatments) → wants FAST approval → OUTCOME-FOCUSED, RISK-ACCEPTING, OPTIMISTIC
    // If too_fast is worse (approving harmful drugs) → wants CAREFUL approval → RULES-BOUND, EMPIRICAL, CAUTIOUS
    q63: {
        too_slow: { PRO: 80, EPS: 75, ONT_S: 70 },   // Blocking treatments is worse = outcome-focused, risk-accepting, optimistic
        eq: { PRO: 50, EPS: 50, ONT_S: 50 },
        too_fast: { PRO: 20, EPS: 25, ONT_S: 35 }    // Approving harmful is worse = procedural, empirical, cautious
    },

    // q64: Electoral - FP (disenfranchise) vs FN (fraud)
    // Question asks "which error is WORSE?"
    // If disenfranchise is worse (blocking legitimate voters) → wants ACCESS → EGALITARIAN, UNIVERSALIST
    // If fraud is worse (allowing illegitimate votes) → wants STRICT RULES → HIERARCHICAL, TRIBAL
    q64: {
        disenfranchise: { PRO: 20, H: 20, TRB: 25 },   // Blocking voters is worse = wants access, egalitarian, universalist
        eq: { PRO: 50, H: 50, TRB: 50 },
        fraud: { PRO: 80, H: 80, TRB: 75 }             // Allowing fraud is worse = wants strict rules, hierarchical, tribal
    }
};

// Allocation question mappings - HTML uses q39a-d, q54a-d, q58a-d format
const ALLOCATION_INFLUENCES = {
    // q39: Why opponents disagree - affects ZS, ONT_H
    // HTML fields: q39a (different values), q39b (misled), q39c (self-interest), q39d (bad motives)
    q39: {
        weights: { a: -0.3, b: 0, c: 0.2, d: 0.5 }, // Higher bad motives = more ZS
        nodes: { ZS: 0.8, ONT_H: -0.6 }  // More evil attribution = higher ZS, lower human optimism
    },
    // q54: REMOVED - question deleted from quiz
    // q54: {
    //     weights: { a: 0.4, b: 0.1, c: -0.5, d: 0 },
    //     nodes: { MOR: 0.9, TRB: 0.3 }
    // },
    // q58: Causes of inequality - affects MAT, H
    // HTML fields: q58a (effort), q58b (family), q58c (discrimination), q58d (luck)
    q58: {
        weights: { a: 0.4, b: 0, c: -0.3, d: -0.2 }, // Higher effort = higher MAT
        nodes: { MAT: 0.7, H: 0.5 }  // More effort attribution = higher MAT, higher H
    }
};

// Ranking question mappings - items scored by position (1st=100, 2nd=83, 3rd=67, 4th=50, 5th=33, 6th=17)
// Format: { item: { node: direction } } where direction is 1 (high rank = high node) or -1 (high rank = low node)
// HTML uses q16_ranking, q17_ranking, q18_ranking format
const RANKING_MAPPINGS = {
    // q16_ranking: Government priorities ranking (HTML field name)
    q16_ranking: {
        economic_growth: { MAT: 1 },       // Prioritizing growth → higher MAT
        equality: { MAT: -1, MOR: -1 },    // Prioritizing equality → lower MAT, more universal
        freedom: { PRO: -1, H: -1 },       // Prioritizing freedom → less procedural, less hierarchical
        security: { ZS: 1, CD: 1 },        // Prioritizing security → more zero-sum, more traditional
        environment: { CD: -1, ONT_S: 1 }, // Prioritizing environment → less traditional, more optimistic
        tradition: { CD: 1, CU: 1 }        // Prioritizing tradition → more traditional, more assimilationist
    },
    // q17_ranking: Trust sources ranking (HTML field name)
    q17_ranking: {
        scientists: { EPS: -1 },           // Trusting scientists → more empirical (lower EPS)
        personal: { EPS: 1 },              // Trusting personal experience → more intuitive
        religious: { CD: 1, EPS: 1 },      // Trusting religious leaders → traditional, intuitive
        community: { TRB: 1, CD: 1 },      // Trusting community → more tribal, traditional
        journalists: { EPS: -1 },          // Trusting journalists → more empirical
        intuition: { EPS: 1 }              // Trusting intuition → more intuitive (higher EPS)
    },
    // q18_ranking: Political identity ranking (HTML field name)
    q18_ranking: {
        national: { TRB: 1, CU: 1 },       // National identity → tribal, assimilationist
        ideological: { PF: 1 },            // Ideological identity → partisan
        religious: { CD: 1, TRB: 1 },      // Religious identity → traditional, tribal
        class: { MAT: -1 },                // Class identity → redistribution
        ethnic: { TRB: 1, MOR: 1 },        // Ethnic identity → tribal, particularist
        global: { MOR: -1, TRB: -1 }       // Global citizen → universal, non-tribal
    },
    // q91_ranking: Indignation ranking (what makes blood boil) - HTML field name
    q91_ranking: {
        elites: { MAT: -1, ZS: 1 },        // Angry at elites → redistribution, zero-sum
        criminals: { H: 1, CD: 1 },        // Angry at criminals → hierarchical, traditional
        woke: { CD: 1, CU: 1 },            // Angry at woke → traditional, assimilationist
        bigotry: { CD: -1, MOR: -1 },      // Angry at bigotry → progressive, universal
        incompetence: { PRO: -1 },         // Angry at government waste → rules-focused
        science: { EPS: -1 }               // Angry at science-denial → empirical
    },

    // q_rank_policy: Design A - Who should have say in policy (multi-loader)
    // Ranking 5 options: scientists, affected, elected, traditions, markets
    // Hits 8 nodes: EPS, H, PRO, CD, MAT, COM, ENG, ZS
    // Scoring: Rank 1 = strongest signal, Rank 5 = negative signal (inverted)
    q_rank_policy: {
        scientists: { EPS: -1, H: 1 },           // Trust researchers → empirical, accept institutional authority
        affected: { EPS: 1, H: -1, COM: 1 },     // Trust affected people → lived experience, bottom-up, inclusive
        elected: { PRO: 1, ENG: 1 },             // Trust elected officials → democratic process, civic engagement
        traditions: { CD: 1, EPS: 1, H: 1 },     // Trust elders/religious → traditional, intuition, hierarchy
        markets: { MAT: 1, ZS: 1 }               // Trust business → market solutions, competitive framing
    }
};

// Checkbox question mappings (multi-select)
// NOTE: Field name updated to match prism_dense_quiz_v2.html
const CHECKBOX_MAPPINGS = {
    // q72: Political activities - REMOVED: no HTML
    // q72: {
    //     // Each selected item adds to ENG score
    //     voted: { ENG: 15 },
    //     donated: { ENG: 20 },
    //     contacted: { ENG: 25 },
    //     attended: { ENG: 30, PF: 10 },     // Rally/protest also indicates partisanship
    //     volunteered: { ENG: 30 },
    //     posted: { ENG: 15, PF: 10 },       // Posting online also indicates partisanship
    //     discussed: { ENG: 10 },
    //     none: { ENG: -20 }                 // "None" reduces engagement score
    // },
    // Each field contains "1" if checked, processed separately below
    // See BINARY_CHECKBOX_MAPPINGS for individual field scoring
};

// Binary checkbox mappings - each field is checked ("1") or unchecked (absent)
// Systemic attributions → lower ONT_S, individual attributions → higher ONT_S
const BINARY_CHECKBOX_MAPPINGS = {           // Fundamental system flaws       // Structural inequalities        // Perverse incentives (fixable)    // Poor implementation (systems sound)          // Lack of resources (neutral)        // Individual choices            // Cultural attitudes          // Tech disruption (neutral)

    // q129: Immigrant Integration (select all that apply)
    // Measures CU (Cultural Uniformity) and NAT (Nationalism Type)
    // CIVIC items (english, civics, values, laws, work) → NAT ~40-50 (civic nationalism)
    // ETHNIC items (customs, loyalty, abandon) → NAT ~65-85 (ethnic nationalism)
    // none → NAT very low (cosmopolitan)
    q129_english: { CU: 5, CD: 3, NAT: 40 },       // Learn English (civic - language as tool)
    q129_civics: { CU: 8, CD: 5, NAT: 45 },        // Learn history/civics (civic nationalism)
    q129_values: { CU: 10, PRO: 5, NAT: 45 },      // Adhere to values (civic integration)
    q129_laws: { PRO: 10, NAT: 35 },               // Follow laws (universal expectation)
    q129_work: { MAT: 5, NAT: 40 },                // Work/contribute (civic contribution)
    q129_customs: { CU: 15, CD: 10, NAT: 65 },     // Adopt customs (cultural assimilation - ethnic lean)
    q129_loyalty: { CU: 20, PF: 5, NAT: 70 },      // Identify as American (stronger ethnic signal)
    q129_abandon: { CU: 25, CD: 15, NAT: 90 },     // Abandon previous culture (ethnic nationalism)
    q129_none: { CU: -30, NAT: 10 },               // No expectations (cosmopolitan)
};

// =============================================================================
// DEPRECATED: V13 PRIMARY/SECONDARY TRAIT WEIGHTING
// =============================================================================
// REPLACED BY: v157 Cross-Load Discount System (see QUESTION_NODE_COUNTS above)
//
// The old system manually designated one trait as "primary" per question.
// The new system automatically applies discounts based on node count:
//   - 1 node: 1.00 weight
//   - 2 nodes: 0.85 weight
//   - 3 nodes: 0.70 weight
//   - 4+ nodes: 0.55 weight
//
// This is more systematic and doesn't require manual trait designation.
// Keeping these constants for reference but they are NO LONGER USED.

const SECONDARY_TRAIT_WEIGHT = 0.5;  // DEPRECATED - not used in v157

// DEPRECATED - replaced by QUESTION_NODE_COUNTS + getCrossLoadDiscount()
const PRIMARY_TRAIT_CONFIG = {
  // 8-trait offender
  'q43': 'TRB',     // Tribalism is primary (political identity question)

  // 6-trait offenders
  'q69': 'CD',      // Culture/tradition is primary
  // q130, q132, q133 reduced to 3 nodes each — no longer 6-trait offenders

  // 5-trait offenders
  // 'q115': 'EPS',    // REMOVED from quiz

  // 4-trait offenders
  'q2': 'EPS',      // Epistemology is primary
  // 'q10': 'MAT',     // REMOVED: no HTML
  'q15': 'PRO',     // Proceduralism is primary
  'q37': 'NAT',     // Nationalism is primary
  'q38': 'ZS',      // Zero-sum is primary
  'q61': 'PRO',     // Proceduralism is primary (error tradeoff)
  'q62': 'CU',      // Cultural unity is primary (error tradeoff)

  // 3-trait offenders
  'q7': 'ONT_H',    // Human nature optimism is primary
  'q7b': 'H',       // Hierarchy is primary
  'q9a': 'CD',      // Culture/tradition is primary
  'q9b': 'CD',      // Culture/tradition is primary
  // 'q11': 'PRO',     // REMOVED from quiz
  'q13': 'H',       // Hierarchy is primary
  // 'q14': 'CD',      // REMOVED: no HTML
  'q29': 'ONT_S',   // System optimism is primary
  'q35': 'H',       // Hierarchy is primary
  'q53': 'COM',     // Compromise is primary
  'q59': 'PRO',     // Proceduralism is primary (error tradeoff)
  'q60': 'MAT',     // Materialism is primary (error tradeoff)
  'q63': 'PRO',     // Proceduralism is primary (error tradeoff)
  'q64': 'PRO',     // Proceduralism is primary (error tradeoff)
  // 'q68': 'AES',     // REMOVED from quiz
  'q71': 'H',       // Hierarchy is primary
  'q73': 'CD',      // Culture/tradition is primary
  'q75': 'CD',      // Culture/tradition is primary
  'q77': 'ONT_S',   // System optimism is primary
  'q94': 'AES',     // Aesthetics is primary (what changed minds)
  // 'q96': 'AES',     // REMOVED from quiz
  'q110': 'ONT_S',  // System optimism is primary
  // 'q134': 'CU',     // REMOVED from quiz
  'q_nat_1': 'NAT', // Nationalism is primary (over CU)
  // 'q135': 'AES',    // REMOVED from quiz
};

// =============================================================================
// L1 SCORING FUNCTIONS
// =============================================================================

function scoreL1Primitives(responses) {
    const l1Profile = {
        CAL: { score: 50, count: 0 },
        EC:  { score: 50, count: 0 },
        DEF: { score: 50, count: 0 },
        ERR: { score: 50, count: 0 }
    };

    // --- CALIBRATION (CAL) ---
    // Score based on accuracy of factual estimates
    let calSum = 0, calCount = 0;
    for (const [qId, actual] of Object.entries(CALIBRATION_FACTS)) {
        const estimate = parseFloat(responses[qId]);
        if (isNaN(estimate)) continue;

        // Get confidence for this question (if available)
        // HTML uses q87-q92 for confidence corresponding to q80-q86 estimates
        const confKeyMap = {
            // q80 has no confidence field (tax rate slider calibration)
            q81: 'q87',  // violent prisoners confidence
            q82: 'q88',  // foreign-born confidence
            q83: 'q89',  // wealth top 1% confidence
            q84: 'q90',  // climate consensus confidence
            q85: 'q91',  // renewables confidence
            q86: 'q92'   // food insecurity confidence
        };
        const confKey = confKeyMap[qId] || (qId + '_conf');
        const confidence = responses[confKey] || 'medium';
        const confWeight = CONFIDENCE_WEIGHTS[confidence] || 0.8;

        // Calculate error: 0 = perfect, 100 = maximally wrong
        const error = Math.abs(estimate - actual);
        // Convert to accuracy score: 100 = perfect, 0 = off by 50+ points
        const accuracy = Math.max(0, 100 - (error * 2));

        // Apply confidence-calibrated weighting:
        // This rewards CALIBRATED confidence (matching confidence to accuracy)
        // Four quadrants:
        //   Accurate + Confident = well calibrated (reward)
        //   Inaccurate + Low confidence = knows limitations (neutral)
        //   Inaccurate + Confident = Dunning-Kruger (penalize)
        //   Accurate + Low confidence = underconfident/lucky (slight reduction)
        const isAccurate = accuracy >= 50;
        const isConfident = confidence === 'high' || confidence === 'medium';

        let calibrationMultiplier;
        if (isAccurate && isConfident) {
            // Accurate AND confident - well calibrated
            calibrationMultiplier = confWeight;  // 0.8-1.2
        } else if (!isAccurate && !isConfident) {
            // Inaccurate BUT admitted low confidence - knows limitations
            calibrationMultiplier = 1.0;  // No penalty
        } else if (!isAccurate && isConfident) {
            // Inaccurate AND confident - poorly calibrated (Dunning-Kruger)
            calibrationMultiplier = 0.5;  // Significant penalty
        } else {
            // Accurate BUT low confidence - underconfident or lucky
            calibrationMultiplier = 0.75;  // Slight reduction
        }

        const weightedAccuracy = Math.min(100, accuracy * calibrationMultiplier);

        calSum += weightedAccuracy;
        calCount++;
    }
    if (calCount > 0) {
        l1Profile.CAL.score = Math.round(calSum / calCount);
        l1Profile.CAL.count = calCount;
    }

    // --- EPISTEMIC CURIOSITY (EC) ---
    // From ec1 and ec4
    let ecSum = 0, ecCount = 0;
    if (responses.q69) {
        const ecScores = { tradition: 25, novelty: 85, tribal: 20, practical: 50 };
        ecSum += ecScores[responses.q69] || 50;
        ecCount++;
    }
    if (responses.q70) {
        ecSum += responses.q70 === 'novel' ? 75 : 25;
        ecCount++;
    }
    if (ecCount > 0) {
        l1Profile.EC.score = Math.round(ecSum / ecCount);
        l1Profile.EC.count = ecCount;
    }

    // --- DEFERENCE (DEF) ---
    // From d3 (mask mandate)
    if (responses.q71) {
        const defScores = { full_support: 85, accept: 70, mixed: 50, resent: 30, oppose: 15 };
        l1Profile.DEF.score = defScores[responses.q71] || 50;
        l1Profile.DEF.count = 1;
    }

    // --- ERROR PREFERENCE (ERR) ---
    // Aggregate from q59-q64 (was err1-err6): fp preference = high, fn preference = low
    let errSum = 0, errCount = 0;
    // Map old err* indices to new q* field names
    const errFieldMap = { 1: 'q59', 2: 'q60', 3: 'q61', 4: 'q62', 5: 'q63', 6: 'q64' };
    for (let i = 1; i <= 6; i++) {
        const qId = errFieldMap[i];
        const answer = responses[qId];
        if (!answer) continue;

        // Map to score: fp-leaning = high (70-90), eq = 50, fn-leaning = low (10-30)
        let errScore = 50;
        if (answer === 'eq') {
            errScore = 50;
        } else if (['fp', 'disinfo', 'deport_legal', 'too_slow', 'disenfranchise'].includes(answer)) {
            // These are "Type I error" preferences (stricter, more false positives)
            errScore = 75;
            // Adjust by ratio if available (HTML uses err*_ratio pattern)
            const ratio = parseInt(responses[`err${i}_ratio`]) || 1;
            errScore += ratio * 3; // Higher ratio = more extreme preference
        } else {
            // Type II error preference (looser, more false negatives)
            errScore = 25;
            const ratio = parseInt(responses[`err${i}_ratio`]) || 1;
            errScore -= ratio * 3;
        }
        errSum += Math.max(0, Math.min(100, errScore));
        errCount++;
    }
    if (errCount > 0) {
        l1Profile.ERR.score = Math.round(errSum / errCount);
        l1Profile.ERR.count = errCount;
    }

    return l1Profile;
}

// =============================================================================
// L3 SCORING FUNCTION (with L1 influence)
// =============================================================================

function scoreQuizToL3Profile(responses) {
    // Initialize accumulators for each node
    const accumulators = {};
    for (const node of Object.keys(L3_NODES)) {
        accumulators[node] = { sum: 0, count: 0 };
    }

    // Process slider questions (original mappings)
    // v157: Uses cross-load discount instead of per-question weights
    for (const [qId, mappings] of Object.entries(SLIDER_MAPPINGS)) {
        const value = parseFloat(responses[qId]);
        if (isNaN(value)) continue;

        // Get cross-load discount based on how many nodes this question feeds
        const crossLoadWeight = getCrossLoadDiscount(qId);

        for (const mapping of mappings) {
            const [node, _legacyWeight, invert, transform] = mapping;
            let score = invert ? (100 - value) : value;

            // Special non-linear normalization for skewed questions
            // q56 (10 lives domestic vs 100 abroad): sqrt normalization
            // This maps 50 → ~70.7, reflecting that choosing 50 is already quite nationalistic
            if (transform === 'sqrt_normalize') {
                score = Math.sqrt(score / 100) * 100;
            }

            // v157: All questions use equal base weight (1.0) * cross-load discount
            accumulators[node].sum += score * crossLoadWeight;
            accumulators[node].count += crossLoadWeight;
        }
    }

    // Process ADDITIONAL slider questions (previously unused)
    // v157: Uses cross-load discount instead of per-question weights
    for (const [qId, mappings] of Object.entries(ADDITIONAL_SLIDER_MAPPINGS)) {
        // Special handling for parental warmth: skip if parent not present
        if (qId === 'q79a' && responses['q46_mom_present'] === 'absent') continue;
        if (qId === 'q79b' && responses['q46_dad_present'] === 'absent') continue;

        const value = parseFloat(responses[qId]);
        if (isNaN(value)) continue;

        // Get cross-load discount based on how many nodes this question feeds
        const crossLoadWeight = getCrossLoadDiscount(qId);

        for (const [node, _legacyWeight, invert] of mappings) {
            const score = invert ? (100 - value) : value;
            // v157: All questions use equal base weight (1.0) * cross-load discount
            accumulators[node].sum += score * crossLoadWeight;
            accumulators[node].count += crossLoadWeight;
        }
    }

    // Process multiple choice questions
    // v157: Uses cross-load discount instead of primary/secondary trait weighting
    for (const [qId, options] of Object.entries(MC_MAPPINGS)) {
        const answer = responses[qId];
        if (!answer || !options[answer]) continue;

        // Get cross-load discount based on how many nodes this question feeds
        const crossLoadWeight = getCrossLoadDiscount(qId);

        for (const [node, score] of Object.entries(options[answer])) {
            if (accumulators[node]) {
                // v157: All traits get same weight (cross-load discount)
                accumulators[node].sum += score * crossLoadWeight;
                accumulators[node].count += crossLoadWeight;
            }
        }
    }

    // Process error tradeoff questions (err1-err6) with RATIO INTENSITY SCALING
    // v157: Uses cross-load discount instead of primary/secondary trait weighting
    // Map q* field names to err* ratio field names (HTML uses err1_ratio, etc.)
    const errRatioFieldMap = { 'q59': 'err1_ratio', 'q60': 'err2_ratio', 'q61': 'err3_ratio',
                               'q62': 'err4_ratio', 'q63': 'err5_ratio', 'q64': 'err6_ratio' };
    for (const [qId, optionMap] of Object.entries(ERROR_TRADEOFF_MAPPINGS)) {
        const answer = responses[qId];
        if (!answer || !optionMap[answer]) continue;

        // Get ratio value (0-7) from the follow-up slider
        // HTML uses err*_ratio naming, so we need to map q* to err*_ratio
        const ratioKey = errRatioFieldMap[qId] || `${qId}_ratio`;
        const rawRatio = responses[ratioKey];

        // Determine if this is an "equal" type answer (no ratio applies)
        const isEqualAnswer = answer === 'eq' || answer === 'both' || answer === 'equal';

        // Default ratio to 1 if non-equal answer but ratio missing
        // Use 0 for equal answers (no intensity scaling)
        const effectiveRatio = isEqualAnswer ? 0 : (parseInt(rawRatio) || 1);

        // Calculate intensity factor: 1.0 at ratio=0, up to 2.0 at ratio=7
        // ENHANCED v155: Extreme ratios (1:50+) now push scores 100% further from neutral
        const intensityFactor = 1 + (effectiveRatio / 7);

        // v157: Get cross-load discount based on how many nodes this question feeds
        const crossLoadWeight = getCrossLoadDiscount(qId);

        for (const [node, baseScore] of Object.entries(optionMap[answer])) {
            if (!accumulators[node]) continue;

            // Scale deviation from neutral (50) by intensity factor
            const deviation = baseScore - 50;
            const scaledDeviation = deviation * intensityFactor;
            const scaledScore = 50 + scaledDeviation;

            // Clamp to valid range
            const finalScore = Math.max(0, Math.min(100, scaledScore));

            // v157: All traits get same weight (cross-load discount)
            accumulators[node].sum += finalScore * crossLoadWeight;
            accumulators[node].count += crossLoadWeight;
        }
    }

    // Process allocation questions (q39a-d, q58a-d)
    for (const [prefix, config] of Object.entries(ALLOCATION_INFLUENCES)) {
        // Calculate weighted sum based on allocation percentages
        let weightedSum = 0;
        let hasData = false;
        for (const [suffix, weight] of Object.entries(config.weights)) {
            const val = parseFloat(responses[`${prefix}${suffix}`]); // e.g. q39a, q39b, q58a, q58b
            if (!isNaN(val)) {
                weightedSum += val * weight;
                hasData = true;
            }
        }
        if (hasData) {
            // Convert weighted sum to position (centered at 50)
            const position = 50 + (weightedSum / 2); // Scale to reasonable range
            for (const [node, influence] of Object.entries(config.nodes)) {
                if (accumulators[node]) {
                    const score = influence > 0 ? position : (100 - position);
                    accumulators[node].sum += score * Math.abs(influence);
                    accumulators[node].count += Math.abs(influence);
                }
            }
        }
    }

    // Process ranking questions (comma-separated ordered values)
    for (const [qId, itemMappings] of Object.entries(RANKING_MAPPINGS)) {
        const rankStr = responses[qId];
        if (!rankStr || typeof rankStr !== 'string') continue;

        const items = rankStr.split(',').map(s => s.trim()).filter(s => s);
        if (items.length === 0) continue;

        // Score each item by position: 1st gets highest, last gets lowest
        const numItems = items.length;
        items.forEach((item, index) => {
            const positionScore = 100 - (index / (numItems - 1)) * 100; // 1st=100, last=0
            const mapping = itemMappings[item];
            if (!mapping) return;

            for (const [node, direction] of Object.entries(mapping)) {
                if (accumulators[node]) {
                    // If direction is positive, high rank = high score
                    // If direction is negative, high rank = low score (invert)
                    const score = direction > 0 ? positionScore : (100 - positionScore);
                    accumulators[node].sum += score * 0.3; // Weight rankings at 0.3
                    accumulators[node].count += 0.3;
                }
            }
        });
    }

    // Process checkbox questions (multi-select, stored as array or comma-separated)
    for (const [qId, itemMappings] of Object.entries(CHECKBOX_MAPPINGS)) {
        let selectedItems = responses[qId];
        if (!selectedItems) continue;

        // Handle both array and comma-separated string
        if (typeof selectedItems === 'string') {
            selectedItems = selectedItems.split(',').map(s => s.trim()).filter(s => s);
        }
        if (!Array.isArray(selectedItems)) continue;

        // Apply each selected item's mapping
        for (const item of selectedItems) {
            const mapping = itemMappings[item];
            if (!mapping) continue;

            for (const [node, score] of Object.entries(mapping)) {
                if (accumulators[node]) {
                    // Checkboxes add raw scores (not averaged)
                    accumulators[node].sum += score;
                    accumulators[node].count += Math.abs(score) / 50; // Normalize weight
                }
            }
        }
    }

    // Process binary checkboxes (individual fields with value "1" if checked)
    // Handle both "1" string, 1 number, and ["1"] array formats
    for (const [fieldName, mapping] of Object.entries(BINARY_CHECKBOX_MAPPINGS)) {
        const val = responses[fieldName];
        const isChecked = val === '1' || val === 1 ||
                          (Array.isArray(val) && (val.includes('1') || val.includes(1)));
        if (isChecked) {
            for (const [node, score] of Object.entries(mapping)) {
                if (accumulators[node]) {
                    accumulators[node].sum += score;
                    accumulators[node].count += Math.abs(score) / 50 || 0.1;
                }
            }
        }
    }

    // ==========================================================================
    // NEW QUESTIONS: CULTURE_POS and ENGAGE_STYLE (v156.1)
    // ==========================================================================

    // CULTURE_POS: Direct cultural position (7-point slider)
    // Scale: 1=strongly traditional → 7=strongly progressive
    // Maps to CD (Cultural Defense): 0=progressive, 100=traditional
    // v157: Uses equal weight (1.0) like all other single-node questions
    if (responses.CULTURE_POS !== undefined) {
        const cultureVal = parseFloat(responses.CULTURE_POS);
        if (!isNaN(cultureVal) && cultureVal >= 1 && cultureVal <= 7) {
            // Convert 1-7 to CD score: 1→100 (traditional), 7→0 (progressive)
            const cdScore = ((7 - cultureVal) / 6) * 100;
            // v157: Equal weight (was 1.5, now 1.0 for consistency)
            accumulators.CD.sum += cdScore * 1.0;
            accumulators.CD.count += 1.0;
        }
    }

    // ENGAGE_STYLE: Political engagement motivation (rankTop2)
    // Values: MOVEMENT, POLICY, RESISTANCE, DUTY, INDEPENDENCE
    // Helps distinguish engagement patterns and tribal vs independent orientation
    if (responses.ENGAGE_STYLE !== undefined) {
        let engageStyles = responses.ENGAGE_STYLE;
        // Handle both array and comma-separated string
        if (typeof engageStyles === 'string') {
            engageStyles = engageStyles.split(',').map(s => s.trim()).filter(s => s);
        }
        if (Array.isArray(engageStyles)) {
            const stylePatterns = {
                'MOVEMENT': { ENG: 85, TRB: 65, PF: 55 },    // Movement-focused = high engagement, more tribal
                'POLICY': { ENG: 70, TRB: 30, PF: 30 },      // Policy-focused = moderate, independent
                'RESISTANCE': { ENG: 80, TRB: 60, PF: 50 },  // Resistance = high engagement, somewhat tribal
                'DUTY': { ENG: 55, TRB: 40, PF: 35 },        // Duty = moderate engagement, less tribal
                'INDEPENDENCE': { ENG: 65, TRB: 20, PF: 15 } // Independence = low tribal, low partisan
            };

            // Weight decreases by rank: first choice = 1.0, second = 0.6
            engageStyles.slice(0, 2).forEach((style, index) => {
                const pattern = stylePatterns[style];
                if (pattern) {
                    const weight = index === 0 ? 1.0 : 0.6;
                    for (const [node, score] of Object.entries(pattern)) {
                        if (accumulators[node]) {
                            accumulators[node].sum += score * weight;
                            accumulators[node].count += weight;
                        }
                    }
                }
            });
        }
    }

    // ==========================================================================
    // INTERSECTION/UNION SIGNAL CALCULATIONS
    // These extract additional signal from patterns across questions
    // ==========================================================================

    // --- Signal 1: In-Group/Out-Group Perception Asymmetry ---
    // Asymmetric perception of parties indicates tribalism
    // HTML fields: q65a (Dems want best), q65b (Reps want best),
    //              q65c (Dems share values), q65d (Reps share values)
    const demPerception = ((parseFloat(responses.q65a) || 50) +
                           (parseFloat(responses.q65c) || 50)) / 2;
    const repPerception = ((parseFloat(responses.q65b) || 50) +
                           (parseFloat(responses.q65d) || 50)) / 2;

    // Only process if at least one perception question was answered
    if (responses.q65a || responses.q65b) {
        const asymmetry = Math.abs(demPerception - repPerception);

        if (asymmetry > 30) {
            // Significant asymmetry → tribal (high TRB)
            // To contribute score X with weight W: sum += X * W, count += W
            const tribalScore = 70 + (asymmetry - 30) * 0.5;  // 70-90 range
            accumulators.TRB.sum += tribalScore * 0.5;
            accumulators.TRB.count += 0.5;
        } else if (asymmetry < 20) {
            // Symmetric perception (whether high or low) → NOT tribal (low TRB)
            // Score of 30 (universalist) with weight 0.5
            accumulators.TRB.sum += 30 * 0.5;  // = 15
            accumulators.TRB.count += 0.5;
        }

        // Symmetric low = cynical about humans, not tribal
        if (demPerception < 40 && repPerception < 40 && asymmetry < 15) {
            // Score of 25 (low optimism) with weight 0.5
            accumulators.ONT_H.sum += 25 * 0.5;  // = 12.5
            accumulators.ONT_H.count += 0.5;
        }
    }

    // --- Signal 2: Conjoint Choice Decisiveness ---
    // Same choice in both primary and follow-up = decisive
    // Different choice = sensitive to parameters = pragmatic
    // Note: q4/q4b removed (kept q4b only), q5/q5b removed, q8/q8b removed
    const conjointPairs = [['q6','q6b'], ['q7','q7b']];  // q3/q3b removed - no HTML

    let consistentCount = 0, answeredPairs = 0;
    conjointPairs.forEach(([primary, followup]) => {
        if (responses[primary] && responses[followup]) {
            answeredPairs++;
            if (responses[primary] === responses[followup]) {
                consistentCount++;
            }
        }
    });

    // FIX: Changed from >= 4 to >= 2 since only 2 conjoint pairs remain
    if (answeredPairs >= 2) {
        const decisiveness = consistentCount / answeredPairs;

        if (decisiveness >= 0.75) {
            // Very decisive - strong stable preferences
            // Score of 30 (principled) with weight 0.4
            accumulators.COM.sum += 30 * 0.4;
            accumulators.COM.count += 0.4;
            // Score of 70 (engaged) with weight 0.3
            accumulators.ENG.sum += 70 * 0.3;
            accumulators.ENG.count += 0.3;
        } else if (decisiveness <= 0.35) {
            // Very sensitive to parameters → pragmatic
            // Score of 70 (pragmatic) with weight 0.4
            accumulators.COM.sum += 70 * 0.4;
            accumulators.COM.count += 0.4;
        }
    }

    // --- Signal 3: Attribution Style Consistency ---
    // Do people attribute opponent disagreement and inequality to same locus?
    // HTML fields for opponent attribution: q39a (different values), q39b (misled),
    //                                       q39c (self-interest), q39d (bad motives)
    // HTML fields for inequality attribution: q58a (effort), q58b (family),
    //                                         q58c (discrimination), q58d (luck)
    const opponentComplete = responses.q39a !== undefined || responses.q39d !== undefined;
    const inequalityComplete = responses.q58a !== undefined;

    if (opponentComplete && inequalityComplete) {
        // Internal locus: outcomes due to individual choices/character
        const opponentInternal = (parseFloat(responses.q39a) || 0) +  // different values
                                 (parseFloat(responses.q39c) || 0) +  // self-interest
                                 (parseFloat(responses.q39d) || 0);   // bad motives
        const inequalityInternal = (parseFloat(responses.q58a) || 0) +  // effort
                                   (parseFloat(responses.q58b) || 0);   // family

        const bothInternal = opponentInternal > 55 && inequalityInternal > 55;

        // External locus: outcomes due to systemic/environmental factors
        const opponentExternal = parseFloat(responses.q39b) || 0;  // misled
        const inequalityExternal = (parseFloat(responses.q58c) || 0) +  // discrimination
                                   (parseFloat(responses.q58d) || 0);   // luck
        const bothExternal = opponentExternal > 35 && inequalityExternal > 55;

        if (bothInternal) {
            // Consistent internal attribution → hierarchical, free-market worldview
            // Score of 65 (high) with weight 0.4
            accumulators.H.sum += 65 * 0.4;
            accumulators.H.count += 0.4;
            accumulators.MAT.sum += 65 * 0.4;
            accumulators.MAT.count += 0.4;
        } else if (bothExternal) {
            // Consistent external attribution → egalitarian, redistributive worldview
            // Score of 35 (low) with weight 0.4
            accumulators.H.sum += 35 * 0.4;
            accumulators.H.count += 0.4;
            accumulators.MAT.sum += 35 * 0.4;
            accumulators.MAT.count += 0.4;
        } else {
            // Asymmetric attribution → possible motivated reasoning
            // Score of 60 (moderately tribal) with weight 0.2 (reduced from 0.3)
            accumulators.TRB.sum += 60 * 0.2;
            accumulators.TRB.count += 0.2;
        }
    }

    // --- Signal 4: Evil Attribution Intensity ---
    // Any evil/bad motive attribution is notable; >30% is extreme
    // HTML field: q39d (bad motives/genuinely bad intentions)
    const evilPct = parseFloat(responses.q39d) || 0;

    if (evilPct > 15) {
        // Significant evil attribution (>15%) - push TRB high
        // Weight scales with evil percentage (15-50% → 0-0.35 weight)
        const weight = Math.min(evilPct - 15, 35) / 100;

        // Zero-Sum score: 70 (high) weighted by evil%
        accumulators.ZS.sum += 70 * weight;
        accumulators.ZS.count += weight;

        // Tribalism score: 70 (high) weighted by evil% (reduced from 75)
        accumulators.TRB.sum += 70 * weight;
        accumulators.TRB.count += weight;

        // Human Optimism score: 30 (low) weighted by evil%
        accumulators.ONT_H.sum += 30 * weight;
        accumulators.ONT_H.count += weight;
    } else if (evilPct <= 10 && responses.q39d !== undefined) {
        // LOW evil attribution - universalist, not tribal
        // Score of 35 (low tribal) with weight 0.3
        accumulators.TRB.sum += 35 * 0.3;
        accumulators.TRB.count += 0.3;
        // Score of 70 (high human optimism) with weight 0.2
        accumulators.ONT_H.sum += 70 * 0.2;
        accumulators.ONT_H.count += 0.2;
    }

    if (evilPct > 30) {
        // Extreme evil attribution → strong partisan identity
        // Score of 70 (high partisan) with weight 0.3 (reduced from 0.4)
        accumulators.PF.sum += 70 * 0.3;
        accumulators.PF.count += 0.3;
    }

    // === SCORE L1 PRIMITIVES ===
    const l1Profile = scoreL1Primitives(responses);

    // --- Signal 5: Engagement-Calibration Interaction ---
    // High engagement + low calibration suggests tribal epistemics
    // Low engagement + high calibration suggests informed cynicism
    // NOTE: q72 (political activities checkbox) removed - no HTML
    // Engagement score defaults to 50 since q72 no longer exists
    let engScore = 50;  // Default (q72 removed)

    const calScore = l1Profile.CAL.score;

    if (engScore > 65 && calScore < 40) {
        // High engagement, low calibration → tribal epistemics
        // Score of 75 (tribal) with weight 0.5
        accumulators.TRB.sum += 75 * 0.5;
        accumulators.TRB.count += 0.5;
        // Score of 70 (intuitive) with weight 0.4
        accumulators.EPS.sum += 70 * 0.4;
        accumulators.EPS.count += 0.4;
    }

    if (engScore < 35 && calScore > 65) {
        // Low engagement, high calibration → informed but cynical about system
        // Score of 25 (pessimistic about system) with weight 0.5
        accumulators.ONT_S.sum += 25 * 0.5;
        accumulators.ONT_S.count += 0.5;
    }


    // =============================================================================
    // BLAME ATTRIBUTION PROCESSING (q43a-e)
    // "When bad things happen in politics/economy, what portion of blame..."
    // This question was changed from group identity (MC) to blame allocation in quiz v7
    // =============================================================================

    const hasBlameAttribution = responses.q43a !== undefined ||
                                responses.q43b !== undefined ||
                                responses.q43c !== undefined;

    if (hasBlameAttribution) {
        // Parse all values (default to 0 if missing)
        const complexForces = parseFloat(responses.q43a) || 0;  // Complex forces nobody controls
        const incompetent = parseFloat(responses.q43b) || 0;    // Powerful people - incompetent
        const selfish = parseFloat(responses.q43c) || 0;        // Powerful people - selfish
        const individual = parseFloat(responses.q43d) || 0;     // Ordinary people's choices
        const luck = parseFloat(responses.q43e) || 0;           // Random chance / bad luck

        // === DERIVED SIGNALS ===
        const eliteFocus = incompetent + selfish;           // Total elite attribution (0-100)
        const uncontrollable = complexForces + luck;        // Things nobody controls (0-100)
        const controllable = incompetent + selfish + individual;  // Things someone controls (0-100)

        // === SIGNAL 1: Zero-Sum Thinking (ZS) ===
        // Elite attribution suggests zero-sum worldview (elites gain at others' expense)
        // Individual attribution suggests positive-sum (everyone can succeed)
        const zsDeviation = (eliteFocus * 0.6) - (individual * 0.8) - (complexForces * 0.2);
        const zsScore = Math.max(0, Math.min(100, 50 + zsDeviation * 0.5));
        accumulators.ZS.sum += zsScore * 0.55;
        accumulators.ZS.count += 0.55;

        // === SIGNAL 2: Hierarchy Acceptance (H) ===
        // Individual attribution = believes in meritocracy = accepts hierarchy
        // Systemic attribution = believes in structural factors = egalitarian
        const hDeviation = individual - (complexForces + luck) * 0.5;
        const hScore = Math.max(0, Math.min(100, 50 + hDeviation * 0.6));
        accumulators.H.sum += hScore * 0.45;
        accumulators.H.count += 0.45;

        // === SIGNAL 3: Human Nature Optimism (ONT_H) ===
        // Incompetence attribution = Hanlon's Razor = forgiving view
        // Selfishness attribution = cynical view
        const ontHDeviation = incompetent - selfish;
        const ontHScore = Math.max(0, Math.min(100, 50 + ontHDeviation * 0.5));
        accumulators.ONT_H.sum += ontHScore * 0.5;
        accumulators.ONT_H.count += 0.5;

        // === SIGNAL 4: System Optimism (ONT_S) ===
        // Controllable attribution = problems can be fixed = optimistic
        // Uncontrollable attribution = fatalistic = pessimistic
        const ontSDeviation = controllable - uncontrollable;
        const ontSScore = Math.max(0, Math.min(100, 50 + ontSDeviation * 0.35));
        accumulators.ONT_S.sum += ontSScore * 0.4;
        accumulators.ONT_S.count += 0.4;

        // === SIGNAL 5: Tribalism (TRB) - Conditional ===
        // High selfish attribution + low individual = us-vs-them worldview
        if (selfish > 25 && individual < 15) {
            const trbScore = 50 + (selfish - individual) * 0.5;
            accumulators.TRB.sum += Math.max(0, Math.min(100, trbScore)) * 0.3;
            accumulators.TRB.count += 0.3;
        } else if (selfish < 15 && individual > 25) {
            const trbScore = 50 - (individual - selfish) * 0.4;
            accumulators.TRB.sum += Math.max(0, Math.min(100, trbScore)) * 0.25;
            accumulators.TRB.count += 0.25;
        }

        // === SIGNAL 6: Material Orientation (MAT) - Conditional ===
        // Individual attribution correlates with free-market beliefs
        if (individual > 20) {
            const matScore = 50 + individual * 0.5;
            accumulators.MAT.sum += Math.max(0, Math.min(100, matScore)) * 0.3;
            accumulators.MAT.count += 0.3;
        } else if (eliteFocus > 50 && individual < 10) {
            const matScore = 50 - (eliteFocus - 50) * 0.3;
            accumulators.MAT.sum += Math.max(0, Math.min(100, matScore)) * 0.25;
            accumulators.MAT.count += 0.25;
        }
    }

    // === BLAME + OPPONENT ATTRIBUTION CONSISTENCY ===
    if (hasBlameAttribution && (responses.q39c !== undefined || responses.q39d !== undefined)) {
        const selfishElites = parseFloat(responses.q43c) || 0;
        const opponentSelfInterest = parseFloat(responses.q39c) || 0;
        const opponentMalice = parseFloat(responses.q39d) || 0;

        const blameCynicism = selfishElites > 30;
        const opponentCynicism = (opponentSelfInterest + opponentMalice) > 40;

        if (blameCynicism && opponentCynicism) {
            // Consistent cynical worldview
            accumulators.ZS.sum += 70 * 0.25;
            accumulators.ZS.count += 0.25;
            accumulators.ONT_H.sum += 30 * 0.2;
            accumulators.ONT_H.count += 0.2;
        } else if (!blameCynicism && !opponentCynicism) {
            // Consistent charitable worldview
            accumulators.ZS.sum += 35 * 0.2;
            accumulators.ZS.count += 0.2;
            accumulators.ONT_H.sum += 65 * 0.15;
            accumulators.ONT_H.count += 0.15;
        }
    }


    // =============================================================================
    // SALIENCE SIGNALS: Process max-diff and importance questions
    // This replaces the old extremity-based salience with direct measurement
    // =============================================================================

    // Max-diff mappings: which L3 nodes each choice corresponds to
    const MAXDIFF_NODE_MAPPINGS = {
        // md1: Economic vs Cultural Trade-offs
        md1: {
            economic_inequality: 'MAT',
            cultural_traditions: 'CD',
            religious_freedom: 'MOR',
            tribal_loyalty: 'TRB',
            hierarchy_order: 'H'
        },
        // md2: Governance and Identity
        md2: {
            procedural_rules: 'PRO',
            civic_engagement: 'ENG',
            national_identity: 'CU',
            partisan_victory: 'PF',
            power_distribution: 'H'
        },
        // md3: Epistemics and Worldview
        md3: {
            empirical_evidence: 'EPS',
            moral_intuition: 'MOR',
            system_optimism: 'ONT_S',
            human_nature: 'ONT_H',
            zero_sum: 'ZS'
        },
        // md4: Social and Moral Priorities
        md4: {
            universal_rights: 'MOR',
            family_community: 'MOR',
            cultural_assimilation: 'CU',
            partisan_fusion: 'PF',
            compromise_bipartisan: 'COM'
        },
        // md5: Political Aesthetics and Process
        md5: {
            inspirational_vision: 'AES',
            technical_policy: 'EPS',
            outcome_results: 'PRO',
            principled_consistency: 'PRO',
            coalition_building: 'COM'
        },
        // md6: Core Identity Trade-offs
        md6: {
            economic_views: 'MAT',
            cultural_views: 'CD',
            party_affiliation: 'PF',
            moral_framework: 'MOR',
            governance_approach: 'PRO'
        }
    };

    // Direct importance mappings: toggle_field → L3 node(s)
    // These are binary toggles on existing questions ("This matters a lot to me")
    const IMPORTANCE_MAPPINGS = {
        imp_q1b: ['ENG'],           // Political consumption → Engagement
        imp_culture: ['CD'],        // Cultural position slider → Cultural Disposition
        imp_econ: ['MAT'],          // Economic conjoint → Material Orientation
        imp_aes: ['AES'],           // Communication style → Aesthetics
        imp_ont: ['ONT_H', 'ONT_S'], // Human progress → Ontological views
        imp_pro: ['PRO'],           // Governance conjoint → Process Orientation
        imp_rules: ['PRO', 'H'],    // Workplace rules → Process & Hierarchy
        imp_opponents: ['ZS', 'TRB'], // Opponent motives → Zero-Sum & Tribalism
        imp_progress: ['ONT_S'],    // Social progress → Ontological Social
        imp_immigration: ['NAT', 'CU', 'CD'] // School advice/immigration → National, Cultural Unity, AND Cultural Disposition
    };

    // Initialize salience accumulators for each node
    const salienceSignals = {};
    for (const node of Object.keys(L3_NODES)) {
        salienceSignals[node] = {
            maxdiffMost: 0,    // Count of times selected as "most important"
            maxdiffLeast: 0,   // Count of times selected as "least important"
            directImportance: null,  // Direct 1-7 rating if available
            totalMaxdiffAppearances: 0  // How many times this node appeared in max-diff sets
        };
    }

    // Process max-diff responses
    for (const [setId, nodeMapping] of Object.entries(MAXDIFF_NODE_MAPPINGS)) {
        const mostChoice = responses[`${setId}_most`];
        const leastChoice = responses[`${setId}_least`];

        // Count appearances for each node in this set
        for (const node of Object.values(nodeMapping)) {
            if (salienceSignals[node]) {
                salienceSignals[node].totalMaxdiffAppearances++;
            }
        }

        // Record most/least selections
        if (mostChoice && nodeMapping[mostChoice]) {
            const node = nodeMapping[mostChoice];
            if (salienceSignals[node]) {
                salienceSignals[node].maxdiffMost++;
            }
        }
        if (leastChoice && nodeMapping[leastChoice]) {
            const node = nodeMapping[leastChoice];
            if (salienceSignals[node]) {
                salienceSignals[node].maxdiffLeast++;
            }
        }
    }

    // Process importance toggle signals (binary: checked = high importance)
    // Toggles are checkboxes with value="1" when checked
    for (const [qId, nodes] of Object.entries(IMPORTANCE_MAPPINGS)) {
        const value = responses[qId];
        // Checkbox is checked if value is "1", "true", or truthy
        const isChecked = value === '1' || value === 'true' || value === true || value === 1;

        if (isChecked) {
            // Checked toggle = strong signal that this topic matters (equivalent to 7 on old scale)
            for (const node of nodes) {
                if (salienceSignals[node]) {
                    salienceSignals[node].directImportance = 7;
                }
            }
        }
        // Unchecked toggle = no signal (leave as null, don't penalize)
        // This is intentional: not checking doesn't mean "doesn't matter"
        // it just means the user didn't affirm high importance
    }

    // =============================================================================
    // DERIVED SALIENCE SIGNALS: Infer salience from existing question responses
    // These fill gaps where importance toggles are missing from HTML
    // =============================================================================

    // ENG (Engagement): q1 (political identity centrality) IS the engagement salience signal
    // High q1 = politics is central to identity = high engagement salience
    const q1Value = parseFloat(responses.q1);
    if (!isNaN(q1Value) && salienceSignals.ENG && salienceSignals.ENG.directImportance === null) {
        // Convert 0-100 scale to 1-7 importance scale
        // 0-20 = low (1-2), 20-50 = moderate-low (2-4), 50-75 = moderate-high (4-6), 75-100 = high (6-7)
        const engImportance = q1Value < 20 ? 2 :
                              q1Value < 40 ? 3 :
                              q1Value < 60 ? 4 :
                              q1Value < 75 ? 5 :
                              q1Value < 90 ? 6 : 7;
        salienceSignals.ENG.directImportance = engImportance;
    }

    // AES (Aesthetics): Engagement with leadership/communication questions indicates salience
    // If user answered 3+ of q130/q131/q132/q133, they care about political aesthetics
    const aesQuestions = ['q130', 'q131', 'q132', 'q133'];
    const aesAnswered = aesQuestions.filter(q => responses[q] && responses[q] !== '').length;
    if (aesAnswered >= 3 && salienceSignals.AES && salienceSignals.AES.directImportance === null) {
        // Engaged with leadership aesthetics section = above-moderate salience
        // Scale: 3 questions = 5, 4 questions = 6 (on 1-7 scale)
        salienceSignals.AES.directImportance = aesAnswered >= 4 ? 6 : 5;
    }

    // MAT (Material): Extreme positions on economic questions indicate salience
    const q67Value = parseFloat(responses.q67); // Wealth/effort relationship
    if (!isNaN(q67Value) && salienceSignals.MAT && salienceSignals.MAT.directImportance === null) {
        // Extreme view (< 30 or > 70) = cares about economics
        if (q67Value < 30 || q67Value > 70) {
            salienceSignals.MAT.directImportance = 5;
        } else if (q67Value < 40 || q67Value > 60) {
            // Moderately strong view = moderate salience
            salienceSignals.MAT.directImportance = 4;
        }
    }

    // Build profile object compatible with archetype matcher
    const profile = {};
    for (const [node, acc] of Object.entries(accumulators)) {
        // Raw position from averaging
        const rawPosition = acc.count > 0 ? acc.sum / acc.count : 50;

        // AMPLIFY VARIANCE: Push positions away from center to counteract
        // the central tendency caused by averaging multiple questions.
        // Without this, most profiles cluster around 45-55 regardless of actual views.
        //
        // Phase 1 Update: Increased from 1.5x to 2.0x amplification
        // Phase 2 Update: Per-node amplification for narrow-variance nodes
        // - TRB had std=7.5, needs 3.0x to reach std~15
        // - ZS had std=10.4, needs 2.5x to reach std~15
        // - ONT_H had std=7.6, needs 2.5x to reach std~12
        const NODE_AMPLIFICATION = {
            TRB: 3.0,    // Tribalism - was too narrow (std=7.5)
            ZS: 2.5,     // Zero-Sum - was narrow (std=10.4)
            ONT_H: 2.5,  // Human Optimism - was narrow (std=7.6)
            // Phase 3 additions: Additional narrow nodes
            MOR: 2.8,    // Moralism - std=10.3, blocking many archetypes
            PRO: 2.0,    // Proceduralism - reduced from 3.0; tanh handles tail compression
            H: 2.5,      // Hierarchy - std=10.6, blocking archetypes
            NAT: 2.5,    // Nationalism - std=10.4, narrow
            AES: 2.8,    // Aesthetics - increased from 2.5 to compensate for cross-load compression
            EPS: 2.3,    // Epistemics - increased from 1.8; more sources now mapped (q94, q98, q29)
            PF: 2.8,     // Partisan Fusion - only 4-5 active sources, needs amplification
            // All other nodes use default 2.0x
        };
        const amplification = NODE_AMPLIFICATION[node] || 2.0;
        const deviation = rawPosition - 50;
        // Use tanh to spread the distribution without clamping at 0/100.
        // For small deviations tanh(x)≈x so behavior is unchanged;
        // for large deviations it compresses smoothly toward the poles.
        const amplifiedDeviation = 50 * Math.tanh(deviation * amplification / 50);
        let position = Math.round(Math.max(0, Math.min(100, 50 + amplifiedDeviation)));

        // === APPLY L1 → L3 INFLUENCE ===
        // L1 primitives shift L3 positions based on influence mappings
        for (const [l1Node, influences] of Object.entries(L1_TO_L3_INFLUENCE)) {
            if (influences[node] && l1Profile[l1Node].count > 0) {
                // L1 deviation from center (0-50 scale)
                const l1Dev = (l1Profile[l1Node].score - 50) / 50;
                // Apply influence: positive influence means L1 high → L3 high
                const shift = l1Dev * influences[node] * 15; // Max ~15 point shift
                position = Math.round(Math.max(0, Math.min(100, position + shift)));
            }
        }

        // =============================================================================
        // NEW SALIENCE CALCULATION: Multi-signal approach
        // Delinks salience from position extremity - people can care deeply about
        // issues where they hold moderate positions
        // =============================================================================

        const signals = salienceSignals[node];
        let salience = 50; // Default baseline salience

        // SIGNAL 1: Direct importance from toggle checkboxes (strongest signal)
        // Available for: MAT, CD, ENG, AES, ONT_H, ONT_S, PRO, H, ZS, TRB, NAT, CU
        // When checked, directImportance = 7 → directSalience = 100
        if (signals.directImportance !== null) {
            // Convert 1-7 scale to 0-100: (rating - 1) / 6 * 100
            const directSalience = ((signals.directImportance - 1) / 6) * 100;
            salience = directSalience * 0.5 + salience * 0.5; // Heavy weight on direct
        }

        // SIGNAL 2: Max-diff derived salience (weight 2.5)
        // most_count and least_count relative to appearances
        if (signals.totalMaxdiffAppearances > 0) {
            // Net salience: positive for "most" selections, negative for "least"
            // Each "most" contributes +30, each "least" contributes -20
            const maxdiffScore = 50 + (signals.maxdiffMost * 30) - (signals.maxdiffLeast * 20);
            const clampedMaxdiff = Math.max(0, Math.min(100, maxdiffScore));

            // Weight based on how many times this node appeared in max-diff
            const maxdiffWeight = Math.min(0.4, signals.totalMaxdiffAppearances * 0.1);
            salience = salience * (1 - maxdiffWeight) + clampedMaxdiff * maxdiffWeight;
        }

        // SIGNAL 3: Position extremity as FALLBACK (reduced weight 0.15)
        // Only contributes when we lack direct signals
        const extremity = Math.abs(position - 50) / 50;
        const hasDirectSignal = signals.directImportance !== null;
        const hasMaxdiffSignal = signals.totalMaxdiffAppearances > 0 && (signals.maxdiffMost > 0 || signals.maxdiffLeast > 0);

        if (!hasDirectSignal && !hasMaxdiffSignal) {
            // No direct signals - use NEUTRAL salience (honest uncertainty)
            // FIX: Position extremity is NOT a valid proxy for importance
            // Someone with a moderate position might care deeply; someone extreme might not care
            // With derived signals now filling gaps (ENG from q1, AES from leadership questions, etc.)
            // this fallback is rarely hit
            salience = 50;
        } else {
            // Have direct signals - extremity adds a SMALL BONUS only
            // FIX: Use addition, not blend. A blend pulls salience toward extremity center (37.5)
            // which penalizes people with moderate positions who care deeply.
            // Someone who indicated importance AND holds extreme views gets +0-10 bonus
            const extremityBonus = Math.round(extremity * 10); // max +10 points
            salience = salience + extremityBonus;
        }

        // SIGNAL 4: Question count bonus (reliability signal, small weight)
        const countBonus = Math.min(10, acc.count * 2);
        salience = Math.min(100, Math.round(salience + countBonus));

        // Final clamp
        salience = Math.max(15, Math.min(100, salience));

        profile[node] = { position, salience };
    }

    // Attach L1 profile for reference/display
    profile._l1 = l1Profile;

    // Attach node signal counts for diagnostic purposes (identifies over/under-sourced nodes)
    profile._signalCounts = {};
    for (const [node, acc] of Object.entries(accumulators)) {
        profile._signalCounts[node] = {
            count: Math.round(acc.count * 100) / 100,
            rawSum: Math.round(acc.sum * 100) / 100
        };
    }

    // Attach salience signal breakdown for debugging
    profile._salienceSignals = {};
    for (const [node, signals] of Object.entries(salienceSignals)) {
        profile._salienceSignals[node] = {
            directImportance: signals.directImportance,
            maxdiffMost: signals.maxdiffMost,
            maxdiffLeast: signals.maxdiffLeast,
            maxdiffAppearances: signals.totalMaxdiffAppearances
        };
    }

    return profile;
}

// =============================================================================
// ARCHETYPE MATCHING (uses ARCHETYPES from prism_archetypes_156.js)
// =============================================================================

function matchArchetypeFromProfile(profile) {
    // Use findBestArchetype (tier-cascading) as the PRIMARY match,
    // and findTopArchetypes for the alternative matches list.
    // findBestArchetype respects tier priority (T1 > MEANS > T2 > ...)
    // so well-specified archetypes are preferred over sparse ones.
    if (typeof findBestArchetype === 'function') {
        const bestResult = findBestArchetype(profile);

        // Compute the raw fitScore for the primary match (for consistent scale)
        let primaryFitScore = bestResult.matchConfidence;
        if (typeof computeArchetypeFitScore === 'function') {
            const primaryFit = computeArchetypeFitScore(profile, bestResult.archetype);
            if (!primaryFit.hardFail) primaryFitScore = primaryFit.fitScore;
        }

        // Get alternative matches from findTopArchetypes if available
        let allMatches = [];
        let hasMultiple = false;
        if (typeof findTopArchetypes === 'function') {
            const topResults = findTopArchetypes(profile, {
                maxResults: 5,
                minFitScore: 0.3,
                minRelativeScore: 0.4
            });
            allMatches = topResults.matches || [];
            hasMultiple = topResults.hasMultiple || false;

            // Ensure the primary match is first in the list
            const primaryId = bestResult.archetype.id;
            allMatches = allMatches.filter(function(m) { return m.archetype.id !== primaryId; });
            allMatches.unshift({
                archetype: bestResult.archetype,
                baseArchetype: bestResult.baseArchetype,
                fitScore: primaryFitScore,
                posterior: 0,
                matchPercent: Math.round(primaryFitScore * 100)
            });
        }

        return {
            archetype: bestResult.archetype,
            score: bestResult.score,
            baseArchetype: bestResult.baseArchetype,
            matchConfidence: primaryFitScore,
            allMatches: allMatches,
            hasMultipleMatches: hasMultiple
        };
    }

    // Fallback: simple matching if external script not loaded
    if (typeof ARCHETYPES === 'undefined') {
        return {
            archetype: { id: '005', name: 'Quiet Middle', tier: 'T1', description: 'Default fallback' },
            score: 50,
            allMatches: [],
            hasMultipleMatches: false
        };
    }

    let bestMatch = null;
    let bestScore = -Infinity;

    for (const arch of ARCHETYPES) {
        if (arch.tier === 'ONT') continue; // Skip ONT variants in first pass

        let score = 50;
        for (const [node, spec] of Object.entries(arch.traits || {})) {
            const profileNode = profile[node];
            if (!profileNode || !spec.pos) continue;

            const posCenter = (spec.pos[0] + spec.pos[1]) / 2;
            const posDiff = Math.abs(profileNode.position - posCenter);
            const salWeight = spec.sal ? (spec.sal[0] + spec.sal[1]) / 200 : 0.5;

            if (posDiff <= 16) {
                score += 10 * salWeight;
            } else {
                score -= (posDiff - 16) * 0.3 * salWeight;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = arch;
        }
    }

    return {
        archetype: bestMatch || ARCHETYPES[0],
        score: Math.max(0, Math.min(100, bestScore)),
        allMatches: [],
        hasMultipleMatches: false
    };
}

// =============================================================================
// BEHAVIOR LOOKUP (uses ARCHETYPE_BEHAVIORS from archetype_behaviors.js)
// =============================================================================

function getBehaviorForArchetype(archetypeId) {
    if (typeof ARCHETYPE_BEHAVIORS !== 'undefined' && ARCHETYPE_BEHAVIORS[archetypeId]) {
        return ARCHETYPE_BEHAVIORS[archetypeId];
    }
    return null;
}

// =============================================================================
// RESULTS DISPLAY
// =============================================================================

function displayResults(profile, archetypeResult, behavior) {
    const arch = archetypeResult.archetype;

    // Build results HTML
    let html = `
    <div class="results-container" style="max-width:900px;margin:0 auto;padding:2rem;">

        <!-- ALIGNMENT MAP -->
        <div class="section-header" style="display:flex;align-items:center;gap:1rem;margin:0 0 1rem 0;padding:0.5rem 1rem;background:#ede2ab;border:2px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a;">
            <span style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;background:#FFFEF8;padding:0.25rem 0.5rem;">alignment</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;">political position across regimes</span>
        </div>
        <div style="background:#FFFEF8;border:2px solid #1a1a1a;padding:1.5rem;margin-bottom:1.5rem;box-shadow:4px 4px 0 #6BB8D9;">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;">
                <div style="border:2px solid #1a1a1a;padding:1rem;text-align:center;">
                    <div style="font-size:2rem;">🇺🇸</div>
                    <div style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;color:#888;">United States</div>
                    <div style="font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:700;margin-top:0.5rem;color:${behavior?.usPattern?.startsWith('D') ? '#3333FF' : behavior?.usPattern?.startsWith('R') ? '#E9141D' : '#666'};">
                        ${behavior ? (behavior.usPattern.startsWith('D') ? 'DEMOCRAT' : behavior.usPattern.startsWith('R') ? 'REPUBLICAN' : 'INDEPENDENT') : 'N/A'}
                    </div>
                    <div style="font-size:0.8rem;color:#4a4a4a;">${behavior?.usPattern || ''}</div>
                </div>
                <div style="border:2px solid #1a1a1a;padding:1rem;text-align:center;">
                    <div style="font-size:2rem;">🇹🇼</div>
                    <div style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;color:#888;">Taiwan (ROC)</div>
                    <div style="font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:700;margin-top:0.5rem;color:${behavior?.taiwan === 'DPP' ? '#1B9431' : behavior?.taiwan === 'KMT' ? '#000095' : '#FF6600'};">
                        ${behavior?.taiwan || 'N/A'}
                    </div>
                </div>
                <div style="border:2px solid #1a1a1a;padding:1rem;text-align:center;">
                    <div style="font-size:2rem;">🇨🇳</div>
                    <div style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;color:#888;">China (PRC)</div>
                    <div style="font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:700;margin-top:0.5rem;">
                        ${behavior?.prc || 'N/A'}
                    </div>
                </div>
            </div>
        </div>

        <!-- ARCHETYPE -->
        <div class="section-header" style="display:flex;align-items:center;gap:1rem;margin:0 0 1rem 0;padding:0.5rem 1rem;background:#ede2ab;border:2px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a;">
            <span style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;background:#FFFEF8;padding:0.25rem 0.5rem;">archetype</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;">your political profile</span>
        </div>
        <div style="background:linear-gradient(135deg,#1a1a1a,#333);color:#FFFEF8;border:2px solid #1a1a1a;padding:2rem;margin-bottom:1.5rem;box-shadow:6px 6px 0 #fa8072;">
            <div style="font-family:'Courier Prime',monospace;font-size:0.7rem;background:#fa8072;color:#1a1a1a;padding:0.25rem 0.75rem;display:inline-block;margin-bottom:0.75rem;">
                ${arch.id} | ${arch.tier}${arch.ontLevel ? ' | ' + arch.ontLevel + ' ONT' : ''}
            </div>
            <div style="font-family:'Space Grotesk',sans-serif;font-size:2.2rem;font-weight:700;margin-bottom:0.5rem;">${arch.name}</div>
            <div style="font-family:'Courier Prime',monospace;font-size:1.1rem;color:#89ccf0;margin-bottom:1rem;">${(archetypeResult.matchConfidence * 100).toFixed(1)}% match</div>
            <div style="font-size:1.1rem;opacity:0.9;line-height:1.5;margin-bottom:0.75rem;">${arch.description || ''}</div>
            <div style="font-size:0.9rem;opacity:0.7;font-style:italic;">${arch.examples ? 'Examples: ' + arch.examples : ''}</div>
        </div>

        <!-- VOTING HISTORY -->
        ${behavior ? `
        <div class="section-header" style="display:flex;align-items:center;gap:1rem;margin:0 0 1rem 0;padding:0.5rem 1rem;background:#ede2ab;border:2px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a;">
            <span style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;background:#FFFEF8;padding:0.25rem 0.5rem;">behavior</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;">US voting history (1964-2024)</span>
        </div>
        <div style="background:#FFFEF8;border:2px solid #1a1a1a;padding:1.5rem;margin-bottom:1.5rem;box-shadow:4px 4px 0 #6BB8D9;">
            <div style="font-family:'Courier Prime',monospace;font-size:0.9rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #888;">
                <strong style="color:${behavior.usPattern.startsWith('D') ? '#3333FF' : '#E9141D'};">Pattern: ${behavior.usPattern}</strong>
            </div>
            <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;font-family:'Courier Prime',monospace;font-size:0.7rem;">
                ${[1964,1968,1972,1976,1980,1984,1988,1992].map(y => `<div style="background:#ede2ab;padding:0.4rem 0.2rem;text-align:center;border:1px solid #1a1a1a;font-weight:700;">${y}</div>`).join('')}
                ${[1964,1968,1972,1976,1980,1984,1988,1992].map(y => {
                    const vote = behavior.votes[y] || 'NV';
                    const color = vote === 'D' ? '#3333FF' : vote === 'R' ? '#E9141D' : vote === 'P' ? '#FFD700' : '#ccc';
                    const textColor = ['P','NV'].includes(vote) ? '#333' : '#fff';
                    return `<div style="background:${color};color:${textColor};padding:0.5rem 0.2rem;text-align:center;border:1px solid #1a1a1a;"><strong>${vote}</strong></div>`;
                }).join('')}
                ${[1996,2000,2004,2008,2012,2016,2020,2024].map(y => `<div style="background:#ede2ab;padding:0.4rem 0.2rem;text-align:center;border:1px solid #1a1a1a;font-weight:700;">${y}</div>`).join('')}
                ${[1996,2000,2004,2008,2012,2016,2020,2024].map(y => {
                    const vote = behavior.votes[y] || 'NV';
                    const color = vote === 'D' ? '#3333FF' : vote === 'R' ? '#E9141D' : vote === 'P' ? '#FFD700' : vote === 'N' ? '#00AA00' : '#ccc';
                    const textColor = ['P','N','NV'].includes(vote) ? '#333' : '#fff';
                    return `<div style="background:${color};color:${textColor};padding:0.5rem 0.2rem;text-align:center;border:1px solid #1a1a1a;"><strong>${vote}</strong></div>`;
                }).join('')}
            </div>
        </div>
        ` : ''}

        <!-- L3 NODES -->
        <div class="section-header" style="display:flex;align-items:center;gap:1rem;margin:0 0 1rem 0;padding:0.5rem 1rem;background:#ede2ab;border:2px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a;">
            <span style="font-family:'Courier Prime',monospace;font-size:0.7rem;text-transform:uppercase;background:#FFFEF8;padding:0.25rem 0.5rem;">profile</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;">L3 political dimensions</span>
        </div>
        <div style="background:#FFFEF8;border:2px solid #1a1a1a;padding:1.5rem;box-shadow:4px 4px 0 #6BB8D9;">
            ${['ENDS', 'MEANS', 'REALITY', 'SELF'].map(cluster => `
                <div style="font-family:'Courier Prime',monospace;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:${cluster === 'ENDS' ? '0' : '1.5rem'} 0 0.75rem 0;padding-bottom:0.25rem;border-bottom:1px solid #ccc;">
                    ${cluster} ${cluster === 'ENDS' ? '- What You Want' : cluster === 'MEANS' ? '- How You Get There' : cluster === 'REALITY' ? '- How You See The World' : '- Your Political Identity'}
                </div>
                ${Object.entries(L3_NODES).filter(([k,v]) => v.cluster === cluster).map(([nodeKey, nodeDef]) => {
                    const pos = profile[nodeKey]?.position ?? 50;
                    const barColor = pos < 40 ? '#89ccf0' : pos > 60 ? '#fa8072' : '#ede2ab';
                    return `
                    <div style="display:grid;grid-template-columns:140px 1fr 50px;align-items:center;gap:1rem;margin-bottom:0.6rem;">
                        <div style="font-family:'Courier Prime',monospace;font-size:0.75rem;">${nodeDef.name}</div>
                        <div style="position:relative;height:18px;background:#eee;border:1px solid #1a1a1a;">
                            <div style="position:absolute;height:100%;width:${pos}%;background:${barColor};"></div>
                            <div style="position:absolute;left:50%;top:0;height:100%;width:1px;background:#888;"></div>
                        </div>
                        <div style="font-family:'Courier Prime',monospace;font-size:0.85rem;font-weight:700;text-align:right;">${pos}</div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#888;margin-top:-0.3rem;margin-bottom:0.5rem;margin-left:140px;margin-right:50px;">
                        <span>${nodeDef.low}</span><span>${nodeDef.high}</span>
                    </div>
                    `;
                }).join('')}
            `).join('')}
        </div>

        <div style="text-align:center;margin-top:2rem;">
            <button onclick="location.reload()" style="font-family:'Space Grotesk',sans-serif;font-size:1rem;padding:1rem 2rem;background:#ede2ab;border:2px solid #1a1a1a;cursor:pointer;box-shadow:4px 4px 0 #1a1a1a;">Retake Quiz</button>
        </div>

        <div style="text-align:center;margin-top:1rem;font-family:'Courier Prime',monospace;font-size:0.7rem;color:#888;">
            PRISM v12.2 — 153 Archetypes — Poolside Edition
        </div>
    </div>
    `;

    return html;
}

// =============================================================================
// MAIN ENTRY POINT
// =============================================================================

function processQuizAndShowResults(responses) {
    // Score quiz to L3 profile
    const profile = scoreQuizToL3Profile(responses);
    console.log('L3 Profile:', profile);

    // Match archetype
    const archetypeResult = matchArchetypeFromProfile(profile);
    console.log('Archetype Result:', archetypeResult);

    // Get behavior
    const behavior = getBehaviorForArchetype(archetypeResult.archetype.id);
    console.log('Behavior:', behavior);

    // Generate and return results HTML
    return {
        profile,
        archetypeResult,
        behavior,
        html: displayResults(profile, archetypeResult, behavior)
    };
}

// Export for use in quiz
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scoreQuizToL3Profile, matchArchetypeFromProfile, processQuizAndShowResults, L3_NODES };
}
