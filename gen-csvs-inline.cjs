// Generate CSVs by re-using the bundled simulation logic
// We'll parse the validate output to build the CSVs

const { execSync } = require('child_process');
const fs = require('fs');

// Get the full validate output
const output = execSync('node dist/validate.cjs', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

// Extract candidate profiles from the election files directly
const electionFiles = [
  'src/historical/elections-1789-1852.ts',
  'src/historical/elections-1856-1888.ts', 
  'src/historical/elections-1892-1916.ts',
  'src/historical/elections-1920-1936.ts',
  'src/historical/candidates.ts',
];

const candidates = [];
for (const file of electionFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Find all candidate blocks
  const yearBlocks = content.matchAll(/year:\s*(\d{4}),\s*\n\s*candidates:\s*\[/g);
  for (const ym of yearBlocks) {
    // just use regex to extract structured data
  }
}

// Actually, let's just extract from the validate output which shows votes per archetype
// Parse lines like: "1789  Washington         100.0  Washington      100.0%"
const electionLines = output.split('\n').filter(l => /^\s+\d{4}\s+\w/.test(l));
console.log(`Found ${electionLines.length} election result lines`);

// For candidate profiles, parse the TS files
const profileRows = ['year,name,party,MAT,CD,CU,MOR,PRO,COM,ZS,ONT_H,ONT_S,PF,TRB,ENG,EPS,AES'];
for (const file of electionFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Match candidate objects
  const re = /name:\s*"([^"]+)"[\s\S]*?party:\s*"([^"]+)"[\s\S]*?year:\s*(\d+)[\s\S]*?MAT:\s*(\d+)[\s\S]*?CD:\s*(\d+)[\s\S]*?CU:\s*(\d+)[\s\S]*?MOR:\s*(\d+)[\s\S]*?PRO:\s*(\d+)[\s\S]*?COM:\s*(\d+)[\s\S]*?ZS:\s*(\d+)[\s\S]*?ONT_H:\s*(\d+)[\s\S]*?ONT_S:\s*(\d+)[\s\S]*?PF:\s*(\d+)[\s\S]*?TRB:\s*(\d+)[\s\S]*?ENG:\s*(\d+)[\s\S]*?EPS:\s*(\d+)[\s\S]*?AES:\s*(\d+)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    profileRows.push(m.slice(3, 1).concat(m.slice(1, 3), m.slice(4)).join(','));
  }
}

// Simpler approach: extract with a more targeted regex
const profileRows2 = ['year,name,party,MAT,CD,CU,MOR,PRO,COM,ZS,ONT_H,ONT_S,PF,TRB,ENG,EPS,AES'];
for (const file of electionFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Split by candidate blocks
  const blocks = content.split(/\{\s*\n\s*name:/);
  for (let i = 1; i < blocks.length; i++) {
    const block = 'name:' + blocks[i].split(/\},?\s*\n\s*\]/)[0];
    const get = (key) => {
      const m = block.match(new RegExp(key + ':\\s*(\\d+)'));
      return m ? m[1] : '';
    };
    const name = (block.match(/name:\s*"([^"]+)"/) || [])[1] || '';
    const party = (block.match(/party:\s*"([^"]+)"/) || [])[1] || '';
    const year = get('year');
    if (!year || !name) continue;
    profileRows2.push([year, name, party, get('MAT'), get('CD'), get('CU'), get('MOR'), get('PRO'), get('COM'), get('ZS'), get('ONT_H'), get('ONT_S'), get('PF'), get('TRB'), get('ENG'), get('EPS'), get('AES')].join(','));
  }
}

fs.writeFileSync('output/candidate_profiles.csv', profileRows2.join('\n'));
console.log(`Wrote candidate_profiles.csv: ${profileRows2.length - 1} candidates`);
