import os
from PIL import Image, ImageDraw

def create_placeholder_avatar(path, color, index):
    # Create a 400x400 image with a solid color background
    img = Image.new('RGBA', (400, 400), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a colored circle
    margin = 20
    draw.ellipse([margin, margin, 400-margin, 400-margin], fill=color)
    
    # Add a simple white pattern (like a star or a smiley)
    # Let's draw a simple white circle inside for now as a minimalist design
    draw.ellipse([150, 150, 250, 250], fill=(255, 255, 255, 100))
    
    img.save(path)
    print(f"Created {path}")

output_dir = "/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/shared/assets/generated_avatars/"
os.makedirs(output_dir, exist_ok=True)

# List of nice colors for placeholders
colors = [
    (236, 91, 19), (245, 158, 11), (16, 185, 129), (59, 130, 246), 
    (139, 92, 246), (236, 72, 153), (107, 114, 128), (20, 184, 166),
    (251, 146, 60), (74, 222, 128), (96, 165, 250), (129, 140, 248),
    (192, 132, 252), (244, 114, 182), (52, 211, 153), (14, 165, 233)
]

for i in range(15, 31):
    path = os.path.join(output_dir, f"avatar_{i}.png")
    if not os.path.exists(path):
        create_placeholder_avatar(path, colors[i-15], i)
