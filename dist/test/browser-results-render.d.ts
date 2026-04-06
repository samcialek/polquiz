/**
 * Layer 4 Browser-rendering verification.
 *
 * Drives one persona through the quiz in Chromium, redirects to
 * prism-results.html, then inspects the rendered DOM to verify:
 *
 *   1. Node bars exist and are populated
 *   2. The pos values in the DOM match respondent's measured expectedPos
 *      (NOT the archetype centroid)
 *   3. Different personas yield different rendered positions
 */
export {};
