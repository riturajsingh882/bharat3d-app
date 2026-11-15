from PIL import Image
import numpy as np
from collections import Counter

img = Image.open('SOIL_SOURCE/soils_of_india.jpg').convert('RGB')
a = np.array(img)
h, w = a.shape[:2]
print('size', img.size)

# Quantized palette
q = img.quantize(colors=32, method=Image.Quantize.MEDIANCUT).convert('RGB')
qa = np.array(q)
flat = qa.reshape(-1, 3)
cnt = Counter(map(tuple, flat))
print('--- top colors ---')
for rgb, c in cnt.most_common(28):
    print('#%02x%02x%02x' % rgb, 'count=%d' % c, '%.2f%%' % (100.0*c/len(flat)))

arr = a.astype(int)
mx = arr.max(2); mn = arr.min(2)
sat = mx - mn
colored = (sat > 40) & (mx > 50)
ys, xs = np.where(colored)
print('colored bbox x', xs.min(), xs.max(), 'y', ys.min(), ys.max())

cell = 50
print('--- colored density grid (x axis = columns of 50px) ---')
for yy in range(0, h, cell):
    row = []
    for xx in range(0, w, cell):
        c = colored[yy:yy+cell, xx:xx+cell].sum()
        row.append('#' if c > 500 else ('+' if c > 100 else ('.' if c > 10 else ' ')))
    line = ''.join(row)
    if line.strip():
        print('%4d ' % yy + line)
