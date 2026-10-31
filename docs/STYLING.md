# Styling

## Tokens

Every visual value comes from a design token. Component styles never contain raw colors, sizes, radii, fonts or timings. Stylelint enforces this in `src/`, along with logical properties (`margin-inline-start`, not `margin-left`) and no shorthand for `border`, `border-radius`, `margin` or `padding`.

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

Tokens are defined in `style-dictionary/`, grouped the same way in every revision: color palette, colors, borders, typography, spacing, sizes and motion. The token names in `style-dictionary/utils/token-names.ts` are the contract that every revision must fill.

## Revisions

A revision is a complete, frozen set of token values. It is data only: a revision can change any value, but never markup or behavior. Changes to markup or behavior belong in a new major version of the package.

Rules:

- A published revision never changes. Fix a mistake by publishing a new revision.
- A new revision gets the next calendar version, such as `2026.3`, and its own folder in `style-dictionary/`.
- Write it as changes to the previous revision. See `style-dictionary/2026.2/borders.ts`, which spreads the parent tokens and overrides the corner radii.
- Add it to `style-dictionary/index.ts` and to the `Revision` enum in `global-styles/src/index.ts`.

The build turns every revision into a full block of custom properties scoped to a class, like `.ord-revision-2026-2`. The oldest supported revision also applies to `:root`, so it is the default. Because each block is complete, a revision can be applied to any element and its subtree follows it.

The token contract test (`src/__tests__/token-contract.test.ts`) checks that every revision defines every token, that every reference resolves, and that the generated CSS contains every token for every revision.

## Light and dark mode

Mode is not a theme. Each color token defines both a `light` and a `dark` value, which compile to `light-dark()`. `applyMode` sets `color-scheme` through a class: light, dark, or system to follow the operating system.

## States

- Focus: a second, dashed rule in drafting blue, set off the outline. Use the `focus-ring` mixin.
- Disabled: hatched with the `hatch` mixin instead of greyed out.
- Error: a dashed rule in the error color.

## Motion

Put every transition and animation inside the `with-motion` mixin. It only runs motion when the user has not asked for reduced motion and when `disableMotion` is off. Durations and easing are tokens, so a revision can change them.
