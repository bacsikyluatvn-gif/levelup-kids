import os
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_fill_holes, binary_opening, binary_dilation
import json

D = "stickers/"
STATE_FILE = "shared/js/state.js"

# Collection and Name Mapping
CONFIG = {
    "hellokitty": ("Hello Kitty", "cartoon"),
    "dragonball": ("Ngọc Rồng", "heroes"),
    "dragonball2": ("Siêu Saiyan", "heroes"),
    "dragonball4": ("Bảy Viên Ngọc Rồng", "heroes"),
    "fastfood": ("Đồ Ăn Nhanh", "food"),
    "flower": ("Hoa Đẹp", "nature"),
    "hero": ("Anh Hùng", "heroes"),
    "koromi": ("Koromi", "cartoon"),
    "magic": ("Pháp Thuật", "magic"),
    "panda": ("Gấu Trúc", "animals"),
    "princess": ("Công Chúa", "cartoon"),
    "princess1": ("Công Chúa 1", "cartoon"),
    "princess2": ("Công Chúa 2", "cartoon"),
    "princess3": ("Công Chúa 3", "cartoon"),
    "princess4": ("Công Chúa 4", "cartoon"),
    "superhero": ("Siêu Nhân", "heroes"),
    "warrior": ("Chiến Binh", "heroes"),
    "weather": ("Thời Tiết", "nature"),
    "cute": ("Dễ Thương", "cartoon"),
    "dress": ("Váy Đầm", "cartoon"),
    "cake": ("Bánh Ngọt", "food"),
    "animal1": ("Thú Rừng", "animals"),
    "animal2": ("Thú Nuôi", "animals"),
    "animal3": ("Thú Cưng", "animals"),
    "animal4": ("Bạn Nhỏ", "animals"),
    "vutru": ("Vũ Trụ", "space"),
    "vutru2": ("Khám Phá Vũ Trụ", "space"),
    "bong1": ("Bóng Đá", "sports"),
    "thethao": ("Thể Thao", "sports"),
    "vinhan": ("Vinh An", "cartoon"),
    "vinhan2": ("Vinh An 2", "cartoon"),
    "banh1": ("Bánh Kẹo", "food"),
    "do1": ("Đồ Chơi", "cartoon"),
    "a": ("Thú Cưng", "animals"),
    "f": ("Đồ Ăn", "food")
}

SHEETS = [
    ("hellokitty", "Hello Kitty_sheet.jpg"),
    ("dragonball", "dragonball_sheet.jpg"),
    ("dragonball2", "drangonball2_sheet.jpg"),
    ("fastfood", "fastfood_sheet.jpg"),
    ("flower", "flower_sheet.jpg"),
    ("hero", "hero_sheet.jpg"),
    ("koromi", "koromi_sheet.jpg"),
    ("magic", "magic_sheet.jpg"),
    ("panda", "panda_sheet.jpg"),
    ("princess", "pri_sheet.jpg"),
    ("princess1", "prin_sheet.jpg"),
    ("princess2", "pri2_sheet.jpg.jpg"),
    ("princess3", "pri3_sheet.jpg"),
    ("princess4", "prin4_sheet.jpg"),
    ("superhero", "super_sheet.jpg"),
    ("warrior", "warrior_sheet.jpg"),
    ("weather", "weather_sheet.jpg"),
    ("cute", "Cute_sheet.jpeg"),
    ("dress", "Dress_sheet.png"),
    ("cake", "cake_sheet.jpg"),
    ("animal1", "animal1_sheet.jpg"),
    ("animal2", "animal2_sheet.jpg"),
    ("animal3", "animal3_sheet.jpg"),
    ("animal4", "animal4_sheet.jpg"),
    ("vutru", "Vutru_sheet.png"),
    ("vutru2", "vutru2_sheet.png"),
    ("bong1", "bong1_sheet.jpg"),
    ("thethao", "thethao_sheet.jpg"),
    ("vinhan", "Vinhan_sheet.jpg"),
    ("vinhan2", "vinhan2_sheet.jpg"),
    ("banh1", "banh1_sheet.png"),
    ("do1", "do1_sheet.jpg"),
    ("dragonball4", "drabonball4_sheet.png"),
]

