# Directory layout

```
ordinate/
├── build-tools/          Build tasks used by gulpfile.js
│   ├── tasks/            One file per task: clean, style-dictionary, styles, typescript, charts, ...
│   ├── utils/
│   └── size.js           Bundle size check, `npm run size`
├── charts/               The @ordinate-ui/charts package (see below)
│   └── src/
│       ├── <chart>/      The same four files as a component, and __tests__/
│       ├── internal/     Drawing code shared by the charts: scales, ticks, paths, patterns, frame
│       └── test-utils/dom/  Test wrappers, one folder per chart, and the finders they add
├── collection-hooks/     The @ordinate-ui/collection-hooks package: useCollection and its pure helpers
├── docs/                 Conventions for contributors
├── global-styles/        The @ordinate-ui/global-styles package
│   └── src/              applyMode, applyRevision, disableMotion, fonts and base CSS
├── pages/                Dev pages served by Vite (npm start)
│   ├── app/              Page list and the mode and revision toolbar
│   └── <component>/      *.page.tsx files for one component
├── src/                  Component source
│   ├── <component>/
│   │   ├── __tests__/    Unit and server-rendering tests, run against lib/components
│   │   ├── index.tsx     Public component: defaults and allowed props only
│   │   ├── interfaces.ts Public props, documented
│   │   ├── internal.tsx  Implementation, also used by other components
│   │   └── styles.scss   Styles, compiled to scoped class names
│   ├── icon/icons/       Built-in icon SVGs, one file per icon
│   ├── test-utils/dom/   Test wrappers, one folder per component; index.ts is generated
│   ├── internal/         Shared code that is not public API
│   │   ├── base-component/  Base props and the revision CSS loaded by every component
│   │   ├── context/      React contexts shared between components
│   │   ├── events/       Custom event helpers for onX handlers
│   │   ├── generated/    Generated from the style dictionary (git-ignored)
│   │   └── styles/       Sass mixins and token variables
│   └── __tests__/        Cross-component tests, the token contract test and the axe helper
├── style-dictionary/     Design tokens, one folder per revision
│   ├── 2026.1/
│   ├── 2026.2/
│   ├── utils/            Token names, types and reference resolution
│   └── index.ts          The list of supported revisions
├── test/
│   └── browser/          Browser tests that Playwright runs against the dev pages
│       └── support/      Dev page helper, fixtures, axe runner and the known axe violations
├── types/                Ambient type declarations
├── playwright.config.ts  Browser test settings; starts the dev pages server
└── size-limits.json      Bundle size budget per component, checked by `npm run size`
```

Unit tests sit next to the code they test, in `__tests__` folders, and run in jsdom with Vitest. Tests that need a real browser (layout, focus moving between components, contrast) live in `test/browser/` instead. Keeping them outside `src/` means the library build never compiles them.

Build output goes to `lib/`, which is git-ignored:

- `lib/components` is the publishable `@ordinate-ui/components` package.
- `lib/style-dictionary` is the compiled token source used by the build and the contract test.
- `lib/design-tokens` is the publishable `@ordinate-ui/design-tokens` package (see [Styling](STYLING.md)).
- `lib/components-definitions` holds one API definition per component (see [API definitions](API_DOCS.md)).
- `lib/charts` is the publishable `@ordinate-ui/charts` package, with its own `package.json`.

`global-styles/` and `collection-hooks/` build into their own `lib/` folders and publish from their folders. The same `npm run build` builds them.

After compiling, the build rewrites every relative import in the output to a full file path (`./internal` becomes `./internal.js` or `./internal/index.js`), and each package's `exports` map names its entry points, so the packages load in Node as well as in bundlers. `npm run verify:packages` checks both.

## The charts package

`charts/` is a workspace like `global-styles/` and `collection-hooks/`, but its build runs from the root gulpfile, after the components and design tokens, because the charts compile against both. The `charts` task compiles every `styles.scss` under `charts/src` to scoped CSS (class names are prefixed `ord_charts-` so they never collide with a component's), compiles the TypeScript with `charts/tsconfig.json`, and writes `lib/charts/package.json` with peer dependencies on `react`, `react-dom` and `@ordinate-ui/components`.

The charts use only the public surface of the library:

- Components come from `@ordinate-ui/components/<name>`. In the charts' tsconfig, in Vite and in Vitest that name resolves to `lib/components`.
- Styles use `@use '@ordinate-ui/design-tokens' as ord;`, which the build resolves to `lib/design-tokens/index.scss`. Stylelint applies the same token rules to `charts/src` as to `src`.
- Nothing is imported from `src/internal`. The few internal pieces the charts need (the floating panel, event helpers, direction helpers and the Sass mixins) are copied into `charts/src/internal`.

Dev pages import charts through the `~charts` alias, which points at `lib/charts`. Tests import `lib/charts`, and the chart wrappers in `lib/charts/test-utils/dom` add `findLineChart` and the other chart finders to the components' `createWrapper()`. See [charts/README.md](../charts/README.md).
