'use strict';

import { commands, window, ProgressLocation } from "vscode";
import * as editor from "../mdal-editor/mdal-editor";
import { CommandType, RETURN_PREFIX, COMMAND } from "./command"

export function cleanMdal(): CommandType {
    return generate(COMMAND.CLEAN);
}

export function generateMdal(): CommandType {
    return generate(COMMAND.GENERATE);
}

function getProgressMessage(command: string) {
    switch(command) {
        case COMMAND.CLEAN:
            return 'Cleaning the src-gen folder...';
        case '':
            return COMMAND.GENERATE;
        default:
            return 'Generating AL source code...';
    }
}

function generate(command: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        if (editor.isNotMdalEditor() || !editor.documentHasURI()) {
            window.showWarningMessage(`This command can only be used with mdAL files.`);
            return;
        }

        if((await commands.getCommands()).filter(it => it === command).length === 0) {
            window.showWarningMessage(`The mdAL Language Server is not ready yet. Please wait a few seconds and try again.`);
            return;
        }

        await window.withProgress({
            location: ProgressLocation.Notification,
			title: getProgressMessage(command),
            cancellable: false
        },
        async (progress) => {
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
