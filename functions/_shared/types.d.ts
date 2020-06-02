
export namespace SLF {

    type Event = AWSLambda.APIGatewayProxyEvent;

    type Context = AWSLambda.Context;

    type Result = AWSLambda.APIGatewayProxyResult;

    type Handler = (event: Event, context: Context) => Promise<Result>;

    type LambdaFunctionResponse = (lambdaFuncName: string, statusCode: number, error?: any) => Result;

    type ConvertToURIComponent = (data: GenericObj) => string;

    type GetAsperaBearerToken = (config: AsperaTokenRequestConfig) => Promise<AsperaToken>;

    type DevDriver = (handler: Handler, config: DevDriverTestConfig) => void;

    type GetValidatedEventBody = <T>(event: Event, type: EventBodyType) => T;

    type EventBodyType = "newAsperaPackageArrival";

    interface GenericObj {

        [key: string]: any;
    }

    interface AWSLambdaDeployConfig {

        config: {
            AWS_KEY: string | null;
            AWS_REGION: string;
            AWS_SECRET: string | null;
            Description: string;
            Environment: {
                Variables: GenericObj;
            };
            FunctionName: string;
            Handler: string;
            Layers: string[];
            MemorySize: string;
            PATH: string;
            Role: string | null;
            Runtime: string;
            Tags?: GenericObj;
            Timeout: string;
        };
        dotenvFilePath: string;
    }

    interface AsperaEventBody {

        dropboxId: string;
        fileId: string;
        inboxName: string;
        metadata: string;
        nodeId: string;
        timestamp: string;
    }

    interface AsperaToken {

        access_token: string;
        token_type: string;
        expires_in: number;
        scope: string;
    }

    interface AsperaTokenRequestConfig {

        domain: "api.asperafiles.com" | "api.ibmaspera.com";
        useNodeAccessKey: boolean;
    }

    interface AsperaTokenRequestData {

        assertion: string;
        grant_type: string;
        scope: string;
    }

    interface DevDriverTestConfig {

        body?: GenericObj;
        headers?: GenericObj;
        queryStringParameters?: GenericObj;
    }
}
