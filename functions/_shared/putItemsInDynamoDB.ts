import * as AWS from "aws-sdk";

import { SLF } from "./types";


const putItemsInDynamoDB: SLF.PutItemsInDynamoDB = async (items: any[], tableName: SLF.DynamoDBTableNames, region: string): Promise<string> => {

    try {

        let schemaEntries: [string, any][];

        switch (tableName) {

            case "newAsperaFiles":

                const schema: SLF.DbAsperaFileDocument = {

                    fileId: 0,
                    fileName: "",
                    fileNameExt: "",
                    filePath: "",
                    fileSize: 0,
                    inboxName: "",
                    packageFileId: "",
                    packageId: "",
                    packageName: "",
                    packageNote: "",
                    sendersEmail: "",
                    sendersName: "",
                    timestamp: ""
                };

                schemaEntries = Object.entries(schema);

                break;

            default:

                throw new TypeError(`switch case not implemented for ${tableName}`);
        }

        AWS.config.update({ region });

        const dynamoClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

        const promises: Promise<any>[] = [];

        for (const Item of items) {

            if (Object.keys(Item).length !== schemaEntries.length) {

                throw new Error("Invalid data being written to database");
            }

            for (const schemaEntry of schemaEntries) {

                const schemaKey: string = schemaEntry[0];
                const schemaValue: any = schemaEntry[1];

                if (Item[schemaKey] === undefined || typeof Item[schemaKey] !== typeof schemaValue) {

                    throw new Error("Invalid data being written to database");
                }
            }

            promises.push(dynamoClient.put({ Item, TableName: tableName }).promise());
        }

        await Promise.all(promises);

        return `${items.length} items written to DynamoDB table [${tableName}]`;
    }
    catch (error) {

        throw new Error(`putItemsInDynamoDB() failed:  ${error}`);
    }
};


export = putItemsInDynamoDB;
