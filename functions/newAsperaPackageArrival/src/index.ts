import * as AWS from "aws-sdk";
import Axios from "axios";
import * as dotenv from "dotenv";



dotenv.config();

console.log(process.env.AWS_KEY);
console.log(process.env.AWS_SECRET);
console.log(process.env.ROLE);



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

    console.log("Hello World 3...!!!\n");

    console.log(Axios);
    console.log();
    console.log(Axios.CancelToken);

    return Promise.resolve("yey");
};

// handler();

export = { handler };
