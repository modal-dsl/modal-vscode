'use strict';

import { window, Uri } from "vscode";

export function isNotMdalEditor(): boolean {
    let activeEditor = window.activeTextEditor;
    return !activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'mdal';
}

export function documentHasURI(): boolean {
    return window.activeTextEditor.document.uri instanceof Uri;
}
