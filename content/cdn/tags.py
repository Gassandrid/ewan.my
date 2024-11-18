import os
import yaml
from collections import Counter

def extract_tags_from_front_matter(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    if content.startswith('---'):
        front_matter_end = content.find('---', 3)
        if front_matter_end != -1:
            front_matter = content[3:front_matter_end]
            try:
                data = yaml.safe_load(front_matter)
                tags = data.get('tags', [])
                if isinstance(tags, str):  # Handle single string tags
                    tags = [tags]
                return tags
            except yaml.YAMLError:
                print(f"Error parsing YAML in {file_path}")
    return []

def tally_tags_in_vault(vault_dir):
    tag_counter = Counter()
    for root, _, files in os.walk(vault_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                tags = extract_tags_from_front_matter(file_path)
                tag_counter.update(tags)
    return tag_counter

# Directory path to your vault, which is root director where file is being executed( . )
vault_directory = os.path.abspath('.')
tag_counts = tally_tags_in_vault(vault_directory)

# Print results
print("Tag Usage Counts:")
for tag, count in tag_counts.most_common():
    print(f"{tag}: {count}")
