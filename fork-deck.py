#!/usr/bin/env python3
"""Fork the presentation: extract 20 specific slides, renumber, remove nav SVG, add Serif logo."""
import re

# User slides (1-indexed) → data-slide (0-indexed)
# User: 1,4,11,12,13,15, 22-26, 28-31, 35-38, 40
KEEP = [0, 3, 10, 11, 12, 14, 21, 22, 23, 24, 25, 27, 28, 29, 30, 34, 35, 36, 37, 39]
OLD_TO_NEW = {old: new_idx for new_idx, old in enumerate(KEEP)}

DAG_TYPES = {
    0: 'null', 3: 'null', 10: "'association'", 11: "'intervention'",
    12: "['intervention','association']", 14: "'mechanism'",
    21: "'mechanism'", 22: "'mechanism'", 23: "'mechanism'",
    24: "'mechanism'", 25: "'mechanism'",
    27: "'identification'", 28: "'mechanism'",
    29: "'identification'", 30: "'identification'",
    34: "'counterfactual'", 35: "'actionability'", 36: "'actionability'",
    37: "'understanding'", 39: 'null'
}

SLIDE_NAMES = {
    0: 'title-hero', 3: 'dep-chain', 10: 'pearl-ladder', 11: 'toothpaste-price',
    12: 'emancipation', 14: 'mediators', 21: 'clip-1', 22: 'dag-after-cut1',
    23: 'clip-2', 24: 'dag-after-cut2', 25: 'clip-3',
    27: 'competing-explanations', 28: 'real-dag',
    29: 'serif-intro', 30: 'serif-data',
    34: 'hte', 35: 'affordance', 36: 'morph-panel',
    37: 'subgroup-dags', 39: 'closing'
}

SERIF_SLIDES = {29, 30}

SERIF_LOGO = '<div style="align-self:flex-end;margin-bottom:-20px;opacity:0.7"><svg viewBox="0 0 120 36" style="width:100px;height:auto"><text x="60" y="26" text-anchor="middle" fill="#C49A4A" font-family="Cormorant Garamond, serif" font-size="28" font-weight="600" letter-spacing="0.08em">SERIF</text></svg></div>\n'

FILE = 'aaru-frame-presentation-v9.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# --- Find boundaries ---
# Match both class="slide" and class="slide active"
slide_re = re.compile(r'<div class="slide(?:\s+active)?" data-slide="(\d+)"')
matches = list(slide_re.finditer(content))
print(f"Found {len(matches)} slides in file")

nav_pos = content.index('<div class="slide-nav"')
script_match = re.search(r'\n<script', content[nav_pos:])
script_pos = nav_pos + script_match.start()

# --- Split ---
preamble = content[:matches[0].start()]
postamble = content[script_pos:]

slide_regions = {}
for i, m in enumerate(matches):
    start = m.start()
    end = matches[i+1].start() if i + 1 < len(matches) else nav_pos
    num = int(m.group(1))
    slide_regions[num] = content[start:end]

nav_section = content[nav_pos:script_pos]

# Verify all requested slides exist
for old_num in KEEP:
    assert old_num in slide_regions, f"Slide {old_num} not found! Available: {sorted(slide_regions.keys())}"

# --- Remove mini-dag CSS from preamble ---
for pat in [
    r'\.mini-dag\{[^}]+\}\n?',
    r'\.mini-dag\.visible\{[^}]+\}\n?',
    r'\.mini-dag svg\{[^}]+\}\n?',
    r'\.mini-dag text\{[^}]+\}\n?',
    r'\.mini-dag text\.active\{[^}]+\}\n?',
    r'\.mini-dag text\[data-dag="[^"]+"\]\{[^}]+\}\n?',
    r'\.mini-dag text\[data-dag="[^"]+"\]\.active\{[^}]+\}\n?',
    r'\.mini-dag line\{[^}]+\}\n?',
]:
    preamble = re.sub(pat, '', preamble)

# --- Build kept slides ---
new_slides = []
for new_num, old_num in enumerate(KEEP):
    section = slide_regions[old_num]
    # Renumber data-slide (handle "slide active" case too)
    section = re.sub(r'data-slide="\d+"', f'data-slide="{new_num}"', section, count=1)
    # Add Serif logo
    if old_num in SERIF_SLIDES:
        inner = re.search(r'(<div class="slide-inner"[^>]*>)', section)
        if inner:
            pos = inner.end()
            section = section[:pos] + '\n' + SERIF_LOGO + section[pos:]
    new_slides.append(section)

# --- Clean nav section: remove mini-dag, update counter ---
nav_section = re.sub(r'<div class="mini-dag"[^>]*>.*?</div>\s*\n?', '\n', nav_section, flags=re.DOTALL)
nav_section = re.sub(r'\d+ / \d+', f'1 / {len(KEEP)}', nav_section)

# --- Update JS in postamble ---
# SLIDE_COUNT
postamble = re.sub(r'const SLIDE_COUNT = \d+;', f'const SLIDE_COUNT = {len(KEEP)};', postamble)

# DAG_MAP
dag_entries = []
for new_num, old_num in enumerate(KEEP):
    comma = ',' if new_num < len(KEEP) - 1 else ''
    pad = '  ' if new_num < 10 else ' '
    dag_entries.append(f"  {new_num}: {DAG_TYPES[old_num]}{comma}{pad}// {SLIDE_NAMES[old_num]}")
new_dag = 'const DAG_MAP = {\n' + '\n'.join(dag_entries) + '\n};'
postamble = re.sub(r'const DAG_MAP = \{[^}]+\};', new_dag, postamble, flags=re.DOTALL)

# pearlSlideIds — only old 12 and 14 are kept
postamble = re.sub(
    r'const pearlSlideIds = \{[^}]+\};',
    f"const pearlSlideIds = {{{OLD_TO_NEW[12]}: 'backdoor', {OLD_TO_NEW[14]}: 'frontdoor'}};",
    postamble
)

# pearlEnterFns
postamble = re.sub(
    r'const pearlEnterFns = \{[^}]+\};',
    f'const pearlEnterFns = {{{OLD_TO_NEW[12]}: backdoorEnter, {OLD_TO_NEW[14]}: frontdoorEnter}};',
    postamble
)

# attrEnterFns — remap kept, remove not-kept
postamble = re.sub(r'  attrEnterFns\[19\] = makeEnterFn\(0\);\n', '', postamble)
postamble = postamble.replace('attrEnterFns[21]', f'attrEnterFns[{OLD_TO_NEW[21]}]')
postamble = postamble.replace('attrEnterFns[23]', f'attrEnterFns[{OLD_TO_NEW[23]}]')

# Disable mini-dag JS
postamble = re.sub(
    r"const miniDag = document\.getElementById\('mini-dag'\);",
    "const miniDag = null; // mini-dag removed",
    postamble
)

# --- Assemble ---
final = preamble + ''.join(new_slides) + nav_section + postamble

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(final)

print(f"\nDone. {len(KEEP)} slides in forked deck:")
for new_num, old_num in enumerate(KEEP):
    serif = ' [+SERIF LOGO]' if old_num in SERIF_SLIDES else ''
    print(f"  old {old_num:2d} -> new {new_num:2d}  ({SLIDE_NAMES[old_num]}){serif}")
