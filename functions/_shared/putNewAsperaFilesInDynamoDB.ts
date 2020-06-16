import * as AWS from "aws-sdk";
import * as path from "path";
import { v4 as uuid } from "uuid";

import * as putItemsInDynamoDB from "./putItemsInDynamoDB";
import { SLF } from "./types";


const putNewAsperaFilesInDynamoDB: SLF.PutNewAsperaFilesInDynamoDB = async (packageInfo: SLF.AsperaApiPackageInfo, filesInfo: SLF.AsperaApiFileInfo[]): Promise<string> => {

    if (process.env.AWS_ACCESS_KEY_ID === undefined) throw new Error("putNewAsperaFilesInDynamoDB() AWS_ACCESS_KEY_ID environment variable not set");
    if (process.env.AWS_SECRET_ACCESS_KEY === undefined) throw new Error("putNewAsperaFilesInDynamoDB() AWS_SECRET_ACCESS_KEY environment variable not set");
    if (process.env.AWS_REGION === undefined) throw new Error("putNewAsperaFilesInDynamoDB() AWS_REGION environment variable not set");

    const filesTableName: SLF.DynamoDBTableName = "DeliveryFiles";
    const methodsTableName: SLF.DynamoDBTableName = "DeliveryMethods";
    const deliveryMethod: string = "Aspera";

    const dynamoClient: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

    const methods: AWS.DynamoDB.DocumentClient.ScanOutput = await dynamoClient.scan({ TableName: methodsTableName, AttributesToGet: ["method"] }).promise();

    if (methods.Items !== undefined) {

        const methodValues: Set<string> = new Set(methods.Items.map((item: any): string => item.method));

        if (!methodValues.has(deliveryMethod)) throw new Error(`putNewAsperaFilesInDynamoDB() deliveryMethod does not exist in table: ${methodsTableName}`);
    }
    else {

        throw new Error(`putNewAsperaFilesInDynamoDB() no results fetched from table: ${methodsTableName}`);
    }

    const fileDocuments: SLF.DeliveryFilesDocument[] = [];

    for (const fileInfo of filesInfo) {

        const fileDocument: SLF.DeliveryFilesDocument = {

            _id: uuid(),
            asperaFileId: fileInfo.id,
            asperaInbox: packageInfo.inboxName,
            asperaPkgFileId: packageInfo.fileId,
            asperaPkgId: packageInfo.id,
            assetId: null,
            deliveryEmail: packageInfo.senderEmail,
            deliveryId: null,
            deliveryMessage: packageInfo.note.substr(0, 255),
            deliveryMethod,
            deliveryName: packageInfo.senderName,
            deliverySubject: packageInfo.name,
            fileExt: path.extname(fileInfo.name),
            fileName: fileInfo.name,
            filePath: fileInfo.path,
            fileSize: fileInfo.size,
            isInbound: true,
            timestamp: packageInfo.completedAt            
        };

        fileDocuments.push(fileDocument);
    }

    const status: string = await putItemsInDynamoDB(fileDocuments, filesTableName);

    console.log(status);

    return status;
};


export = putNewAsperaFilesInDynamoDB;
