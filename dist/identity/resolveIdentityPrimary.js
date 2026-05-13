import { MOR_BOUNDARY_ORDER, boundaryLoad } from "../engine/math.js";
// Activation thresholds locked in the 6.E preflight (ADR-006 fallback path).
const LATENT_INTENSITY = 1.5;
const LATENT_LOAD = 0.45;
const ACTIVE_INTENSITY = 2.25;
const ACTIVE_LOAD = 0.65;
// ADR-007 §"Identity-Primary Resolver Migration" seed thresholds (T6).
// Calibration target: should not regress on existing correct IDP resolutions.
const ADR007_EXCESS_THRESHOLD = 20;
const ADR007_SCOPED_THRESHOLD = 70;
const ADR007_UNIVERSAL_CEILING = 75;
const ADR007_INTENSITY03_THRESHOLD = 1.2;
const ADR007_INTENSITY03_DOMINANT = 2.25;
function expectedContinuous(state, nodeId) {
    const node = state.continuous[nodeId];
    if (!node)
        return 3;
    return node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
}
const MORAL_CIRCLE_SCOPES_ORDER = [
    "national", "religious", "ethnic_racial", "class",
    "gender", "ideological",
];
/**
 * Top scoped affinity by excess (ADR-007 path). Returns null if the
 * affinity hasn't materialized or no scope has positive excess.
 */
function topExcessScope(affinity) {
    let best = null;
    let bestVal = 0;
    for (const scope of MORAL_CIRCLE_SCOPES_ORDER) {
        const e = affinity.excessAffinities[scope] ?? 0;
        if (e > bestVal) {
            bestVal = e;
            best = scope;
        }
    }
    return best;
}
/**
 * Top boundary by score from the legacy ADR-006 module (fallback when
 * state.moralCircle.affinity is null). Removed in T12.
 */
function topBoundary(state) {
    const mb = state.morBoundaries;
    if (!mb)
        return null;
    let bestKey = MOR_BOUNDARY_ORDER[0];
    let bestVal = mb.boundaries[bestKey];
    let allEqual = true;
    for (const k of MOR_BOUNDARY_ORDER) {
        const v = mb.boundaries[k];
        if (v !== bestVal)
            allEqual = false;
        if (v > bestVal) {
            bestVal = v;
            bestKey = k;
        }
    }
    return allEqual ? null : bestKey;
}
/** ADR-007 scope → legacy MorBoundaryId for downstream compatibility. */
function scopeToLegacyAnchor(scope) {
    switch (scope) {
        case "national": return "national";
        case "religious": return "religious";
        case "ethnic_racial": return "ethnic_racial";
        case "class": return "class";
        case "ideological": return "ideological";
        case "gender": return "gender";
    }
}
/**
 * Resolve the identity-primary overlay (ADR-007 §"Identity-Primary Resolver
 * Migration", T6 cutover).
 *
 * ADR-007 path (preferred): when `state.moralCircle.affinity` is materialized,
 * gate on excess affinity per ADR-007 seed thresholds:
 *   excess[g] >= 20  AND  scoped[g] >= 70  AND  universal <= 75  AND  intensity03 >= 1.2
 * Top scoped excess scope drives routing. `sexual` excess routes LGBTQ Voter
 * directly (no more sexual→gender collapse + demo_lgbtq override).
 *
 * ADR-006 fallback: when `state.moralCircle.affinity` is null (pre-T3
 * question rewire), use legacy morBoundaries gate. This fallback path is
 * removed in T12.
 *
 * Engagement gates from ADR-002 unchanged in either path.
 */
