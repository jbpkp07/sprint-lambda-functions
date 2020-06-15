import * as getAsperaApiBearerToken from "./getAsperaApiBearerToken";
import * as getAsperaApiPackageFiles from "./getAsperaApiPackageFiles";
import * as getAsperaApiTransfer from "./getAsperaApiTransfer";
import { SLF } from "./types";


const getAsperaApiPackageFilesAndToken: SLF.GetAsperaApiPackageFilesAndToken = async (contentsFileId: string): Promise<SLF.AsperaApiPackageFilesAndToken> => {

    const s3BearerToken: SLF.AsperaApiToken = await getAsperaApiBearerToken({ domain: "api.asperafiles.com", useNodeAccessKey: true });

    const s3Requests: [Promise<SLF.AsperaApiTransferInfo>, Promise<SLF.AsperaApiFileInfo[]>] = [

        getAsperaApiTransfer(s3BearerToken, { method: "byContentsFileId", methodValue: contentsFileId }),
        getAsperaApiPackageFiles(s3BearerToken, contentsFileId)
    ];

    const [transferInfo, filesInfo]: [SLF.AsperaApiTransferInfo, SLF.AsperaApiFileInfo[]] = await Promise.all(s3Requests);

    if (transferInfo.filePaths.size !== filesInfo.length) throw new Error("getAsperaApiPackageFilesAndToken() Aspera package file count mismatch");

    for (const fileInfo of filesInfo) {

        if (!transferInfo.filePaths.has(fileInfo.path)) throw new Error(`getAsperaApiPackageFilesAndToken() Aspera package file path mismatch ${fileInfo.path}`);
    }

    return { filesInfo, s3BearerToken, transferInfo };
};


export = getAsperaApiPackageFilesAndToken;
