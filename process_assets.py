from PIL import Image
import os

src_dir = "E:/GermaniStudy/brand-masters"
branding_dir = "E:/GermaniStudy/public/assets/branding"
public_dir = "E:/GermaniStudy/public"
archive_dir = "E:/GermaniStudy/archive"

os.makedirs(branding_dir, exist_ok=True)
os.makedirs(public_dir, exist_ok=True)
os.makedirs(archive_dir, exist_ok=True)

# 1. Convert main_logo.jpeg to logo_light.png
main_logo_path = os.path.join(src_dir, "main_logo.jpeg")
if os.path.exists(main_logo_path):
    img = Image.open(main_logo_path)
    img.save(os.path.join(branding_dir, "logo_light.png"), "PNG", optimize=True)
    # The brief says to move original to archive
    import shutil
    shutil.move(main_logo_path, os.path.join(archive_dir, "main_logo.jpeg"))

# 2. Copy and compress other branding files
mapping = {
    "dark_theme_logo.png": "logo_dark.png",
    "lateral_light.png": "logo_wide_light.png",
    "lateral.png": "logo_wide_dark.png",
    "favicon.png": "favicon_light.png",
    "favicon_dark.png": "favicon_dark.png"
}

for src_name, dest_name in mapping.items():
    src_file = os.path.join(src_dir, src_name)
    if os.path.exists(src_file):
        img = Image.open(src_file)
        img.save(os.path.join(branding_dir, dest_name), "PNG", optimize=True)

# 3. Generate Favicons
favicon_master = os.path.join(src_dir, "favicon.png")
if os.path.exists(favicon_master):
    img = Image.open(favicon_master)
    img.resize((16, 16), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon-16x16.png"), optimize=True)
    img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon-32x32.png"), optimize=True)
    img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon-192x192.png"), optimize=True)
    img.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "apple-touch-icon.png"), optimize=True)
    
    img16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    img32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img32.save(os.path.join(public_dir, "favicon.ico"), format='ICO', sizes=[(32, 32), (16, 16)])

print("Asset processing complete")
