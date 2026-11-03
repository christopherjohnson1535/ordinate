# @ordinate/docs

The Ordinate documentation, served from your own machine: every guide, every component with runnable examples and its full API, the design language and the patterns. It needs no network, so it works on a plane, behind a firewall, or years after the version you use has left the website.

Install it at the same version as the library, so the docs describe the components you have:

```sh
npm install --save-dev @ordinate/docs
npx ordinate-docs --open
```

Or run it once without installing:

```sh
npx @ordinate/docs --open
```

## Opening a page

Name a component or a guide to open its page directly:

```sh
npx ordinate-docs Table --open
npx ordinate-docs side-navigation --open
npx ordinate-docs revisions --open
```

## Options

| Option          | What it does                                                                      |
| --------------- | --------------------------------------------------------------------------------- |
| `--open`, `-o`  | Open the documentation in the default browser.                                    |
| `--port <n>`    | Port to listen on. Defaults to 4180; the next free port is used if taken.         |
| `--host <name>` | Address to listen on. Defaults to `127.0.0.1`, so only this machine can reach it. |
| `--path`        | Print the folder the built documentation is in, and exit.                         |
| `--site <dir>`  | Serve another build of the site.                                                  |
| `--version`     | Print the version of the documentation.                                           |

When the project in the current folder uses a different version of `@ordinate/components`, the command says so and names the matching docs package.

## In a checkout of Ordinate

```sh
npm run docs          # build the library and the site, then serve and open it
npm run docs:dev      # the site with hot reload, for writing pages
npm run docs:package  # write the publishable package to lib/docs
```

See [docs/DOCS_SITE.md](../docs/DOCS_SITE.md) for how the site is put together and how to add a page.

## License

Apache License 2.0.
