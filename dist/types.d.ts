export type ContinuousNodeId = "MAT" | "CD" | "CU" | "MOR" | "PRO" | "COM" | "ZS" | "ONT_H" | "ONT_S" | "PF" | "TRB" | "ENG";
export type CategoricalNodeId = "EPS" | "AES";
export type NodeId = ContinuousNodeId | CategoricalNodeId;
export type Cluster = "ENDS" | "MEANS" | "REALITY" | "SELF";
export type NodeType = "continuous" | "categorical";
export interface NodeDef {
    id: NodeId;
    type: NodeType;
    cluster: Cluster;
}
export type ArchetypeTier = "T1" | "T2" | "MEANS" | "GATE" | "REALITY";
export interface ContinuousTemplate {
    kind: "continuous";
    pos: 1 | 2 | 3 | 4 | 5;
    /**
     * Salience 0-3. OPTIONAL because SELF-cluster nodes (PF / TRB / ENG)
     * use position-IS-activation per ADR-005 and have no separate salience
     * axis. Non-SELF nodes always set sal explicitly.
     */
    sal?: 0 | 1 | 2 | 3;
    anti?: "high" | "low";
}
export interface CategoricalTemplate {
    kind: "categorical";
    probs: [number, number, number, number, number, number];
    sal: 0 | 1 | 2 | 3;
    antiCats?: number[];
}
export type ArchetypeNodeTemplate = ContinuousTemplate | CategoricalTemplate;
export interface Archetype {
    id: string;
    name: string;
    tier: ArchetypeTier;
    /** Set to false to exclude from MAP under the new Euclidean WTA scorer (replaces prior=0). */
    active?: boolean;
    /**
     * Marks centrist-anchor archetypes (e.g., 059 Public-Minded Moderate). Used
     * by the engine's centrist-pull adjustment to avoid over-rotating toward
     * extreme matches when the respondent is genuinely centrist.
     */
    centristAnchor?: boolean;
    nodes: Partial<Record<NodeId, ArchetypeNodeTemplate>>;
}
export type QuestionStage = "fixed12" | "screen20" | "stage2" | "stage3";
export type QuestionUiType = "single_choice" | "slider" | "allocation" | "ranking" | "pairwise" | "best_worst" | "priority_sort" | "dual_axis" | "conjoint" | "multi";
export type TouchRole = "position" | "salience" | "category" | "anchor";
export type TouchKind = "continuous" | "categorical" | "derived";
export interface TouchTarget {
    node: NodeId | "TRB_ANCHOR";
    kind: TouchKind;
    role: TouchRole;
    weight: number;
    touchType: string;
}
export type SalienceDist = [number, number, number, number];
export type ContinuousPosDist = [number, number, number, number, number];
export type CategoricalDist = [number, number, number, number, number, number];
export interface OptionEvidenceContinuous {
    pos?: ContinuousPosDist;
    sal?: SalienceDist;
}
export interface OptionEvidenceCategorical {
    cat?: CategoricalDist;
    sal?: SalienceDist;
}
export type TrbAnchor = "national" | "ideological" | "religious" | "class" | "ethnic_racial" | "gender" | "sexual" | "global" | "mixed_none";
export type TrbAnchorDist = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
/**
 * Respondent party identification — captured from Q200 metadata. Used for the
 * partisan-loyalty multiplier in election compute (post-1932 only).
 *   D = Democratic, R = Republican, I = Independent / no-lean,
 *   N = nonvoter / unsure, T = third-party affiliated, O = other / refused.
 */
export type PartyID = "D" | "R" | "I" | "N" | "T" | "O";
export interface OptionEvidence {
    continuous?: Partial<Record<ContinuousNodeId, OptionEvidenceContinuous>>;
    categorical?: Partial<Record<CategoricalNodeId, OptionEvidenceCategorical>>;
    trbAnchor?: Partial<Record<TrbAnchor, number>>;
}
export interface AllocationBucketMap {
    continuous?: Partial<Record<ContinuousNodeId, number>>;
    categorical?: Partial<Record<CategoricalNodeId, CategoricalDist>>;
    trbAnchor?: Partial<Record<TrbAnchor, number>>;
}
export interface RankingItemMap {
    /**
     * Two accepted shapes per applyRankingAnswer / applyBestWorstSalience:
     *   - scalar number: log-likelihood delta on posDist (used by `ranking`
     *     questions that nudge a node positionally without specifying a target
     *     posterior)
     *   - OptionEvidenceContinuous (`{ pos?, sal? }`): full target posterior
     *     (used by best_worst pole-batteries Q93-Q96 and Q218 categorical AES)
     * Each question type uses one shape consistently across all items.
     */
    continuous?: Partial<Record<ContinuousNodeId, number | OptionEvidenceContinuous>>;
    categorical?: Partial<Record<CategoricalNodeId, CategoricalDist>>;
    trbAnchor?: Partial<Record<TrbAnchor, number>>;
}
export interface PairOptionMap {
    continuous?: Partial<Record<ContinuousNodeId, number>>;
    categorical?: Partial<Record<CategoricalNodeId, CategoricalDist>>;
}
/**
 * Dual-axis evidence. A single gesture on a 2D grid gives x (position) and
 * y (salience) for one node.
 *
 *   x in [0,1] → position: linear interpolation between `xLow` and `xHigh`
 *   target posteriors, then convex-mixed into posDist at DUAL_AXIS_POS_MIX.
 *   y in [0,1] → salience: mapped to a SalienceDist likelihood ratio (high
 *   y → higher-salience dist, low y → lower-salience dist). Multiplied into
 *   salDist.
 *
 * One DualAxisMap per question. Exactly one continuous node is touched on
 * both position and salience by this single gesture.
 */
