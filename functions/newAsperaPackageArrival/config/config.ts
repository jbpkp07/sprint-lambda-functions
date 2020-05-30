import * as path from "path";

import { IAWSLambdaConfig } from "../../_shared/IAWSLambdaConfig";
import { IGenericObj } from "../../_shared/IGenericObj";



// Configure here =====================================================================================================
const AWS_REGION: string = "us-west-2";
const Description: string = "Handles the arrival of a new Aspera package";
const Handler: string = "index.handler";
const Layers: string[] = ["arn:aws:lambda:us-west-2:177953807159:layer:axios:3"];
const MemorySize: string = "128";
const Runtime: string = "nodejs12.x";
const Timeout: string = "3";
const Variables: IGenericObj = { Hello: "World" };
// ====================================================================================================================



const lambdaFuncDir: string = path.basename(path.join(__dirname, ".."));

export const lambdaConfig: IAWSLambdaConfig = {

    config: {
        AWS_KEY: null,    // WARNING:  Leave this as null (this value is read from an environment variable; don't commit KEY to the repo)
        AWS_REGION,
        AWS_SECRET: null, // WARNING:  Leave this as null (this value is read from an environment variable; don't commit SECRET to the repo)
        Description,
        Environment: {
            Variables
        },
        FunctionName: lambdaFuncDir,
        Handler,
        Layers,
        MemorySize,
        PATH: `../${lambdaFuncDir}/build`,
        Role: null,       // WARNING:  Leave this as null (this value is read from an environment variable; don't commit ROLE to the repo)
        Runtime,
        Timeout
    },
    dotenvFilePath: `../${lambdaFuncDir}/env/.env`
};
