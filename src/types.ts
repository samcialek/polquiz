/**
 * Continuous belief-axis nodes plus engagement.
 *
 * `MOR`, `PF`, `TRB` are @deprecated per ADR-007 — superseded by the
 * compound moral-circle module (`state.moralCircle.affinity`). They remain
 * in this union during the transition so engine fallback paths still
 * compile; full removal lands in a follow-up cleanup pass once all
 * consumers (electorate, eval, diagnostics) are migrated.
 */
export type ContinuousNodeId =
  | "MAT"
  | "CD"
  | "CU"
  /** @deprecated ADR-007 — use `state.moralCircle.affinity.universalAffinity`. */
  | "MOR"
  | "PRO"
  | "COM"
  | "ZS"
  | "ONT_H"
  | "ONT_S"
  /** @deprecated ADR-007 — use `state.moralCircle.affinity.scopedAffinities.political_camp`. */
  | "PF"
  /** @deprecated ADR-007 — use `state.moralCircle.affinity.scopedAffinities.<scope>`. */
  | "TRB"
  | "ENG";

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
  /**
   * @deprecated ADR-006 module; superseded by `moralCircle` per ADR-007.
   * Removed in T12 of the moral-circle full migration.
   */
  morBoundaries?: ArchetypeMorBoundaries;
  /**
   * Moral-circle template per ADR-007. Universal baseline + 8 scoped
   * affinities. Added in T2 of the moral-circle migration; consumed by
   * `archetypeDistance` in T7 and by `resolveIdentityPrimary` in T6.
   */
  moralCircle?: ArchetypeMoralCircle;
}

/**
 * Display-only metadata. The live engine does NOT read this field — question
 * scheduling is governed by `SALIENCE_ROUTER_FIXED` in `src/engine/config.ts`
 * plus the EIG selector + forced-coverage probes. The value names predate the
 * Salience-Router architecture (2026-04-27) and persist for diagnostic
 * dashboards only. Do not infer fixed-router membership from `stage: "fixed12"`
 * — check `SALIENCE_ROUTER_FIXED` instead.
 */
export type QuestionStage = "fixed12" | "screen20" | "stage2" | "stage3";

export type QuestionUiType =
  | "single_choice"
  | "slider"
  | "allocation"
  | "ranking"
  | "pairwise"
  | "best_worst"
  | "priority_sort"
  | "dual_axis"
  | "conjoint"
  | "multi";

export type TouchRole = "position" | "salience" | "category" | "anchor" | "affinity";
export type TouchKind = "continuous" | "categorical" | "derived";

