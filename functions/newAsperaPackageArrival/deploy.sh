
lambdaFuncName=$(basename "$(dirname "$0")");

tput setab 0;

printf '\n  Compiling TypeScript file(s) [/src, config.ts, deploy.ts] ... ';

../../node_modules/.bin/tsc;

cd ./config

../../../node_modules/.bin/tsc;

cd ../../_shared

../../node_modules/.bin/tsc;

tput setaf 2; 
tput bold;

printf 'Done!\n\n';

tput sgr0;
tput setab 0;

node deploy.js "../$lambdaFuncName/config/config.js";

rm -f deploy.js "../$lambdaFuncName/config/config.js";

read -n 1 -r -s -p $'  Press any key to exit ... \n\n';
