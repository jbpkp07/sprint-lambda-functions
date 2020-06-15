import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { SLF } from "./types";


function pruneFileInfo(fileInfo: SLF.AsperaApiFileInfo): SLF.AsperaApiFileInfo {

    const basicFileInfo: SLF.AsperaApiFileInfo = {

        id: fileInfo.id,
        name: fileInfo.name,
        path: fileInfo.path,
        size: fileInfo.size,
        type: fileInfo.type
    };

    return basicFileInfo;
}


const getAsperaApiPackageFiles: SLF.GetAsperaApiPackageFiles = async (token: SLF.AsperaApiToken, contentsFileId: string): Promise<SLF.AsperaApiFileInfo[]> => {

    const urlBase: string = "https://ats-aws-us-west-2.aspera.io/files";

    const url: string = `${urlBase}/${contentsFileId}/files`;

    if (process.env.NODE_ACCESS_KEY === undefined) throw new Error("getAsperaApiPackageFiles() environment variable not set for NODE_ACCESS_KEY");

    const requestConfig: AxiosRequestConfig = {

        headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "X-Aspera-AccessKey": `${process.env.NODE_ACCESS_KEY}`
        },
        method: "GET",
        url
    };

    const files: SLF.AsperaApiFileInfo[] = [];
    
    const subDirPromises: Promise<SLF.AsperaApiFileInfo[]>[] = [];

    try {

        const response: AxiosResponse<SLF.AsperaApiFileInfo[]> = await Axios(requestConfig);
        
        const dirents: SLF.AsperaApiFileInfo[] = response.data;

        for (const dirent of dirents) {

            if (dirent.id === undefined) throw new Error("getAsperaApiPackageFiles() Aspera API did not return { .id } for dirent");
            if (dirent.name === undefined) throw new Error("getAsperaApiPackageFiles() Aspera API did not return { .name } for dirent");
            if (dirent.path === undefined) throw new Error("getAsperaApiPackageFiles() Aspera API did not return { .path } for dirent");
            if (dirent.type === undefined) throw new Error("getAsperaApiPackageFiles() Aspera API did not return { .type } for dirent");
            
            if (dirent.type === "folder") {
   
                subDirPromises.push(getAsperaApiPackageFiles(token, dirent.id));
            }
            else if (dirent.type === "file") {

                if (dirent.size === undefined) throw new Error("getAsperaApiPackageFiles() Aspera API did not return { .size } for dirent");

                files.push(pruneFileInfo(dirent));
            }
        }

        const subDirFilesResults: SLF.AsperaApiFileInfo[][] = await Promise.all(subDirPromises);

        for (const subDirFiles of subDirFilesResults) {

            for (const subDirFile of subDirFiles) {

                files.push(pruneFileInfo(subDirFile));
            }
        }

        files.sort((a: SLF.AsperaApiFileInfo, b: SLF.AsperaApiFileInfo): number => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1);

        return files;
    }
    catch (error) {

        throw new Error(error);
    }
};


export = getAsperaApiPackageFiles;
