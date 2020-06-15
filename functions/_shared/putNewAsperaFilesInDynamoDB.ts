import * as path from "path";

import * as putItemsInDynamoDB from "./putItemsInDynamoDB";
import { SLF } from "./types";


const putNewAsperaFilesInDynamoDB: SLF.PutNewAsperaFilesInDynamoDB = async (packageInfo: SLF.AsperaApiPackageInfo, filesInfo: SLF.AsperaApiFileInfo[]): Promise<string> => {

    const fileDocuments: SLF.DbAsperaFileDocument[] = [];

    for (const fileInfo of filesInfo) {

        const fileDocument: SLF.DbAsperaFileDocument = {

            fileId: parseInt(fileInfo.id),
            fileName: fileInfo.name,
            fileNameExt: path.extname(fileInfo.name),
            filePath: fileInfo.path,
            fileSize: fileInfo.size,
            inboxName: packageInfo.inboxName,
            packageFileId: packageInfo.fileId,
            packageId: packageInfo.id,
            packageName: packageInfo.name,
            packageNote: packageInfo.note.substr(0, 256),
            sendersEmail: packageInfo.senderEmail,
            sendersName: packageInfo.senderName,
            timestamp: packageInfo.completedAt
        };

        fileDocuments.push(fileDocument);
    }

    const status: string = await putItemsInDynamoDB(fileDocuments, "newAsperaFiles");

    console.log(status);

    return status;
};


export = putNewAsperaFilesInDynamoDB;