export interface TouchTarget {
  node: NodeId | "TRB_ANCHOR" | "MORAL_CIRCLE";
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

/**
 * @deprecated since ADR-006 (PR 6.B). Replaced by `MorBoundaryId` (7
 * categories instead of 9: gender + sexual fold to gender, global → implicit
 * universalism via low boundaries, mixed_none → all-low signal). Removal
 * scheduled for PR 6.E (engine cutover).
 */
export type TrbAnchor =
  | "national"
  | "ideological"
  | "religious"
  | "class"
  | "ethnic_racial"
  | "gender"
  | "sexual"
  | "global"
  | "mixed_none";

/**
 * @deprecated since ADR-006 (PR 6.B). Replaced by `MorBoundaryVector` (7-tuple
 * of independent 0..1 boundedness scores). Removal scheduled for PR 6.E.
 */
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

// ────────────────────────────────────────────────────────────────────────────
// MOR_BOUNDARIES — compound moral-circle module (ADR-006, PR 6.B additive)
// ────────────────────────────────────────────────────────────────────────────

/**
 * The 7 independent identity-political boundaries that structure a
 * respondent's moral circle. Per ADR-006, each is a 0..1 boundedness score —
 * scores do NOT sum to 1.
 *
 *   national        — co-citizens (US implicit; activation still varies)
 *   ethnic_racial   — co-ethnics
 *   religious       — co-religionists
 *   class           — co-class
 *   ideological     — people who share my ideas/values
 *   gender          — co-gender or co-LGBTQ-cohort (folds gender + sexual_orientation politics)
 *   political_tribe — party / camp / movement / candidate-faction loyalty
 *
 * The order matches `MOR_BOUNDARIES` in `src/config/categories.ts`.
 */
export type MorBoundaryId =
  | "national"
  | "ethnic_racial"
  | "religious"
  | "class"
  | "ideological"
  | "gender"
  | "political_tribe";

/**
 * 7-tuple of independent boundedness scores in [0, 1]. Order matches
 * `MorBoundaryId` definition order. Scores do NOT sum to 1.
 */
export type MorBoundaryVector = [
  number,  // national
  number,  // ethnic_racial
  number,  // religious
  number,  // class
  number,  // ideological
  number,  // gender
  number,  // political_tribe
];

/**
 * Object form of the 7 boundary scores. Used in archetype data and
 * respondent state where named field access is more readable than
 * positional access. Values 0..1 each, independent.
 */
export interface MorBoundaries {
  national: number;
  ethnic_racial: number;
  religious: number;
  class: number;
  ideological: number;
  gender: number;
  political_tribe: number;
}

/**
 * Optional self-reported group membership for the four directly-asked
 * categories plus political_tribe (sourced from existing Q200 party-ID
 * metadata, not a new demographic question).
 *
 *   - National membership is implicit (US).
 *   - Ideological "membership" is derived from the rest of the quiz.
 *   - The four explicit demographic asks (ethnic_racial, religious, class,
 *     gender) are end-of-quiz with `null` / decline-to-state allowed on each.
 *
 * Important: `political_tribe` membership labels ("D" / "R" / "independent" /
 * "third" / "none") are party-ID *labels*, not activation strength. The
 * activation strength lives in `MorBoundaries.political_tribe` and is
 * sourced from PF / Q97 / Q211 / Q212 evidence. A respondent can be
 * `morMembership.political_tribe = "independent"` AND have
 * `morBoundaries.political_tribe ≈ 0.9` (an independent who fiercely
 * identifies with the third-party / anti-establishment camp); these fields
 * are independent.
 */
export interface MorMembership {
  ethnic_racial?: string | null;
  religious?: string | null;
  class?: string | null;
  gender?: string | null;
  political_tribe?: "D" | "R" | "independent" | "third" | "none" | string | null;
}

/**
 * Respondent posterior over the moral-circle module. Mirrors `MorBoundaries`
 * for boundary scores plus an intensity scalar and per-boundary touch counts.
 *
 * `intensity` is real-valued in [0, 3], matching how EPS/AES salience is
 * computed at runtime as `expectedSal` (continuous expectation, not integer-
 * stepped).
 */
export interface MorBoundariesNodeState {
  boundaries: MorBoundaries;
  /** 0..3, real-valued. How activated moral-circle concern is in political judgment. */
  intensity: number;
  touches: Partial<Record<MorBoundaryId, number>>;
  /** Optional touch type tracking, matching the per-node pattern elsewhere. */
  touchTypes: Set<string>;
  status: NodeStatus;
}

/**
 * Archetype-side encoding of the moral-circle module. Same boundary +
 * intensity shape as the respondent posterior; archetype templates may set
 * integer intensity values (0 | 1 | 2 | 3) for clarity but the runtime type
 * is real-valued.
 *
 * No demographic membership on archetypes — they are abstract political
 * shapes. Demographic match only enters at the candidate-matching layer
 * (Layer 2 lock-and-key in `respondentVoteChoice.ts`, scheduled for PR 6.E).
 */
export interface ArchetypeMorBoundaries {
  boundaries: MorBoundaries;
  /** 0..3, real-valued. Templates commonly use integers 0|1|2|3. */
  intensity: number;
}

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
  /** @deprecated ADR-006; superseded by `moralCircle` per ADR-007. Removed in T12. */
  trbAnchor?: Partial<Record<TrbAnchor, number>>;
  /**
   * Per-option moral-circle contribution per ADR-007. Universal and scoped
   * affinity magnitudes (0..100) the option pushes onto respondent state.
   * Added in T1 of the moral-circle migration; consumed by `update.ts` in T4.
   */
  moralCircle?: OptionEvidenceMoralCircle;
}

export interface AllocationBucketMap {
  continuous?: Partial<Record<ContinuousNodeId, number>>;
  categorical?: Partial<Record<CategoricalNodeId, CategoricalDist>>;
  trbAnchor?: Partial<Record<TrbAnchor, number>>;
  /** ADR-007 (T3): moral-circle contribution per allocation bucket. */
  moralCircle?: OptionEvidenceMoralCircle;
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
  /** ADR-007 (T3): moral-circle contribution per ranking item. */
  moralCircle?: OptionEvidenceMoralCircle;
}

