a = 1001
b = 0

while a > 0:
    c = a % 10
    if c == 1:
        b += 1  # Increment count when '1' is found
    a //= 10  # Use integer division to remove last digit

print(b)