export interface DualAxisMap {
    node: ContinuousNodeId;
    xLow: ContinuousPosDist;
    xHigh: ContinuousPosDist;
}
/**
 * Strength follow-up — an optional secondary prompt shown immediately after
 * the primary answer on single_choice / conjoint questions. Captures how
 * strongly the respondent prefers the picked option. Stored via
 * applyRatioBoost which then runs a salience update after the primary
 * evidence applies. The UI renders either a 2-button choice (a_lot / a_little
 * → ratio 10 vs 1.5) or a ratio slider (1.5 … 100).
 */
export interface StrengthFollowUp {
    kind: "strength" | "ratio";
    prompt: string;
    /** For `strength` kind, two labels: strong and weak. For `ratio`, slider endpoints. */
    labels?: {
        strong?: string;
        weak?: string;
        lowEnd?: string;
        highEnd?: string;
    };
}
export interface QuestionDef {
    id: number;
    stage: QuestionStage;
    section: string;
    promptShort: string;
    promptFull?: string;
    optionLabels?: Record<string, string>;
    uiType: QuestionUiType;
    quality: number;
    rewriteNeeded: boolean;
    touchProfile: TouchTarget[];
    /** Optional explicit option-key list (legacy — normally derived from optionEvidence). */
    options?: string[];
    optionEvidence?: Record<string, OptionEvidence>;
    sliderMap?: Record<string, OptionEvidence>;
    allocationMap?: Record<string, AllocationBucketMap>;
    rankingMap?: Record<string, RankingItemMap>;
    pairMaps?: Record<string, Record<string, PairOptionMap>>;
    bestWorstMap?: Record<string, RankingItemMap>;
    /** Dual-axis gesture: one grid tap gives both position (x) and salience (y). */
    dualAxisMap?: DualAxisMap;
    /** Optional strength/ratio follow-up prompt after primary answer. */
    strengthFollowUp?: StrengthFollowUp;
    /** Number of best + number of worst picks the UI collects. Default 1 (legacy). */
    bwMaxPicks?: number;
    /**
     * Optional UI labels for the best/worst columns. Defaults to "most"/"least".
     * Override per question when "bothers me most/least" or "matters most/least"
     * etc. is more natural than the generic default.
     */
    bestWorstLabels?: {
        mostLabel?: string;
        leastLabel?: string;
    };
    /**
     * Per-bucket salience update overrides. Used by Q103 (issue_salience_screener)
     * and similar priority-sort questions that need stronger per-question salience
     * concentration than the default rankingMap-derived buckets provide.
     */
    salienceBuckets?: Record<string, SalienceDist>;
    /**
     * Priority batteries fire before EIG-scored questions. Used for orienting
     * multi-node pole batteries (Q93-Q96) whose per-touch coverage gets heavily
     * discounted by the EIG scorer but whose total info yield across K nodes
     * makes them high-value early-quiz anchors.
     */
    priorityBattery?: boolean;
    exposeRules?: {
        eligibleIf?: string[];
        goodFollowupsIfUnresolved?: number[];
    };
}
export type NodeStatus = "unknown" | "dead" | "live_resolved" | "live_unresolved";
export interface ContinuousNodeState {
    posDist: ContinuousPosDist;
    salDist: SalienceDist;
    touches: number;
    touchTypes: Set<string>;
    status: NodeStatus;
}
export interface CategoricalNodeState {
    catDist: CategoricalDist;
    salDist: SalienceDist;
    touches: number;
    touchTypes: Set<string>;
    status: NodeStatus;
}
export interface RespondentState {
    answers: Record<number, unknown>;
    continuous: Record<ContinuousNodeId, ContinuousNodeState>;
    categorical: Record<CategoricalNodeId, CategoricalNodeState>;
    trbAnchor: {
        dist: TrbAnchorDist;
        touches: number;
    };
    /** Euclidean distance from the respondent state to each active archetype. Lower = better match. */
    archetypeDistances: Record<string, number>;
    /** ID of the current leading archetype (lowest distance). */
    currentLeader?: string;
    /** How many consecutive questions the current leader has held the top spot. */
    consecutiveLeadCount?: number;
    /** Self-reported party ID from Q200 metadata. */
    partyID?: PartyID | null;
    /** Parties the respondent flagged as never-vote (Q212 negative_partisanship). */
    negativeParties?: Set<string> | null;
    /** Whether the respondent identifies as a strategic / lesser-evil voter (Q211). */
    strategicVoting?: boolean;
    /** Single most-salient node id (used as a tie-breaker in election compute). */
    dominantNode?: string | null;
    /** Per-question ratio-boost multipliers applied via applyRatioBoost. */
    ratioBoosts?: Record<string, number>;
}
