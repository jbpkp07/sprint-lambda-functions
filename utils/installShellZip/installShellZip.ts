import * as fs from "fs";
import * as path from "path";
import { exec as sudoExec } from "sudo-prompt";
import { terminal } from "terminal-kit";

import { getJSONArgsString, ICopyFile } from "./copyFileSync";


const srcZipExePath: string = path.join(__dirname, "bin", "zip.exe");
const srcZipDllPath: string = path.join(__dirname, "bin", "bzip2.dll");

const gitBashBinPath32: string = "/Program Files (x86)/Git/usr/bin";
const destZipExePath32: string = path.join(gitBashBinPath32, "zip.exe");
const destZipDllPath32: string = path.join(gitBashBinPath32, "bzip2.dll");

const gitBashBinPath64: string = "/Program Files/Git/usr/bin";
const destZipExePath64: string = path.join(gitBashBinPath64, "zip.exe");
const destZipDllPath64: string = path.join(gitBashBinPath64, "bzip2.dll");

const copyFileSyncJsPath: string = "./copyFileSync.js";


function sudoPromptHandler(error?: Error, stdout?: string | Buffer, stderr?: string | Buffer): void {

    if (error !== undefined) throw error;

    if (stderr !== undefined && stderr.length > 0) terminal.brightRed(`${stderr.toString()}\n`);

    else if (stdout !== undefined && stdout.length > 0) terminal.brightGreen(`${stdout.toString()}\n`);

    terminal.brightGreen("    Done!\n\n");
}

function installShellZip(): void {

    terminal.bgBlack();

    terminal.brightCyan("    Installing shell zip for Windows Git bash...\n\n");

    const copyFiles: ICopyFile[] = [];

    try {

        if (!fs.existsSync(srcZipExePath)) throw new Error(`    Missing file:  ${srcZipExePath}`);

        if (!fs.existsSync(srcZipDllPath)) throw new Error(`    Missing file:  ${srcZipDllPath}`);

        // 32 bit install --------------------
        if (fs.existsSync(gitBashBinPath32)) {

            if (!fs.existsSync(destZipExePath32)) {

                terminal.cyan("    Copying [zip.exe] ...\n");
                terminal.white("    src:  ").gray(`${srcZipExePath}\n`);
                terminal.white("    dest: ").gray(`${destZipExePath32}\n\n`);

                copyFiles.push({ src: srcZipExePath, dest: destZipExePath32 });
            }

            if (!fs.existsSync(destZipDllPath32)) {

                terminal.cyan("    Copying [bzip2.dll] ...\n");
                terminal.white("    src:  ").gray(`${srcZipDllPath}\n`);
                terminal.white("    dest: ").gray(`${destZipDllPath32}\n\n`);

                copyFiles.push({ src: srcZipDllPath, dest: destZipDllPath32 });
            }
        }

        // 64 bit install --------------------
        if (fs.existsSync(gitBashBinPath64)) {

            if (!fs.existsSync(destZipExePath64)) {

                terminal.cyan("    Copying [zip.exe] ...\n");
                terminal.white("    src:  ").gray(`${srcZipExePath}\n`);
                terminal.white("    dest: ").gray(`${destZipExePath64}\n\n`);

                copyFiles.push({ src: srcZipExePath, dest: destZipExePath64 });
            }

            if (!fs.existsSync(destZipDllPath64)) {

                terminal.cyan("    Copying [bzip2.dll] ...\n");
                terminal.white("    src:  ").gray(`${srcZipDllPath}\n`);
                terminal.white("    dest: ").gray(`${destZipDllPath64}\n\n`);

                copyFiles.push({ src: srcZipDllPath, dest: destZipDllPath64 });
            }
        }

        if (copyFiles.length > 0) {

            const cmd: string = `node ${copyFileSyncJsPath} ${getJSONArgsString(copyFiles)}`;

            sudoExec(cmd, { name: "Install Shell Zip" }, sudoPromptHandler);
        }
        else {

            terminal.brightGreen("    No changes needed, already installed!\n\n");
        }
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

installShellZip();
