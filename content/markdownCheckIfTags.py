#!/usr/bin/env python3

import os
import re
import yaml
from colorama import init, Fore, Style
from pathlib import Path

# Initialize colorama for cross-platform colored terminal output
init()

def check_markdown_files(root_dir="."):
    """
    Recursively checks all markdown files in a directory for YAML frontmatter tags.
    
    Args:
        root_dir (str): The root directory to start searching from
    
    Returns:
        list: Files missing tags in their YAML frontmatter
    """
    # Get all markdown files recursively
    md_files = list(Path(root_dir).rglob("*.md"))
    files_without_tags = []
    
    # Regular expression to extract YAML frontmatter
    yaml_pattern = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
    
    # Process each markdown file
    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                
                # Check if file has YAML frontmatter
                yaml_match = yaml_pattern.match(content)
                if yaml_match:
                    # Extract and parse YAML frontmatter
                    frontmatter_text = yaml_match.group(1)
                    frontmatter = yaml.safe_load(frontmatter_text)
                    
                    # Check if 'tags' key exists and has content
                    if 'tags' not in frontmatter or not frontmatter['tags']:
                        files_without_tags.append(str(file_path))
                else:
                    # File has no YAML frontmatter at all
                    files_without_tags.append(str(file_path))
        
        except Exception as e:
            print(f"{Fore.RED}Error processing {file_path}: {e}{Style.RESET_ALL}")
    
    return files_without_tags

def print_fancy_output(files_without_tags):
    """
    Prints a fancy formatted output listing files without tags
    
    Args:
        files_without_tags (list): List of files without tags
    """
    total_files = len(files_without_tags)
    
    # Print header
    print(f"\n{Fore.CYAN}{'='*80}{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}📁 MARKDOWN FILES MISSING TAGS IN YAML FRONTMATTER{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
    
    if total_files == 0:
        print(f"{Fore.GREEN}✅ All markdown files have tags in their YAML frontmatter.{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}Found {total_files} file(s) without tags:{Style.RESET_ALL}\n")
        
        # Group files by directory for better organization
        files_by_dir = {}
        for file_path in files_without_tags:
            directory = os.path.dirname(file_path)
            if directory not in files_by_dir:
                files_by_dir[directory] = []
            files_by_dir[directory].append(os.path.basename(file_path))
        
        # Print files grouped by directory
        for directory, files in files_by_dir.items():
            if directory == "":
                print(f"{Fore.BLUE}📂 Root directory:{Style.RESET_ALL}")
            else:
                print(f"{Fore.BLUE}📂 {directory}:{Style.RESET_ALL}")
            
            for filename in sorted(files):
                print(f"  {Fore.RED}❌ {filename}{Style.RESET_ALL}")
            print()
    
    # Print footer with summary
    print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}Summary: {total_files} file(s) need attention.{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")

if __name__ == "__main__":
    print(f"{Fore.GREEN}Scanning markdown files for missing tags...{Style.RESET_ALL}")
    files_without_tags = check_markdown_files()
    print_fancy_output(files_without_tags)
