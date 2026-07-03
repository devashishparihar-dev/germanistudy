from PIL import Image
import sys

def process(in_p, out_p, mode):
    img = Image.open(in_p).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for r, g, b, a in data:
        if mode == 'black':
            # Background is dark.
            alpha = max(r, g, b)
            if alpha == 0:
                new_data.append((0, 0, 0, 0))
            else:
                nr = min(255, int(r * 255 / alpha))
                ng = min(255, int(g * 255 / alpha))
                nb = min(255, int(b * 255 / alpha))
                new_data.append((nr, ng, nb, alpha))
        else:
            # Background is white (or very light).
            # If the image background is e.g. 253, 255, 255, we can assume it's basically 255.
            # alpha is how far the pixel is from white.
            alpha = 255 - min(r, g, b)
            if alpha == 0:
                new_data.append((255, 255, 255, 0))
            else:
                nr = min(255, max(0, int((r - (255 - alpha)) * 255 / alpha)))
                ng = min(255, max(0, int((g - (255 - alpha)) * 255 / alpha)))
                nb = min(255, max(0, int((b - (255 - alpha)) * 255 / alpha)))
                new_data.append((nr, ng, nb, alpha))
                
    img.putdata(new_data)
    img.save(out_p, "PNG")

mode = sys.argv[1]
in_p = sys.argv[2]
out_p = sys.argv[3]
process(in_p, out_p, mode)
