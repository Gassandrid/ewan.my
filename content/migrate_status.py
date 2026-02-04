#!/usr/bin/env python3
"""
Migration script to convert checkbox-based status to the status property
for consumption content (books, papers, videos).

Migration logic:
- Books: completed: true → status: "done", otherwise keep existing status
- Papers/Videos:
  - watched: true AND completed: true → status: "done"
  - watched: true only → status: "watched"
  - neither or both false → status: "none"
"""

import os
import re
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import yaml


def extract_frontmatter(content: str) -> Tuple[Optional[Dict[str, Any]], str, str]:
    """
    Extract YAML frontmatter from markdown content.
    Returns (frontmatter_dict, frontmatter_text, body_text)
    """
    # Match frontmatter between --- markers
    pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        return None, "", content

    frontmatter_text = match.group(1)
    body = match.group(2)

    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        return frontmatter, frontmatter_text, body
    except yaml.YAMLError as e:
        print(f"Error parsing YAML: {e}")
        return None, frontmatter_text, body


def determine_new_status_book(frontmatter: Dict[str, Any]) -> Optional[str]:
    """
    Determine new status for books.
    If completed has any truthy value (True, date, etc.), return "done"
    Otherwise, keep existing status or return None to not set it
    """
    completed = frontmatter.get('completed')
    existing_status = frontmatter.get('status')

    # If completed has any truthy value (True, a date, etc.), mark as done
    if completed:
        return "done"
    elif existing_status:
        return existing_status
    else:
        return "none"


def determine_new_status_paper_video(frontmatter: Dict[str, Any]) -> str:
    """
    Determine new status for papers and videos.
    - Both watched and completed (truthy values) → "done"
    - Only watched (truthy) → "watched"
    - Neither → "none"
    """
    watched = frontmatter.get('watched', False)
    completed = frontmatter.get('completed', False)

    # Check for truthy values (True, dates, etc.)
    if watched and completed:
        return "done"
    elif watched:
        return "watched"
    else:
        return "none"


def migrate_file(file_path: Path, dry_run: bool = False) -> bool:
    """
    Migrate a single file's status properties.
    Returns True if file was modified, False otherwise.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False

    frontmatter, fm_text, body = extract_frontmatter(content)

    if frontmatter is None:
        print(f"No frontmatter found in {file_path}")
        return False

    # Determine file class
    file_class = frontmatter.get('class')
    if not file_class:
        print(f"No class found in {file_path}")
        return False

    # Normalize class to list
    if isinstance(file_class, str):
        file_class = [file_class]
    elif not isinstance(file_class, list):
        file_class = []

    # Check if this is a book, paper, or video
    is_book = 'book' in file_class
    is_paper = 'paper' in file_class
    is_video = 'video' in file_class

    if not (is_book or is_paper or is_video):
        print(f"Skipping {file_path}: not a book, paper, or video")
        return False

    # Determine new status
    if is_book:
        new_status = determine_new_status_book(frontmatter)
        properties_to_remove = ['completed']
    else:  # paper or video
        new_status = determine_new_status_paper_video(frontmatter)
        properties_to_remove = ['watched', 'completed']

    # Check if we need to make changes
    has_checkboxes = any(prop in frontmatter for prop in properties_to_remove)
    current_status = frontmatter.get('status')

    if not has_checkboxes and current_status == new_status:
        print(f"No changes needed for {file_path}")
        return False

    # Store original values for dry-run display
    original_completed = frontmatter.get('completed', False)
    original_watched = frontmatter.get('watched', False)

    if dry_run:
        print(f"[DRY RUN] Would update {file_path}")
        print(f"  Class: {file_class}")
        if is_book:
            print(f"  completed: {original_completed} → status: {new_status}")
        else:
            print(f"  watched: {original_watched}, completed: {original_completed} → status: {new_status}")
        return True

    # Update frontmatter
    frontmatter['status'] = new_status
    for prop in properties_to_remove:
        if prop in frontmatter:
            del frontmatter[prop]

    # Reconstruct the file with updated frontmatter
    new_frontmatter_text = yaml.dump(frontmatter,
                                      default_flow_style=False,
                                      allow_unicode=True,
                                      sort_keys=False)
    new_content = f"---\n{new_frontmatter_text}---\n{body}"

    # Write the updated content
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ Updated {file_path}")
        print(f"  Status: {new_status}")
        return True
    except Exception as e:
        print(f"Error writing {file_path}: {e}")
        return False


def find_content_files(base_path: Path) -> list[Path]:
    """
    Find all markdown files in the vault that might be consumption content.
    """
    patterns = [
        base_path / "Resources" / "textbooks" / "*.md",
        base_path / "Resources" / "papers" / "*.md",
        base_path / "Resources" / "papers" / "UVM" / "*.md",
        base_path / "Resources" / "youtube" / "*.md",
    ]

    files = []
    for pattern in patterns:
        files.extend(pattern.parent.glob(pattern.name))

    # Also do a broader search to catch any we might have missed
    for md_file in base_path.rglob("*.md"):
        if md_file not in files:
            # Check if it might be a consumption content file by reading it
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    first_lines = ''.join([f.readline() for _ in range(20)])
                    if 'class:' in first_lines and any(c in first_lines for c in ['book', 'paper', 'video']):
                        files.append(md_file)
            except:
                pass

    return list(set(files))


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Migrate consumption content status from checkboxes to status property')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be changed without actually changing it')
    parser.add_argument('--vault-path', type=str, default='/Users/gassandrid/VAULT', help='Path to vault')

    args = parser.parse_args()

    vault_path = Path(args.vault_path)
    if not vault_path.exists():
        print(f"Error: Vault path {vault_path} does not exist")
        return

    print(f"Scanning for consumption content files in {vault_path}...")
    files = find_content_files(vault_path)
    print(f"Found {len(files)} potential files to process\n")

    modified_count = 0
    for file_path in sorted(files):
        if migrate_file(file_path, dry_run=args.dry_run):
            modified_count += 1
        print()

    print(f"\n{'Would modify' if args.dry_run else 'Modified'} {modified_count} files")


if __name__ == "__main__":
    main()
