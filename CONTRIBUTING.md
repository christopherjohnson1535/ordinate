# Contributing

Thanks for your interest in Ordinate. The project is in early development, so expect APIs to change.

## Reporting issues

Use [GitHub issues](https://github.com/christopherjohnson1535/ordinate/issues) for bugs and feature requests. Search existing issues first. For a bug, include the component, the revision and mode you were using, and the steps to reproduce it.

## Setup

You need Node.js 22 or later.

```sh
git clone https://github.com/christopherjohnson1535/ordinate.git
cd ordinate
npm install
npm run build
```

Run `npm start` to rebuild on change and serve the dev pages at the address Vite prints. The toolbar on every page switches mode and revision.

## Checks

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm test`             | Unit and server-rendering tests in jsdom and Node. Fast; run often. |
| `npm run lint`         | ESLint and Stylelint.                                               |
| `npm run test:browser` | Browser tests in Chromium against the dev pages.                    |
| `npm run size`         | Bundles each component and checks it against its size budget.       |

All of them except `npm run lint` need `npm run build` first, because they use the built components in `lib/components`.

### Browser tests

The browser tests live in `test/browser/` and use [Playwright](https://playwright.dev). Download the browser once:

```sh
npx playwright install chromium
```

If Chromium from another Playwright install is already on your machine, the config finds it through a global `playwright` package, or you can point `ORDINATE_CHROMIUM` at the executable and skip the download.

`npm run test:browser` starts the dev pages server on port 5190 (set `PAGES_PORT` to use another) and reuses one that is already running there. It does not build anything, so run `npm run build` first. While `npm start` is running you can reuse its server instead: `PAGES_PORT=5173 npm run test:browser`, with the port Vite printed. Pass Playwright options after `--`, for example `npm run test:browser -- console` to run one file or `npm run test:browser -- --headed` to watch. A failed run leaves a report in `test-results/browser-report` (`npx playwright show-report test-results/browser-report`).

The suite covers the example pages end to end, keyboard and positioning behavior that jsdom cannot check, and an axe pass over every dev page in light and dark mode. Write tests through the helper in `test/browser/support/dev-page.ts`, which opens a page by its route (`group/name`) and sets mode, revision, density and direction through the top bar. A new dev page gets the axe pass automatically. Violations that need more than a small fix are listed in `test/browser/support/known-axe-violations.ts` with the reason; the pass fails when one of them is fixed, so remove the entry then.

Type-check the tests with `npx tsc -p test/browser`.

### Bundle size

`npm run size` bundles every entry in `lib/components/<name>/index.js` with esbuild, leaving out React, and prints its minified and gzipped size, JavaScript and CSS together, next to the budget in `size-limits.json`. It fails when a component is over either budget or has none.

When a component grows on purpose, or you add one, run `npm run size -- --update`. It sets every budget to the current size plus 15%, so commit only the entries you meant to change and explain the growth in the pull request.

## Making a change

1. Open an issue first for anything larger than a small fix, so we can agree on the approach.
2. Create a branch from `main`.
3. Follow the conventions in [docs/](docs). The most important ones:
   - [Component conventions](docs/COMPONENT_CONVENTIONS.md) for file layout and public APIs.
   - [Styling](docs/STYLING.md) for tokens, revisions and the no-raw-values rule.
   - [Code style](docs/CODE_STYLE.md) for formatting, file headers and commit messages.
4. Add or update tests and dev pages for what you changed.
5. Make sure `npm run build`, `npm test` and `npm run lint` all pass. For changes to how components look, behave or load, run `npm run test:browser` and `npm run size` too.
6. Open a pull request describing the change and why it is needed.

There is no CI yet, so please run the checks locally before opening a pull request.

## Licensing

By contributing, you agree that your contributions are licensed under the [Apache License, Version 2.0](LICENSE).

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md).
