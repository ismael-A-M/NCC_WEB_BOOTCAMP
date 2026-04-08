t,n=map(int,input().split())
arr=list(map(int,input().split()))
p=[0]*(t+1)
mi=float('inf')
for i in range(t):
    p[i+1]=p[i]+arr[i]
for i in range(t-n+1):
    h=p[i+n]-p[i]
    if mi>h:
        mi=h
        inx=i
print(inx+1)