export interface PairOptionMap {
  continuous?: Partial<Record<ContinuousNodeId, number>>;
  categorical?: Partial<Record<CategoricalNodeId, CategoricalDist>>;
  /** Legacy ADR-006 path. Identity-anchor evidence for the chosen option. */
  trbAnchor?: Partial<Record<TrbAnchor, number>>;
  /** ADR-007 (T3): moral-circle contribution per pairwise option. */
  moralCircle?: OptionEvidenceMoralCircle;
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
  xLow: ContinuousPosDist;   // target posterior when x = 0 (axis low pole)
  xHigh: ContinuousPosDist;  // target posterior when x = 1 (axis high pole)
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
  labels?: { strong?: string; weak?: string; lowEnd?: string; highEnd?: string };
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
  /**
   * @deprecated since ADR-006 (PR 6.B). Replaced by `morBoundaries` (the
   * compound moral-circle module). Removal scheduled for PR 6.E (engine
   * cutover). Old code paths still write to this during the additive
   * transition; new code should read from `morBoundaries` once 6.E lands.
   */
  trbAnchor: {
    dist: TrbAnchorDist;
    touches: number;
  };

  /**
   * Compound moral-circle module per ADR-006 (added in PR 6.B as additive).
   * Replaces continuous MOR + continuous TRB + continuous PF +
   * categorical TRB_ANCHOR. Optional during the additive transition
   * (PRs 6.B–6.D); becomes required and the legacy fields are removed in
   * PR 6.E (engine cutover). Currently unused by the engine.
   */
  morBoundaries?: MorBoundariesNodeState;

  /**
   * Optional self-reported group membership per ADR-006 (added in PR 6.B
   * as additive). Populated by the 4 new demographic questions (PR 6.F)
   * and by Q200 party-ID metadata for `political_tribe`.
   * Currently unused by the engine — consumed by the candidate-matching
   * layer in PR 6.E (Layer 2 lock-and-key) for the 4 demographic categories;
   * `political_tribe` is read by Layer 1 vector distance only in v1
   * (existing partisan multiplier retained — see ADR-006 §"Warning: do not
   * double-count partisanship").
   */
  morMembership?: MorMembership;

  /**
   * Moral-circle affinity state per ADR-007. `affinity` starts as `null`
   * (unmeasured — not zero-default, since universalAffinity=0 would be a
   * positive moral claim). Materialized once first moral-circle evidence
   * lands. Consumers must guard against `affinity === null` before reading.
   * Added in T1 of the moral-circle migration.
   */
  moralCircle?: MoralCircleAffinityState;

  /**
   * Self-reported group membership per ADR-007. Independent axis from
   * affinity. Replaces `morMembership` (renamed; `political_tribe` →
   * `political_camp`; `sexual` field added for LGBTQ identity). Added in
   * T1; legacy `morMembership` removed in T12.
   */
  membership?: Membership;

  /** Euclidean distance from the respondent state to each active archetype. Lower = better match. */
  archetypeDistances: Record<string, number>;
  /** ID of the current leading archetype (lowest distance). */
  currentLeader?: string;
  /** How many consecutive questions the current leader has held the top spot. */
  consecutiveLeadCount?: number;

