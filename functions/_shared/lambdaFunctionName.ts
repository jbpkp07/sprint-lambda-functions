const lambdaFunctionName: string = (process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined) ?
    process.env.AWS_LAMBDA_FUNCTION_NAME :
    require("path").basename(require("path").join(__dirname, ".."));

export = lambdaFunctionName;
