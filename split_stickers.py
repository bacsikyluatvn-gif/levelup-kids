import os
from PIL import Image

def split_sheet(file_path, cols, rows, output_dir, prefix):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    try:
        img = Image.open(file_path).convert('RGB')
        img_w, img_h = img.size
        
        cell_w = img_w // cols
        cell_h = img_h // rows
        
        for r in range(rows):
            for c in range(cols):
                left = c * cell_w
                top = r * cell_h
                right = left + cell_w
                bottom = top + cell_h
                
                sticker = img.crop((left, top, right, bottom))
                clean_prefix = prefix.replace(" ", "_").lower()
                output_name = f"sticker_{clean_prefix}_{r}_{c}.png"
                sticker.save(os.path.join(output_dir, output_name))
        print(f"Successfully split {prefix} into {cols*rows} stickers.")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

sheets = [
    ("Hello Kitty_sheet.jpg", 4, 5, "hellokitty"),
    ("dragonball_sheet.jpg", 4, 5, "dragonball"),
    ("drangonball2_sheet.jpg", 4, 5, "dragonball2"),
    ("fastfood_sheet.jpg", 4, 5, "fastfood"),
    ("flower_sheet.jpg", 4, 5, "flower"),
    ("hero_sheet.jpg", 4, 5, "hero"),
    ("koromi_sheet.jpg", 4, 5, "koromi"),
    ("magic_sheet.jpg", 4, 5, "magic"),
    ("panda_sheet.jpg", 4, 5, "panda"),
    ("pri2_sheet.jpg.jpg", 4, 5, "princess2"),
    ("pri3_sheet.jpg", 4, 5, "princess3"),
    ("pri_sheet.jpg", 4, 5, "princess"),
    ("prin_sheet.jpg", 4, 5, "princess1"),
    ("super_sheet.jpg", 4, 5, "superhero"),
    ("warrior_sheet.jpg", 4, 5, "warrior"),
    ("weather_sheet.jpg", 4, 5, "weather")
]

stickers_dir = "/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/stickers/"

for sheet_file, c, r, pref in sheets:
    split_sheet(os.path.join(stickers_dir, sheet_file), c, r, stickers_dir, pref)

