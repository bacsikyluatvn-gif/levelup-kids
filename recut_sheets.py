import os
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_fill_holes, binary_opening, binary_dilation

def improved_blob_splitter(file_path, out_dir, prefix, min_area=2000, threshold_offset=15):
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, not found.")
        return 0, 0, 0
    
    try:
        img = Image.open(file_path).convert('RGB')
    except Exception as e:
        print(f"Error opening {file_path}: {e}")
        return 0, 0, 0
    
    print(f"Processing {file_path}...")
    
    # Convert to grayscale and threshold
    gray = img.convert('L')
    arr_gray = np.array(gray)
    
    # Adaptive threshold: find background level
    # We assume the background is the brighter part
    bg_level = np.percentile(arr_gray, 95)
    threshold = bg_level - threshold_offset
    
    # Mask: background is brightness > threshold
    mask = arr_gray < threshold
    
    # Fill holes inside stickers
    mask = binary_fill_holes(mask)
    
    # Separate stickers that touch slightly
    # If the sheet has many tiny stickers (like space), we use a smaller kernel
    kernel_size = 5
    if "vutru" in prefix or "dragonball" in prefix:
        kernel_size = 3 # More delicate for complex shapes
        
    mask_open = binary_opening(mask, structure=np.ones((kernel_size, kernel_size)))
    
    # Find connected components
    labeled, num_features = label(mask_open)
    if num_features == 0:
        return 0, 0, 0
    
    img_w, img_h = img.size
    total_area = img_w * img_h
    
    # Extract blobs
    blobs = []
    for i in range(1, num_features + 1):
        y_idx, x_idx = np.where(labeled == i)
        area = len(y_idx)
        
        # Filter out noise AND filter out the whole-sheet frame/background if it leaked
        if area < min_area: continue
        if area > total_area * 0.5: continue # Ignore the whole sheet blob
        
        y1, y2 = y_idx.min(), y_idx.max()
        x1, x2 = x_idx.min(), x_idx.max()
        
        # Skip if it touches edges too much (likely a border)
        edge_touch = 0
        if y1 < 10: edge_touch += 1
        if y2 > img_h - 10: edge_touch += 1
        if x1 < 10: edge_touch += 1
        if x2 > img_w - 10: edge_touch += 1
        
        # If it touches 3+ edges, it's definitely a frame
        if edge_touch >= 3: continue
        
        # Centroid for sorting
        cy, cx = y_idx.mean(), x_idx.mean()
        
        # Refine mask for this component
        comp_mask = (labeled == i)
        # Dilate back to capture details lost in opening
        comp_mask = binary_dilation(comp_mask, structure=np.ones((kernel_size+2, kernel_size+2)))
        comp_mask = comp_mask & mask
        
        # Re-calculate bbox
        y_final, x_final = np.where(comp_mask)
        if len(y_final) == 0: continue
        
        blobs.append({
            'label': i,
            'bbox': (x_final.min(), y_final.min(), x_final.max(), y_final.max()),
            'center': (cx, cy),
            'mask': comp_mask,
            'area': len(y_final)
        })
    
    if not blobs:
        return 0, 0, 0
        
    # Sort into rows
    row_tol = img_h * 0.08 # Increased tolerance for uneven sheets
    blobs.sort(key=lambda b: b['center'][1])
    
    rows = []
    if blobs:
        current_row = [blobs[0]]
        for i in range(1, len(blobs)):
            if abs(blobs[i]['center'][1] - current_row[0]['center'][1]) < row_tol:
                current_row.append(blobs[i])
            else:
                rows.append(current_row)
                current_row = [blobs[i]]
        rows.append(current_row)
    
    for r in rows:
        r.sort(key=lambda b: b['center'][0])
        
    count = 0
    max_c = 0
    for ri, row in enumerate(rows):
        max_c = max(max_c, len(row))
        for ci, blob in enumerate(row):
            x1, y1, x2, y2 = blob['bbox']
            # Crop with generous padding
            p = 15
            l, t = max(0, x1-p), max(0, y1-p)
            r_p, b_p = min(img_w, x2+p), min(img_h, y2+p)
            
            cell = img.crop((l, t, r_p, b_p))
            blob_mask_crop = blob['mask'][t:b_p, l:r_p]
            
            cell_arr = np.array(cell)
            ah, aw, _ = cell_arr.shape
            mh, mw = blob_mask_crop.shape
            h_min, w_min = min(mh, ah), min(mw, aw)
            
            # White bg
            final_cell = np.ones((ah, aw, 3), dtype=np.uint8) * 255
            # Apply mask
            mask_3d = np.repeat(blob_mask_crop[:h_min, :w_min][:, :, np.newaxis], 3, axis=2)
            final_cell[:h_min, :w_min] = np.where(mask_3d, cell_arr[:h_min, :w_min], 255)
            
            isolated = Image.fromarray(final_cell)
            
            # Square it up
            cw, ch = isolated.size
            side = max(cw, ch)
            final_side = side + 30 # Even more padding
            
            sq = Image.new('RGB', (final_side, final_side), (255, 255, 255))
            sq.paste(isolated, ((final_side - cw) // 2, (final_side - ch) // 2))
            
            out_name = f"sticker_{prefix}_{ri}_{ci}.png"
            sq.save(os.path.join(out_dir, out_name))
            count += 1
            
    return len(rows), max_c, count

D = "stickers/"
all_sheets = [
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

print("Starting intelligent recut v2...")
for p, f in all_sheets:
    try:
        # For dragonball4 and vutru2, we might need even higher threshold offset 
        # because the background is textured or has shadows
        offset = 15
        if p in ["dragonball4", "vutru2"]: offset = 30 
        
        r, c, t = improved_blob_splitter(D + f, D, p, threshold_offset=offset)
        if t > 0:
            print(f"DONE: {p} ({t} stickers, {r}x{c} grid)")
        else:
            # Retry with very aggressive offset if failed
            r, c, t = improved_blob_splitter(D + f, D, p, threshold_offset=40)
            if t > 0:
                print(f"DONE (RETRY): {p} ({t} stickers, {r}x{c} grid)")
            else:
                print(f"FAILED: {p} (No blobs found)")
    except Exception as e:
        print(f"ERROR: {p} - {e}")

print("Recut complete.")
