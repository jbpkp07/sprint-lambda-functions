import * as getAsperaApiBearerToken from "./getAsperaApiBearerToken";
import * as getAsperaApiPackage from "./getAsperaApiPackage";
import { SLF } from "./types";


// tslint:disable-next-line: max-line-length
const getAsperaApiPackageAndToken: SLF.GetAsperaApiPackageAndToken = async (contentsFileId: string, timestamp: string, inboxName?: string): Promise<SLF.AsperaApiPackageAndToken> => {

    const aspPackageConfig: SLF.AsperaApiPackageConfig = {

        contentsFileId,
        inboxName,
        method: "byTimestamp",
        methodValue: timestamp
    };

    const aocBearerToken: SLF.AsperaApiToken = await getAsperaApiBearerToken({ domain: "api.ibmaspera.com", useNodeAccessKey: false });

    const packageInfo: SLF.AsperaApiPackageInfo | null = await getAsperaApiPackage(aocBearerToken, aspPackageConfig);

    return { aocBearerToken, packageInfo };
};


export = getAsperaApiPackageAndToken;
