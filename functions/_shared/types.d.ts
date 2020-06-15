
export namespace SLF {

    // aliases ----------------------------------------------------------------
    type Context = AWSLambda.Context;
    type Event = AWSLambda.APIGatewayProxyEvent;
    type Result = AWSLambda.APIGatewayProxyResult;


    // enums ------------------------------------------------------------------
    type DynamoDBTableName = "newAsperaFiles" | "";

    type EventBodyType = "newAsperaPackageArrival" | "";
    

    // functions --------------------------------------------------------------
    type ConvertToURIComponent = (data: GenericObj) => string;

    type DevDriver = (handler: Handler, config: DevDriverTestConfig) => void;

    type GetAsperaApiBearerToken = (config: AsperaApiTokenRequestConfig) => Promise<AsperaApiToken>;

    type GetAsperaApiPackage = (token: AsperaApiToken, config: AsperaApiPackageConfig) => Promise<AsperaApiPackageInfo | null>;

    type GetAsperaApiPackageAndToken = (contentsFileId: string, timestamp: string, inboxName?: string) => Promise<AsperaApiPackageAndToken>;

    type GetAsperaApiPackageFiles = (token: AsperaApiToken, contentsFileId: string) => Promise<AsperaApiFileInfo[]>;

    type GetAsperaApiPackageFilesAndToken = (contentsFileId: string) => Promise<AsperaApiPackageFilesAndToken>;

    type GetAsperaApiTransfer = (token: AsperaApiToken, config: AsperaApiTransferConfig) => Promise<AsperaApiTransferInfo>;

    type Handler = (event: Event, context: Context) => Promise<Result>;

    type LambdaFunctionResponse = (lambdaFuncName: string, statusCode: number, error?: any) => Result;

    type PutItemsInDynamoDB = (items: any[], tableName: DynamoDBTableName) => Promise<string>;

    type PutNewAsperaFilesInDynamoDB = (packageInfo: AsperaApiPackageInfo, filesInfo: AsperaApiFileInfo[]) => Promise<string>;

    type ValidateEventBody<T> = (event: Event, type: EventBodyType) => T;

    
    // interfaces -------------------------------------------------------------
    interface GenericObj {

        [key: string]: any;
    }

    interface AsperaApiFileInfo {

        id: string;
        name: string;
        path: string;
        size: number;
        type: string;
    }

    interface AsperaApiPackageAndToken {

        aocBearerToken: AsperaApiToken;
        packageInfo: AsperaApiPackageInfo | null;
    }

    interface AsperaApiPackageConfig {

        contentsFileId?: string;
        inboxName?: string;
        method: "byPackageId" | "byTimestamp";
        methodValue: string;
    }

    interface AsperaApiPackageFilesAndToken {

        filesInfo: AsperaApiFileInfo[];
        s3BearerToken: AsperaApiToken;
        transferInfo: AsperaApiTransferInfo;
    }

    interface AsperaApiPackageInfo {

        completedAt: string;
        contentsFileId: string;
        failed: boolean;
        fileId: string;
        id: string;
        inboxName: string;
        name: string;
        note: string;
        senderEmail: string;
        senderName: string;
    }

    interface AsperaApiToken {

        access_token: string;
        token_type: string;
        expires_in: number;
        scope: string;
    }

    interface AsperaApiTokenRequestConfig {

        domain: "api.asperafiles.com" | "api.ibmaspera.com";
        useNodeAccessKey: boolean;
    }

    interface AsperaApiTokenRequestData {

        assertion: string;
        grant_type: string;
        scope: string;
    }

    interface AsperaApiTransferConfig {

        contentsFileId?: string;
        method: "byTransferId" | "byContentsFileId";
        methodValue: string;
    }

    interface AsperaApiTransferInfo {

        contentsFileId: string;
        filePaths: Set<string>;
        packageId: string;
    }

    interface AsperaEventBody {

        dropboxId: string;
        fileId: string;
        inboxName: string;
        metadata: string;
        nodeId: string;
        timestamp: string;
    }

    interface AWSLambdaDeployConfig {

        config: {
            AWS_KEY: string | null;
            AWS_REGION: string | null;
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

    interface DbAsperaFileDocument {

        fileId: number;
        fileName: string;
        fileNameExt: string;
        filePath: string;
        fileSize: number;
        inboxName: string;
        packageFileId: string;
        packageId: string;
        packageName: string;
        packageNote: string;
        sendersEmail: string;
        sendersName: string;
        timestamp: string;
    }

    interface DevDriverTestConfig {

        body?: GenericObj;
        headers?: GenericObj;
        queryStringParameters?: GenericObj;
    }
}
