import { IGenericObj } from "./IGenericObj";


export interface IAWSLambdaConfig {

    config: {
        AWS_KEY: string | null;
        AWS_REGION: string;
        AWS_SECRET: string | null;
        Description: string;
        Environment: {
            Variables: IGenericObj;
        };
        FunctionName: string;
        Handler: string;
        Layers: string[];
        MemorySize: string;
        PATH: string;
        Role: string | null;
        Runtime: string;
        Tags?: IGenericObj;
        Timeout: string;
    };
    dotenvFilePath: string;
}
