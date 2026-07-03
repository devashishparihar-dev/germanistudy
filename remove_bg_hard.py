from PIL import Image
import sys

def process(input_path, output_path, mode):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for r, g, b, a in data:
        if mode == 'black':
            # Background is around (10, 11, 15). Anything below 40 should be transparent.
            if r < 40 and g < 40 and b < 40:
                new_data.append((0, 0, 0, 0))
            else:
                # To keep it anti-aliased, we can blend
                # But a hard threshold might be okay if it's high enough res
                # Let's do a smooth blend between 40 and 80
                lum = max(r,g,b)
                if lum < 40:
                    new_data.append((0,0,0,0))
                else:
                    alpha = min(255, int((lum - 40) * (255 / 40))) if lum < 80 else 255
                    new_data.append((r, g, b, alpha))
        else:
            # White background. Anything above 220 should be transparent.
            if r > 220 and g > 220 and b > 220:
                new_data.append((255, 255, 255, 0))
            else:
                lum = min(r,g,b)
                if lum > 220:
                    new_data.append((255,255,255,0))
                else:
                    alpha = min(255, int((220 - lum) * (255 / 40))) if lum > 180 else 255
                    new_data.append((r, g, b, alpha))

    img.putdata(new_data)
    img.save(output_path, "PNG")

mode = sys.argv[1]
in_p = sys.argv[2]
out_p = sys.argv[3]
process(in_p, out_p, mode)
