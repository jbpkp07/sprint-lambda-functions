import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { terminal } from "terminal-kit";
import { zip } from "zip-a-folder";


const layersDirName: string = "layers";

const currentDirName: string = path.basename(__dirname);
const currentDirPath: string = __dirname;
const currentFileName: string = path.basename(__filename);

const zipFilesDirName: string = "_zipped";
const zipFilesDirPath: string = path.join(__dirname, zipFilesDirName);


async function zipLayers(): Promise<void> {

    terminal.bgBlack();

    terminal.brightCyan("    Zipping Lambda layers for deployment...\n\n");

    try {

        // check that this file is located inside of the correct directory where it should be
        if (currentDirName !== layersDirName) {

            throw new Error(`    ERROR:   [${currentFileName}] should be inside the [${layersDirName}] directory to operate correctly\n`);
        }

        // remove existing zip files directory if it exists (synchronously)
        fs.rmdirSync(zipFilesDirPath, { recursive: true });

        // make sure the zip files directory was deleted (synchronously)
        if (fs.existsSync(zipFilesDirPath)) {

            throw new Error(`    ERROR:   Not able to delete directory: [${zipFilesDirName}]\n`);
        }

        // get child Dirent objects inside "layers" directory (synchronously), and filter directories to make sure that the zip files directory is not included
        const directoryDirents: fs.Dirent[] = fs.readdirSync(currentDirPath, { withFileTypes: true })/*
        */                                      .filter((dirent: fs.Dirent): boolean => dirent.isDirectory() && dirent.name !== zipFilesDirName);

        // make a fresh zip files directory (synchronously)
        fs.mkdirSync(zipFilesDirPath);

        // make sure the zip files directory was created (synchronously)
        if (!fs.existsSync(zipFilesDirPath)) {

            throw new Error(`    ERROR:   Not able to create directory: [${zipFilesDirName}]\n`);
        }

        // zip layers directories
        for (const dirent of directoryDirents) {

            const directoryFullPath: string = path.join(currentDirPath, dirent.name);
            const newZipFileFullPath: string = path.join(zipFilesDirPath, `${dirent.name}.zip`);

            installNpmPackages(directoryFullPath);

            terminal.white("    Zipping:  ").gray(`${directoryFullPath}\n`);

            await zip(directoryFullPath, newZipFileFullPath);  // Now create a zip of the layer

            terminal.white("    Zipped:   ").brightGreen(`${path.basename(newZipFileFullPath)}\n\n`);
        }

        terminal.brightGreen("    Done!\n\n").white("    Zipped Directory:  ").gray(`${zipFilesDirPath}\n\n`);
    }
    catch (error) {

        if (error.message !== undefined) {

            terminal.brightRed(`${error.message}\n`);
        }
        else {

            terminal.brightRed(`${error}\n`);
        }
    }
}


function installNpmPackages(layerDirectoryPath: string): void {

    const packageJsonDirectory: string = path.join(layerDirectoryPath, "nodejs");
    const packageJsonFilePath: string = path.join(packageJsonDirectory, "package.json");

    if (fs.existsSync(packageJsonFilePath)) {

        terminal.cyan(`    Installing npm package(s) for [${path.basename(layerDirectoryPath)}] layer...\n`);

        // Install NPM packages (synchronously)
        const stdout: string = execSync(`cd ${packageJsonDirectory} && npm install`, { encoding: "utf8", stdio: "pipe" });

        terminal.brightGreen(`    ${stdout.replace(/\n/g, "\n    ").trimRight()}\n\n`);
    }
}


zipLayers();