def improved_blob_splitter(file_path, out_dir, prefix, min_area=1500, threshold_offset=15):
    if not os.path.exists(file_path): return []
    try:
        img = Image.open(file_path).convert('RGB')
    except: return []
    
    gray = img.convert('L')
    arr_gray = np.array(gray)
    bg_level = np.percentile(arr_gray, 95)
    threshold = bg_level - threshold_offset
    
    mask = arr_gray < threshold
    mask = binary_fill_holes(mask)
    
    kernel_size = 5
    if "vutru" in prefix or "dragon" in prefix: kernel_size = 3
    
    mask_open = binary_opening(mask, structure=np.ones((kernel_size, kernel_size)))
    labeled, num_features = label(mask_open)
    if num_features == 0: return []
    
    img_w, img_h = img.size
    total_area = img_w * img_h
    blobs = []
    for i in range(1, num_features + 1):
        y_idx, x_idx = np.where(labeled == i)
        area = len(y_idx)
        if area < min_area or area > total_area * 0.4: continue
        
        y1, y2, x1, x2 = y_idx.min(), y_idx.max(), x_idx.min(), x_idx.max()
        edge_touch = (1 if y1<10 else 0) + (1 if y2>img_h-10 else 0) + (1 if x1<10 else 0) + (1 if x2>img_w-10 else 0)
        if edge_touch >= 3: continue
        
        cy, cx = y_idx.mean(), x_idx.mean()
        comp_mask = binary_dilation(labeled == i, structure=np.ones((kernel_size+2, kernel_size+2))) & mask
        y_f, x_f = np.where(comp_mask)
        if len(y_f) == 0: continue
        
        blobs.append({'bbox': (x_f.min(), y_f.min(), x_f.max(), y_f.max()), 'center': (cx, cy), 'mask': comp_mask})
    
    if not blobs: return []
    
    # Sort into rows and then columns
    blobs.sort(key=lambda b: b['center'][1])
    rows = []
    if blobs:
        row_tol = img_h * 0.08
        current_row = [blobs[0]]
        for i in range(1, len(blobs)):
            if abs(blobs[i]['center'][1] - current_row[0]['center'][1]) < row_tol:
                current_row.append(blobs[i])
            else:
                rows.append(current_row)
                current_row = [blobs[i]]
        rows.append(current_row)
    
    catalog_entries = []
    for ri, row in enumerate(rows):
        row.sort(key=lambda b: b['center'][0])
        for ci, blob in enumerate(row):
            x1, y1, x2, y2 = blob['bbox']
            p = 15
            l, t, r_p, b_p = max(0, x1-p), max(0, y1-p), min(img_w, x2+p), min(img_h, y2+p)
            cell = img.crop((l, t, r_p, b_p))
            mask_crop = blob['mask'][t:b_p, l:r_p]
            cell_arr = np.array(cell)
            ah, aw, _ = cell_arr.shape
            mh, mw = mask_crop.shape
            h_min, w_min = min(mh, ah), min(mw, aw)
            
            final_cell = np.ones((ah, aw, 3), dtype=np.uint8) * 255
            mask_3d = np.repeat(mask_crop[:h_min, :w_min][:, :, np.newaxis], 3, axis=2)
            final_cell[:h_min, :w_min] = np.where(mask_3d, cell_arr[:h_min, :w_min], 255)
            
            isolated = Image.fromarray(final_cell)
            cw, ch = isolated.size
            side = max(cw, ch) + 30
            sq = Image.new('RGB', (side, side), (255, 255, 255))
            sq.paste(isolated, ((side - cw) // 2, (side - ch) // 2))
            
            out_name = f"sticker_{prefix}_{ri}_{ci}.png"
            sq.save(os.path.join(out_dir, out_name))
            
            cat_name, cat_col = CONFIG.get(prefix, (prefix.capitalize(), "other"))
            catalog_entries.append({
                "id": f"sticker_{prefix}_{ri}_{ci}",
                "name": f"{cat_name} {ri}.{ci}",
                "collection": cat_col,
                "img": f"../stickers/{out_name}"
            })
    return catalog_entries

def process_grid_sheet(file_name, pr, n):
    file_path = os.path.join(D, file_name)
    if not os.path.exists(file_path): return []
    img = Image.open(file_path).convert('RGB')
    w, h = img.size
    cw, ch = w//4, h//2
    entries = []
    idx = 1
    for r in range(2):
        for c in range(4):
            if idx > n: break
            cell = img.crop((c*cw, r*ch, (c+1)*cw, (r+1)*ch))
            tw, th = cell.size
            side = max(tw, th) + 40
            sq = Image.new('RGB', (side, side), (255, 255, 255))
            sq.paste(cell, ((side-tw)//2, (side-th)//2))
            out_name = f"sticker_{pr}{idx}.png"
            sq.save(os.path.join(D, out_name))
            
            cat_name, cat_col = CONFIG.get(pr, (pr.capitalize(), "other"))
            entries.append({
                "id": f"sticker_{pr}{idx}",
                "name": f"{cat_name} {idx}",
                "collection": cat_col,
                "img": f"../stickers/{out_name}"
            })
            idx += 1
    return entries

# 1. Clear stickers folder of all previous cuts
print("🧹 Cleaning up old stickers...")
for f in os.listdir(D):
    if f.startswith("sticker_") and (f.endswith(".png") or f.endswith(".jpg")):
        os.remove(os.path.join(D, f))

# 2. Process everything and build catalog
new_catalog = []
print("✂️ Processing sheets...")
for p, f in SHEETS:
    res = improved_blob_splitter(D + f, D, p, threshold_offset=(30 if p in ["dragonball4", "vutru2"] else 15))
    if not res: # Retry once for failed ones
        res = improved_blob_splitter(D + f, D, p, threshold_offset=40)
    new_catalog.extend(res)
    print(f"  - {p}: {len(res)} stickers")

# Add the old grid sheets
new_catalog.extend(process_grid_sheet("animals.png", "a", 8))
new_catalog.extend(process_grid_sheet("food.png", "f", 4))

# 3. Inject into state.js
print("💉 Injecting catalog into state.js...")
with open(STATE_FILE, "r") as f:
    content = f.read()

start_marker = "window.STICKER_CATALOG = ["
end_marker = "];"
start_idx = content.find(start_marker)
# Find the next ]; after the start marker
end_idx = content.find(end_marker, start_idx + len(start_marker))

if start_idx != -1 and end_idx != -1:
    catalog_json = json.dumps(new_catalog, indent=8, ensure_ascii=False)
    # Adjust formatting to match JS style a bit better
    catalog_json = catalog_json.lstrip(" ") # remove first line indents from json.dumps
    
    new_content = content[:start_idx + len(start_marker)] + "\n" + catalog_json[1:-1] + "\n    " + content[end_idx:]
    with open(STATE_FILE, "w") as f:
        f.write(new_content)
    print("✅ Successfully updated state.js with " + str(len(new_catalog)) + " stickers!")
else:
    print("❌ Could not find STICKER_CATALOG block in state.js")
