import * as lambdaFunctionName from "./lambdaFunctionName";
import { SLF } from "./types";


const lambdaFunctionResponse: SLF.LambdaFunctionResponse = (statusCode: number, error?: any): SLF.Result => {

    const response: SLF.Result = {

        body: JSON.stringify({
            lambdaFunctionName,
            message: (error !== undefined) ? `${error}` : "Success"
        }),
        headers: {
            "Content-Type": "application/json"
        },
        isBase64Encoded: false,
        statusCode
    };

    return response;
};


export = lambdaFunctionResponse;
