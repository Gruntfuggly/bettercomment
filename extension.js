
var vscode = require( 'vscode' ),
    minimatch = require( 'minimatch' );

function activate( context )
{
    function forceLineComment( filename )
    {
        var result = false;
        vscode.workspace.getConfiguration( 'betterComment' ).forcedLineComment.map( function( glob )
        {
            let filePath = vscode.workspace.asRelativePath( filename );
            if( minimatch( filePath, glob, { matchBase: true } ) )
            {
                result = true;
            }
        } );

        return result;
    }

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

        if( forceLineComment( editor.document.fileName ) && s.line !== e.line )
        {
            var lastLine = e.character > 0 ? e.line : e.line - 1;
            var line = s.line;
            while( line <= lastLine )
            {
                var position = new vscode.Position( line, 0 );
                editor.selection = new vscode.Selection( position, position );
                editor.revealRange( editor.selection, vscode.TextEditorRevealType.Default );
                vscode.commands.executeCommand( 'editor.action.commentLine' );
                ++line;
            }
            editor.selection = new vscode.Selection( s, e );
            editor.revealRange( editor.selection, vscode.TextEditorRevealType.Default );

        }
        else if( !hasSelection && withinComment || hasSelection && s.character !== 0 )
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
