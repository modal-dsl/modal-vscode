'use strict';

/**
 * Adopted from:
 * - https://github.com/theia-ide/yang-vscode
 *  - https://github.com/eclipse/sprotty-vscode
 */

import * as path from 'path';
import * as os from 'os';

import { workspace, commands, Uri, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, Position as LSPosition, Location as LSLocation } from 'vscode-languageclient';
import * as generators from "./commands/generators";

let extension: MdalLanguageExtension | undefined;

export function activate(context: ExtensionContext) {
    extension = new MdalLanguageExtension(context);

    context.subscriptions.push(
        commands.registerCommand("mdal.clean.proxy", generators.cleanMdal()),
        commands.registerCommand("mdal.generate.proxy", generators.generateMdal()),
    );
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
            run : { 
                command: serverModule
            },
            debug: { 
                command: serverModule,
                args: ['-log', '-Xdebug', '-Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y', '-Xmx256m']
            }
        };
        
        const clientOptions: LanguageClientOptions = {
            documentSelector: ['mdal'],
            synchronize: {
                configurationSection: 'mdalLanguageServer',
                fileEvents: workspace.createFileSystemWatcher('**/*.mdal')
            }
        };
        
        const languageClient = new LanguageClient('mdalLanguageServer', 'mdAL Language Server', serverOptions, clientOptions);
        const disposable = languageClient.start()
    
        commands.registerCommand('mdal.show.references', (uri: string, position: LSPosition, locations: LSLocation[]) => {
            commands.executeCommand('editor.action.showReferences',
                        Uri.parse(uri),
                        languageClient.protocol2CodeConverter.asPosition(position),
                        locations.map(languageClient.protocol2CodeConverter.asLocation));
        })
    
        commands.registerCommand('mdal.apply.workspaceEdit', (obj: any) => {
            const edit = languageClient.protocol2CodeConverter.asWorkspaceEdit(obj);
            if (edit) {
                workspace.applyEdit(edit);
            }
        });

        context.subscriptions.push(disposable);

        return languageClient;
    }

    deactivateLanguageClient(): Thenable<void> {
        if (!this.languageClient) {
            return Promise.resolve(undefined);
        }
        return this.languageClient.stop();
    }

}