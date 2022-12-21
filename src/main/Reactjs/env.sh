#!/bin/bash

rm -f .env.development.local
cp .env.global .env.development.local

i=0;
while [ $i -le 10 ] 
do 
    NET=$(ifconfig en"$i" | grep inet); 
    if [ ! -z "$NET" ] ; then 
        IP_ADDRESS=$(ifconfig en"$i" | grep inet | grep -v inet6 | cut -d ' ' -f2);
        break;
    fi
    i=$(( i+1 ));
done 

if [ ! -z "$IP_ADDRESS" ]; then
    find .env.development.local -type f | xargs sed -i '' "s|LOCAL_IP|http://${IP_ADDRESS}:8080/api/|g"
fi


