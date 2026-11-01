# Directory layout

```
ordinate/
├── build-tools/          Build tasks used by gulpfile.js
│   ├── tasks/            One file per task: clean, style-dictionary, styles, typescript, ...
│   └── utils/
├── collection-hooks/     The @ordinate/collection-hooks package: useCollection and its pure helpers
├── docs/                 Conventions for contributors
├── global-styles/        The @ordinate/global-styles package
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
└── types/                Ambient type declarations
```

Build output goes to `lib/`, which is git-ignored:

- `lib/components` is the publishable `@ordinate/components` package.
- `lib/style-dictionary` is the compiled token source used by the build and the contract test.
