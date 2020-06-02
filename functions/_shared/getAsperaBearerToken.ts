import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import * as convertToURIComponent from "./convertToURIComponent";
import { SLF } from "./types";


const getAsperaBearerToken: SLF.GetAsperaBearerToken = async (config: SLF.AsperaTokenRequestConfig): Promise<SLF.AsperaToken> => {

    const data: SLF.AsperaTokenRequestData = {

        assertion: `${process.env.ENCODED_HEADER}.${process.env.ENCODED_PAYLOAD}.${process.env.ENCODED_SIGNATURE}`,
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        scope: (config.useNodeAccessKey) ? `node.${process.env.NODE_ACCESS_KEY}:admin:all` : "admin:all"
    };

    const requestConfig: AxiosRequestConfig = {

        data: convertToURIComponent(data),
        headers: {
            "Authorization": process.env.AUTHORIZATION,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: `https://${config.domain}/api/v1/oauth2/api_aspera/token`
    };

    try {

        const s3BearerResponse: AxiosResponse<SLF.AsperaToken> = await Axios(requestConfig);

        return s3BearerResponse.data;
    }
    catch (error) {

        throw new Error(`Unable to get Bearer Token from ${config.domain}  ${error}`);
    }
};


export = getAsperaBearerToken;
