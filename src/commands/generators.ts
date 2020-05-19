'use strict';

import { commands, window } from "vscode";
import * as editor from "../mdal-editor/mdal-editor";
import { CommandType, RETURN_PREFIX } from "./command"

export function cleanMdal(): CommandType {
    return generate('mdal.clean');
}

export function generateMdal(): CommandType {
    return generate('mdal.generate');
}

function generate(command: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        if (editor.isNotMdalEditor() || !editor.documentHasURI())
            return;

        if((await commands.getCommands()).filter(it => it === command).length === 0) {
            window.showErrorMessage(`The mdAL Language Server is not ready yet. Please wait a few seconds and try again.`);
            return;
        }

        console.log(`Sending command "${command}" to mdAL language server.`);
        const returnVal: string = await commands.executeCommand(command, window.activeTextEditor.document.uri.toString(), additionalParameters);
        console.log(`Received return value "${returnVal}" from mdAL language server.`);

        if (returnVal.startsWith(RETURN_PREFIX.ERROR)) {
            window.showErrorMessage(returnVal.replace(RETURN_PREFIX.ERROR, ''));
        } else {
            window.showInformationMessage(returnVal.replace(RETURN_PREFIX.SUCCESS, ''));
        }
    };
}
