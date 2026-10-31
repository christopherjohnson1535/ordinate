# Component conventions

## Files

Every component lives in `src/<component-name>/` with the same files:

- `interfaces.ts` declares `<Name>Props` and a namespace of the same name for related types (`ButtonProps.Variant`, `ButtonProps.Ref`). Every prop has a doc comment written for the people using the component.
- `index.tsx` is the public component. It sets defaults, passes only the allowed props on, and does nothing else. It starts with `'use client'`.
- `internal.tsx` holds the implementation. Other components compose the internal version, never the public one.
- `styles.scss` holds the styles. Class names are scoped at build time.
- `__tests__/<name>.test.tsx` tests the built component from `lib/components`.

Add a dev page in `pages/<component-name>/` showing every variant and state.

## Public API

- No styling props. Components accept `id` and `data-*` attributes, and nothing that changes their look: no `className`, no `style`. Internal components may take a `className` so other components can position them.
- Controlled state. Components that hold a value or visibility are controlled: `value` and `onChange`, `visible` and `onDismiss`.
- Events. Handlers are named `onX` and receive a `CustomEvent` with the payload in `event.detail`. Use `fireNonCancelableEvent` by default and `fireCancelableEvent` when the consumer must be able to prevent a default action, like following a link.
- Refs. Expose a small `Ref` interface through `useImperativeHandle`, such as `focus()`, rather than the underlying DOM node.
- Accessibility props are named `ariaLabel`, `ariaDescribedby` and so on, and map to the matching `aria-*` attribute.
- Form controls read their ID, label, description and error state from `FormField` through `useFormFieldContext`. Props set directly on the control take precedence.

## Behavior

- Prefer native elements and their built-in behavior: `<button>`, `<a>`, `<dialog>`, `<label>`.
- A disabled link keeps its role, loses its `href` and gets `aria-disabled`.
- Warn about misuse with `warnOnce` instead of throwing.

## Adding a component

1. Create the folder and files above.
2. Use only existing tokens in `styles.scss`. If you need a new one, add it to the token contract first (see [Styling](STYLING.md)).
3. Run `npm run build`. The component is added to `src/index.ts` automatically.
4. Add tests and a dev page.
