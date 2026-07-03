from PIL import Image
import sys

def make_transparent(input_path, output_path, bg_color):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            # Change all white (also shades of white)
            # to transparent
            if bg_color == 'white':
                if item[0] > 220 and item[1] > 220 and item[2] > 220:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            elif bg_color == 'black':
                if item[0] < 35 and item[1] < 35 and item[2] < 35:
                    new_data.append((0, 0, 0, 0))
                else:
                    new_data.append(item)
                    
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python remove_bg_color.py <input> <output> <white|black>")
        sys.exit(1)
    make_transparent(sys.argv[1], sys.argv[2], sys.argv[3])
