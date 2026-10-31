# Code style

## Formatting and linting

Prettier formats everything (`npm run format`). ESLint and Stylelint run with `npm run lint`, and both must pass before a change is merged.

## File headers

Every source file starts with the license header. ESLint checks it in JavaScript and TypeScript.

```ts
// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
```

Sass files use the same text in a block comment.

## TypeScript

- Use `interface` for object types.
- Group a component's related types in a namespace that matches its props interface.
- Avoid `any`. Prefer narrow types and type guards.
- Imports are sorted automatically: packages, then `~` aliases, then relative imports, then styles.

## Naming

- Folders and files use kebab-case: `form-field/internal.tsx`.
- Components and types use PascalCase. Props and functions use camelCase.
- CSS classes in `styles.scss` use kebab-case and describe what the element is (`close-button`), not how it looks.

## Comments

Write a comment when the code cannot say why something is done. Do not restate what the code does.

## Tests

- Test behavior the user or the consumer can observe: rendered roles and names, attributes, fired events.
- Query by role and accessible name where possible.
- Component tests import from `lib/components`, so run `npm run build` first.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add a loading state
fix(modal): restore focus after closing
docs: describe revision rules
```

Keep the subject under 72 characters and in the imperative mood. Explain the reason for the change in the body when it is not obvious.
