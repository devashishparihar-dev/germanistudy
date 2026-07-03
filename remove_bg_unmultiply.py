from PIL import Image
import sys

def remove_black_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        # Estimate alpha from brightness (max channel)
        A = max(r, g, b)
        if A == 0:
            new_data.append((0, 0, 0, 0))
        else:
            # Unmultiply color
            R = int(r * 255 / A)
            G = int(g * 255 / A)
            B = int(b * 255 / A)
            new_data.append((R, G, B, A))
    img.putdata(new_data)
    img.save(output_path, "PNG")

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        # Estimate alpha from darkness (255 - min channel)
        A = 255 - min(r, g, b)
        if A == 0:
            new_data.append((255, 255, 255, 0))
        else:
            # Unmultiply color
            # r = R*A + 255*(1-A) -> R*A = r - 255*(1-A) -> R = (r - 255 + A) / A
            # using 0-1 scale for math: R_out = (r/255 - 1 + A/255) / (A/255)
            # R_out * 255 = (r - 255 + A) * 255 / A
            R = max(0, min(255, int((r - 255 + A) * 255 / A)))
            G = max(0, min(255, int((g - 255 + A) * 255 / A)))
            B = max(0, min(255, int((b - 255 + A) * 255 / A)))
            new_data.append((R, G, B, A))
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == '__main__':
    mode = sys.argv[1]
    input_p = sys.argv[2]
    output_p = sys.argv[3]
    if mode == 'black':
        remove_black_bg(input_p, output_p)
    elif mode == 'white':
        remove_white_bg(input_p, output_p)
    else:
        print("Mode must be black or white")
