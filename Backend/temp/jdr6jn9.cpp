#include <stdio.h>

void fibonacci_sequence(int n, int fib[]) {
    fib[0] = 0, fib[1] = 1;
    for (int i = 2; i < n; i++)
        fib[i] = fib[i - 1] + fib[i - 2];
}

int fibonacci_parity_difference(int n) {
    int fib[n];
    fibonacci_sequence(n, fib);

    int odd_sum = 0, even_sum = 0;
    for (int i = 0; i < n; i++) {
        if (fib[i] % 2 == 0)
            even_sum += fib[i];
        else
            odd_sum += fib[i];
    }
    return odd_sum - even_sum;
}
int test(int n)
{
    int t=fibonacci_parity_difference(n);
    return t;

}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", test(n));
    return 0;
}
