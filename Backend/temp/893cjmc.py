a=1001
b=0
while(a>0):
    c=a%10
    if(c==1):
        b+=c
        a/=10
print(b)