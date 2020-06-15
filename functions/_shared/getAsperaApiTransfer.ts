import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { SLF } from "./types";


const getAsperaApiTransfer: SLF.GetAsperaApiTransfer = async (token: SLF.AsperaApiToken, config: SLF.AsperaApiTransferConfig): Promise<SLF.AsperaApiTransferInfo> => {

    const urlBase: string = "https://ats-aws-us-west-2.aspera.io/ops/transfers";

    let url: string;

    switch (config.method) {

        case "byTransferId":

            url = `${urlBase}/${config.methodValue}`;
            break;

        case "byContentsFileId":

            url = `${urlBase}?tag=aspera.node.file_id%3D${config.methodValue}`;
            break;

        default:

            throw new TypeError("getAsperaApiTransfer() config method not implemented");
    }

    if (process.env.NODE_ACCESS_KEY === undefined) throw new Error("getAsperaApiTransfer() environment variable not set for NODE_ACCESS_KEY");

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

        let transfer: any;

        if (Array.isArray(response.data)) {

            if (response.data.length !== 1) {

                throw new Error("getAsperaApiTransfer() Aspera API did not return 1 transfer object");
            }

            transfer = response.data[0];
        }
        else {

            transfer = response.data;
        }

        const transferInfo: SLF.AsperaApiTransferInfo = {

            contentsFileId: transfer.start_spec.tags.aspera.node.file_id,
            filePaths: new Set(transfer.files.map((file: any): string => file.path)/*
            */                       .sort((a: string, b: string): number => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)),
            packageId: transfer.start_spec.tags.aspera.files.package_id
        };

        if (transferInfo.contentsFileId === undefined) throw new Error("getAsperaApiTransfer() Aspera API did not return { .start_spec.tags.aspera.node.file_id }");
        if (transferInfo.contentsFileId !== config.methodValue && config.method === "byContentsFileId") {

            throw new Error(`getAsperaApiTransfer() Aspera API did not return correct file_id (${transferInfo.contentsFileId} vs ${config.methodValue})`);
        }
        if (config.contentsFileId !== undefined && transferInfo.contentsFileId !== config.contentsFileId) {

            throw new Error(`getAsperaApiTransfer() Aspera API did not return correct file_id (${transferInfo.contentsFileId} vs ${config.contentsFileId})`);
        }
        if (transferInfo.filePaths.size === 0) throw new Error("getAsperaApiTransfer() Aspera API did not return any files { .files }");
        if (transferInfo.packageId === undefined) throw new Error("getAsperaApiTransfer() Aspera API did not return { .start_spec.tags.aspera.files.package_id }");

        return transferInfo;
    }
    catch (error) {

        throw new Error(error);
    }
};


export = getAsperaApiTransfer;
