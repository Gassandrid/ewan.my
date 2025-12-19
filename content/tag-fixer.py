#!/usr/bin/env python3
"""
Add or normalize YAML frontmatter property `fileClass` as a list containing "task"
for every Markdown (.md) file in the current working directory (non-recursive).

Behavior:
- If a file has no YAML frontmatter, one is created with fileClass: [task].
- If frontmatter exists:
  * If fileClass is missing -> set to [task].
  * If fileClass is a string -> convert to [existing] and ensure "task" is included.
  * If fileClass is a list -> ensure "task" is present (no duplicates).
  * If fileClass is null/other -> set to [task].
- Other frontmatter keys are preserved (comments may be lost if present).

Usage:
  python3 tag-fixer.py

Note: Run this script from the directory whose Markdown files you want to modify.
"""
from __future__ import annotations

import os
import sys
from typing import Tuple, Optional

try:
    import yaml  # PyYAML
except ImportError:
    print("This script requires PyYAML. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

FRONTMATTER_DELIM = "---"
TARGET_KEY = "fileClass"
TARGET_VALUE = "task"


def split_frontmatter(text: str) -> Tuple[Optional[str], str]:
    """Split text into (frontmatter_yaml, body). If no frontmatter, returns (None, text).

    Frontmatter is recognized as starting at the first line with '---' and ending at the next
    line that exactly equals '---'.
    """
    if not text.startswith(FRONTMATTER_DELIM):
        return None, text

    lines = text.splitlines()
    if not lines:
        return None, text

    if lines[0].strip() != FRONTMATTER_DELIM:
        return None, text

    # Find closing delimiter line index
    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].strip() == FRONTMATTER_DELIM:
            end_idx = i
            break

    if end_idx is None:
        # Malformed: opening without closing; treat as no frontmatter to avoid data loss
        return None, text

    fm_lines = lines[1:end_idx]
    body_lines = lines[end_idx + 1 :]
    fm_text = "\n".join(fm_lines).strip("\n")
    body_text = "\n".join(body_lines)
    if body_text and not body_text.endswith("\n"):
        body_text += "\n"
    return fm_text, body_text


def ensure_fileclass_in_frontmatter(fm_text: Optional[str]) -> str:
    """Given frontmatter YAML (or None), return a YAML string with TARGET_KEY ensured as a list containing TARGET_VALUE.
    Other keys are preserved. Comments/formatting may not be preserved.
    """
    data = {}  # type: ignore[var-annotated]
    if fm_text is not None and fm_text.strip():
        try:
            loaded = yaml.safe_load(fm_text)
            if isinstance(loaded, dict):
                data = loaded
            elif loaded is None:
                data = {}
            else:
                # Unexpected YAML type; wrap into a dict to avoid data loss
                data = {"_frontmatter_raw": loaded}
        except Exception:
            # If parsing fails, keep raw under a special key (best-effort preservation)
            data = {"_frontmatter_raw": fm_text}

    val = data.get(TARGET_KEY, None)
    if isinstance(val, list):
        items = [str(x) for x in val]
        if TARGET_VALUE not in items:
            items.append(TARGET_VALUE)
        data[TARGET_KEY] = items
    elif isinstance(val, str):
        items = [val] if val else []
        if TARGET_VALUE not in items:
            items.append(TARGET_VALUE)
        data[TARGET_KEY] = items
    else:
        data[TARGET_KEY] = [TARGET_VALUE]

    # Dump YAML with stable key order as encountered (PyYAML may reorder by insertion order in Python 3.7+)
    dumped = yaml.safe_dump(data, sort_keys=False, default_flow_style=False).strip()
    return dumped


def process_file(path: str) -> bool:
    """Process a single Markdown file. Returns True if the file was modified.
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            original = f.read()
    except (OSError, UnicodeDecodeError):
        print(f"[skip] Could not read file: {path}")
        return False

    fm_text, body = split_frontmatter(original)
    new_fm_yaml = ensure_fileclass_in_frontmatter(fm_text)

    new_text = f"{FRONTMATTER_DELIM}\n{new_fm_yaml}\n{FRONTMATTER_DELIM}\n"
    # Preserve a blank line between frontmatter and body if body exists
    if body:
        if not body.startswith("\n"):
            new_text += "\n"
        new_text += body

    if new_text != original:
        try:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_text)
            return True
        except OSError:
            print(f"[error] Failed to write file: {path}")
            return False
    else:
        return False


def main() -> int:
    md_files = [f for f in os.listdir(".") if f.lower().endswith(".md") and os.path.isfile(f)]
    if not md_files:
        print("No Markdown files found in current directory.")
        return 0

    modified = 0
    for fname in md_files:
        changed = process_file(fname)
        status = "updated" if changed else "ok"
        print(f"[{status}] {fname}")
        if changed:
            modified += 1

    print(f"Done. {modified} file(s) updated out of {len(md_files)} Markdown file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