  // Election / vote-prediction metadata captured from Q200/Q211/Q212 hooks
  // in update.ts. All optional; consumed by predictVote in
  // historical/respondentVoteChoice.ts.
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

// ─── ADR-007 — Moral Circle Affinity (additive scaffolding) ────────────────
// Pure data-shape additions. No engine, selector, mapper, archetype, or
// candidate-distance code reads or writes these types until Stage F cutover.
// See `results/architecture/ADR-007-explicit-moral-circle-affinity.md`.

/**
 * Six scoped moral-circle affinities. Universal concern is stored separately
 * as `universalAffinity` and is the baseline; scoped values are six in-group
 * magnitudes compared against the universal baseline to derive excess.
 *
 * Revision (2026-05-07): scope set reduced from 8 to 6.
 *   - `sexual` dropped — folded back into `gender`. LGBTQ Voter routes via
 *     gender excess + `demo_lgbtq` membership lock-and-key.
 *   - `political_camp` merged into `ideological`. Both captured the same
 *     partisan-in-group dimension; the broader name (`ideological`) survives
 *     since "I share their values" subsumes "I share their party."
 */
export type MoralCircleScope =
  | "national"
  | "religious"
  | "ethnic_racial"
  | "class"
  | "gender"
  | "ideological";

/** Raw scoped-affinity map. `null` = "not meaningful to me", not zero. */
export type MoralCircleScopedAffinities = Record<MoralCircleScope, number | null>;

/** Derived per-scope excess map. Always numeric (`null` collapses to 0). */
export type MoralCircleExcessAffinities = Record<MoralCircleScope, number>;

/** Raw input prior to derivation. The 9 stored numbers per ADR-007. */
export interface MoralCircleAffinityInput {
  /** 0..100 baseline moral concern for any human being. */
  universalAffinity: number;
  scopedAffinities: MoralCircleScopedAffinities;
}

/**
 * Full derived moral-circle affinity object. `scopedAffinities` retains raw
 * values (including `null`) for diagnostics; `excessAffinities` and
 * `activeBoundaries` are the active-signal layer.
 */
export interface MoralCircleAffinity {
  universalAffinity: number;
  scopedAffinities: MoralCircleScopedAffinities;
  excessAffinities: MoralCircleExcessAffinities;
  /** Mathematical activation: scopes where excess > 0. */
  activeBoundaries: MoralCircleScope[];
  /** L2-norm intensity normalized to [0, 1]; saturates at one fully-loaded boundary. */
  intensity01: number;
  /** intensity01 × 3, for compatibility with existing 0..3 salience surfaces. */
  intensity03: number;
}

/**
 * Internal running-average accumulator for moral-circle evidence. Per-scope
 * counts let us track how many times each component has been touched, so
 * downstream consumers can distinguish well-measured scopes from sparsely-
 * touched ones. Not exposed in the public API; engine-internal.
 */
export interface MoralCircleAffinityAccumulator {
  universalSum: number;
  universalCount: number;
  scopedSums: Partial<Record<MoralCircleScope, number>>;
  scopedCounts: Partial<Record<MoralCircleScope, number>>;
}

/**
 * Per-respondent moral-circle state container. `affinity` is `null` at quiz
 * start (no zero-default — "unmeasured" must not look like "no baseline
 * concern for humans"). Materialized once the first moral-circle evidence
 * lands; consumers must guard against the `null` case.
 *
 * `accumulator` holds the per-component running totals; `affinity` is
 * recomputed from the accumulator on each touch.
 */
export interface MoralCircleAffinityState {
  affinity: MoralCircleAffinity | null;
  touchCount: number;
  accumulator: MoralCircleAffinityAccumulator;
}

/**
 * Archetype-side moral-circle template. Same 9-number shape as
 * `MoralCircleAffinityInput`; aliased for documentation. Profiles live in
 * `src/config/archetypes.ts` per ADR-007.
 */
export interface ArchetypeMoralCircle {
  /** 0..100 baseline moral concern projected by this archetype. */
  universalAffinity: number;
  scopedAffinities: MoralCircleScopedAffinities;
}

/**
 * Per-option contribution to moral-circle affinity. Each option in a question
 * may push universal and/or one or more scoped affinities. Per-option values
 * are 0..100 magnitudes that the engine aggregates into the respondent's
 * `state.moralCircle.affinity`. `null` on a scoped contribution means
 * "this option says this scope is not meaningful for the respondent."
 */
export interface OptionEvidenceMoralCircle {
  universal?: number;
  scopedAffinities?: Partial<Record<MoralCircleScope, number | null>>;
}

/**
 * Self-reported group membership per ADR-007 §"Identity-Primary Resolver
 * Migration". Membership is independent of affinity — affinity says "this
 * scope is morally loaded for me," membership says which concrete in-group
 * within that scope. `political_camp` carries a party-ID label, not an
 * activation strength (activation lives in
 * `state.moralCircle.affinity.scopedAffinities.political_camp`). All fields
 * optional with `null` allowed for decline-to-state.
 */
export interface Membership {
  ethnic_racial?: string | null;
  religious?: string | null;
  class?: string | null;
  gender?: string | null;
  /**
   * Party-ID label. Field name retained for terminology consistency with
   * external systems (Q200 party metadata). Maps onto the `ideological`
   * scope under the merged 6-scope model.
   */
  political_camp?: "D" | "R" | "independent" | "third" | "none" | string | null;
}
