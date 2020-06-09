import * as path from "path";

import { SLF } from "../../_shared/types";


// Configure here =====================================================================================================
const Description: string = "Handles the arrival of a new Aspera package";
const Handler: string = "index.handler";
const Layers: string[] = ["arn:aws:lambda:us-west-2:177953807159:layer:axios:3", "arn:aws:lambda:us-west-2:177953807159:layer:dotenv:1"];
const MemorySize: string = "128";
const Runtime: string = "nodejs12.x";
const Timeout: string = "10";
const Variables: SLF.GenericObj = { NODE_ENV: "Production" };  // Always keep this key [NODE_ENV: "Production"] to determine if running locally or AWS production
// ====================================================================================================================



const lambdaFuncName: string = path.basename(path.join(__dirname, ".."));

export const deployConfig: SLF.AWSLambdaDeployConfig = {

    config: {
        AWS_KEY: null,    // WARNING:  Leave this as null (this value is read from an environment variable; don't commit KEY to the repo)
        AWS_REGION: null, // WARNING:  Leave this as null (this value is read from an environment variable; don't commit REGION to the repo)
        AWS_SECRET: null, // WARNING:  Leave this as null (this value is read from an environment variable; don't commit SECRET to the repo)
        Description,
        Environment: {
            Variables
        },
        FunctionName: lambdaFuncName,
        Handler,
        Layers,
        MemorySize,
        PATH: `../../${lambdaFuncName}/build`,
        Role: null,       // WARNING:  Leave this as null (this value is read from an environment variable; don't commit ROLE to the repo)
        Runtime,
        Timeout
    },
    dotenvFilePath: `../../${lambdaFuncName}/env/.env`
};
