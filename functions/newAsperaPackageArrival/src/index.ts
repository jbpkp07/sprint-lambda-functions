import * as AWS from "aws-sdk";
import Axios from "axios";





// @ts-ignore
const dynamoClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

// @ts-ignore
interface IAsperaEventBody {

    dropboxId: string;
    fileId: string;
    inboxName: string;
    metadata: string;
    nodeId: string;
    timestamp: string;
}

const handler: any = async (_event?: AWSLambda.APIGatewayEvent, _context?: AWSLambda.Context): Promise<string> => {


    console.log("Hello World...!!!\n");

    console.log(Axios);

    return Promise.resolve("yey");
};

handler();

export = { handler };
