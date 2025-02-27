#!/usr/bin/env python3

import os
import re

def count_words_in_file(file_path):
    """Count words in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Remove code blocks
            content = re.sub(r'```[\s\S]*?```', '', content)
            
            # Remove inline code
            content = re.sub(r'`[^`]*`', '', content)
            
            # Remove URLs
            content = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', content)
            
            # Remove image and link references
            content = re.sub(r'!\[\[.*?\]\]', '', content)
            content = re.sub(r'\[\[.*?\]\]', '', content)
            
            # Remove HTML tags
            content = re.sub(r'<[^>]+>', '', content)
            
            # Split and count remaining words
            words = content.split()
            return len(words)
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return 0

def process_directory():
    """Process all markdown files recursively and count words."""
    total_words = 0
    file_counts = []
    
    # Get the root project directory (current directory)
    root_dir = os.getcwd()
    
    # Walk through all directories
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip .git directory
        if '.git' in dirnames:
            dirnames.remove('.git')
            
        # Process only markdown files
        for filename in filenames:
            if filename.endswith(('.md', '.markdown')):
                file_path = os.path.join(dirpath, filename)
                word_count = count_words_in_file(file_path)
                rel_path = os.path.relpath(file_path, root_dir)
                file_counts.append((rel_path, word_count))
                total_words += word_count

    return total_words, file_counts

def main():
    total_words, file_counts = process_directory()
    
    # Sort files by word count
    file_counts.sort(key=lambda x: x[1], reverse=True)
    
    # Print summary
    print("\n=== Word Count Summary ===")
    print(f"\nTotal words: {total_words:,}")
    print(f"Total files: {len(file_counts)}")
    print(f"Average words per file: {total_words / len(file_counts):,.1f}" if file_counts else "No files found")
    
    # Print top 10 largest files
    print("\nTop 10 largest files by word count:")
    for file_path, count in file_counts[:10]:
        print(f"{count:,} words: {file_path}")

if __name__ == "__main__":
    main()

