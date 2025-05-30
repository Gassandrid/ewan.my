#!/usr/bin/env python3


"""
# Get daily word counts for all time:
python totalWordsWritten.py

# Get daily word counts for the last 30 days:
python totalWordsWritten.py --days 30

# Show current word count summary along with daily statistics:
python totalWordsWritten.py --current
"""

import os
import re
import subprocess
from collections import defaultdict
from datetime import datetime
import argparse
from dateutil import parser as date_parser

def count_words_in_content(content):
    """Count words in content after removing markdown-specific elements."""
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

def count_words_in_file(file_path):
    """Count words in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            return count_words_in_content(content)
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

def get_git_tracked_markdown_files():
    """Get all markdown files tracked by git."""
    try:
        result = subprocess.run(
            ["git", "ls-files", "*.md", "*.markdown"], 
            capture_output=True, 
            text=True, 
            check=True
        )
        return [file.strip() for file in result.stdout.splitlines()]
    except subprocess.CalledProcessError as e:
        print(f"Error getting git tracked files: {e}")
        return []

def get_file_history(file_path, days=None):
    """Get commit history for a specific file with word counts."""
    try:
        # Build the git log command
        git_cmd = ["git", "log", "--follow", "--format=%H %at %an", "--"]
        git_cmd.append(file_path)
        
        # If days are specified, limit to that timeframe
        if days:
            git_cmd.insert(2, f"--since={days}.days.ago")
            
        # Get commit hashes and timestamps
        result = subprocess.run(git_cmd, capture_output=True, text=True, check=True)
        commits = []
        
        for line in result.stdout.splitlines():
            if not line.strip():
                continue
                
            parts = line.split(' ', 2)
            if len(parts) >= 2:
                commit_hash = parts[0]
                commit_timestamp = int(parts[1])
                commit_date = datetime.fromtimestamp(commit_timestamp).strftime('%Y-%m-%d')
                commits.append((commit_hash, commit_date))
        
        # Get word counts for each commit
        word_counts = []
        for i, (commit_hash, commit_date) in enumerate(commits):
            try:
                # Get file content at this commit
                content_result = subprocess.run(
                    ["git", "show", f"{commit_hash}:{file_path}"],
                    capture_output=True,
                    text=True,
                    check=False  # Don't raise exception if file didn't exist
                )
                
                if content_result.returncode == 0:
                    word_count = count_words_in_content(content_result.stdout)
                    word_counts.append((commit_hash, commit_date, word_count))
            except Exception as e:
                print(f"Error processing {file_path} at commit {commit_hash}: {e}")
        
        return word_counts
        
    except subprocess.CalledProcessError as e:
        print(f"Error getting history for {file_path}: {e}")
        return []

def calculate_daily_word_counts(days=None):
    """Calculate how many words were written per day based on git history."""
    tracked_files = get_git_tracked_markdown_files()
    daily_stats = {}
    file_histories = {}
    
    print(f"Analyzing {len(tracked_files)} markdown files tracked by git...")
    
    for i, file_path in enumerate(tracked_files):
        if i > 0 and i % 10 == 0:
            print(f"Processed {i}/{len(tracked_files)} files...")
            
        history = get_file_history(file_path, days)
        if not history:
            continue
            
        file_histories[file_path] = history
        
        # Calculate word count changes between commits
        for j in range(len(history) - 1):
            newer_commit = history[j]
            older_commit = history[j + 1]
            
            # Get commit info
            commit_hash, commit_date, new_word_count = newer_commit
            _, _, old_word_count = older_commit
            
            # Only count positive changes (words added)
            word_delta = max(0, new_word_count - old_word_count)
            if word_delta > 0:
                # Initialize daily stats if this is the first entry for this day
                if commit_date not in daily_stats:
                    daily_stats[commit_date] = {
                        'total_words': 0,
                        'files': {},
                        'commits': set(),
                        'largest_file': ('', 0),
                        'most_improved_file': ('', 0),
                    }
                
                # Update daily stats
                daily_stats[commit_date]['total_words'] += word_delta
                daily_stats[commit_date]['commits'].add(commit_hash)
                
                # Track per-file contributions
                if file_path not in daily_stats[commit_date]['files']:
                    daily_stats[commit_date]['files'][file_path] = 0
                daily_stats[commit_date]['files'][file_path] += word_delta
                
                # Update largest file if needed
                if daily_stats[commit_date]['files'][file_path] > daily_stats[commit_date]['most_improved_file'][1]:
                    daily_stats[commit_date]['most_improved_file'] = (file_path, daily_stats[commit_date]['files'][file_path])
    
    # Create a simple version with just total counts for backward compatibility
    daily_deltas = {date: stats['total_words'] for date, stats in daily_stats.items()}
    
    return daily_deltas, daily_stats, file_histories

def main():
    parser = argparse.ArgumentParser(description='Calculate words written in markdown files using git history.')
    parser.add_argument('--days', type=int, help='Number of days to look back in history')
    parser.add_argument('--current', action='store_true', help='Display current word count summary')
    parser.add_argument('--detail', action='store_true', help='Show detailed file breakdown for each day')
    parser.add_argument('--top', type=int, default=3, help='Number of files to show in detailed view (default: 3)')
    args = parser.parse_args()

    if args.current:
        # Original functionality
        total_words, file_counts = process_directory()
        
        # Sort files by word count
        file_counts.sort(key=lambda x: x[1], reverse=True)
        
        # Print summary
        print("\n=== Current Word Count Summary ===")
        print(f"\nTotal words: {total_words:,}")
        print(f"Total files: {len(file_counts)}")
        print(f"Average words per file: {total_words / len(file_counts):,.1f}" if file_counts else "No files found")
        
        # Print top 10 largest files
        print("\nTop 10 largest files by word count:")
        for file_path, count in file_counts[:10]:
            print(f"{count:,} words: {file_path}")
    
    # Calculate daily word counts based on git history
    print("\n=== Daily Writing Statistics ===")
    daily_deltas, daily_stats, _ = calculate_daily_word_counts(args.days)
    
    if not daily_deltas:
        print("\nNo word count changes found in git history.")
        return
        
    # Sort by date
    sorted_days = sorted(daily_stats.keys(), key=lambda x: date_parser.parse(x), reverse=True)
    
    # Calculate totals
    total_days = len(sorted_days)
    total_added = sum(daily_deltas.values())
    avg_per_day = total_added / total_days if total_days > 0 else 0
    
    # Calculate unique files modified across all days
    all_files = set()
    for day in sorted_days:
        all_files.update(daily_stats[day]['files'].keys())
    
    # Print results
    print(f"\nAnalyzed period: {sorted_days[-1]} to {sorted_days[0]} ({total_days} days)")
    print(f"Total words written: {total_added:,}")
    print(f"Average words per day: {avg_per_day:,.1f}")
    print(f"Total unique files modified: {len(all_files)}")
    
    # Find most productive day
    most_productive = max(sorted_days, key=lambda x: daily_stats[x]['total_words']) if sorted_days else None
    if most_productive:
        print(f"Most productive day: {most_productive} with {daily_stats[most_productive]['total_words']:,} words")
    
    # Find day with most files edited
    if sorted_days:
        most_files_day = max(sorted_days, key=lambda x: len(daily_stats[x]['files']))
        print(f"Day with most files edited: {most_files_day} ({len(daily_stats[most_files_day]['files'])} files)")
    
    print("\nDaily breakdown:")
    print("----------------")
    for day in sorted_days:
        stats = daily_stats[day]
        print(f"\n{day}: {stats['total_words']:,} words across {len(stats['files'])} files ({len(stats['commits'])} commits)")
        
        if args.detail:
            # Show the top files by word count for this day
            sorted_files = sorted(stats['files'].items(), key=lambda x: x[1], reverse=True)
            print(f"  Top {min(args.top, len(sorted_files))} files:")
            for file_path, count in sorted_files[:args.top]:
                # Shorten file path for display if it's very long
                display_path = file_path
                if len(display_path) > 60:
                    display_path = "..." + display_path[-57:]
                print(f"    {count:,} words: {display_path}")

def print_help():
    """Print a help message with usage examples."""
    print("""
Usage examples:
--------------
# Get daily word counts for all time:
python totalWordsWritten.py

# Get daily word counts for the last 30 days:
python totalWordsWritten.py --days 30

# Get daily word counts with detailed file breakdown:
python totalWordsWritten.py --detail

# Show current word count summary along with daily statistics:
python totalWordsWritten.py --current

# Show detailed breakdown with customized number of files:
python totalWordsWritten.py --detail --top 5
""")

if __name__ == "__main__":
    main()
    # Uncomment the following line to show help message at the end
    # print_help()

