import * as AWS from "aws-sdk";
import * as path from "path";
import { v4 as uuid } from "uuid";

import * as putItemsInDynamoDB from "./putItemsInDynamoDB";
import { SLF } from "./types";

type AttributeMap = AWS.DynamoDB.DocumentClient.AttributeMap;
type DocumentClient = AWS.DynamoDB.DocumentClient;
type ScanOutput = AWS.DynamoDB.DocumentClient.ScanOutput;


const putNewAsperaFilesInDynamoDB: SLF.PutNewAsperaFilesInDynamoDB = async (packageInfo: SLF.AsperaApiPackageInfo, filesInfo: SLF.AsperaApiFileInfo[]): Promise<string> => {

    if (process.env.AWS_ACCESS_KEY_ID === undefined) throw new Error("putNewAsperaFilesInDynamoDB() AWS_ACCESS_KEY_ID environment variable not set");
    if (process.env.AWS_SECRET_ACCESS_KEY === undefined) throw new Error("putNewAsperaFilesInDynamoDB() AWS_SECRET_ACCESS_KEY environment variable not set");
    if (process.env.AWS_REGION === undefined) throw new Error("putNewAsperaFilesInDynamoDB() AWS_REGION environment variable not set");

    const filesTableName: SLF.TableNameDynamoDB = "DeliveryFiles";
    const methodsTableName: SLF.TableNameDynamoDB = "DeliveryMethods";
    const deliveryMethod: string = "Aspera";

    const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

    const methods: ScanOutput = await dynamoClient.scan({ TableName: methodsTableName }).promise();

    if (methods.Items !== undefined) {

        const methodValues: Set<string> = new Set(methods.Items.map((item: AttributeMap): string => (item as SLF.DeliveryMethodsDocument).method));

        if (!methodValues.has(deliveryMethod)) throw new Error(`putNewAsperaFilesInDynamoDB() deliveryMethod [${deliveryMethod}] does not exist in table: ${methodsTableName}`);
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
            h265AssetId: null,
            ingestAssetPaths: {
                h264: null,
                h265: null,
                raw: null
            },
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
