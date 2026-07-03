from PIL import Image
import sys
import math

def make_transparent_smooth(input_path, output_path, bg_color):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        target_color = (255, 255, 255) if bg_color == 'white' else (0, 0, 0)
        
        # Thresholds for distance
        t1 = 15.0  # anything closer than this is fully transparent
        t2 = 120.0 # anything farther than this is fully opaque
        
        new_data = []
        for item in datas:
            # calculate distance
            r, g, b, a = item
            tr, tg, tb = target_color
            
            # Use max channel difference as a simple distance, or Euclidean
            dist = math.sqrt((r-tr)**2 + (g-tg)**2 + (b-tb)**2)
            
            if dist < t1:
                new_data.append((r, g, b, 0))
            elif dist > t2:
                new_data.append(item)
            else:
                # Smooth interpolation
                # alpha goes from 0 to 255 as dist goes from t1 to t2
                alpha_factor = (dist - t1) / (t2 - t1)
                
                # We can also attempt to "unmultiply" the color to remove the background halo
                # but simple alpha blending works decently
                new_alpha = int(255 * alpha_factor)
                
                # To prevent white/black halos, we force the color towards the foreground color,
                # but since we don't know it, leaving RGB intact and lowering alpha is our best bet.
                
                # If target is white, the blended pixels are lighter, we can darken them slightly
                # If target is black, the blended pixels are darker, we can lighten them slightly
                
                new_data.append((r, g, b, new_alpha))
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python remove_bg_smooth.py <input> <output> <white|black>")
        sys.exit(1)
    make_transparent_smooth(sys.argv[1], sys.argv[2], sys.argv[3])
