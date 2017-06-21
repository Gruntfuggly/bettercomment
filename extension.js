
var vscode = require( 'vscode' );

function activate( context )
{
    var disposable = vscode.commands.registerCommand( 'bettercomment.toggle', function()
    {
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;
        var withinComment = false;
        var line = editor.document.lineAt( s.line ).text;
        var blockCommentPattern = /\/\*.+?\*\//g;

        while( match = blockCommentPattern.exec( line ) )
        {
            if( s.character >= match.index && s.character <= blockCommentPattern.lastIndex )
            {
                withinComment = true;
            }
        }

        if( !hasSelection && withinComment || hasSelection && s.character !== 0 )
        {
            vscode.commands.executeCommand( 'editor.action.blockComment' );
        }
        else
        {
            vscode.commands.executeCommand( 'editor.action.commentLine' );
        }
    } );
    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
