import { SLF } from "./types";

const devDriver: SLF.DevDriver = (handler: SLF.Handler, config: SLF.DevDriverTestConfig): void => {

    if (process.env.NODE_ENV !== "Production") {

        const testEvent: SLF.Event = {

            body: (config.body !== undefined) ? JSON.stringify(config.body) : null,
            headers: (config.headers !== undefined) ? config.headers : {},
            httpMethod: "",
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: null,
            path: "",
            pathParameters: null,
            queryStringParameters: (config.queryStringParameters !== undefined) ? config.queryStringParameters : null,
            requestContext: {} as any,
            resource: "",
            stageVariables: null
        };

        handler(testEvent, {} as any)
    
            .then((res: SLF.Result): void => {
    
                console.log(res);
            });
    }
};

export = devDriver;
