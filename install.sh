tput setab 0;
tput setaf 6; 
tput bold;

printf '\n  Installing sprint-lambda-functions ... \n\n';

tput setaf 7; 
tput bold;

npm install;

cd ./layers && sh zipLayers.sh;

cd ../utils/installShellZip && sh installShellZip.sh;

tput setaf 2; 
tput bold;

printf '\n  Finished installing sprint-lambda-functions\n\n';

tput setaf 7; 
tput bold;

read -n 1 -r -s -p $'  Press any key to exit ... \n';
