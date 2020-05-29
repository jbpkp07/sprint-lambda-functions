tput setab 0;

printf '\n  Compiling TypeScript file(s) [installShellZip.ts, copyFileSync.ts] ... ';

../../node_modules/.bin/tsc;

tput setaf 2; 
tput bold;

printf 'Done!\n\n';

tput sgr0;
tput setab 0;

node installShellZip.js;

rm -f installShellZip.js copyFileSync.js;

read -n 1 -r -s -p $'  Press any key to continue ... \n\n';
