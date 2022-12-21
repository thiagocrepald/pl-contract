 #!/bin/bash

 cd src/main/Reactjs/
 yarn && yarn build:staging
 cd ../../../

mvn -Denvironment=staging package install

cd target
rm -f plantao-mais.war
mv -f plantao-mais*.war plantao-mais.war
cd ..
scp target/plantao-mais.war esparta@161.35.96.146:/opt/plantaomais/development/plantao-mais.war      

# You need to add the server IP alias in your ~/ssh/config file.
ssh plantaomais << 'ENDSSH'

cd /opt/plantaomais/development && docker build -f Dockerfile -t plantaomais .
cd /opt/plantaomais/development && docker-compose -f app.yml -p plantaomais stop && docker-compose -f app.yml -p plantaomais up -d

ENDSSH