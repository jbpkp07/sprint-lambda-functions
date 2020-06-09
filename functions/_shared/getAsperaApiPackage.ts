import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { SLF } from "./types";


const getAsperaApiPackage: SLF.GetAsperaApiPackage = async (token: SLF.AsperaApiToken, config: SLF.AsperaApiPackageConfig): Promise<SLF.AsperaApiPackageInfo | null> => {

    const urlBase: string = "https://api.asperafiles.com/api/v1/packages";

    const url: string = (config.method === "byPackageId") ? `${urlBase}/${config.value}` : `${urlBase}?completed_at=${config.value}`;

    const requestConfig: AxiosRequestConfig = {

        headers: {
            Authorization: `Bearer ${token.access_token}`
        },
        method: "GET",
        url
    };

    try {

        const response: AxiosResponse = await Axios(requestConfig);
        
        let aspPackage: any;

        if (Array.isArray(response.data)) {

            if (response.data.length !== 1) {

                return null;
            }

            aspPackage = response.data[0];
        }
        else {

            aspPackage = response.data;
        }

        const packageInfo: SLF.AsperaApiPackageInfo = {

            contentsFileId: aspPackage.contents_file_id,
            failed: aspPackage.failed,
            fileId: aspPackage.file_id,
            id: aspPackage.id,
            name: aspPackage.name,
            note: (aspPackage.note === undefined || aspPackage.note === null || aspPackage.note.length === 0) ? "---" : aspPackage.note,
            senderEmail: (aspPackage.external_sender_email !== undefined) ? aspPackage.external_sender_email : aspPackage.sender.email,
            senderName: (aspPackage.external_sender_name !== undefined) ? aspPackage.external_sender_name : aspPackage.sender.name
        };

        if (packageInfo.contentsFileId === undefined) throw new Error("getAsperaApiPackage() Aspera API did not return { .contents_file_id }");
        if (packageInfo.contentsFileId !== config.contentsFileId) throw new Error("getAsperaApiPackage() contentsFileId did not match package { .contents_file_id }");
        if (packageInfo.failed) throw new Error("getAsperaApiPackage() Aspera package shows that it failed during transfer");
        if (packageInfo.fileId !== config.fileId) throw new Error("getAsperaApiPackage() fileId did not match package { .file_id }");
        if (packageInfo.id === undefined) throw new Error("getAsperaApiPackage() Aspera API did not return packageId { .id }");
        if (packageInfo.name === undefined) throw new Error("getAsperaApiPackage() Aspera API did not return package name { .name }");
        if (packageInfo.senderEmail === undefined) throw new Error("getAsperaApiPackage() Aspera API did not return a sender email");
        if (packageInfo.senderName === undefined) throw new Error("getAsperaApiPackage() Aspera API did not return a sender name");

        return packageInfo;
    }
    catch (error) {

        throw new Error(error);
    }
};


export = getAsperaApiPackage;
