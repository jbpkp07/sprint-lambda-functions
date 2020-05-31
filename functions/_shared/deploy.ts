import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { terminal } from "terminal-kit";

import { SLF } from "./types";


const awsLambdaExecPath: string = path.normalize("../../node_modules/.bin/lambda");
const tempConfigFilePath: string = path.normalize("./config.lambda");


try {

    if (process.argv.length !== 3) throw new Error("    deploy.js requires 1 argument:   node deploy.js <lambdaConfigPath>\n");

    const lambdaConfigPath: string = process.argv[2];

    const { lambdaConfig }: { lambdaConfig: SLF.AWSLambdaDeployConfig } = require(lambdaConfigPath);

    // tslint:disable-next-line: strict-type-predicates
    if (lambdaConfig.config === undefined || lambdaConfig.dotenvFilePath === undefined) throw new Error("    deploy.js invalid config provided\n");

    terminal.bgBlack();
    terminal.brightCyan(`    Deploying Lambda Function [${lambdaConfig.config.FunctionName}]...\n\n`);

    const dotenvFile: string = path.basename(lambdaConfig.dotenvFilePath);
    const dotenvFilePath: string = lambdaConfig.dotenvFilePath;

    if (!fs.existsSync(dotenvFilePath)) throw new Error(`    Missing [${dotenvFile}] @ ${dotenvFilePath}\n`);
    if (!fs.existsSync(lambdaConfig.config.PATH)) throw new Error(`    Invalid path: ${lambdaConfig.config.PATH}\n`);

    dotenv.config({ path: dotenvFilePath });

    if (process.env.AWS_KEY === undefined) throw new Error(`    Missing [AWS_KEY=???] from file [${dotenvFile}]`);
    if (process.env.AWS_SECRET === undefined) throw new Error(`    Missing [AWS_SECRET=???] from file [${dotenvFile}]`);
    if (process.env.ROLE === undefined) throw new Error(`    Missing [ROLE=???] from file [${dotenvFile}]`);

    lambdaConfig.config.AWS_KEY = process.env.AWS_KEY;
    lambdaConfig.config.AWS_SECRET = process.env.AWS_SECRET;
    lambdaConfig.config.Role = process.env.ROLE;

    if (fs.existsSync(tempConfigFilePath)) fs.unlinkSync(tempConfigFilePath);

    fs.writeFileSync(tempConfigFilePath, JSON.stringify(lambdaConfig.config));

    const stdout: string = execSync(`${awsLambdaExecPath} deploy ${tempConfigFilePath}`, { encoding: "utf8", stdio: "pipe" });

    terminal.brightGreen(`    ${stdout.replace(/\n/g, "\n    ").trimRight()}\n\n`);

    if (fs.existsSync(tempConfigFilePath)) fs.unlinkSync(tempConfigFilePath);
}
catch (error) {

    if (error.message !== undefined) {

        terminal.brightRed(`${error.message}\n`);
    }
    else {

        terminal.brightRed(`${error}\n`);
    }

    if (fs.existsSync(tempConfigFilePath)) fs.unlinkSync(tempConfigFilePath);
}
