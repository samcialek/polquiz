/**
 * Candidates-as-voters election diagnostic.
 *
 * Take every historical candidate profile in candidates.ts (across all 60
 * elections) and treat each as a hypothetical voter. Have each candidate-voter
 * cast a vote in every one of the 60 elections. Aggregate winners per election.
 *
 * Each candidate-year entry is a distinct voter (Nixon 1960 and Nixon 1972
 * are separate voters because they're separately coded — different policy
 * positions, different post-Watergate paranoia, etc.). Total N = ~140.
 *
 * Sanity check: each candidate must pick themselves in their own election
 * (ideological distance = 0 at self-match). The non-ideological modifier
 * could in principle make another candidate closer via a large positive
 * bonus, but with modifier capped at ±0.30 and most cross-candidate distances
 * > 0.5, self-votes dominate.
 *
 * Output: results/centroid-sim/candidate-voter-frequencies.json.
 */
export {};
