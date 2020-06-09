import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { SLF } from "./types";


const getAsperaApiTransferByFileId: SLF.GetAsperaApiTransferByFileId = async (token: SLF.AsperaApiToken, contentsFileId: string): Promise<SLF.AsperaApiTransferInfo> => {

    const urlBase: string = "https://ats-aws-us-west-2.aspera.io/ops/transfers";

    const url: string = `${urlBase}?tag=aspera.node.file_id%3D${contentsFileId}`;

    const requestConfig: AxiosRequestConfig = {

        headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "X-Aspera-AccessKey": `${process.env.NODE_ACCESS_KEY}`
        },
        method: "GET",
        url
    };

    try {

        const response: AxiosResponse = await Axios(requestConfig);
        
        const transfers: any[] = response.data;

        if (transfers.length !== 1) throw new Error("getAsperaApiTransferByFileId() Aspera API did not return 1 transfer object");

        const transfer: any = transfers[0];
        
        const transferInfo: SLF.AsperaApiTransferInfo = {

            contentsFileId: transfer.start_spec.tags.aspera.node.file_id,
            filePaths: new Set(transfer.files.map((file: any): string => file.path)/*
            */                       .sort((a: string, b: string): number => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)),
            packageId: transfer.start_spec.tags.aspera.files.package_id
        };

        if (transferInfo.contentsFileId === undefined) throw new Error("getAsperaApiTransferByFileId() Aspera API did not return { .start_spec.tags.aspera.node.file_id }");
        if (transferInfo.contentsFileId !== contentsFileId) throw new Error(`getAsperaApiTransferByFileId() Aspera API did not return correct file_id (${transferInfo.contentsFileId} vs ${contentsFileId})`);
        if (transferInfo.filePaths.size === 0) throw new Error("getAsperaApiTransferByFileId() Aspera API did not return any files { .files }");
        if (transferInfo.packageId === undefined) throw new Error("getAsperaApiTransferByFileId() Aspera API did not return { .start_spec.tags.aspera.files.package_id }");

        return transferInfo;
    }
    catch (error) {

        throw new Error(error);
    }
};


export = getAsperaApiTransferByFileId;
