
export namespace SLF {

    type Event = AWSLambda.APIGatewayProxyEvent;

    type Context = AWSLambda.Context;

    type Result = AWSLambda.APIGatewayProxyResult;

    type Handler = (event: Event, context: Context) => Promise<Result>;

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
}
