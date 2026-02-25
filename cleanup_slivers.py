import os
import numpy as np
from PIL import Image

dir_path = 'stickers'
deleted_count = 0

for f in os.listdir(dir_path):
    if f.startswith('sticker_') and f.endswith('.png'):
        try:
            path = os.path.join(dir_path, f)
            with Image.open(path) as img:
                arr = np.array(img.convert('RGB'))
                white_pixels = np.all(arr == [255, 255, 255], axis=-1)
                white_ratio = np.mean(white_pixels)
                
                # If more than 96% is white, it's trash (less than 4% content)
                if white_ratio > 0.96:
                    print(f"Deleting trash: {f} ({white_ratio:.1%} white)")
                    os.remove(path)
                    deleted_count += 1
                         
        except Exception as e:
            continue

print(f"Total trash stickers deleted: {deleted_count}")
