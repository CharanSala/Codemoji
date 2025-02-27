#include <stdio.h>

void mystory_one(int n, int arr[]) {  
    arr[0] = 0;
    arr[1] = 1;
    for (int i = 2; i < n; i++)  
        arr[i] = arr[i - 1] + arr[i - 2];  
}

int mystory_two(int n) {  
    int arr[n];  
    mystory_one(n, arr);  

    int sumOdd = 0, sumEven = 0;  
    for (int i = 0; i < n; i++) {  
        if (arr[i] % 2 == 0)  
            sumEven += arr[i];  
        else  
            sumOdd += arr[i];  
    }  
    return sumOdd - sumEven;   
}

int mystory_final(int n) {  
    int result = mystory_two(n);
    return result;
}

int main() {
    int n;
  
    scanf("%d", &n);
    
    printf("Result: %d\n", mystory_final(n));
    return 0;
}
