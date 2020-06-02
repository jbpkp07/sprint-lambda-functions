import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";

import { SLF } from "../../_shared/types";

dotenv.config({ path: "./.env" });

const getAsperaBearerToken: SLF.GetAsperaBearerToken = require("./getAsperaBearerToken");
const lambdaFunctionName: string = require("./lambdaFunctionName");
const lambdaFunctionResponse: SLF.LambdaFunctionResponse = require("./lambdaFunctionResponse");



// @ts-ignore
const dynamoClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();


function validateEventBody(event: SLF.Event): SLF.AsperaEventBody {

    if ((event as any).body === undefined) throw new Error("Aspera Event body is undefined");
    if (event.body === null) throw new Error("Aspera Event body is null");

    let asperaEventBody: SLF.AsperaEventBody;

    try {

        asperaEventBody = JSON.parse(event.body);
    }
    catch (error) {

        throw new Error("Unable to parse Aspera event body");
    }

    if ((asperaEventBody as any).dropboxId === undefined) throw new Error("Aspera Event body is missing key { dropboxId }");
    if ((asperaEventBody as any).fileId === undefined) throw new Error("Aspera Event body is missing key { fileId }");
    if ((asperaEventBody as any).inboxName === undefined) throw new Error("Aspera Event body is missing key { inboxName }");
    if ((asperaEventBody as any).metadata === undefined) throw new Error("Aspera Event body is missing key { metadata }");
    if ((asperaEventBody as any).nodeId === undefined) throw new Error("Aspera Event body is missing key { nodeId }");
    if ((asperaEventBody as any).timestamp === undefined) throw new Error("Aspera Event body is missing key { timestamp }");

    return asperaEventBody;
}


const handler: SLF.Handler = async (event: SLF.Event, _context: SLF.Context): Promise<SLF.Result> => {

    let s3BearerToken: SLF.AsperaToken;
    let aocBearerToken: SLF.AsperaToken;

    try {

        const asperaEvent: SLF.AsperaEventBody = validateEventBody(event);

        console.log(asperaEvent);
        console.log("\n\n");

        console.time("API response time");

        const tokenRequests: Promise<SLF.AsperaToken>[] = [

            getAsperaBearerToken({ domain: "api.asperafiles.com", useNodeAccessKey: true }),
            getAsperaBearerToken({ domain: "api.ibmaspera.com", useNodeAccessKey: false })
        ];

        [s3BearerToken, aocBearerToken] = await Promise.all(tokenRequests);

        console.timeEnd("API response time");

        console.log(s3BearerToken);

        console.log("\n\n");

        console.log(aocBearerToken);

        console.log("\n\n");
    }
    catch (error) {

        (error.message !== undefined) ? console.log(error.message) : console.log(error);

        return lambdaFunctionResponse(lambdaFunctionName, 500, error);
    }

    return lambdaFunctionResponse(lambdaFunctionName, 200);
};


if (process.env.NODE_ENV !== "Production") {

    const devDriver: SLF.DevDriver = require("./devDriver");

    const testBody: SLF.AsperaEventBody = {

        dropboxId: "123",
        fileId: "456",
        inboxName: "Spafax Drop Box",
        metadata: "some meta data",
        nodeId: "789",
        timestamp: new Date().toLocaleString()
    };
    
    devDriver(handler, { body: testBody });
}


export = { handler };
