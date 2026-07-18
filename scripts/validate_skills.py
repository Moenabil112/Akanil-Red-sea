#!/usr/bin/env python3
from pathlib import Path
import re, sys

root = Path(__file__).resolve().parents[1]
skills_dir = root / ".claude" / "skills"
errors = []
count = 0

for skill_md in sorted(skills_dir.glob("*/SKILL.md")):
    count += 1
    text = skill_md.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        errors.append(f"{skill_md}: missing opening frontmatter")
        continue
    parts = text.split("---", 2)
    if len(parts) < 3:
        errors.append(f"{skill_md}: malformed frontmatter")
        continue
    fm = parts[1]
    name = re.search(r"^name:\s*(.+)$", fm, re.M)
    desc = re.search(r"^description:\s*(.+)$", fm, re.M)
    if not name:
        errors.append(f"{skill_md}: missing name")
    elif name.group(1).strip() != skill_md.parent.name:
        errors.append(f"{skill_md}: name does not match directory")
    if not desc or len(desc.group(1).strip()) < 25:
        errors.append(f"{skill_md}: missing or weak description")
    if len(parts[2].strip()) < 200:
        errors.append(f"{skill_md}: skill body is too short")

print(f"Skills found: {count}")
if errors:
    print("Validation failed:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)
print("Validation passed.")
