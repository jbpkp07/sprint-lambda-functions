import { SLF } from "./types";

const lambdaFunctionResponse: SLF.LambdaFunctionResponse = (lambdaFuncName: string, statusCode?: number, error?: any): SLF.Result => {

    const response: SLF.Result = {

        body: JSON.stringify({
            lambdaFuncName,
            message: (error !== undefined) ? `${error}` : "Success"
        }),
        headers: {
            "Content-Type": "application/json"
        },
        isBase64Encoded: false,
        statusCode: (statusCode !== undefined) ? statusCode : 200
    };

    return response;
};

export = lambdaFunctionResponse;