export function resolveIdentityPrimary(state, engagementLabel, demographics) {
    // ENG leaves archetype signatures under ADR-002; engagement gating runs on
    // the standalone EngagementLabel the caller computed from state.
    const engagementActive = engagementLabel.level === "engaged" ||
        engagementLabel.level === "highly-engaged";
    const engagementDominant = engagementLabel.level === "highly-engaged";
    // ── ADR-007 path: prefer when affinity is materialized ──────────────────
    if (state.moralCircle?.affinity) {
        return resolveViaMoralCircle(state, state.moralCircle.affinity, engagementLabel, engagementActive, engagementDominant, demographics);
    }
    // ── ADR-006 fallback (removed in T12) ───────────────────────────────────
    const mb = state.morBoundaries;
    const intensity = mb?.intensity ?? 0;
    const load = mb ? boundaryLoad(mb.boundaries) : 0;
    const anchorTop = topBoundary(state);
    const passedLatent = intensity >= LATENT_INTENSITY && load >= LATENT_LOAD;
    const passedActive = intensity >= ACTIVE_INTENSITY && load >= ACTIVE_LOAD && engagementActive;
    const passedDominant = intensity >= ACTIVE_INTENSITY && load >= ACTIVE_LOAD && engagementDominant;
    const gate = {
        intensity,
        load,
        engagementLevel: engagementLabel.level,
        passedLatent,
        passedActive,
        passedDominant,
    };
    if (!passedLatent || !anchorTop) {
        return {
            state: "none",
            anchor: anchorTop ?? undefined,
            reasonCodes: anchorTop ? ["gate_not_met"] : ["module_uninitialized_or_uniform"],
            gate,
        };
    }
    const stateLabel = passedDominant
        ? "dominant"
        : passedActive
            ? "active"
            : "latent";
    // Pre-gender LGBTQ check (legacy fallback only)
    if (anchorTop === "gender") {
        const lgbtq = typeof demographics?.demo_lgbtq === "string" ? demographics.demo_lgbtq : "";
        if (lgbtq === "yes") {
            return {
                state: stateLabel,
                label: "LGBTQ Voter",
                confidence: passedActive ? "high" : "medium",
                anchor: anchorTop,
                reasonCodes: ["gender_anchor", "lgbtq_demographic_match", "legacy_path"],
                gate,
            };
        }
    }
    if (anchorTop === "ethnic_racial") {
        const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
        if (race === "black") {
            return {
                state: stateLabel,
                label: "Black Voter",
                confidence: passedActive ? "high" : "medium",
                anchor: anchorTop,
                reasonCodes: ["racial_anchor", "black_demographic_match"],
                gate,
            };
        }
        if (race === "white") {
            const zs = expectedContinuous(state, "ZS");
            const cd = expectedContinuous(state, "CD");
            const onts = expectedContinuous(state, "ONT_S");
            const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
            if (grievanceSignals >= 2) {
                return {
                    state: stateLabel,
                    label: "White Grievance Voter",
                    confidence: grievanceSignals === 3 ? "high" : "medium",
                    anchor: anchorTop,
                    reasonCodes: ["racial_anchor", "white_demographic_match", "status_threat_pattern"],
                    gate,
                };
            }
            return {
                state: "unresolved",
                confidence: "low",
                anchor: anchorTop,
                reasonCodes: ["racial_anchor", "white_demographic_match", "insufficient_grievance_signal"],
                gate,
            };
        }
        return {
            state: "unresolved",
            confidence: "low",
            anchor: anchorTop,
            reasonCodes: ["racial_anchor", "missing_or_nonresolving_race_demographic"],
            gate,
        };
    }
    if (anchorTop === "religious") {
        const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
        if (religion === "christian") {
            return {
                state: stateLabel,
                label: "Evangelical Voter",
                confidence: passedActive ? "medium" : "low",
                anchor: anchorTop,
                reasonCodes: ["religious_anchor", "christian_demographic_match"],
                gate,
            };
        }
        return {
            state: "unresolved",
            confidence: "low",
            anchor: anchorTop,
            reasonCodes: ["religious_anchor", "missing_or_non_evangelical_religion_detail"],
            gate,
        };
    }
    if (anchorTop === "gender") {
        const gender = typeof demographics?.demo_gender === "string" ? demographics.demo_gender : "";
        const cd = expectedContinuous(state, "CD");
        const mor = expectedContinuous(state, "MOR");
        const onts = expectedContinuous(state, "ONT_S");
        const zs = expectedContinuous(state, "ZS");
        if (gender === "female") {
            const feministSignals = Number(cd <= 2.5) + Number(mor >= 3.5) + Number(onts >= 3.5);
            if (feministSignals >= 2) {
                return {
                    state: stateLabel,
                    label: "Feminist Voter",
                    confidence: feministSignals === 3 ? "high" : "medium",
                    anchor: anchorTop,
                    reasonCodes: ["gender_anchor", "female_demographic_match", "progressive_gender_pattern"],
                    gate,
                };
            }
            return {
                state: "unresolved",
                confidence: "low",
                anchor: anchorTop,
                reasonCodes: ["gender_anchor", "female_demographic_match", "insufficient_feminist_signal"],
                gate,
            };
        }
        if (gender === "male") {
            const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
            if (grievanceSignals >= 2) {
                return {
                    state: stateLabel,
                    label: "Male Grievance Voter",
                    confidence: grievanceSignals === 3 ? "high" : "medium",
                    anchor: anchorTop,
                    reasonCodes: ["gender_anchor", "male_demographic_match", "status_threat_pattern"],
                    gate,
                };
            }
            return {
                state: "unresolved",
                confidence: "low",
                anchor: anchorTop,
                reasonCodes: ["gender_anchor", "male_demographic_match", "insufficient_grievance_signal"],
                gate,
            };
        }
        return {
            state: "unresolved",
            confidence: "low",
            anchor: anchorTop,
            reasonCodes: ["gender_anchor", "missing_or_nonresolving_gender_demographic"],
            gate,
        };
    }
    // Top boundary is national / class / ideological / political_tribe — none
    // of these route to an identity-primary archetype. Pass through to base.
    return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["identity_pattern_detected_but_anchor_not_yet_resolvable"],
        gate,
    };
}
// ─── ADR-007 path (T6) ─────────────────────────────────────────────────────
/**
 * ADR-007 §"Identity-Primary Resolver Migration" — gate on excess affinity
 * thresholds and route by top excess scope. Demographic membership matching
 * is unchanged from the ADR-006 path (uses MorMembership / demographics).
 */
