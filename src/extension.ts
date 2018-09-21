'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const config = vscode.workspace.getConfiguration("wayExt");
    const { scrollLineCount, scrollSpeed } = config;

    let curScrollOperation = null;
    let curDirection = '';
    const scrollUp = vscode.commands.registerCommand('wayExt.waySmoothScrollDown', () => {
        // The code you place here will be executed every time your command is executed
        const stopCurScrolling = shouldStopCurScrolling(curDirection, 'down', curScrollOperation);
        if (stopCurScrolling) {
            clearInterval(curScrollOperation);
        } else {
            curDirection = 'down';
            myScroll({ scrollLineCount, scrollSpeed, to: 'down' });
        }
    });

    const scrollDown = vscode.commands.registerCommand('wayExt.waySmoothScrollUp', () => {
        const stopCurScrolling = shouldStopCurScrolling(curDirection, 'up', curScrollOperation);
        if (stopCurScrolling) {
            clearInterval(curScrollOperation);
        } else {
            curDirection = 'up';
            myScroll({ scrollLineCount, scrollSpeed, to: 'up' });
        }
    });

    context.subscriptions.push(scrollDown, scrollUp);

    function shouldStopCurScrolling(curDirection, newDirection, curScrollOperation) {
        const lastOperNotDone = curScrollOperation && curScrollOperation._idleTimeout > -1;
        const goingOppoDirection = curDirection && curDirection !== newDirection;
        return lastOperNotDone && goingOppoDirection;
    }

    function myScroll({ scrollLineCount, scrollSpeed = 3, to, by = "line" }) {
        clearInterval(curScrollOperation);
        curScrollOperation = setInterval(() => {
            vscode.commands.executeCommand('editorScroll', { to, by });
            vscode.commands.executeCommand('cursorMove', { to, by });
            --scrollLineCount
            if (scrollLineCount <= 0) {
                clearInterval(curScrollOperation);
            }
        }, scrollSpeed);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
