import os
import json
import re

STATE_FILE = "shared/js/state.js"
STICKERS_DIR = "stickers"

def sanitize():
    if not os.path.exists(STATE_FILE):
        print(f"Error: {STATE_FILE} not found.")
        return

    with open(STATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the STICKER_CATALOG block
    start_marker = "window.STICKER_CATALOG = ["
    end_marker = "];"
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Error: Could not find start of STICKER_CATALOG.")
        return
        
    # Find the matching ] at the end of the array
    # We look for the first ]; after the start
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        print("Error: Could not find end of STICKER_CATALOG.")
        return

    # Extract the JSON-ish content
    json_str = content[start_idx + len(start_marker) : end_idx].strip()
    
    # Wrap in [] to make it a valid JSON array if it isn't already
    # Actually, it's already inside [ ... ], so we just need to parse it.
    # We can try to parse it as a JSON array by adding the brackets back.
    try:
        catalog = json.loads("[" + json_str + "]")
    except Exception as e:
        print(f"Error parsing catalog JSON: {e}")
        # Manual fallback if JSON parsing fails (e.g. trailing commas or weird characters)
        # But since I generated it with json.dumps previously, it should be fine.
        return

    print(f"Original catalog size: {len(catalog)}")

    # Filter based on file existence
    sanitized_catalog = []
    removed_count = 0
    
    for item in catalog:
        img_path = item.get("img", "")
        # img_path is typically "../stickers/sticker_xxx.png"
        filename = os.path.basename(img_path)
        actual_path = os.path.join(STICKERS_DIR, filename)
        
        if os.path.exists(actual_path):
            sanitized_catalog.append(item)
        else:
            removed_count += 1
            print(f"Removing missing sticker: {filename}")

    print(f"Removed {removed_count} missing stickers.")
    print(f"New catalog size: {len(sanitized_catalog)}")

    # Generate new content
    new_json_str = json.dumps(sanitized_catalog, indent=8, ensure_ascii=False)
    # Formatting adjustment to match the file style
    # json.dumps returns [ \n ... \n ]
    # We want to replace the content between [ and ]
    
    # We'll just replace the whole block from window.STICKER_CATALOG = [ to ];
    new_block = "window.STICKER_CATALOG = " + new_json_str + ";"
    
    new_content = content[:start_idx] + new_block + content[end_idx + len(end_marker):]

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Successfully sanitized state.js!")

if __name__ == "__main__":
    sanitize()
