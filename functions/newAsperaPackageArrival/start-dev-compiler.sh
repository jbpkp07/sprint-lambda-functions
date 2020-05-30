tput setab 0;
tput bold;

lambdaFuncName=$(basename "$(dirname "$0")");

echo -e '\033]2;'TypeScript Compiler:  [$lambdaFuncName]'\007';

tput setaf 7;
printf "  Running TypeScript Compiler:  [";
tput setaf 6;
printf "$lambdaFuncName";
tput setaf 7;
printf "]\n\n";

rm -r -f build;

sleep 3;

../../node_modules/.bin/tsc -w;
