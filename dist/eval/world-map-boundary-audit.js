import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const HISTORICAL_BASEMAP_URL = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/";
const MODERN_WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const AVAILABLE_MAP_YEARS = [1715, 1783, 1800, 1815, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010];
const POINTS = {
    lhasa: { label: "Lhasa/Tibet", coords: [91.12, 29.65] },
    simferopol: { label: "Simferopol/Crimea", coords: [34.1, 44.95] },
};
async function main() {
    const outDir = join(process.cwd(), "results", "world-map-coverage");
    mkdirSync(outDir, { recursive: true });
    const checks = [];
    checks.push(await checkHistoricalPoint({
        issue: "Tibet control after 1951",
        requestedYear: 1989,
        mapYear: closestHistoricalMapYear(1989),
        point: POINTS.lhasa,
        expected: "China",
        sourceIssueIf: actual => actual.includes("Tibet"),
        recommendation: "Display-time override: resolve Tibet polygons to China for requested years >= 1951. Add a true 1980/1989 layer only if a better source is adopted.",
    }));
    checks.push(await checkHistoricalPoint({
        issue: "Tibet control after 1951",
        requestedYear: 1960,
        mapYear: 1960,
        point: POINTS.lhasa,
        expected: "China",
        sourceIssueIf: actual => actual.includes("Tibet"),
        recommendation: "Same as above: historical-basemaps world_1960.geojson keeps Tibet separate even though PRC control dates to 1951 in the alignment convention.",
    }));
    checks.push(await checkHistoricalPoint({
        issue: "Crimea after Soviet breakup",
        requestedYear: 1994,
        mapYear: 1994,
        point: POINTS.simferopol,
        expected: "Ukraine",
        sourceIssueIf: actual => !actual.includes("Ukraine"),
        recommendation: "Use historical 1994/2000/2010 layers for post-Soviet pre-modern years; they assign Crimea to Ukraine.",
    }));
    checks.push(await checkHistoricalPoint({
        issue: "Crimea after Soviet breakup",
        requestedYear: 2010,
        mapYear: 2010,
        point: POINTS.simferopol,
        expected: "Ukraine",
        sourceIssueIf: actual => !actual.includes("Ukraine"),
        recommendation: "Use the 2010 historical layer through 2025 unless a better current disputed-boundary layer is adopted.",
    }));
    checks.push(await checkModernPoint({
        issue: "Crimea modern overlap",
        requestedYear: 2026,
        point: POINTS.simferopol,
        expected: "Ukraine",
        recommendation: "world-atlas 110m contains overlapping Russia and Ukraine coverage at Crimea. Render Ukraine after Russia so the recognized Ukrainian claim wins visually.",
    }));
    writeFileSync(join(outDir, "boundary-audit.csv"), toCsv(["issue", "requestedYear", "mapLayer", "point", "expected", "actual", "status", "recommendation"], checks.map(c => [c.issue, c.requestedYear, c.mapLayer, c.point, c.expected, c.actual, c.status, c.recommendation])));
    writeFileSync(join(outDir, "boundary-audit.md"), buildReport(checks));
    console.log(`World map boundary audit complete. Outputs written to ${outDir}`);
    for (const check of checks) {
        console.log(`${check.requestedYear} ${check.point}: expected ${check.expected}; actual ${check.actual}; ${check.status}`);
    }
}
async function checkHistoricalPoint(args) {
    const data = await fetch(`${HISTORICAL_BASEMAP_URL}world_${args.mapYear}.geojson`).then(response => response.json());
    const actual = data.features
        .filter(feature => feature.geometry && contains(feature.geometry, args.point.coords))
        .map(featureLabel)
        .join(" || ") || "none";
    return {
        issue: args.issue,
        requestedYear: args.requestedYear,
        mapLayer: String(args.mapYear),
        point: args.point.label,
        expected: args.expected,
        actual,
        status: args.sourceIssueIf(actual) ? "source_issue" : "ok",
        recommendation: args.recommendation,
    };
}
async function checkModernPoint(args) {
    const topology = await fetch(MODERN_WORLD_ATLAS_URL).then(response => response.json());
    const actual = topology.objects.countries.geometries
        .filter(geometry => geometryContains(topology, geometry, args.point.coords))
        .map(geometry => `${geometry.id} ${geometry.properties?.name ?? ""}`.trim())
        .join(" || ") || "none";
    return {
        issue: args.issue,
        requestedYear: args.requestedYear,
        mapLayer: "modern",
        point: args.point.label,
        expected: args.expected,
        actual,
        status: actual.includes("Russia") && actual.includes("Ukraine") ? "render_issue" : actual.includes("Ukraine") ? "ok" : "source_issue",
        recommendation: args.recommendation,
    };
}
function closestHistoricalMapYear(year) {
    let closest = AVAILABLE_MAP_YEARS[0];
    for (const candidate of AVAILABLE_MAP_YEARS) {
        if (candidate <= year)
            closest = candidate;
        else
            break;
    }
    return closest;
}
function featureLabel(feature) {
    const props = feature.properties ?? {};
    return [props.NAME, props.SUBJECTO, props.PARTOF].filter(Boolean).join(" | ");
}
function contains(geometry, point) {
    if (geometry.type === "Polygon")
        return polygonContains(geometry.coordinates, point);
    if (geometry.type === "MultiPolygon")
        return geometry.coordinates.some(polygon => polygonContains(polygon, point));
    return false;
}
function polygonContains(polygon, point) {
    if (!pointInRing(point, polygon[0]))
        return false;
    for (let i = 1; i < polygon.length; i++) {
        if (pointInRing(point, polygon[i]))
            return false;
    }
    return true;
}
function pointInRing(point, ring) {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0], yi = ring[i][1];
        const xj = ring[j][0], yj = ring[j][1];
        const intersects = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
        if (intersects)
            inside = !inside;
    }
    return inside;
}
function geometryContains(topology, geometry, point) {
    if (geometry.type === "Polygon") {
        return topoPolygonContains(topology, geometry.arcs, point);
    }
    return geometry.arcs.some(polygon => topoPolygonContains(topology, polygon, point));
}
function topoPolygonContains(topology, polygon, point) {
    const rings = polygon.map(ring => stitch(topology, ring));
    return polygonContains(rings, point);
}
function stitch(topology, arcIndexes) {
    const out = [];
    for (const arcIndex of arcIndexes) {
        const arc = decodeArc(topology, arcIndex);
        if (out.length && arc.length)
            out.push(...arc.slice(1));
        else
            out.push(...arc);
    }
    return out;
}
function decodeArc(topology, arcIndex) {
    const raw = topology.arcs[Math.abs(arcIndex)];
    const [sx, sy] = topology.transform.scale;
    const [tx, ty] = topology.transform.translate;
    let x = 0;
    let y = 0;
    const coords = raw.map(([dx, dy]) => {
        x += dx;
        y += dy;
        return [x * sx + tx, y * sy + ty];
    });
    return arcIndex < 0 ? coords.reverse() : coords;
}
function buildReport(checks) {
    return [
        "# World Map Boundary Audit",
        "",
        `Generated: ${new Date().toISOString()}`,
        "",
        "This audit checks known disputed or time-sensitive boundary cases against the basemap sources used by the live World Alignment map.",
        "",
        "| Issue | Requested year | Map layer | Point | Expected | Actual source hit | Status | Recommendation |",
        "|---|---:|---:|---|---|---|---|---|",
        ...checks.map(c => `| ${mdCell(c.issue)} | ${c.requestedYear} | ${c.mapLayer} | ${mdCell(c.point)} | ${mdCell(c.expected)} | ${mdCell(c.actual)} | ${c.status} | ${mdCell(c.recommendation)} |`),
        "",
        "## Interpretation",
        "",
        "- Tibet is a historical-basemaps source issue for the 1960 layer. The map should resolve Tibet to China for requested years >= 1951 unless a better intermediate layer is adopted.",
        "- Crimea is correct in the 1994, 2000, and 2010 historical layers, but modern world-atlas overlaps Russia and Ukraine at Crimea. The live map should render Ukraine above Russia for the modern layer.",
        "- The live map now uses the extra available historical layers 1800, 1900, 1930, 2000, and 2010 instead of jumping from 1960 straight to modern.",
        "",
    ].join("\n");
}
function toCsv(header, rows) {
    return [
        header.map(csvQuote).join(","),
        ...rows.map(row => row.map(value => csvQuote(String(value))).join(",")),
    ].join("\n");
}
function csvQuote(value) {
    if (/[",\n]/.test(value))
        return `"${value.replace(/"/g, '""')}"`;
    return value;
}
function mdCell(value) {
    return value.replace(/\|/g, "<br>").replace(/\n/g, " ");
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
//# sourceMappingURL=world-map-boundary-audit.js.map