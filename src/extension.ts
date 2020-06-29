'use strict';

import * as path from 'path';
import * as os from 'os';

import { workspace, commands, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';
import * as command from "./command";
import { PROXY_COMMAND } from "./command"

let extension: MdalLanguageExtension | undefined;

export function activate(context: ExtensionContext) {
    extension = new MdalLanguageExtension(context);
}

export function deactivate(): Thenable<void> {
    if (!extension) {
        return Promise.resolve();
    }
    const result = extension.deactivateLanguageClient();
    extension = undefined;
    return result;
}

export class MdalLanguageExtension {
    readonly languageClient: LanguageClient;

    constructor(context: ExtensionContext) {
        this.languageClient = this.activateLanguageClient(context);
    }

    protected activateLanguageClient(context: ExtensionContext): LanguageClient {
        const executable = os.platform() === 'win32' ? 'mdal-ls.bat' : 'mdal-ls';
        const serverModule = context.asAbsolutePath(path.join('mdal', 'bin', executable));

        const serverOptions: ServerOptions = {
            run: {
                command: serverModule
            },
            debug: {
                command: serverModule,
                args: ['-log', '-Xdebug', '-Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y', '-Xmx256m']
            }
        };

        const clientOptions: LanguageClientOptions = {
            //documentSelector: ['mdal'],
            documentSelector: [{ scheme: 'file', language: 'mdal' }],
            synchronize: {
                configurationSection: 'mdalLanguageServer',
                fileEvents: workspace.createFileSystemWatcher('**/*.mdal')
            }
        };

        const languageClient = new LanguageClient('mdalLanguageServer', 'mdAL Language Server', serverOptions, clientOptions);
        const disposable = languageClient.start()

        context.subscriptions.push(
            // Command Palette / Menu commands
            commands.registerCommand(PROXY_COMMAND.CLEAN, command.cleanMdal()),
            commands.registerCommand(PROXY_COMMAND.GENERATE, command.generateMdal()),
            // Code Action Commands
            commands.registerCommand(PROXY_COMMAND.LOAD_SYMBOL_REFERENCES, command.loadSymbolReferences()),
            disposable
        );

        return languageClient;
    }

    deactivateLanguageClient(): Thenable<void> {
        if (!this.languageClient) {
            return Promise.resolve(undefined);
        }
        return this.languageClient.stop();
    }

}
