a = int(input())  # Take input from user
b = 0

while a > 0:
    if a % 10 == 1:  # Check if the last digit is 1
        b += 1       # Increment the count
    a //= 10         # Remove the last digit

print(b)  # Print the total count of 1's