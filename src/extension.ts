import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const sortText = (reverse: boolean) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('没有选中的文本');
            return;
        }
        const { start, end } = editor.selection;
        let newText = '';
        let range: vscode.Range;
        if (start.line === end.line) {
            range = editor.selection;
        } else {
            const fullLineStart = new vscode.Position(start.line, 0);
            const fullLineEnd = new vscode.Position(end.line, 9999);
            range = new vscode.Range(fullLineStart, fullLineEnd);
        }
        const text = editor.document.getText(range);
        if (start.line === end.line) {
            const list = text
                .split(',')
                .map((v) => v.trim())
                .sort();
            if (reverse) {
                list.reverse();
            }
            newText = list.join(', ');
        } else {
            const lineList = text.split('\n');
            const indent = lineList[0].search(/\S/);
            const list = lineList.map((v) => v.trim()).sort();
            if (reverse) {
                list.reverse();
            }
            newText = list.map((v) => `${' '.repeat(indent)}${v}`).join('\n');
        }
        editor.edit((editBuilder) => {
            editBuilder.replace(range, newText);
        });
    };
    let cmd1 = vscode.commands.registerCommand('line-or-word-sort.asc', () => {
        sortText(false);
    });
    let cmd2 = vscode.commands.registerCommand('line-or-word-sort.desc', () => {
        sortText(true);
    });

    context.subscriptions.push(cmd1);
    context.subscriptions.push(cmd2);
}

export function deactivate() {}
