import * as vscode from 'vscode';
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

export default async (options: any): Promise<string> => {
  let isShowDialog = options && options.showDialog ? true : false;

	let editor = vscode.window.activeTextEditor;
  if (!editor) {
    throw new Error('activeTextEditorが不明です。');
  }
  // 選択範囲テキスト取得
  let text = editor.document.getText(editor.selection);
  if (!text) {
    throw new Error('コミットテキストを選択してください。');
  }
  let input: string | undefined = text;

  if (isShowDialog) {
    input = await vscode.window.showInputBox({
      prompt: 'コミットメッセージを入力してください＊＊', 
      value: text
    });
    if (!input) {
      return Promise.resolve(''); // cancel
    }
  }

  vscode.workspace.saveAll();

  if (!vscode.workspace.rootPath) {
    throw new Error('ワークスペースルートパスが不明です。');
  }

  let cmd = `git add . && git commit -m"${input}"`;
  return exec(cmd, {cwd: vscode.workspace.rootPath}).then( () => cmd);
};