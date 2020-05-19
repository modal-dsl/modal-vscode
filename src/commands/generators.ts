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
        if (editor.isNotMdalEditor())
            return;

        if (editor.documentHasURI()) {
            console.log(`Sending command ${command} to mdAL language server.`);

            const returnVal: string = await commands.executeCommand(command, window.activeTextEditor.document.uri.toString(), additionalParameters);
            if (returnVal.startsWith(RETURN_PREFIX.ERROR)) {
                window.showErrorMessage(returnVal.replace(RETURN_PREFIX.ERROR, ''));
            } else {
                window.showInformationMessage(returnVal.replace(RETURN_PREFIX.SUCCESS, ''));
            }
        }
    };
}
