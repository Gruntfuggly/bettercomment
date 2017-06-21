# Better Comment

Simply chooses to toggle a line comment or a block comment depending on where the start of the selection is. If the selection does not begin at the start of a line then a block comment is toggled, otherwise a line comment is toggled. If there is no current selection, it will try to detect a block comment under the cursor and toggle it, otherwise it will toggle a line comment.

By default, it overrides the standard line comment toggle key definition, `Ctrl+/` or `Cmd+/`.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.bettercomment).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install bettercomment

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/bettercomment).

## Configuration

None