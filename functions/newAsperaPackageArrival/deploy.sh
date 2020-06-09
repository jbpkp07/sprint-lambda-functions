
lambdaFuncName=$(basename "$(dirname "$0")");

tput setab 0;

printf '\n  Compiling TypeScript file(s) [/src, /_shared, deployConfig.ts, deploy.ts] ... ';

rm -r -f build;

mkdir build;

cp -f ./env/.env ./build

../../node_modules/.bin/tsc -b tsconfig.json tsconfig.shared.json;

../../node_modules/.bin/tsc -b ./config/tsconfig.json;

../../node_modules/.bin/tsc -b ../_shared/deploy/tsconfig.json;

tput setaf 2; 
tput bold;

printf 'Done!\n\n';

tput sgr0;
tput setab 0;

cd ../_shared/deploy

node deploy.js "../../$lambdaFuncName/config/deployConfig.js";

rm -f deploy.js "../../$lambdaFuncName/config/deployConfig.js";

read -n 1 -r -s -p $'  Press any key to exit ... \n\n';
