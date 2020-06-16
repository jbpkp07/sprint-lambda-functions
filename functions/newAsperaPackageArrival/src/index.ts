import * as dotenv from "dotenv";

import { SLF } from "../../_shared/types";

dotenv.config({ path: "./.env" });

const getAsperaApiPackage: SLF.GetAsperaApiPackage = require("./getAsperaApiPackage");
const getAsperaApiPackageAndToken: SLF.GetAsperaApiPackageAndToken = require("./getAsperaApiPackageAndToken");
const getAsperaApiPackageFilesAndToken: SLF.GetAsperaApiPackageFilesAndToken = require("./getAsperaApiPackageFilesAndToken");
const lambdaFunctionResponse: SLF.LambdaFunctionResponse = require("./lambdaFunctionResponse");
const putNewAsperaFilesInDynamoDB: SLF.PutNewAsperaFilesInDynamoDB = require("./putNewAsperaFilesInDynamoDB");
const validateEventBody: SLF.ValidateEventBody<SLF.AsperaEventBody> = require("./validateEventBody");


const handler: SLF.Handler = async (event: SLF.Event, _context: SLF.Context): Promise<SLF.Result> => {

    try {

        const eventBody: SLF.AsperaEventBody = validateEventBody(event, "newAsperaPackageArrival");

        console.log(eventBody);

        const contentsFileId: string = `${parseInt(eventBody.fileId) + 1}`;

        const apiCalls: [Promise<SLF.AsperaApiPackageAndToken>, Promise<SLF.AsperaApiPackageFilesAndToken>] = [

            getAsperaApiPackageAndToken(contentsFileId, eventBody.timestamp, eventBody.inboxName),
            getAsperaApiPackageFilesAndToken(contentsFileId)
        ];

        const [aspPackage, aspPackageFiles]: [SLF.AsperaApiPackageAndToken, SLF.AsperaApiPackageFilesAndToken] = await Promise.all(apiCalls);

        if (aspPackage.packageInfo === null) {

            console.log("index.handler() calling Aspera Packages API w/ second attempt (now using packageId)");

            const aspPackageConfig: SLF.AsperaApiPackageConfig = {

                contentsFileId,
                inboxName: eventBody.inboxName,
                method: "byPackageId",
                methodValue: aspPackageFiles.transferInfo.packageId
            };

            aspPackage.packageInfo = await getAsperaApiPackage(aspPackage.aocBearerToken, aspPackageConfig);

            if (aspPackage.packageInfo === null) throw new Error("index.handler() AsperaApiPackageInfo is still null after retry attempt");
        }

        await putNewAsperaFilesInDynamoDB(aspPackage.packageInfo, aspPackageFiles.filesInfo);
    }
    catch (error) {

        (error.message !== undefined) ? console.log(error.message) : console.log(error);

        return lambdaFunctionResponse(500, error);
    }

    return lambdaFunctionResponse(200);
};


if (process.env.NODE_ENV !== "Production") {

    const devDriver: SLF.DevDriver = require("./devDriver");

    const testBody: any = {

        dropboxId: "5561",
        fileId: "1119",
        inboxName: "Cloud_Drop",
        metadata: "[]",
        nodeId: "25222",
        timestamp: "2020-06-16 11:04:56Z"
    };

    devDriver(handler, { body: testBody });
}


export = { handler };
