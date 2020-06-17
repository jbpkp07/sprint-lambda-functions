import * as AWS from "aws-sdk";

import { SLF } from "./types";

type BatchWriteItemOutput = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;
type DocumentClient = AWS.DynamoDB.DocumentClient;
type WriteRequests = AWS.DynamoDB.DocumentClient.WriteRequests;


const putItemsInDynamoDB: SLF.PutItemsInDynamoDB = async (items: SLF.GenericObj[], tableName: SLF.TableNameDynamoDB): Promise<string> => {

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
                    h265AssetId: "",
                    ingestAssetPaths: {
                        h264: "",
                        h265: "",
                        raw: ""
                    },
                    isInbound: true,
                    timestamp: ""
                };

                schemaEntries = Object.entries(schema);

                break;

            default:

                throw new TypeError(`switch case not implemented for ${tableName}`);
        }

        AWS.config.update({ region: process.env.AWS_REGION });

        const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

        const writeRequests: WriteRequests = [];

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

        const response: BatchWriteItemOutput = await dynamoClient.batchWrite({ RequestItems: { [tableName]: writeRequests } }).promise();

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
