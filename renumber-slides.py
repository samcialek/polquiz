import re

with open(r'C:\Users\Sam\.openclaw\workspace\aaru-frame-presentation-v3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The new slide 4 is counterfactual-motivation
# Old slide 4 (video-clip) should now be 5
# All subsequent slides need +1

# Find all data-slide="N" where N >= 5 (the old numbering after our insert)
# But wait - the HTML comment already says "SLIDE 5: VIDEO CLIP" 
# Let me check what the current state is

# Find all slide divs with their IDs and current data-slide values
slides = re.findall(r'<div class="slide[^"]*" data-slide="(\d+)" id="([^"]+)"', content)
print("Current slides:")
for num, sid in slides:
    print(f"  data-slide={num} id={sid}")

# The issue: old slides 4-17 need to become 5-18
# But new slide 4 (counterfactual-motivation) is already at 4
# Need to increment old 4+ that aren't the new slide

# Actually, I changed the comment to "SLIDE 5: VIDEO CLIP" but the data-slide is still "4"
# Let me just renumber everything from the video-clip onwards

# Strategy: find video-clip's data-slide value and increment from there
def renumber(match):
    full = match.group(0)
    num = int(match.group(1))
    sid = match.group(2) if match.lastindex >= 2 else None
    
    # Don't touch slides 0-3 or the new counterfactual-motivation
    if sid == 'counterfactual-motivation':
        return full
    if num >= 4 and sid != 'counterfactual-motivation':
        new_num = num + 1
        return full.replace(f'data-slide="{num}"', f'data-slide="{new_num}"')
    return full

content = re.sub(
    r'<div class="slide[^"]*" data-slide="(\d+)" id="([^"]+)"',
    renumber,
    content
)

# Also update totalSlides in JS if it exists
content = re.sub(r'totalSlides\s*=\s*(\d+)', lambda m: f'totalSlides = {int(m.group(1)) + 1}', content)

# Update any slide navigation references
# Find the JS that handles slide transitions
slides_after = re.findall(r'data-slide="(\d+)"', content)
print("\nAfter renumbering:")
for s in sorted(set(slides_after), key=int):
    print(f"  data-slide={s}")

with open(r'C:\Users\Sam\.openclaw\workspace\aaru-frame-presentation-v3.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nDone!")