function resolveViaMoralCircle(state, affinity, engagementLabel, engagementActive, engagementDominant, demographics) {
    const intensity03 = affinity.intensity03;
    // Load proxy: max scoped affinity (0..100) / 100, comparable to legacy 0..1 scale.
    const maxScoped = Math.max(0, ...MORAL_CIRCLE_SCOPES_ORDER.map(s => affinity.scopedAffinities[s] ?? 0));
    const load = maxScoped / 100;
    const topScope = topExcessScope(affinity);
    const topExcess = topScope ? affinity.excessAffinities[topScope] ?? 0 : 0;
    const topScoped = topScope ? affinity.scopedAffinities[topScope] ?? 0 : 0;
    // ADR-007 gate: excess >= 20 AND scoped >= 70 AND universal <= 75 AND intensity03 >= 1.2
    const baseGate = topExcess >= ADR007_EXCESS_THRESHOLD &&
        topScoped >= ADR007_SCOPED_THRESHOLD &&
        affinity.universalAffinity <= ADR007_UNIVERSAL_CEILING &&
        intensity03 >= ADR007_INTENSITY03_THRESHOLD;
    const passedLatent = baseGate;
    const passedActive = baseGate && engagementActive;
    const passedDominant = baseGate && engagementDominant && intensity03 >= ADR007_INTENSITY03_DOMINANT;
    const gate = {
        intensity: intensity03,
        load,
        engagementLevel: engagementLabel.level,
        passedLatent,
        passedActive,
        passedDominant,
    };
    if (!passedLatent || !topScope) {
        return {
            state: "none",
            anchor: topScope ? scopeToLegacyAnchor(topScope) : undefined,
            scopedAnchor: topScope ?? undefined,
            reasonCodes: topScope ? ["gate_not_met"] : ["affinity_uniform_or_below_universal"],
            gate,
        };
    }
    const stateLabel = passedDominant ? "dominant" : passedActive ? "active" : "latent";
    // ── ethnic_racial → Black or White Grievance ────────────────────────────
    if (topScope === "ethnic_racial") {
        const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
        if (race === "black") {
            return {
                state: stateLabel,
                label: "Black Voter",
                confidence: passedActive ? "high" : "medium",
                anchor: scopeToLegacyAnchor(topScope),
                scopedAnchor: topScope,
                reasonCodes: ["ethnic_racial_scope_excess", "black_demographic_match"],
                gate,
            };
        }
        if (race === "white") {
            const zs = expectedContinuous(state, "ZS");
            const cd = expectedContinuous(state, "CD");
            const onts = expectedContinuous(state, "ONT_S");
            const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
            if (grievanceSignals >= 2) {
                return {
                    state: stateLabel,
                    label: "White Grievance Voter",
                    confidence: grievanceSignals === 3 ? "high" : "medium",
                    anchor: scopeToLegacyAnchor(topScope),
                    scopedAnchor: topScope,
                    reasonCodes: ["ethnic_racial_scope_excess", "white_demographic_match", "status_threat_pattern"],
                    gate,
                };
            }
            return {
                state: "unresolved",
                confidence: "low",
                anchor: scopeToLegacyAnchor(topScope),
                scopedAnchor: topScope,
                reasonCodes: ["ethnic_racial_scope_excess", "white_demographic_match", "insufficient_grievance_signal"],
                gate,
            };
        }
        return {
            state: "unresolved",
            confidence: "low",
            anchor: scopeToLegacyAnchor(topScope),
            scopedAnchor: topScope,
            reasonCodes: ["ethnic_racial_scope_excess", "missing_or_nonresolving_race_demographic"],
            gate,
        };
    }
    // ── religious → Evangelical ─────────────────────────────────────────────
    if (topScope === "religious") {
        const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
        if (religion === "christian") {
            return {
                state: stateLabel,
                label: "Evangelical Voter",
                confidence: passedActive ? "medium" : "low",
                anchor: scopeToLegacyAnchor(topScope),
                scopedAnchor: topScope,
                reasonCodes: ["religious_scope_excess", "christian_demographic_match"],
                gate,
            };
        }
        return {
            state: "unresolved",
            confidence: "low",
            anchor: scopeToLegacyAnchor(topScope),
            scopedAnchor: topScope,
            reasonCodes: ["religious_scope_excess", "missing_or_non_evangelical_religion_detail"],
            gate,
        };
    }
    // ── gender → Feminist (female + signals) or Male Grievance (male + signals)
    // sexual case already handled above. demo_lgbtq=yes here would mean a
    // person whose gender excess outweighs their sexual excess; treat as LGBTQ
    // Voter still since the lock-and-key on lgbtq is decisive.
    if (topScope === "gender") {
        const lgbtq = typeof demographics?.demo_lgbtq === "string" ? demographics.demo_lgbtq : "";
        if (lgbtq === "yes") {
            return {
                state: stateLabel,
                label: "LGBTQ Voter",
                confidence: passedActive ? "high" : "medium",
                anchor: scopeToLegacyAnchor(topScope),
                scopedAnchor: topScope,
                reasonCodes: ["gender_scope_excess", "lgbtq_demographic_match"],
                gate,
            };
        }
        const gender = typeof demographics?.demo_gender === "string" ? demographics.demo_gender : "";
        const cd = expectedContinuous(state, "CD");
        const onts = expectedContinuous(state, "ONT_S");
        const zs = expectedContinuous(state, "ZS");
        if (gender === "female") {
            // Feminist signal: progressive cultural direction, high ONT_S, high
            // universal-aware moral circle (universalAffinity reads from the new
            // module). Adapted from ADR-006 path which used MOR pos.
            const feministSignals = Number(cd <= 2.5) +
                Number(affinity.universalAffinity >= 60) +
                Number(onts >= 3.5);
            if (feministSignals >= 2) {
                return {
                    state: stateLabel,
                    label: "Feminist Voter",
                    confidence: feministSignals === 3 ? "high" : "medium",
                    anchor: scopeToLegacyAnchor(topScope),
                    scopedAnchor: topScope,
                    reasonCodes: ["gender_scope_excess", "female_demographic_match", "progressive_gender_pattern"],
                    gate,
                };
            }
            return {
                state: "unresolved",
                confidence: "low",
                anchor: scopeToLegacyAnchor(topScope),
                scopedAnchor: topScope,
                reasonCodes: ["gender_scope_excess", "female_demographic_match", "insufficient_feminist_signal"],
                gate,
            };
        }
        if (gender === "male") {
            const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
            if (grievanceSignals >= 2) {
                return {
                    state: stateLabel,
                    label: "Male Grievance Voter",
                    confidence: grievanceSignals === 3 ? "high" : "medium",
                    anchor: scopeToLegacyAnchor(topScope),
                    scopedAnchor: topScope,
                    reasonCodes: ["gender_scope_excess", "male_demographic_match", "status_threat_pattern"],
                    gate,
                };
            }
            return {
                state: "unresolved",
                confidence: "low",
                anchor: scopeToLegacyAnchor(topScope),
                scopedAnchor: topScope,
                reasonCodes: ["gender_scope_excess", "male_demographic_match", "insufficient_grievance_signal"],
                gate,
            };
        }
        return {
            state: "unresolved",
            confidence: "low",
            anchor: scopeToLegacyAnchor(topScope),
            scopedAnchor: topScope,
            reasonCodes: ["gender_scope_excess", "missing_or_nonresolving_gender_demographic"],
            gate,
        };
    }
    // national / class / ideological / political_camp — no IDP overlay defined.
    return {
        state: "unresolved",
        confidence: "low",
        anchor: scopeToLegacyAnchor(topScope),
        scopedAnchor: topScope,
        reasonCodes: ["scope_excess_detected_no_idp_overlay_defined"],
        gate,
    };
}
//# sourceMappingURL=resolveIdentityPrimary.js.map