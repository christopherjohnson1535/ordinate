# Ordinate

Ordinate is a React component library with a quiet, precise console style: a light frame, content on white sheets, ink-colored rules, IBM Plex type and square corners. Import a component and it already looks and behaves like every other component in the system.

Two things set it apart:

- Revisions. The look of the whole library is versioned separately from its code. An application pins one revision, such as `2026.1`, and every component follows it. A new revision, for example one that rounds every corner, never changes an application until it opts in.
- No style overrides. Components accept no `className` or `style`. Consistency comes from the components, not from discipline in each application.

## Packages

| Package                         | Contents                                                             |
| ------------------------------- | -------------------------------------------------------------------- |
| `@ordinate-ui/components`       | The React components. Built from this repository's root.             |
| `@ordinate-ui/global-styles`    | Fonts, base page styles, and the mode, density and revision helpers. |
| `@ordinate-ui/collection-hooks` | Filtering, sorting, pagination and selection state for collections.  |
| `@ordinate-ui/design-tokens`    | The design tokens as Sass variables and JavaScript constants.        |
| `@ordinate-ui/charts`           | Line, area, bar, mixed and pie charts, patterned as well as colored. |

## Install

```sh
npm install @ordinate-ui/components @ordinate-ui/global-styles
```

Add `@ordinate-ui/collection-hooks`, `@ordinate-ui/design-tokens` or `@ordinate-ui/charts` when you need them. React 18 or later is a peer dependency. All packages are released together at the same version.

## Usage

```tsx
import { applyMode, applyRevision, Mode, Revision } from '@ordinate-ui/global-styles';
import '@ordinate-ui/global-styles/index.css';

import Button from '@ordinate-ui/components/button';

applyRevision(Revision.V2026_1);
applyMode(Mode.System);

export function SaveBar() {
  return <Button variant="primary">Save changes</Button>;
}
```

### Applications and websites

The same components build a console or a website. `applyStyle(Style.Editorial)` (or `Studio`, or `Shopfront`) gives every component the voice of a journal, a studio portfolio or a local shop, while `Style.Console`, the default, keeps the application look, drawn like a set of drawings: a sheet index, schedules, a checklist sheet for setup flows and notes in the margin. See [Theming, styles, revisions and density](docs/THEMING.md).

`applyRevision`, `applyMode`, `applyStyle` and `applyDensity` take an optional element, so a single page or section can try a newer revision before the whole application moves to it.

### Brand theme

`applyTheme` from `@ordinate-ui/components/theming` changes a fixed set of brand tokens: primary and accent colors, font families and corner radii. The theme sits on top of the pinned revision. See [Theming, revisions and density](docs/THEMING.md).

### Labels and right-to-left

Components ship English labels for the text they render on their own, such as a close button's accessible name. Each label can be replaced with a prop, or for the whole application with `I18nProvider` and your own messages:

```tsx
import I18nProvider from '@ordinate-ui/components/i18n';

const messages = { '@ordinate-ui/components': { en: { modal: { closeAriaLabel: 'Close dialog' } } } };

<I18nProvider messages={[messages]}>
  <App />
</I18nProvider>;
```

Set `dir="rtl"` on the page for right-to-left languages; layouts, icons and keyboard navigation follow it.

### Code editor

`CodeEditor` runs on CodeMirror 6, which comes with the package. The editor loads CodeMirror with a dynamic `import()` when it first renders, and each language when an editor first uses it, so bundlers put them in separate chunks and pages without a code editor never download them.

### Server rendering

Components import their own CSS, so a bundler has to process them. Bundling for the browser needs no setup. For server rendering, tell the bundler to bundle `@ordinate-ui/*` instead of loading it from `node_modules`, where Node cannot read the CSS imports. With Vite, set `ssr.noExternal`. Astro renders static pages in a separate `prerender` environment that the top-level setting does not reach, so set it for both environments:

```js
// astro.config.mjs
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

const bundleOrdinate = { resolve: { noExternal: [/^@ordinate-ui\//] } };

export default defineConfig({
  integrations: [react()],
  vite: { environments: { ssr: bundleOrdinate, prerender: bundleOrdinate } },
});
```

## Components

- **Layout:** AppLayout, AppLayoutToolbar, ColumnLayout, Container, ContentLayout, Drawer, Grid, HelpPanel, PanelLayout, SpaceBetween, SplitPanel, StyleScope, TitleBlock
- **Content:** Box, Divider, ExpandableSection, Header, KeyValuePairs, TextContent, TruncatedText
- **Collections:** ActionCard, Cards, CollectionPreferences, ItemCard, List, PropertyFilter, Table (and TableRoot, TableHead, TableHeaderCell, TableBody, TableRow, TableBodyCell), TextFilter, Token, TokenGroup
- **Actions:** Button, ButtonDropdown, ButtonGroup, CopyToClipboard, Link, SegmentedControl, ToggleButton
- **Forms:** AttributeEditor, Autosuggest, Checkbox, CodeEditor, ControlGroup, Form, FormField, Input, Multiselect, PromptInput, RadioButton, RadioGroup, Select, Slider, TagEditor, Textarea, Tiles, Toggle
- **Dates and files:** Calendar, DateInput, DatePicker, DateRangePicker, TimeInput, FileDropzone, FileInput, FileTokenGroup, FileUpload
- **Navigation:** AnchorNavigation, BreadcrumbGroup, NavigableGroup, Pagination, SideNavigation, Tabs, TopNavigation, TreeView
- **Guided flows:** AnnotationContext, Hotspot, Steps, TutorialPanel, Wizard
- **Overlays:** Dialog, Dropdown, Modal, Popover, Tooltip
- **Status and feedback:** Alert, Badge, ErrorBoundary, Flashbar, LiveRegion, Measure, ProgressBar, Skeleton, Spinner, Stamp, StatusIndicator
- **Icons:** Icon, IconProvider
- **Website frame:** Opening, Section, CallToAction, SiteHeader, SiteFooter
- **Website content:** Article, Figure, Media, Plate, StoryCard, MenuTile, IndexList, PullQuote, Testimonial
- **Website flows:** HowItWorks, Journey, OpeningHours

Charts (area, bar, line, mixed line and bar, pie) are in the separate `@ordinate-ui/charts` package.

## Development

```sh
npm install
npm run build      # build every package
npm start          # rebuild on change and serve the dev pages
npm test           # unit, accessibility, server-rendering and token contract tests
npm run lint       # ESLint and Stylelint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started and [docs/](docs) for the conventions.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
