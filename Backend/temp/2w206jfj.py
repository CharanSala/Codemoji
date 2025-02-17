def one(x,a):
    a[0]=0
    a[1]=1
    for i in range(2,x):
        a[i]=a[i-1]+a[i-2]
def two(x):
    one(x,a)
    lp,p=0
    for i in range(0,x):
        if a[i]%2==0:
            p+=a[x]
        else:
            lp+=a[i]
    return lp-p
def  final(x):
    pc=two(x)
    return pc
x=int(input())

final(x)