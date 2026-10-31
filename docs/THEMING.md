# Theming, revisions and density

Ordinate's appearance comes from three layers of design tokens. Each one answers a different question, and they combine in a fixed order.

| Layer    | Question                                  | Set with                    | Scope           |
| -------- | ----------------------------------------- | --------------------------- | --------------- |
| Revision | Which version of the design do we target? | `applyRevision`             | Page or subtree |
| Mode     | Light, dark, or follow the system?        | `applyMode`, `applyDensity` | Page or subtree |
| Theme    | What are this product's brand values?     | `applyTheme`                | Page or subtree |

A component never reads a raw value. It reads a token such as `ord.$color-text-link`, which compiles to `var(--ord-color-text-link)`. The layers decide what that variable holds.

## Revisions

A revision is a complete set of token values, published once and never changed. Applications pin one so an upgrade of the package cannot change how they look. The oldest supported revision is the default.

Revisions are data only. A revision may change any token value, for example every corner radius, but it never adds markup, props or behavior.

## Modes

Two modes exist today, and both are set with classes on the page or on a subtree.

- **Color mode** is light, dark or system. Colors are written once with `light-dark()`, so switching mode only changes `color-scheme`.
- **Density** is comfortable or compact. Tokens that respond to density hold a value for each. Most are the `space-scaled-*` spacings and control heights. Components use the scaled spacings for padding that should tighten in compact mode, and the static `space-*` spacings for gaps that should not.

Density tokens are emitted as three variables: `--ord-x-comfortable`, `--ord-x-compact`, and `--ord-x`, which points at one of them. The compact class repoints `--ord-x` on its element and on any revision subtree inside it. That way each nested revision keeps its own compact values.

## Themes

A theme lets one product use its own brand colors, fonts and corner radii without forking the library.

```ts
import { applyTheme } from '@ordinate/components/theming';

const { reset } = applyTheme({
  theme: {
    tokens: {
      colorBackgroundButtonPrimary: { light: '#0b5cad', dark: '#7cc4ff' },
      colorTextLink: { light: '#0b5cad', dark: '#7cc4ff' },
      fontFamilyBase: "'Inter', system-ui, sans-serif",
      borderRadiusButton: '999px',
    },
  },
});
```

### What can be themed

Only a fixed set of tokens is themeable. The set lives in `style-dictionary/utils/themeable.ts`.

- **Brand colors:** primary button, links, accent, focus ring, checked controls, selected items, highlight, and the page and container backgrounds.
- **Font families:** base, display and mono.
- **Corner radii:** every `border-radius-*` token.

Status colors (error, warning, success, info) are not themeable, because their meaning has to stay the same in every product. Body text colors are not themeable either, because they carry the contrast guarantees. Spacing, sizes and motion belong to the revision and density layers.

A theme cannot target one component instance. It applies to every component on the page, or in one subtree, so all buttons still look the same.

### How a theme combines with a revision

The theme sits on top of the pinned revision. It wins for the tokens it sets, and every other token keeps the revision's value. For example, if a theme sets `borderRadiusButton` and the page moves from 2026.1 to 2026.2, buttons keep the theme's radius while containers pick up the new revision's radius.

`applyTheme` injects one stylesheet. Its selectors outrank the revision classes, including revision subtrees nested inside the themed element.

### Server rendering

`generateThemeStylesheet({ theme })` returns the same CSS as a string, so a server-rendered page (for example an Astro layout) can inline it in `<head>` and avoid a flash of the default look.

### Validation

Unknown or non-themeable token names are ignored, with a warning in development. Values that could break out of a declaration (`;`, `{`, `}`, `<`) are rejected.
