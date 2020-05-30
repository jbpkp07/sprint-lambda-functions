lambdaFuncName=$(basename "$(dirname "$0")");

echo -e '\033]2;'Lambda Function:  [$lambdaFuncName]'\007';

tput setab 0;
tput bold;
tput setaf 7;

printf "  Running Lambda Function:  [";

tput setaf 6;

printf "$lambdaFuncName";

tput setaf 7;

printf "]\n\n";


cd build;

../../../node_modules/.bin/nodemon index.js;
