import * as AWS from "aws-sdk";
// import Axios from "axios";

import { SLF } from "../../_shared/types";


// @ts-ignore
const dynamoClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();


const lambdaFuncName: string = "newAsperaPackageArrival";

const response: AWSLambda.APIGatewayProxyResult = {

    body: JSON.stringify({
        lambdaFuncName,
        message: "Success"
    }),
    headers: {
        "Content-Type": "application/json"
    },
    isBase64Encoded: false,
    statusCode: 200
};

function updateResponseOnError(error: string, statusCode: number): void {

    response.body = JSON.stringify({
        lambdaFuncName,
        message: `${error}`
    });

    response.statusCode = statusCode;
}

function validateEventBody(event: SLF.Event): SLF.AsperaEventBody {

    if ((event as any).body === undefined) throw new Error("Aspera Event body is undefined");
    if (event.body === null) throw new Error("Aspera Event body is null");

    let asperaEventBody: SLF.AsperaEventBody;

    try { asperaEventBody = JSON.parse(event.body); }
    catch (error) { throw new Error("Unable to parse Aspera event body"); }

    if ((asperaEventBody as any).dropboxId === undefined) throw new Error("Aspera Event body is missing key 'dropboxId'");
    if ((asperaEventBody as any).fileId === undefined) throw new Error("Aspera Event body is missing key 'fileId'");
    if ((asperaEventBody as any).inboxName === undefined) throw new Error("Aspera Event body is missing key 'inboxName'");
    if ((asperaEventBody as any).metadata === undefined) throw new Error("Aspera Event body is missing key 'metadata'");
    if ((asperaEventBody as any).nodeId === undefined) throw new Error("Aspera Event body is missing key 'nodeId'");
    if ((asperaEventBody as any).timestamp === undefined) throw new Error("Aspera Event body is missing key 'timestamp'");

    return asperaEventBody;
}

const handler: SLF.Handler = async (event: SLF.Event, _context: SLF.Context): Promise<SLF.Result> => {

    return new Promise((resolve: Function): void => {

        try {

            const asperaEvent: SLF.AsperaEventBody = validateEventBody(event);

            console.log(asperaEvent);
        }
        catch (error) {

            (error.message !== undefined) ? console.log(error.message) : console.log(error);

            updateResponseOnError(error, 500);
        }

        resolve(response);
    });
};

export = { handler };



// const testEvent: AWSLambda.APIGatewayProxyEvent = {

//     body: {} as SLF.AsperaEventBody,
//     headers: {},
//     httpMethod: "",
//     isBase64Encoded: false,
//     multiValueHeaders: {},
//     multiValueQueryStringParameters: null,
//     path: "",
//     pathParameters: null,
//     queryStringParameters: null,
//     requestContext: {} as any,
//     resource: "",
//     stageVariables: null
// };



if (process.env.NODE_ENV !== "Production") {

    const eventBody: any = {

        dropboxId: "123",
        fileId: "456",
        inboxName: "Spafx Drop Box",
        metadata: "789",
        nodeId: "abc",
        timestamp: new Date().toLocaleString()
    };

    handler({ body: JSON.stringify(eventBody) } as any, {} as any)

        .then((res: AWSLambda.APIGatewayProxyResult): void => {

            console.log(res);
        });
}

