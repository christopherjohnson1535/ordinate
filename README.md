# Ordinate

Ordinate is a React component library drawn in the style of an engineering plate: fine ink rules, hatching instead of grey fills, dimensioned spacing. Import a component and it already looks and behaves like every other component in the system.

Two things set it apart:

- Revisions. The look of the whole library is versioned separately from its code. An application pins one revision, such as `2026.1`, and every component follows it. A new revision, for example one that rounds every corner, never changes an application until it opts in.
- No style overrides. Components accept no `className` or `style`. Consistency comes from the components, not from discipline in each application.

The structure of this repository follows [Cloudscape](https://github.com/cloudscape-design/components).

## Packages

| Package                   | Contents                                                    |
| ------------------------- | ----------------------------------------------------------- |
| `@ordinate/components`    | The React components. Built from this repository's root.    |
| `@ordinate/global-styles` | Fonts, base page styles, and the mode and revision helpers. |

## Usage

```tsx
import { applyMode, applyRevision, Mode, Revision } from '@ordinate/global-styles';
import '@ordinate/global-styles/index.css';

import Button from '@ordinate/components/button';

applyRevision(Revision.V2026_1);
applyMode(Mode.System);

export function SaveBar() {
  return <Button variant="primary">Save changes</Button>;
}
```

`applyRevision` and `applyMode` take an optional element, so a single page or section can try a newer revision before the whole application moves to it.

### Astro and other server-rendered setups

Components import their own CSS. When rendering on the server with Vite, Astro included, let Vite bundle the package instead of loading it from `node_modules`:

```js
// astro.config.mjs
export default {
  vite: { ssr: { noExternal: ['@ordinate/components'] } },
};
```

## Components

- Button
- FormField
- Input
- Modal

## Development

```sh
npm install
npm run build      # build lib/components
npm start          # rebuild on change and serve the dev pages
npm test           # unit tests and the token contract test
npm run lint       # ESLint and Stylelint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started and [docs/](docs) for the conventions.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
