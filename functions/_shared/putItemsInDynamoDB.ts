import * as AWS from "aws-sdk";

import { SLF } from "./types";


const putItemsInDynamoDB: SLF.PutItemsInDynamoDB = async (items: SLF.GenericObj[], tableName: SLF.DynamoDBTableName): Promise<string> => {

    try {

        if (process.env.AWS_ACCESS_KEY_ID === undefined) throw new Error("putItemsInDynamoDB() AWS_ACCESS_KEY_ID environment variable not set");
        if (process.env.AWS_SECRET_ACCESS_KEY === undefined) throw new Error("putItemsInDynamoDB() AWS_SECRET_ACCESS_KEY environment variable not set");
        if (process.env.AWS_REGION === undefined) throw new Error("putItemsInDynamoDB() AWS_REGION environment variable not set");

        let schemaEntries: [string, any][];

        switch (tableName) {

            case "DeliveryFiles":

                const schema: SLF.DeliveryFilesDocument = {

                    _id: "",
                    asperaFileId: "",
                    asperaInbox: "",
                    asperaPkgFileId: "",
                    asperaPkgId: "",
                    assetId: "",
                    deliveryEmail: "",
                    deliveryId: "",
                    deliveryMessage: "",
                    deliveryMethod: "",
                    deliveryName: "",
                    deliverySubject: "",
                    fileExt: "",
                    fileName: "",
                    filePath: "",
                    fileSize: 0,
                    isInbound: true,
                    timestamp: ""
                };

                schemaEntries = Object.entries(schema);

                break;

            default:

                throw new TypeError(`switch case not implemented for ${tableName}`);
        }

        AWS.config.update({ region: process.env.AWS_REGION });

        const dynamoClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

        const writeRequests: AWS.DynamoDB.DocumentClient.WriteRequests = [];

        for (const Item of items) {

            if (Object.keys(Item).length !== schemaEntries.length) {

                throw new Error("Invalid data being written to database");
            }

            for (const schemaEntry of schemaEntries) {

                const schemaKey: string = schemaEntry[0];
                const schemaValue: any = schemaEntry[1];

                if (Item[schemaKey] === undefined || (Item[schemaKey] !== null && typeof Item[schemaKey] !== typeof schemaValue)) {

                    throw new Error("Invalid data being written to database");
                }
            }

            writeRequests.push({ PutRequest: { Item } });
        }

        const response: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput = await dynamoClient.batchWrite({ RequestItems: { [tableName]: writeRequests } }).promise();

        if (response.UnprocessedItems !== undefined && Object.keys(response.UnprocessedItems).length !== 0) {

            throw new Error(`DynamoDB notified that there were unprocessed items ${JSON.stringify(response.UnprocessedItems)}`);
        }

        return `${items.length} items written to DynamoDB table [${tableName}]`;
    }
    catch (error) {

        throw new Error(`putItemsInDynamoDB() table: ${tableName} ${error}`);
    }
};


export = putItemsInDynamoDB;
