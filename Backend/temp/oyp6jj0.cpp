#include <stdio.h>

int reverse_number(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }
    return rev;
}

int sum_of_squares(int n) {
    int sum = 0;
    while (n > 0) {
        int digit = n % 10;
        sum += digit * digit;  // Square and sum digits
        n /= 10;
    }
    return sum;
}

int mysterious_transformation(int n) {
    int reversed_n = reverse_number(n);
    return sum_of_squares(reversed_n);
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", mysterious_transformation(n));
    return 0;
}