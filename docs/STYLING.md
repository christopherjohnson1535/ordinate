# Styling

## Tokens

Every visual value comes from a design token. Component styles never contain raw colors, sizes, radii, fonts, letter-spacing, opacity or timings. Stylelint enforces this in `src/`, along with logical properties (`margin-inline-start`, not `margin-left`) and no shorthand for `border`, `border-radius`, `margin` or `padding`.

Use tokens through the Sass namespace:

```scss
@use '../internal/styles' as styles;
@use '../internal/styles/tokens' as ord;

.button {
  @include styles.border-radius(ord.$border-radius-button);
  padding-inline: ord.$space-button-horizontal;
  color: ord.$color-text-body;
}
```

Each Sass variable compiles to a CSS custom property, for example `var(--ord-border-radius-button)`. The values come from the revision in effect.

Tokens are defined in `style-dictionary/`, grouped the same way in every revision: color palette, colors, borders, typography, spacing, sizes, motion and effects (opacities). The token names in `style-dictionary/utils/token-names.ts` are the contract that every revision must fill.

## Tokens in your own components

The `@ordinate/design-tokens` package gives custom components the same tokens. Each token is a reference to its CSS custom property, so it follows the pinned revision, the color mode, the density and any `applyTheme` theme, exactly as the built-in components do.

In Sass, the variables have the same names as the internal `ord.$...` ones:

```scss
@use '@ordinate/design-tokens' as ord;

.summary-card {
  padding-block: ord.$space-scaled-m;
  border-block-end: ord.$border-width-default solid ord.$color-border-divider;
  color: ord.$color-text-body;
}
```

In JavaScript or TypeScript, each token is a camelCase constant:

```tsx
import { colorTextSecondary, spaceXs } from '@ordinate/design-tokens';

<span style={{ color: colorTextSecondary, marginInlineStart: spaceXs }}>Updated hourly</span>;
```

The package holds references only. The values come from the revision styles that load with any `@ordinate/components` component, so render at least one Ordinate component, or import `@ordinate/components/internal/base-component`, on pages that use the tokens. The build writes the package to `lib/design-tokens` from the token names in `style-dictionary/utils/token-names.ts`, and `src/__tests__/design-tokens.test.ts` checks that every token is exported.

## Revisions

A revision is a complete, frozen set of token values. It is data only: a revision can change any value, but never markup or behavior. Changes to markup or behavior belong in a new major version of the package.

Rules:

- A published revision never changes. Fix a mistake by publishing a new revision.
- A new revision gets the next calendar version, such as `2026.3`, and its own folder in `style-dictionary/`.
- Write it as changes to the previous revision. See `style-dictionary/2026.2/borders.ts`, which spreads the parent tokens and overrides the corner radii.
- Add it to `style-dictionary/index.ts` and to the `Revision` enum in `global-styles/src/index.ts`.

The build turns every revision into a full block of custom properties scoped to a class, like `.ord-revision-2026-2`. The oldest supported revision also applies to `:root`, so it is the default. Because each block is complete, a revision can be applied to any element and its subtree follows it.

The token contract test (`src/__tests__/token-contract.test.ts`) checks that every revision defines every token, that every reference resolves, and that the generated CSS contains every token for every revision.

## Chart colors

Charts take their series colors from `color-charts-categorical1` to `color-charts-categorical8`, in that order: blue, orange, teal, red, violet, olive, plum, green. Each has its own light and dark value. Every color keeps at least 3:1 contrast against the container background in its mode, neighbors in the order stay apart for red-green color blindness, and every series also gets a fill pattern or a dash and marker, so color is never the only difference. Thresholds and axes are drawn in ink (`color-border-strong`) and grid rules in `color-border-divider-secondary`.

## Light and dark mode

Mode is not a theme. Each color token defines both a `light` and a `dark` value, which compile to `light-dark()`. `applyMode` sets `color-scheme` through a class: light, dark, or system to follow the operating system.

## Density

Compact density tightens padding and control heights. Spacing tokens come in two kinds:

- `space-scaled-*` and control heights change with density. Use them for padding inside containers, rows and controls.
- `space-*` stays the same. Use it for gaps that carry meaning, such as the space between an icon and its label.

A token gets density values by holding `{ comfortable, compact }` in the revision. See [Theming, revisions and density](THEMING.md).

## Runtime theming

Applications can change a fixed set of brand tokens at runtime with `applyTheme`. Components need nothing special for this, as long as they read colors, fonts and radii from tokens. See [Theming, revisions and density](THEMING.md) for the themeable set.

## The look

Revision 2026.1 draws the console like a set of drawings: a light grey frame holding a sheet index, content on framed white sheets with grid letters and a title block, numbered notes in the margin, ink-colored text and rules, IBM Plex Sans for the interface and IBM Plex Mono for code and data, square corners, and drafting blue used sparingly for accents and progress. Grey control borders keep forms light; strong ink borders are kept for things drawn like a plate, such as modals and title blocks.

## Drawing marks

The console borrows the marks of a drawing set, and `src/internal/styles/drawing.scss` holds the shared ones: `mono-caption` and `font-caption` for small mono capitals, `circled-tag` for references such as S1, `heavy-rule-block-start` for the rule that opens a title block, and `on-ink`. A revision mark (△) and margin numbers are decoration and stay hidden from screen readers; the text they point to carries the meaning.

## States

- Focus: a solid 2 px ink outline, offset 2 px. Use the `focus-ring` mixin.
- Hover: a raised grey background on controls and list items.
- Selected: ink fill with white text for toggles, segmented controls, navigation items and selected table rows. Inside an ink fill, use the `on-ink` mixin from `drawing.scss` so links, status text and controls stay readable.
- Disabled: dimmed text and hatched with the `hatch` mixin.
- Error: an error-colored border with a 2 px inset mark on the leading edge, and the message below the control.

## Icons

Icons are SVG files in `src/icon/icons/`, drawn on a 16 by 16 grid as open strokes. Do not set colors or stroke widths in the file: the `Icon` component sets the stroke to the current text color and keeps the line weight the same at every size. Give solid parts `class="filled"`. The build checks each file and turns the folder into the icon name list.

## Motion

Put every transition and animation inside the `with-motion` mixin. It only runs motion when the user has not asked for reduced motion and when `disableMotion` is off. Durations and easing are tokens, so a revision can change them.
