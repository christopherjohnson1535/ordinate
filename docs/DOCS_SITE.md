# The documentation site

`docs-site/` is the Ordinate reference: guides, foundations, and a page for every component with runnable examples, guidelines and its API. It is built with Ordinate itself, and it runs on your own machine with no network, the way `rustup doc` does for Rust.

```sh
npm run docs          # build the library if needed, build the site, serve it and open a browser
npm run docs:dev      # the same site with hot reload, for writing pages (port 4180)
npm run docs:build    # build the site into docs-site/dist
```

Run `npm run build` once before `docs:dev`, and again after changing a component's `interfaces.ts`, because the API tables read `lib/components-definitions` and `lib/charts-definitions`.

## Layout

```
docs-site/
├── bin/ordinate-docs.mjs     The `ordinate-docs` command: serves the built site and opens a browser
├── scripts/check-pages.mjs   Opens pages in a headless browser and reports errors
├── src/
│   ├── app/                  Shell: layout, routes, search, display settings, sheet index
│   ├── pages/                Page templates: cover sheet, component index, component page, guide page
│   ├── parts/                Building blocks for pages: Example, ApiReference, DocSection, CodeBlock, ...
│   ├── registry/             Finds the content below and exposes it to the shell and search
│   └── content/
│       ├── components/<folder>/index.tsx       The component page's text
│       ├── components/<folder>/examples/*.tsx  One runnable example per file
│       ├── guides/*.tsx                        Get started
│       ├── foundations/*.tsx                   Foundations
│       ├── packages/*.tsx                      Charts, collection hooks, tokens, global styles
│       └── patterns/*.tsx                      Whole pages built from the library
└── vite.config.mjs
```

The site routes on the URL hash (`#/components/button`, and `#/components/button#api` for a section), so it needs no server rewrites and every built file uses relative URLs.

## Adding a component page

A component page is a folder named like the component's folder in `src/` (or `charts/src/`). Nothing else needs registering: the navigation, the index, search and the sheet numbers pick it up.

`index.tsx` default-exports a `ComponentDoc` (see `src/registry/types.ts`):

```tsx
const doc: ComponentDoc = {
  name: 'Button',
  folder: 'button',
  group: 'actions',
  summary: 'Runs an action, or goes somewhere, when the user clicks it.',
  description: <p>…</p>,
  marks: ['M13', 'M7'],
  examples: [{ id: 'variants', title: 'Variants', description: <p>…</p>, layout: 'centered' }],
  guidelines: { use: [...], avoid: [...], writing: [...] },
  accessibility: [...],
  related: ['button-dropdown', 'link'],
};
export default doc;
```

- `summary` is one sentence, used in the index and in search. Say what the component does for the user, not what it is made of.
- `description` is one or two short paragraphs: how it is drawn, which marks it uses, the one or two things a reader must know first.
- `marks` lists the design-language marks the component draws, M1 to M13 (see `content/foundations/marks.tsx`).
- `examples` are in reading order. The first is the most common use. Each `id` is a file in `examples/`.
  - `layout`: `centered` for one small control, `padded` (the default) for most, `flush` for layouts that bring their own frame.
  - `height`: `short`, `medium` or `tall` for components that fill their parent, such as AppLayout or SplitPanel.
- `guidelines.avoid` names the alternative, with a link (`<a href="#/components/link">Link</a>`).
- `accessibility` says what the component does for keyboard and screen reader users and what the application must still do. Check each statement against `internal.tsx`.
- `testing: false` hides the Testing section, for components with no test finder, such as providers.

The API section needs no writing: it is read from the component's `interfaces.ts` at build time.

## Writing examples

Each file in `examples/` default-exports a component. The same file runs in the frame and is shown as its code, so write it as an application would.

- Import only `react` and `@ordinate/*` packages, by the names an application uses: `@ordinate/components/<folder>`, `@ordinate/charts/<folder>`, `@ordinate/collection-hooks`, `@ordinate/design-tokens`. Never import from the site.
- No style sheets, `className` or `style` on Ordinate components: arrange things with SpaceBetween, ColumnLayout, Grid and Box, as an application must.
- Use believable data and wording: services, regions, people and dates that could be real. Reuse the cast of the dev pages (the north-annex project, us-mountain-1, Dana Ruiz) where it fits.
- Make interactive components interactive: keep state with `useState`, and show what an event did with a line of text when it is not visible otherwise.
- Keep each example short enough to read: one idea per example, under about 80 lines.
- Links inside examples point at a page of the site (`#/components/button`) or at `https://example.com`.
- Portaled overlays (modals, popovers rendered with a portal) attach to the page body, so they follow the site's mode and revision rather than the example toolbar's.

## Writing guides

A guide is a `.tsx` file in `guides/`, `foundations/`, `packages/` or `patterns/` that default-exports a `GuideDoc`: a `slug` matching the file name, a `title`, a one-sentence `summary`, an `order` within its section, optional search `keywords`, and the `Page` component. Build the page from `DocSection`, `Prose`, `CodeBlock`, `Command` and `Notes` in `src/parts/prose.tsx`, and from Ordinate components. Number the sections from 1.

## Voice

Write the way the doc comments in `src/*/interfaces.ts` are written: short declarative sentences, the reader addressed as "you", concrete nouns, no marketing. Say what happens, then why if it is not obvious. Avoid filler and stock phrases ("seamless", "robust", "leverage", "powerful", "simply"), rhetorical contrasts ("not just X, but Y"), and lists of three for rhythm's sake. Use sentence case for headings and labels.

## Checking pages

With the dev server running, `scripts/check-pages.mjs` opens pages in a headless browser and reports uncaught errors, console errors, examples that failed to render and routes that did not resolve:

```sh
node docs-site/scripts/check-pages.mjs --base http://localhost:4180 --all
node docs-site/scripts/check-pages.mjs --base http://localhost:4180 --shots /tmp/shots --dark /components/table
```

`--shots` saves a screenshot of each page, `--full` makes them full-page, `--dark` uses a dark system color scheme. Set `CHROME_PATH` to use an installed Chrome.
