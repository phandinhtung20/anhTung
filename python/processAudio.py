import sys
import wave
import contextlib

# print "This is the name of the script: ", sys.argv[0]
# print "Number of arguments: ", len(sys.argv)
# print "The arguments are: " , str(sys.argv)
# print("Hello world")

file = './uploads/file1302-1540031701069.wav'
with contextlib.closing(wave.open(file, 'r')) as f:
    frames = f.getnframes()
    rate = f.getframerate()
    duration = frames / float(rate)
    print(frames)
    print(rate)
    print("%s\n" %(int(duration*1000)))
    print("__END__")

sys.stdout.flush()