import os
import argparse

def replace_tags(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        if len(lines) < 2 or lines[0].strip() != '---':
            return False

        end = -1
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                end = i
                break
        
        if end == -1:
            return False

        mod = False
        for i in range(1, end):
            if 'statistics' in lines[i]:
                new = lines[i].replace('statistics', 'math/statistics')
                if new != lines[i]:
                    lines[i] = new
                    mod = True
        
        if mod:
            with open(path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            return True

    except Exception as e:
        print(f"Error processing file {path}: {e}")
    
    return False

def main(dir):
    if not os.path.isdir(dir):
        print(f"Error: Directory not found at '{dir}'")
        return

    print(f"Scanning directory: {dir}\n")
    count = 0

    for root, _, files in os.walk(dir, followlinks=True):
        for file in files:
            if file.endswith((".md", ".markdown")):
                path = os.path.join(root, file)
                if replace_tags(path):
                    print(f"Modified: {path}")
                    count += 1
    
    print(f"\nScan complete. Modified {count} file(s).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Recursively find and replace tags within the YAML frontmatter of Markdown files."
    )
    parser.add_argument(
        "directory",
        type=str,
        help="The path to the directory containing Markdown files."
    )
    
    args = parser.parse_args()
    main(args.directory)
