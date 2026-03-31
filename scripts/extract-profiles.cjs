const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "..", "src", "config", "archetypes.ts"),
  "utf8"
);

// Match each archetype object block
const archetypeRegex = /\{\s*\n\s*id:\s*"(\d+)",\s*\n\s*name:\s*"([^"]+)"/g;

const continuousNodes = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG"
];

const header = ["ID", "Name"].concat(continuousNodes).join("|");
const rows = [header];

// Find all archetypes and extract their blocks
// We'll find each archetype start, then grab enough text to cover its nodes
let match;
const starts = [];
while ((match = archetypeRegex.exec(src)) !== null) {
  starts.push({ index: match.index, id: match[1], name: match[2] });
}

for (let i = 0; i < starts.length; i++) {
  const start = starts[i].index;
  // Block goes until next archetype start or end of array
  const end = (i + 1 < starts.length) ? starts[i + 1].index : src.length;
  const block = src.substring(start, end);

  const positions = continuousNodes.map(function(node) {
    const re = new RegExp(node + ':\s*\{\s*kind:\s*"continuous",\s*pos:\s*(\d+)');
    const m = block.match(re);
    return m ? m[1] : "";
  });

  rows.push([starts[i].id, starts[i].name].concat(positions).join("|"));
}

console.log("Extracted " + (rows.length - 1) + " archetypes");

const outDir = path.join(__dirname, "..", "output");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "archetype-profiles.csv");
fs.writeFileSync(outPath, rows.join("\n") + "\n", "utf8");
console.log("Written to " + outPath);
