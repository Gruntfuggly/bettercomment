
var vscode = require( 'vscode' );
var minimatch = require( 'minimatch' );
var commentPatterns = require( 'comment-patterns' );

function activate( context )
{
    function forceLineComment( filename )
    {
        var result = false;
        vscode.workspace.getConfiguration( 'betterComment' ).forcedLineComment.map( function( glob )
        {
            var filePath = vscode.workspace.asRelativePath( filename );
            if( minimatch( filePath, glob, { matchBase: true } ) )
            {
                result = true;
            }
        } );

        return result;
    }

    function isCommented( document, offset, singleLineComment )
    {
        if( offset <= 0 )
        {
            return false;
        }

        var line = document.lineAt( document.positionAt( offset ) );
        var lineOffset = document.offsetAt( line.range.start );
        var commentIndex = line.text.indexOf( singleLineComment );
        if( commentIndex === -1 )
        {
            return false;
        }
        return commentIndex < offset - lineOffset;
    }

    var disposable = vscode.commands.registerCommand( 'bettercomment.toggle', function()
    {
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var singleLineComment = "//";
        var blockStart = "/*";
        var blockEnd = "*/";

        var commentPattern;
        try
        {
            commentPattern = commentPatterns( editor.document.uri.fsPath );

            if( commentPattern && commentPattern.name === 'Markdown' )
            {
                commentPattern = commentPatterns( ".html" );
            }

            if( commentPattern && commentPattern.singleLineComment && commentPattern.singleLineComment.length > 0 )
            {
                singleLineComment = commentPattern.singleLineComment[ 0 ].start;
            }
            if( commentPattern && commentPattern.multiLineComment && commentPattern.multiLineComment.length > 0 )
            {
                if( commentPattern.multiLineComment[ 0 ].start.source )
                {
                    blockStart = commentPattern.multiLineComment[ 0 ].start.source;
                    if( blockStart === "\\/\\*\\*" )
                    {
                        blockStart = "/*";
                    }
                }
                else
                {
                    blockStart = commentPattern.multiLineComment[ 0 ].start;
                }
                blockEnd = commentPattern.multiLineComment[ 0 ].end;
            }
        }
        catch( e )
        {
        }
        var s = selection.start;
        var e = selection.end;
        var r = selection.isReversed;

        var hasSelection = s.line !== e.line || s.character !== e.character;
        var withinComment = false;

        var beforeText = editor.document.getText().substr( 0, editor.document.offsetAt( selection.start ) );
        var afterText = editor.document.getText().substr( editor.document.offsetAt( selection.start ) );
        var lastOpeningComment = beforeText.lastIndexOf( blockStart );

        while( isCommented( editor.document, lastOpeningComment, singleLineComment ) )
        {
            beforeText = beforeText.substr( 0, lastOpeningComment );
            lastOpeningComment = beforeText.lastIndexOf( blockStart );
        }

        var lastClosingComment = beforeText.lastIndexOf( blockEnd );
        var nextClosingComment = afterText.indexOf( blockEnd );

        if( lastOpeningComment !== -1 && nextClosingComment !== -1 && lastOpeningComment > lastClosingComment )
        {
            withinComment = true;
            var selectionStart = editor.document.positionAt( lastOpeningComment );
            var selectionEnd = editor.document.positionAt( beforeText.length + nextClosingComment );
            editor.selection = new vscode.Selection( selectionStart, selectionEnd );
        }

        function commentLine()
        {
            var position = new vscode.Position( lineToComment, 0 );
            editor.selection = new vscode.Selection( position, position );

            vscode.commands.executeCommand( 'editor.action.commentLine' ).then( function( result )
            {
                lineToComment++;
                if( lineToComment <= lastLine )
                {
                    commentLine();
                }
                else
                {
                    editor.selection = new vscode.Selection( r ? e : s, r ? s : e );
                }
            } );
        }

        if( forceLineComment( editor.document.fileName ) && s.line !== e.line )
        {
            var lastLine = e.character > 0 ? e.line : e.line - 1;
            var lineToComment = s.line;
            commentLine();
        }
        else if( !hasSelection && withinComment || hasSelection && s.character !== 0 )
        {
            vscode.commands.executeCommand( 'editor.action.blockComment' );
        }
        else
        {
            vscode.commands.executeCommand( 'editor.action.commentLine' ).then( function()
            {
                if( s.character === 0 && editor.selection.start.character !== 0 )
                {
                    editor.selection = new vscode.Selection( new vscode.Position( editor.selection.start.line, 0 ), editor.selection.end );
                }
            } );
        }
    } );
    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
