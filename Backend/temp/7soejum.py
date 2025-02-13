a=1001
b=0
while(a>0):
    temp=a%10
    if(temp>=1):
        b+=temp
        b/=10
print(a)