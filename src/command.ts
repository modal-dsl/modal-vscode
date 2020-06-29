'use strict';

import { commands, window, Uri, ProgressLocation } from "vscode";

type CommandType = (...args: any[]) => any;

const PROXY_SUFFIX = '.proxy'

export const RETURN_PREFIX = {
    SUCCESS: "mdal.command.success",
    ERROR: "mdal.command.error"
};

export const COMMAND = {
    CLEAN: "mdal.clean",
    GENERATE: "mdal.generate",
    LOAD_SYMBOL_REFERENCES: "mdal.loadSymbolReferences"
};

export const PROXY_COMMAND = {
    CLEAN: COMMAND.CLEAN + PROXY_SUFFIX,
    GENERATE: COMMAND.GENERATE + PROXY_SUFFIX,
    LOAD_SYMBOL_REFERENCES: COMMAND.LOAD_SYMBOL_REFERENCES + PROXY_SUFFIX
};

export function cleanMdal(): CommandType {
    return generate(COMMAND.CLEAN);
}

export function generateMdal(): CommandType {
    return generate(COMMAND.GENERATE);
}

export function loadSymbolReferences(): CommandType {
    return generate(COMMAND.LOAD_SYMBOL_REFERENCES);
}

function getProgressMessage(command: string) {
    switch (command) {
        case COMMAND.CLEAN:
            return 'Cleaning the src-gen folder...';
        case COMMAND.GENERATE:
            return 'Generating AL source code...';
        case COMMAND.LOAD_SYMBOL_REFERENCES:
            return 'Loading symbol references...';
        default:
            return '';
    }
}

function generate(command: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        console.log("Starting command");
        if (isNotMdalEditor() || !documentHasURI()) {
            window.showWarningMessage(`This command can only be used with mdAL files.`);
            return;
        }

        if ((await commands.getCommands()).filter(it => it === command).length === 0) {
            window.showWarningMessage(`The mdAL Language Server is not ready yet. Please wait a few seconds and try again.`);
            return;
        }

        await window.withProgress({
            location: ProgressLocation.Notification,
            title: getProgressMessage(command),
            cancellable: false
        },
        async () => {
            console.log(`Sending command "${command}" to mdAL language server.`);
            const returnVal: string = await commands.executeCommand(command, window.activeTextEditor.document.uri.toString(), additionalParameters);
            console.log(`Received return value "${returnVal}" from mdAL language server.`);

            if (returnVal.startsWith(RETURN_PREFIX.ERROR)) {
                window.showErrorMessage(returnVal.replace(RETURN_PREFIX.ERROR, ''));
            } else {
                window.showInformationMessage(returnVal.replace(RETURN_PREFIX.SUCCESS, ''));
            }
        });
    };
}

function isNotMdalEditor(): boolean {
    let activeEditor = window.activeTextEditor;
    return !activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'mdal';
}

function documentHasURI(): boolean {
    return window.activeTextEditor.document.uri instanceof Uri;
}
