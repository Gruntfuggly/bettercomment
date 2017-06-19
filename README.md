# Better Comment

Simply chooses to toggle a line comment or a block comment depending on where the start of the selection is. If the selection does not begin at the start of a line then a block comment is toggled, otherwise a line comment is toggled.

By default, it overrides the standard line comment toggle key definition, `Ctrl+/` or `Cmd+/`.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.bettercomment).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install bettercomment

### Source Code

This extension is so simple, I'll just include the source code here:

```
var vscode = require( 'vscode' );

function activate( context ) {
    var disposable = vscode.commands.registerCommand( 'bettercomment.toggle', function() {
        var textEditor = vscode.window.activeTextEditor;
        var selection = textEditor.selection;

        var s = selection.start;
        if( s.character === 0 ) {
            vscode.commands.executeCommand( 'editor.action.commentLine' );
        }
        else {
            vscode.commands.executeCommand( 'editor.action.blockComment' );
        }
    } );

    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
```

## Configuration

None