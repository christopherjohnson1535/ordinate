# Component conventions

## Files

Every component lives in `src/<component-name>/` with the same files:

- `interfaces.ts` declares `<Name>Props` and a namespace of the same name for related types (`ButtonProps.Variant`, `ButtonProps.Ref`). Every prop has a doc comment written for the people using the component.
- `index.tsx` is the public component. It sets defaults, passes only the allowed props on, and does nothing else. It starts with `'use client'`.
- `internal.tsx` holds the implementation. Other components compose the internal version, never the public one.
- `styles.scss` holds the styles. Class names are scoped at build time.
- `__tests__/<name>.test.tsx` tests the built component from `lib/components`, including an axe check with `expectNoAxeViolations` and use of the component's test-utils wrapper.
- `__tests__/<name>.ssr.test.tsx` renders the component with `renderToString` in a Node environment, with no DOM.

Every component also has:

- A test-utils wrapper in `src/test-utils/dom/<component-name>/index.ts`, a class extending `ComponentWrapper` with a `rootSelector` built from the component's own scoped class name, plus `find…` methods for its parts and actions such as `setInputValue`. The build adds `findX` and `findAllXs` to every wrapper automatically.
- A dev page in `pages/<component-name>/` showing every variant and state.

## Definition of done

A component is done when it has the four standard files, unit tests with an axe check, a server-rendering test, a test-utils wrapper and a dev page, and when it looks right in both revisions, all three color modes, compact density and right-to-left layout.

## Public API

- No styling props. Components accept `id` and `data-*` attributes, and nothing that changes their look: no `className`, no `style`. Internal components may take a `className` so other components can position them.
- Controlled state. Components that hold a value or visibility are controlled: `value` and `onChange`, `visible` and `onDismiss`.
- Events. Handlers are named `onX` and receive a `CustomEvent` with the payload in `event.detail`. Use `fireNonCancelableEvent` by default and `fireCancelableEvent` when the consumer must be able to prevent a default action, like following a link.
- Refs. Expose a small `Ref` interface through `useImperativeHandle`, such as `focus()`, rather than the underlying DOM node.
- Accessibility props are named `ariaLabel`, `ariaDescribedby` and so on, and map to the matching `aria-*` attribute.
- Form controls read their ID, label, description and error state from `FormField` through `useFormFieldContext`. Props set directly on the control take precedence.

## Behavior

- Prefer native elements and their built-in behavior: `<button>`, `<a>`, `<dialog>`, `<label>`, `<input type="checkbox">`.
- Use `InternalIcon` with a built-in icon name for any icon inside a component. Add a new icon to `src/icon/icons/` rather than drawing SVG inline.
- A disabled link keeps its role, loses its `href` and gets `aria-disabled`.
- Warn about misuse with `warnOnce` instead of throwing.

## Built-in strings

Any text a component renders on its own, such as an accessible name for a close button or a "Loading" label, is a message. Ordinate ships these in English only; applications can replace them with props or with `I18nProvider`.

- Expose it as an optional prop, such as `closeAriaLabel` or `i18nStrings.nextPageAriaLabel`, with no default value in the destructuring.
- Add the English text to `src/i18n/messages/all.en.ts` under the component's folder name.
- Read it in `internal.tsx` with `const i18n = useInternalI18n('modal')` and `i18n('closeAriaLabel', closeAriaLabel)`. The prop wins, then the `I18nProvider` locale, then English.
- Messages with numbers use ICU plurals, such as `{count, plural, one {# item} other {# items}}`, and are called with `i18n(key, prop, { count })`.

## Right-to-left

- Lay out with logical properties only (Stylelint enforces this).
- For arrow-key navigation along a row, use `getLogicalArrowStep(event.key, element)` from `src/internal/direction.ts`, so Right moves backward in right-to-left layout.
- Icons that point along the reading direction (`angle-left`, `arrow-right`, `external` and so on) mirror themselves; don't swap icon names by direction.

## Adding a component

1. Create the folder and files above.
2. Use only existing tokens in `styles.scss`. If you need a new one, add it to the token contract first (see [Styling](STYLING.md)).
3. Run `npm run build`. The component is added to `src/index.ts` automatically.
4. Add the wrapper, tests and a dev page (see the definition of done).
