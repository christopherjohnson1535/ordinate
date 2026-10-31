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

## Making a change

1. Open an issue first for anything larger than a small fix, so we can agree on the approach.
2. Create a branch from `main`.
3. Follow the conventions in [docs/](docs). The most important ones:
   - [Component conventions](docs/COMPONENT_CONVENTIONS.md) for file layout and public APIs.
   - [Styling](docs/STYLING.md) for tokens, revisions and the no-raw-values rule.
   - [Code style](docs/CODE_STYLE.md) for formatting, file headers and commit messages.
4. Add or update tests and dev pages for what you changed.
5. Make sure `npm run build`, `npm test` and `npm run lint` all pass.
6. Open a pull request describing the change and why it is needed.

There is no CI yet, so please run the checks locally before opening a pull request.

## Licensing

By contributing, you agree that your contributions are licensed under the [Apache License, Version 2.0](LICENSE).

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md).
