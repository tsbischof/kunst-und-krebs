import numpy

dt = 0.2
t = numpy.linspace(0+dt, numpy.pi-dt, 1023)
y = numpy.sin(t)**10

dtype = numpy.uint8
min_y = numpy.iinfo(dtype).min
max_y = numpy.iinfo(dtype).max
dy = max_y - min_y

y -= y.min()
y /= y.max()
y *= dy 
y += min_y
y = y.astype(dtype)

with open("breath.h","w") as f:
    f.write("#define BREATH {")
    f.write(",".join(map(str, y)))
    f.write("}")
