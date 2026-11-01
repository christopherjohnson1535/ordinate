# API definitions

The build reads every component's `interfaces.ts` with the TypeScript compiler and writes one JSON file per component to `lib/components-definitions/<component-name>.json`. Documentation sites, editor tooling and the dev pages read these files instead of parsing the source themselves.

The task is `build-tools/tasks/docs.js`, and the extraction lives in `build-tools/utils/documenter.js`. It runs at the end of `npm run build`, or on its own with `npx gulp docs`. It picks up every folder in `src/` that has an `index.tsx`, the same folders that end up in `src/index.ts`.

## What a definition holds

```json
{
  "name": "PanelLayout",
  "folder": "panel-layout",
  "properties": [
    {
      "name": "panelPosition",
      "type": "PanelLayoutProps.PanelPosition",
      "optional": true,
      "description": "Which side the panel is on: ...",
      "defaultValue": "'side-start'",
      "values": ["side-start", "side-end"]
    }
  ],
  "regions": [{ "name": "panelContent", "description": "...", "isDefault": false }],
  "events": [
    {
      "name": "onPanelResize",
      "description": "...",
      "detailType": "PanelLayoutProps.PanelResizeDetail",
      "cancelable": false
    }
  ],
  "functions": [{ "name": "focusResizeHandle", "description": "...", "parameters": [], "returnType": "void" }]
}
```

- **properties** are the props that are neither regions nor events, including inherited ones such as `id`. `type` is the type as written in the source. `values` lists the choices when the type is a union of string or number literals.
- **regions** are the props that take React content (`React.ReactNode`). `children` is the default region.
- **events** are the `on…` props. `detailType` is the type of `event.detail`, and `cancelable` says whether the handler can call `preventDefault()`.
- **functions** are the methods of the component's `Ref` interface, the ones reachable through a React ref.

Every list is sorted by name. Descriptions are the doc comments as written, Markdown included.

## Default values

A property's `defaultValue` comes from the first of these that exists:

1. A `@default` tag in its doc comment.
2. A sentence in its doc comment of the form ``Defaults to `value`.``, `Defaults to "value".` or `Defaults to 12.`
3. The default in the destructuring of the props in the component's `index.tsx`, then its `internal.tsx`. A constant from the same file is replaced with its value.

## Doc comments are required

`src/__tests__/api-docs.test.ts` fails when a component has no definition, or when any property, region, event or ref function has no doc comment. Write each one for the people using the component; see [Component conventions](COMPONENT_CONVENTIONS.md).

## Browsing the definitions

The dev page `docs/props` (`pages/docs/props.page.tsx`) renders every definition as a table of contents and prop lists. Run `npm run build` before `npm start` so the definitions exist.
