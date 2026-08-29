import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('(())', '()')
    
    if new_content != content:
        print(f"Fixing {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

src_dir = os.path.join('e:\\GermaniStudy', 'src')
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
