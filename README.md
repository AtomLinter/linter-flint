# linter-flint

Lint projects using [`flint`][flint].

# Installation

You need to have [`flint`][flint] installed on your system before using this
package. Once that is setup this package should work right away. If you are
getting messages about `flint` not being available you may need to set the full
path to it in your settings.

As this package is just a wrapper around `flint`, you will need something to
actually run it. By default the [Linter][] package will be installed for you to
fill this need.

# Considerations

By default the linter status bar shows counts for the entire project and the panel shows the messages for the current file.

The `status bar/panel` can be configured what `scope` of messages they are showing.

`linter-flint` actually runs when you open any file, but the messages it reports will be for a fake file that doesn't exist.

That means that they will never actually show in the project scoped panel by default, just in the status bar counts.

You would need to change their panel to `project scope`

```
Settings -> Packages -> linter-ui-default -> Panel Represents -> Entire Project
```

to see all messages for the project at once, `flint` messages will then show up.

[flint]: https://github.com/pengwynn/flint
[Linter]: https://atom.io/packages/linter
