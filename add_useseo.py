import os
import re

def to_title_case(s):
    # Split PascalCase
    words = re.findall(r'[A-Z][a-z0-9]*', s)
    if not words:
        return s
    return ' '.join(words)

src_dir = os.path.join('e:\\GermaniStudy', 'src', 'views')
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Skip if already using useSEO
            if 'useSEO(' in content:
                continue
            
            # Replace old SEO import/component if exists
            content = re.sub(r'import\s+SEO\s+from\s+[\'"]\.\.?/.*?SEO[\'"];?\n', '', content)
            content = re.sub(r'<SEO\s+title=[\'"]([^\'"]+)[\'"]\s+description=[\'"]([^\'"]+)[\'"]\s*/>', '', content)
            
            # Add useSEO import
            # Need to figure out relative path to hooks
            rel_path = os.path.relpath('e:\\GermaniStudy\\src\\hooks', root).replace('\\', '/')
            if 'import { useSEO }' not in content:
                content = re.sub(r'(import React.*?\n)', r'\1import { useSEO } from \'' + rel_path + r'/useSEO\';\n', content, count=1)
            
            # Add hook call
            comp_name = file[:-4]
            title = to_title_case(comp_name)
            if title == 'App' or title == 'Not Found':
                continue
                
            desc = f"View {title} on GermaniStudy."
            if comp_name == 'Home':
                title = 'Home'
                desc = "The premium preparation platform for German Master's applicants. Ace the Digital Master Test (dMAT)."
            elif comp_name == 'Blogs':
                title = 'Blogs & Insights'
                desc = "Read the latest tips, guides, and student experiences to help you on your journey to studying a Master's degree in Germany."
            elif comp_name == 'BlogPost':
                pass # BlogPost has dynamic title
            
            # Inject hook
            if comp_name == 'BlogPost':
                hook_call = "  useSEO({\n    title: post ? post.title : 'Loading...',\n    description: post ? post.excerpt : '',\n    ogImage: post ? post.image : undefined,\n  });\n"
                # For blog post, inject after 'const post = ...' or near top
                content = re.sub(r'(const\s+post\s*=\s*.*?;\n)', r'\1' + hook_call, content, count=1)
                # Ensure we handle the "Not Found" case too, but the main one handles dynamic updates
            else:
                hook_call = f"  useSEO({{\n    title: '{title}',\n    description: \"{desc}\",\n  }});\n\n"
                content = re.sub(r'(const\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{\n)', r'\1' + hook_call, content, count=1)
                content = re.sub(r'(export\s+default\s+function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{\n)', r'\1' + hook_call, content, count=1)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Done injecting useSEO.")
