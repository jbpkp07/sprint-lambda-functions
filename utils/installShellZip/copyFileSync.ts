import * as fs from "fs";


export interface ICopyFile {

    src: string;
    dest: string;
}

export function getJSONArgsString(copyFiles: ICopyFile[]): string {

    let argsString: string = "";

    for (const arg of copyFiles) {

        argsString += ` "${JSON.stringify(arg).replace(/\"/g, "\\\"")}"`;
    }

    return argsString;
}


const args: string[] = process.argv.slice(2);

try {
    
    for (const arg of args) {

        const copyFile: ICopyFile = JSON.parse(arg);
    
        if (!fs.existsSync(copyFile.src)) {

            throw new Error(`    Src file missing:  ${copyFile.src}`);
        }

        if (fs.existsSync(copyFile.dest)) {

            throw new Error(`    Dest file already exists:  ${copyFile.dest}`);
        }

        fs.copyFileSync(copyFile.src, copyFile.dest);
    }
} 
catch (error) {
    
    if (error.message !== undefined) {

        console.error(error.message);
    }
    else {

        console.error(error);
    }
}
