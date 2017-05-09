var vscode = require( 'vscode' );

function activate( context )
{
    var disposable = vscode.commands.registerCommand( 'bettercomment.toggle', function()
    {
        var textEditor = vscode.window.activeTextEditor;
        var selection = textEditor.selection;

        var s = selection.start;
        var e = selection.end;
        if( ( s.line === e.line && s.character === e.character ) || s.character === 0 )
        {
            vscode.commands.executeCommand( 'editor.action.commentLine' );
        }
        else
        {
            vscode.commands.executeCommand( 'editor.action.blockComment' );
        }
    } );

    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;