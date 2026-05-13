import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { AMERICAS } from "../global/jurisdictions-americas.js";
import { ASIA } from "../global/jurisdictions-asia.js";
import { EUROPE_PART1 } from "../global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../global/jurisdictions-europe2.js";
import { MENA_AFRICA } from "../global/jurisdictions-mena.js";
const ALL_REGIMES = [
    ...EUROPE_PART1,
    ...EUROPE_PART2,
    ...AMERICAS,
    ...ASIA,
    ...MENA_AFRICA,
];
const HISTORICAL_MAP_YEARS = [1715, 1783, 1800, 1815, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010];
const REQUESTED_YEARS = [1715, 1783, 1789, 1815, 1880, 1914, 1920, 1938, 1945, 1960, 1994, 2026];
const HISTORICAL_BASEMAP_URL = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/";
const MODERN_WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
// This mirrors the current live-page manual map. The improved audit also uses
// the source TopoJSON country names, which is the desired fallback.
const CURRENT_RENDERER_COUNTRY_ID_MAP = {
    "4": "Afghanistan", "36": "Australia", "40": "Austria", "56": "Belgium", "76": "Brazil", "124": "Canada",
    "152": "Chile", "156": "China", "158": "Taiwan", "170": "Colombia", "208": "Denmark",
    "246": "Finland", "250": "France", "276": "Germany", "300": "Greece", "356": "India",
    "360": "Indonesia", "364": "Iran", "368": "Iraq", "372": "Ireland", "376": "Israel",
    "380": "Italy", "392": "Japan", "408": "North Korea", "410": "South Korea", "484": "Mexico",
    "528": "Netherlands", "554": "New Zealand", "578": "Norway", "586": "Pakistan",
    "604": "Peru", "608": "Philippines", "616": "Poland", "620": "Portugal",
    "643": "Russia", "682": "Saudi Arabia", "710": "South Africa", "724": "Spain",
    "752": "Sweden", "756": "Switzerland", "764": "Thailand", "792": "Turkey",
    "804": "Ukraine", "826": "United Kingdom", "840": "United States",
    "862": "Venezuela", "32": "Argentina", "818": "Egypt", "566": "Nigeria",
    "404": "Kenya", "288": "Ghana", "100": "Bulgaria", "642": "Romania",
    "203": "Czech Republic", "348": "Hungary", "703": "Slovakia",
};
const EXACT_ALIASES = {
    "united states": "USA",
    "united states of america": "USA",
    "usa": "USA",
    "us": "USA",
    "russia": "Russia/USSR",
    "russian federation": "Russia/USSR",
    "ussr": "Russia/USSR",
    "soviet union": "Russia/USSR",
    "turkey": "Ottoman Empire/Turkey",
    "turkiye": "Ottoman Empire/Turkey",
    "ottoman empire": "Ottoman Empire/Turkey",
    "austria": "Austria/Austria-Hungary",
    "austria-hungary": "Austria/Austria-Hungary",
    "austro-hungarian empire": "Austria/Austria-Hungary",
    "germany": "Germany/Prussia",
    "german empire": "Germany/Prussia",
    "prussia": "Germany/Prussia",
    "west germany": "Germany/Prussia",
    "east germany": "Germany/Prussia",
    "czech republic": "Czech/Czechoslovakia",
    "czechia": "Czech/Czechoslovakia",
    "czechoslovakia": "Czech/Czechoslovakia",
    "korea": "Korea",
    "south korea": "South Korea",
    "republic of korea": "South Korea",
    "korea, republic of": "South Korea",
    "north korea": "North Korea",
    "democratic people's republic of korea": "North Korea",
    "korea, democratic people's republic of": "North Korea",
    "dprk": "North Korea",
    "vietnam": "Vietnam",
    "viet nam": "Vietnam",
    "north vietnam": "Vietnam",
    "south vietnam": "Vietnam",
    "persia": "Iran",
    "iran, islamic republic of": "Iran",
    "siam": "Thailand",
    "imperial japan": "Japan",
    "qing": "China",
    "qing china": "China",
    "republic of china": "Taiwan",
    "taiwan, province of china": "Taiwan",
    "formosa": "Taiwan",
    "m?ori": "New Zealand",
    "maori": "New Zealand",
    "māori": "New Zealand",
    "malaya": "Malaysia",
    "federated malay states": "Malaysia",
    "algiers": "Algeria",
    "tunis": "Tunisia",
    "tripolitania": "Libya",
    "cyrenaica": "Libya",
    "fezzan": "Libya",
    "asante": "Ghana",
    "gold coast": "Ghana",
    "hausa states": "Nigeria",
    "oyo": "Nigeria",
    "bornu-kanem": "Nigeria",
    "borno": "Nigeria",
    "kongo": "Dem. Rep. Congo",
    "congo": "Dem. Rep. Congo",
    "luba": "Dem. Rep. Congo",
    "lunda": "Dem. Rep. Congo",
    "cochin china": "Vietnam",
    "đại việt": "Vietnam",
    "dai viet": "Vietnam",
    "annam": "Vietnam",
    "arakan": "Myanmar",
    "kandy": "Sri Lanka",
    "ceylon": "Sri Lanka",
    "mysore": "India",
    "carnatic": "India",
    "madras": "India",
    "british east india company": "India",
    "indian princely states": "India",
    "hyderabad": "India",
    "maratha": "India",
    "maratha confederacy": "India",
    "awadh": "India",
    "sikh empire": "Pakistan",
    "punjab": "Pakistan",
    "xhosa": "South Africa",
    "zulu": "South Africa",
    "sotho": "South Africa",
    "kingdom of the two sicilies": "Italy",
    "papal states": "Italy",
    "tuscany": "Italy",
    "venetia": "Italy",
    "parma": "Italy",
    "modena": "Italy",
    "lucca": "Italy",
    "massa": "Italy",
    "pontremoli": "Italy",
    "fivizzano": "Italy",
    "hanover": "Germany/Prussia",
    "brunswick": "Germany/Prussia",
    "oldenburg": "Germany/Prussia",
    "hamburg": "Germany/Prussia",
    "bremen": "Germany/Prussia",
    "lübeck": "Germany/Prussia",
    "lubeck": "Germany/Prussia",
    "holstein": "Germany/Prussia",
    "waldeck": "Germany/Prussia",
    "lippe-detmold": "Germany/Prussia",
    "schaumburg-lippe": "Germany/Prussia",
    "hohenzollern": "Germany/Prussia",
    "anhalt": "Germany/Prussia",
    "united kingdom of great britain and ireland": "United Kingdom",
    "great britain": "United Kingdom",
    "uk": "United Kingdom",
    "britain": "United Kingdom",
    "british india": "India",
    "india (uk)": "India",
    "dutch east indies": "Indonesia",
    "netherlands east indies": "Indonesia",
    "new spain": "Mexico",
    "spanish philippines": "Philippines",
    "burma": "Myanmar",
    "abyssinia": "Ethiopia",
    "dem. rep. congo": "Dem. Rep. Congo",
    "dr congo": "Dem. Rep. Congo",
    "drc": "Dem. Rep. Congo",
    "dominican rep.": "Dominican Republic",
    "central african rep.": "Central African Republic",
};
const MODERN_ADDITION_PLAN = {
    "Australia": {
        country: "Australia",
        priority: "P0",
        region: "Oceania",
        reason: "Already appears in live modern ID map but has no alignment rows; large Anglosphere democracy and regional anchor.",
        suggestedPeriods: "Indigenous polities/pre-contact baseline; British penal colony (1788-1850s); responsible government/federation (1850s-1914); wartime/White Australia (1914-1945); postwar social-liberal democracy (1945-1996); contemporary Australia (1996-2026)",
    },
    "Ukraine": {
        country: "Ukraine",
        priority: "P0",
        region: "Europe",
        reason: "Already appears in live modern ID map and is a core post-Soviet / war-era case.",
        suggestedPeriods: "Cossack Hetmanate/partition legacy; imperial Russian/Austrian Ukraine (1789-1917); Ukrainian revolution/Soviet incorporation (1917-1939); WWII/late Soviet Ukraine (1939-1991); oligarchic independence (1991-2013); Maidan/war democracy (2014-2026)",
    },
    "Denmark": {
        country: "Denmark",
        priority: "P1",
        region: "Europe",
        reason: "Already appears in live modern ID map; fills Scandinavia/Nordic constitutional family.",
        suggestedPeriods: "Absolutist Denmark-Norway (1660-1814); constitutional monarchy (1849-1914); welfare-state Denmark (1945-2001); contemporary Denmark (2001-2026)",
    },
    "Finland": {
        country: "Finland",
        priority: "P1",
        region: "Europe",
        reason: "Already appears in live modern ID map; important Nordic/Russian-border case.",
        suggestedPeriods: "Swedish/Russian grand duchy context (1789-1917); independence/civil war/interwar (1917-1939); WWII/Finlandization (1939-1991); EU/NATO-era Finland (1991-2026)",
    },
    "Ireland": {
        country: "Ireland",
        priority: "P1",
        region: "Europe",
        reason: "Already appears in live modern ID map; major Anglophone, Catholic-national, postcolonial democracy.",
        suggestedPeriods: "Kingdom/Union Ireland (1789-1916); revolutionary/free state (1916-1937); de Valera republic (1937-1973); EU/Celtic Tiger Ireland (1973-2008); contemporary Ireland (2009-2026)",
    },
    "Norway": {
        country: "Norway",
        priority: "P1",
        region: "Europe",
        reason: "Already appears in live modern ID map; completes core Nordic cases.",
        suggestedPeriods: "Danish/Swedish union period (1789-1905); independent constitutional Norway (1905-1945); social-democratic oil state (1945-1990); contemporary Norway (1990-2026)",
    },
    "New Zealand": {
        country: "New Zealand",
        priority: "P1",
        region: "Oceania",
        reason: "Already appears in live modern ID map; key settler-democracy and Indigenous treaty case.",
        suggestedPeriods: "Maori polities/pre-Treaty; British colony/Treaty era (1840-1907); dominion welfare democracy (1907-1984); neoliberal reform and bicultural state (1984-2026)",
    },
    "Kenya": {
        country: "Kenya",
        priority: "P1",
        region: "Africa",
        reason: "Already appears in live modern ID map; East African anchor missing from alignment data.",
        suggestedPeriods: "Coastal Swahili/interior polities; British East Africa/settler colony (1895-1963); Kenyatta/Moi dominant-party state (1963-2002); multiparty Kenya (2002-2026)",
    },
    "Bulgaria": {
        country: "Bulgaria",
        priority: "P1",
        region: "Europe",
        reason: "Already appears in live modern ID map; useful Balkan/Ottoman-to-communist-to-EU case.",
        suggestedPeriods: "Ottoman Bulgaria (1396-1878); principality/kingdom (1878-1944); communist Bulgaria (1944-1989); democratic/EU Bulgaria (1989-2026)",
    },
    "Slovakia": {
        country: "Slovakia",
        priority: "P1",
        region: "Europe",
        reason: "Already appears in live modern ID map; separates modern Slovakia from the Czech/Czechoslovak aggregate.",
        suggestedPeriods: "Habsburg Hungary baseline; Czechoslovak period (1918-1938); wartime Slovak state (1939-1945); Czechoslovak communist/federal era (1945-1992); independent Slovakia (1993-2026)",
    },
    "Ghana": {
        country: "Ghana",
        priority: "P1",
        region: "Africa",
        reason: "Already appears in live modern ID map; West African decolonization anchor.",
        suggestedPeriods: "Asante/Gold Coast precolonial-colonial baseline; Nkrumah developmental state (1957-1966); coups/Rawlings era (1966-1992); stable multiparty Ghana (1992-2026)",
    },
    "Bangladesh": {
        country: "Bangladesh",
        priority: "P1",
        region: "South Asia",
        reason: "Large population missing from modern coverage and historically separable from India/Pakistan after 1971.",
        suggestedPeriods: "Bengal under Mughal/EIC/Raj context; East Pakistan (1947-1971); independence and military-party cycles (1971-1990); competitive/illiberal democratic Bangladesh (1991-2026)",
    },
    "Myanmar": {
        country: "Myanmar",
        priority: "P1",
        region: "Southeast Asia",
        reason: "Large Southeast Asian country missing from modern coverage, with sharply distinct military-state geometry.",
        suggestedPeriods: "Konbaung Burma (1752-1885); British Burma (1885-1948); parliamentary/military socialist Burma (1948-1988); SLORC/SPDC junta (1988-2011); partial opening/coup era (2011-2026)",
    },
    "Malaysia": {
        country: "Malaysia",
        priority: "P1",
        region: "Southeast Asia",
        reason: "Important plural, developmental, ethnic-coalitional regime not covered by Indonesia/Singapore.",
        suggestedPeriods: "Malay sultanates/Straits settlements; British Malaya (1874-1957); Alliance/Barisan Nasional developmental state (1957-2018); competitive coalition era (2018-2026)",
    },
    "Morocco": {
        country: "Morocco",
        priority: "P1",
        region: "MENA",
        reason: "North African monarchy missing from modern coverage; useful contrast with Algeria/Egypt/Tunisia.",
        suggestedPeriods: "Alawi sultanate (1666-1912); French/Spanish protectorate (1912-1956); Hassan II monarchy (1956-1999); Mohammed VI reformist monarchy (1999-2026)",
    },
    "Dem. Rep. Congo": {
        country: "Dem. Rep. Congo",
        priority: "P1",
        region: "Africa",
        reason: "Large population and territory; central African state-collapse/mineral-political economy case.",
        suggestedPeriods: "Kongo/Luba/Lunda regional polities; Congo Free State/Belgian Congo (1885-1960); Mobutu Zaire (1965-1997); war/postwar DRC (1997-2026)",
    },
    "Democratic Republic of the Congo": {
        country: "Democratic Republic of the Congo",
        priority: "P1",
        region: "Africa",
        reason: "Large population and territory; central African state-collapse/mineral-political economy case.",
        suggestedPeriods: "Kongo/Luba/Lunda regional polities; Congo Free State/Belgian Congo (1885-1960); Mobutu Zaire (1965-1997); war/postwar DRC (1997-2026)",
    },
    "Tanzania": {
        country: "Tanzania",
        priority: "P2",
        region: "Africa",
        reason: "East African socialist-to-dominant-party case; helps fill Africa in 1960+ maps.",
        suggestedPeriods: "Zanzibar/coastal and interior polities; German/British Tanganyika (1880s-1961); Nyerere ujamaa (1961-1985); CCM developmental dominance (1985-2026)",
    },
    "Sudan": {
        country: "Sudan",
        priority: "P2",
        region: "Africa/MENA",
        reason: "Large Nile/Sahel state with military-Islamist and civil-war geometry.",
        suggestedPeriods: "Funj/Darfur/Ottoman-Egyptian Sudan; Mahdist state (1885-1898); Anglo-Egyptian Sudan (1899-1956); postcolonial military-civil cycles (1956-1989); Islamist/military Sudan (1989-2026)",
    },
};
async function main() {
    const outDir = join(process.cwd(), "results", "world-map-coverage");
    mkdirSync(outDir, { recursive: true });
    const byJurisdiction = groupByJurisdiction(ALL_REGIMES);
    const alignmentKeys = new Set(byJurisdiction.keys());
    const coverageRows = [];
    const missingRows = [];
    for (const requestedYear of REQUESTED_YEARS) {
        const mapYear = requestedYear === 2026 ? "modern" : closestHistoricalMapYear(requestedYear);
        const features = await loadMapFeatures(mapYear);
        const seen = new Set();
        let currentRendererMatched = 0;
        let currentRendererActive = 0;
        let improvedMatched = 0;
        let improvedActive = 0;
        let improvedMatchedButNoEra = 0;
        let improvedMissing = 0;
        for (const feature of features) {
            const dedupeKey = `${feature.name}|${feature.subject ?? ""}|${feature.partOf ?? ""}`;
            if (seen.has(dedupeKey))
                continue;
            seen.add(dedupeKey);
            const currentName = currentRendererName(feature);
            const currentMatch = currentName ? matchAlignmentKey([currentName], alignmentKeys) : null;
            if (currentMatch) {
                currentRendererMatched++;
                if (findActiveEra(byJurisdiction, currentMatch, requestedYear))
                    currentRendererActive++;
            }
            const improvedMatch = matchAlignmentKey(improvedCandidateNames(feature, requestedYear), alignmentKeys);
            if (improvedMatch) {
                improvedMatched++;
                if (findActiveEra(byJurisdiction, improvedMatch, requestedYear)) {
                    improvedActive++;
                }
                else {
                    improvedMatchedButNoEra++;
                    missingRows.push(missingRow(feature, requestedYear, "matched_but_no_active_era"));
                }
            }
            else {
                improvedMissing++;
                missingRows.push(missingRow(feature, requestedYear, "no_alignment_jurisdiction"));
            }
        }
        coverageRows.push({
            mapYear: String(mapYear),
            requestedYear,
            featureCount: seen.size,
            currentRendererMatched,
            currentRendererActive,
            improvedMatched,
            improvedActive,
            improvedActivePct: pct(improvedActive, seen.size),
            improvedMatchedButNoEra,
            improvedMissing,
        });
    }
    const modernFeatures = await loadMapFeatures("modern");
    const modernMissing = uniqueModernMissing(modernFeatures, alignmentKeys);
    const immediatePlan = buildAdditionPlan(modernMissing);
    writeFileSync(join(outDir, "coverage-by-map-year.csv"), toCsv([
        "mapYear", "requestedYear", "featureCount",
        "currentRendererMatched", "currentRendererActive",
        "improvedMatched", "improvedActive", "improvedActivePct",
        "improvedMatchedButNoEra", "improvedMissing",
    ], coverageRows.map(r => [
        r.mapYear, r.requestedYear, r.featureCount,
        r.currentRendererMatched, r.currentRendererActive,
        r.improvedMatched, r.improvedActive, r.improvedActivePct,
        r.improvedMatchedButNoEra, r.improvedMissing,
    ])));
    writeFileSync(join(outDir, "missing-map-countries-by-year.csv"), toCsv(["mapYear", "requestedYear", "country", "subject", "partOf", "reason", "priority", "suggestedAction"], missingRows.map(r => [String(closestMapYearForLabel(r.requestedYear)), r.requestedYear, r.country, r.subject, r.partOf, r.reason, r.priority, r.suggestedAction])));
    writeFileSync(join(outDir, "modern-missing-countries.csv"), toCsv(["country", "priority", "region", "reason", "suggestedPeriods"], immediatePlan.map(p => [p.country, p.priority, p.region, p.reason, p.suggestedPeriods])));
    writeFileSync(join(outDir, "report.md"), buildReport(coverageRows, immediatePlan));
    console.log(`World map coverage audit complete. Outputs written to ${outDir}`);
    for (const row of coverageRows) {
        console.log(`${row.requestedYear}: active ${row.improvedActive}/${row.featureCount} (${row.improvedActivePct}), missing ${row.improvedMissing}`);
    }
}
async function loadMapFeatures(mapYear) {
    if (mapYear === "modern") {
        const response = await fetch(MODERN_WORLD_ATLAS_URL);
        if (!response.ok)
            throw new Error(`Failed to fetch ${MODERN_WORLD_ATLAS_URL}: ${response.status}`);
        const data = await response.json();
        return data.objects.countries.geometries.map(g => ({
            year: "modern",
            id: g.id,
            name: g.properties?.name ?? "",
            sourceName: g.properties?.name ?? "",
        }));
    }
    const response = await fetch(`${HISTORICAL_BASEMAP_URL}world_${mapYear}.geojson`);
    if (!response.ok)
        throw new Error(`Failed to fetch historical basemap ${mapYear}: ${response.status}`);
    const data = await response.json();
    return data.features.map(f => ({
        year: mapYear,
        name: stringProp(f.properties, "NAME"),
        subject: stringProp(f.properties, "SUBJECTO"),
        partOf: stringProp(f.properties, "PARTOF"),
        sourceName: stringProp(f.properties, "NAME"),
    })).filter(f => f.name.length > 0);
}
function stringProp(props, key) {
    const value = props?.[key];
    return typeof value === "string" ? value.trim() : "";
}
function currentRendererName(feature) {
    if (feature.year === "modern") {
        return CURRENT_RENDERER_COUNTRY_ID_MAP[String(feature.id)] ?? "";
    }
    return feature.name;
}
function improvedCandidateNames(feature, requestedYear) {
    const raw = [
        feature.name,
        stripParenthetical(feature.name),
        feature.subject ?? "",
        stripParenthetical(feature.subject ?? ""),
        feature.partOf ?? "",
        stripParenthetical(feature.partOf ?? ""),
    ];
    if (requestedYear >= 1951) {
        const hasTibet = raw.some(name => normalize(stripParenthetical(name)) === "tibet");
        if (hasTibet)
            raw.push("China");
    }
    return [...new Set(raw.map(s => s.trim()).filter(Boolean))];
}
function stripParenthetical(name) {
    return name.replace(/\s*\([^)]*\)\s*/g, "").trim();
}
function matchAlignmentKey(names, alignmentKeys) {
    for (const name of names) {
        if (alignmentKeys.has(name))
            return name;
        const alias = EXACT_ALIASES[normalize(name)];
        if (alias && alignmentKeys.has(alias))
            return alias;
    }
    return null;
}
function normalize(name) {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
}
function findActiveEra(byJurisdiction, jurisdiction, year) {
    const regimes = byJurisdiction.get(jurisdiction) ?? [];
    return regimes.find(r => year >= r.startYear && year <= r.endYear) ?? null;
}
function groupByJurisdiction(regimes) {
    const map = new Map();
    for (const regime of regimes) {
        const existing = map.get(regime.jurisdiction);
        if (existing)
            existing.push(regime);
        else
            map.set(regime.jurisdiction, [regime]);
    }
    return map;
}
function closestHistoricalMapYear(year) {
    let closest = HISTORICAL_MAP_YEARS[0];
    for (const candidate of HISTORICAL_MAP_YEARS) {
        if (candidate <= year)
            closest = candidate;
        else
            break;
    }
    return closest;
}
function closestMapYearForLabel(year) {
    return year === 2026 ? "modern" : closestHistoricalMapYear(year);
}
function missingRow(feature, requestedYear, reason) {
    const country = feature.name || feature.sourceName;
    const plan = MODERN_ADDITION_PLAN[country] ?? MODERN_ADDITION_PLAN[stripParenthetical(country)];
    const priority = plan?.priority ?? inferMissingPriority(country, requestedYear);
    return {
        mapYear: String(closestMapYearForLabel(requestedYear)),
        requestedYear,
        country,
        subject: feature.subject ?? "",
        partOf: feature.partOf ?? "",
        reason,
        priority,
        suggestedAction: plan?.suggestedPeriods ?? (reason === "matched_but_no_active_era"
            ? "Extend existing jurisdiction coverage to this map year or fix boundary convention."
            : "Add a new jurisdiction or alias if this is a major/recurring map polity."),
    };
}
function inferMissingPriority(country, year) {
    const normalized = normalize(stripParenthetical(country));
    const p0 = new Set(["australia", "ukraine"]);
    const p1 = new Set([
        "bangladesh", "myanmar", "morocco", "democratic republic of the congo", "dem. rep. congo",
        "denmark", "finland", "ireland", "norway", "new zealand", "kenya", "ghana",
        "bulgaria", "slovakia", "malaysia", "sri lanka", "libya", "tunisia", "angola",
        "sudan", "tanzania",
    ]);
    if (p0.has(normalized))
        return "P0";
    if (p1.has(normalized))
        return "P1";
    return year >= 1960 ? "P2" : "P2";
}
function uniqueModernMissing(features, alignmentKeys) {
    const missing = new Set();
    for (const feature of features) {
        if (!matchAlignmentKey(improvedCandidateNames(feature, 2026), alignmentKeys)) {
            const name = stripParenthetical(feature.name);
            if (name)
                missing.add(name);
        }
    }
    return [...missing].sort((a, b) => a.localeCompare(b));
}
function buildAdditionPlan(modernMissing) {
    return modernMissing.map(country => MODERN_ADDITION_PLAN[country] ?? {
        country,
        priority: inferMissingPriority(country, 2026),
        region: "TBD",
        reason: "Present in modern world-atlas basemap but not in PRISM alignment data.",
        suggestedPeriods: "Add source-backed modern jurisdiction sequence if this country is prioritized for broad map fill.",
    }).sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.country.localeCompare(b.country));
}
function priorityRank(priority) {
    return priority === "P0" ? 0 : priority === "P1" ? 1 : 2;
}
function buildReport(coverageRows, plan) {
    const p0 = plan.filter(p => p.priority === "P0");
    const p1 = plan.filter(p => p.priority === "P1");
    const modern = coverageRows.find(r => r.mapYear === "modern");
    return [
        "# World Map Coverage Audit",
        "",
        `Generated: ${new Date().toISOString()}`,
        "",
        "## Sources",
        "",
        `- Historical boundaries: ${HISTORICAL_BASEMAP_URL}`,
        `- Modern country geometries: ${MODERN_WORLD_ATLAS_URL}`,
        "",
        "## Coverage By Slider Year",
        "",
        "| Requested year | Map layer | Improved active / features | Improved active % | Missing features |",
        "|---:|---:|---:|---:|---:|",
        ...coverageRows.map(r => `| ${r.requestedYear} | ${r.mapYear} | ${r.improvedActive}/${r.featureCount} | ${r.improvedActivePct} | ${r.improvedMissing} |`),
        "",
        "## Modern Coverage",
        "",
        modern
            ? `With improved name handling, the modern map has active PRISM alignment data for ${modern.improvedActive}/${modern.featureCount} country features (${modern.improvedActivePct}).`
            : "Modern map row was not generated.",
        "",
        "## P0 Additions",
        "",
        ...p0.map(p => `- ${p.country}: ${p.reason}`),
        "",
        "## P1 Additions",
        "",
        ...p1.map(p => `- ${p.country}: ${p.reason}`),
        "",
        "## Output Files",
        "",
        "- `coverage-by-map-year.csv`",
        "- `missing-map-countries-by-year.csv`",
        "- `modern-missing-countries.csv`",
        "",
    ].join("\n");
}
function pct(numerator, denominator) {
    if (denominator <= 0)
        return "0.0%";
    return `${(100 * numerator / denominator).toFixed(1)}%`;
}
function toCsv(header, rows) {
    return [
        header.map(csvQuote).join(","),
        ...rows.map(row => row.map(value => csvQuote(String(value))).join(",")),
    ].join("\n");
}
function csvQuote(value) {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
//# sourceMappingURL=world-map-coverage-audit.js.map