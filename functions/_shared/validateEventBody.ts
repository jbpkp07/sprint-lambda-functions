import { SLF } from "./types";


const validateEventBody: SLF.ValidateEventBody<any> = (event: SLF.Event, type: SLF.EventBodyType): any => {

    if ((event as any).body === undefined) throw new Error("Event body is undefined");
    if (event.body === null) throw new Error("Event body is null");

    let eventBody: any;

    try {

        eventBody = JSON.parse(event.body);
    }
    catch (error) {

        throw new Error("Unable to parse event body");
    }

    let keys: string[] = [];

    switch (type) {

        case "newAsperaPackageArrival":

            const bodySchema: SLF.AsperaEventBody = {

                dropboxId: "",
                fileId: "",
                inboxName: "",
                metadata: "",
                nodeId: "",
                timestamp: ""
            };

            keys = Object.keys(bodySchema);

            break;

        default:

            throw new TypeError("validateEventBody() switch case not implemented for argument (type: SLF.EventBodyType)");
    }

    for (const key of keys) {

        if (eventBody[key] === undefined) throw new Error(`Event body is missing key { ${key} }`);
    }

    return eventBody;
};


export = validateEventBody;
