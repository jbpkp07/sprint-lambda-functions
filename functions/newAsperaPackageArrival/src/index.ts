import * as dotenv from "dotenv";
import * as path from "path";

import { SLF } from "../../_shared/types";

dotenv.config({ path: "./.env" });

const lambdaFunctionName: string = require("./lambdaFunctionName");
const lambdaFunctionResponse: SLF.LambdaFunctionResponse = require("./lambdaFunctionResponse");
const validateEventBody: SLF.ValidateEventBody<SLF.AsperaEventBody> = require("./validateEventBody");
const getAsperaApiBearerToken: SLF.GetAsperaApiBearerToken = require("./getAsperaApiBearerToken");
const getAsperaApiTransferByFileId: SLF.GetAsperaApiTransferByFileId = require("./getAsperaApiTransferByFileId");
const getAsperaApiPackageFiles: SLF.GetAsperaApiPackageFiles = require("./getAsperaApiPackageFiles");
const getAsperaApiPackage: SLF.GetAsperaApiPackage = require("./getAsperaApiPackage");
const putItemsInDynamoDB: SLF.PutItemsInDynamoDB = require("./putItemsInDynamoDB");


type S3PromiseResults = [SLF.AsperaApiToken, SLF.AsperaApiTransferInfo, SLF.AsperaApiFileInfo[]];
type aocPromiseResults = [SLF.AsperaApiToken, SLF.AsperaApiPackageInfo | null];


const handler: SLF.Handler = async (event: SLF.Event, _context: SLF.Context): Promise<SLF.Result> => {

    let s3BearerToken: SLF.AsperaApiToken;
    let transferInfo: SLF.AsperaApiTransferInfo;
    let filesInfo: SLF.AsperaApiFileInfo[];

    let aocBearerToken: SLF.AsperaApiToken;
    let aspPackage: SLF.AsperaApiPackageInfo | null;

    try {

        const eventBody: SLF.AsperaEventBody = validateEventBody(event, "newAsperaPackageArrival");

        console.log(eventBody);

        const fileId: string = eventBody.fileId;
        const contentsFileId: string = `${parseInt(eventBody.fileId) + 1}`;


        const s3Promise: Promise<S3PromiseResults> = (async (): Promise<S3PromiseResults> => {

            s3BearerToken = await getAsperaApiBearerToken({ domain: "api.asperafiles.com", useNodeAccessKey: true });

            const s3Requests: [Promise<SLF.AsperaApiTransferInfo>, Promise<SLF.AsperaApiFileInfo[]>] = [

                getAsperaApiTransferByFileId(s3BearerToken, contentsFileId),
                getAsperaApiPackageFiles(s3BearerToken, contentsFileId)
            ];

            [transferInfo, filesInfo] = await Promise.all(s3Requests);

            return [s3BearerToken, transferInfo, filesInfo];

        })();


        const aocPromise: Promise<aocPromiseResults> = (async (): Promise<aocPromiseResults> => {

            const aspPackageConfig: SLF.AsperaApiPackageConfig = {

                contentsFileId,
                fileId,
                method: "byTimestamp",
                value: eventBody.timestamp
            };

            aocBearerToken = await getAsperaApiBearerToken({ domain: "api.ibmaspera.com", useNodeAccessKey: false });

            aspPackage = await getAsperaApiPackage(aocBearerToken, aspPackageConfig);

            return [aocBearerToken, aspPackage];

        })();


        [[s3BearerToken, transferInfo, filesInfo], [aocBearerToken, aspPackage]] = await Promise.all([s3Promise, aocPromise]);


        if (transferInfo.filePaths.size !== filesInfo.length) throw new Error("index.handler() Aspera package file count mismatch");

        if (aspPackage === null) {

            console.log("Calling Aspera Packages API w/ second attempt (now using packageId)");

            const aspPackageConfig: SLF.AsperaApiPackageConfig = {

                contentsFileId,
                fileId,
                method: "byPackageId",
                value: transferInfo.packageId
            };

            aspPackage = await getAsperaApiPackage(aocBearerToken, aspPackageConfig);

            if (aspPackage === null) throw new Error("index.handler() AsperaApiPackageInfo is still null after retry attempt");
        }

        const fileDocuments: SLF.DbAsperaFileDocument[] = [];

        for (const fileInfo of filesInfo) {

            if (!transferInfo.filePaths.has(fileInfo.path)) throw new Error(`index.handler() Aspera package file path mismatch ${fileInfo.path}`);

            const fileDocument: SLF.DbAsperaFileDocument = {

                fileId: parseInt(fileInfo.id),
                fileName: fileInfo.name,
                fileNameExt: path.extname(fileInfo.name),
                filePath: fileInfo.path,
                fileSize: fileInfo.size,
                inboxName: eventBody.inboxName,
                packageFileId: aspPackage.fileId,
                packageId: aspPackage.id,
                packageName: aspPackage.name,
                packageNote: aspPackage.note,
                sendersEmail: aspPackage.senderEmail,
                sendersName: aspPackage.senderName,
                timestamp: eventBody.timestamp
            };

            fileDocuments.push(fileDocument);
        }

        if (process.env.AWS_REGION !== undefined) {

            const status: string = await putItemsInDynamoDB(fileDocuments, "newAsperaFiles", process.env.AWS_REGION);

            console.log(status);
        }
        else {

            throw new Error("index.handler() AWS_REGION environment variable not set");
        }

    }
    catch (error) {

        (error.message !== undefined) ? console.log(error.message) : console.log(error);

        return lambdaFunctionResponse(lambdaFunctionName, 500, error);
    }

    return lambdaFunctionResponse(lambdaFunctionName, 200);
};


if (process.env.NODE_ENV !== "Production") {

    const devDriver: SLF.DevDriver = require("./devDriver");

    const testBody: any = {

        dropboxId: "5561",
        fileId: "990",
        inboxName: "Cloud_Drop",
        metadata: "[]",
        nodeId: "25222",
        timestamp: "2020-06-09 18:12:41Z"
    };

    devDriver(handler, { body: testBody });
}


export = { handler };
