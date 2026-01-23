import os
from PIL import Image
chars = "@%#*+=-:. "
assets = sorted(os.listdir('assets'))
for path in assets:
    ext = path.lower().rsplit('.', 1)[-1]
    if ext not in ('png','jpg','jpeg'):
        continue
    img = Image.open(os.path.join('assets', path)).convert('L')
    aw, ah = img.size
    new_w = 60
    new_h = max(10, int((ah/aw) * new_w * 0.5))
    img = img.resize((new_w, new_h))
    print('\n' + path)
    for y in range(new_h):
        row = ''.join(chars[int(pixel/255*(len(chars)-1))] for pixel in img.crop((0, y, new_w, y+1)).getdata())
        print(row)
