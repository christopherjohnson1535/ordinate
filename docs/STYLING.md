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

The console borrows the marks of a drawing set, and `src/internal/styles/drawing.scss` holds the shared ones: `mono-caption` and `font-caption` for small mono capitals, `circled-tag` for references such as S1, `heavy-rule-block-start` for the rule that opens a title block, `on-ink`, `construction-line` and `hash-mark`. A revision mark (△) and margin numbers are decoration and stay hidden from screen readers; the text they point to carries the meaning.

Sections are drawn with construction lines rather than boxes. A thin line opens each section and runs past both ends; a second line stands between the heading column and the content and runs past the top and the bottom. Both use `construction-line`, which holds them back with `opacity-construction`. A 45-degree `hash-mark` sits wherever a line ends or meets another. A dimension line, from `src/internal/components/dimension-line`, lies on the top line and carries a short measure of what the section holds, such as "7 services". The line breaks around its label, so it needs no background. The lines and marks are drawing only; the label is text.

Every container is drawn this way. Container puts the heading in a margin column. The container variants of Table, Cards, ExpandableSection and Tabs keep their heading on top, because they need the full width, and draw the same opening line with `ConstructionTopLine` from `src/internal/components/construction`. `RuleEndMarks` puts the hash marks on a footer rule.

Cards have no box. ItemCard, the cards inside Cards, ActionCard and Tiles draw `CropMarks` from `src/internal/components/crop-marks` at their four corners, in the kind's color at `opacity-construction`, with arms of `size-crop-mark`. A chosen card or tile closes the marks into a frame in ink with heavier corners, and its reference turns ink too. Where the whole card answers a click, the marks reach out to `size-crop-mark-reach` while the pointer is over it, on devices with a real pointer only. ActionCard points at its destination with a leader arrow that moves a little further on hover. The large answer tiles in a Journey question keep their box. Cards, ItemCard, ActionCard and Tiles take a `kind`, and ItemCard and Cards' `cardDefinition` take a `reference`, as Container does.

Tabs use the same marks for the open view. The row stands on a construction line in the kind's color, with no dividers between tabs, and small ink crop marks stand at the corners of the open tab, taking in its action and close button. The marks slide to the next tab quickly and slow as they land; with reduced motion they move at once. Each tab can carry a `reference` after its label in the kind's color, and Tabs take a `kind`.

KeyValuePairs borrow Container's margin at a small scale: each label is set right-aligned in a margin column against a faint construction line, with its value to the right in ink. Rows meet edge to edge, so the line runs unbroken down each column.

## Kinds

A section's color says what it holds. Kinds are not decoration and not status, so the three hues stay clear of green, amber and red.

| Kind            | Token                      | Light    | Dark      | For                        |
| --------------- | -------------------------- | -------- | --------- | -------------------------- |
| `configuration` | `color-kind-configuration` | Blue 600 | Cyan 400  | Settings people change     |
| `resource`      | `color-kind-resource`      | Teal 600 | Teal 400  | Things that exist or run   |
| `policy`        | `color-kind-policy`        | Plum 600 | Plum 400  | Rules the system follows   |
| `neutral`       | `color-kind-neutral`       | Grey 600 | Chalk 300 | Anything else, the default |

The kind colors the construction lines, hash marks, dimension line and reference. Each keeps at least 4.5:1 against the container background in its mode, because the reference is text. Pair a kind with a reference whose letter matches it, such as C1, R1 or P1, so the meaning does not rest on color alone.

## Status and badges

Only the mark carries color; words stay in ink. A StatusIndicator draws its state's icon in the state's color and its text in `color-text-body-secondary`, so a table full of states reads calmly and the icon's shape still tells the states apart. Steps hang their icons on a faint construction line.

States are named like their icons: `complete`, `caution`, `fault`, `note`, `underway`, `waiting`, `halted`, `queued`, plus `loading`. `tone` replaces the mark's color without changing its shape.

A Badge is a short label in small mono capitals, keyed by a colored square of `size-key-square`, like the key beside a legend entry. Its `tone` is one of `neutral`, `note`, `complete` and `fault`, or the severity scale `critical`, `high`, `medium` and `low`. The scale is also told by the square's fill: solid for critical and high, half for medium, open for low, with critical in bold.

An Alert is a margin note rather than a box. A construction line in the note's color opens it, the icon and a mono caption naming the kind of note sit in a narrow margin, and the title, text and action follow in ink. Its `type` is `note`, `complete`, `caution` or `fault`, and `i18nStrings` replaces the caption.

The old names (`type`, `colorOverride`, Badge's `color`, the old status values and Alert's `info`, `success`, `warning` and `error`) still work with a warning until the next major version.

## States

- Focus: a solid 2 px ink outline, offset 2 px. Use the `focus-ring` mixin.
- Hover: a raised grey background on controls and list items.
- Selected: ink fill with white text for toggles, segmented controls, navigation items and selected table rows. Inside an ink fill, use the `on-ink` mixin from `drawing.scss` so links, status text and controls stay readable.
- Disabled: dimmed text and hatched with the `hatch` mixin.
- Error: an error-colored border with a 2 px inset mark on the leading edge, and the message below the control.

## Icons

Icons are SVG files in `src/icon/icons/`, drawn on a 16 by 16 grid as open strokes. Do not set colors or stroke widths in the file: the `Icon` component sets the stroke to the current text color and keeps the line weight the same at every size. Give solid parts `class="filled"`. The build checks each file and turns the folder into the icon name list.

The file name is the icon's name. Name a new icon for what it means in Ordinate, in plain words, and give solid variants the suffix `-solid`. Icons renamed from their earlier names keep the old names as deprecated aliases in `src/icon/deprecated-names.ts`; [Icon names](ICON_NAMES.md) lists them.

## Motion

Put every transition and animation inside the `with-motion` mixin. It only runs motion when the user has not asked for reduced motion and when `disableMotion` is off. Durations and easing are tokens, so a revision can change them.
