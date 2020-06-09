import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import * as convertToURIComponent from "./convertToURIComponent";
import { SLF } from "./types";


const getAsperaApiBearerToken: SLF.GetAsperaApiBearerToken = async (config: SLF.AsperaApiTokenRequestConfig): Promise<SLF.AsperaApiToken> => {

    const data: SLF.AsperaApiTokenRequestData = {

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

        const response: AxiosResponse<SLF.AsperaApiToken> = await Axios(requestConfig);

        const asperaTokenSchema: SLF.AsperaApiToken = {

            access_token: "",
            expires_in: 0,
            scope: "",
            token_type: ""
        };

        for (const key of Object.keys(asperaTokenSchema)) {

            if ((response.data as any)[key] === undefined) throw new Error(`Aspera API Bearer Token from ${config.domain} is missing key { ${key} }`);
        }
    
        return response.data;
    }
    catch (error) {

        throw new Error(`Unable to get Bearer Token from ${config.domain}  ${error}`);
    }
};


export = getAsperaApiBearerToken;
