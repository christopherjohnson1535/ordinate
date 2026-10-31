# @ordinate/global-styles

Fonts, base page styles, and the helpers that set mode and revision for [Ordinate](../README.md) components.

```ts
import { applyMode, applyRevision, disableMotion, Mode, Revision } from '@ordinate/global-styles';
import '@ordinate/global-styles/index.css';

applyRevision(Revision.V2026_1);
applyMode(Mode.Dark);
```

| Function                           | Effect                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `applyMode(mode, target?)`         | Light, dark or system mode. `null` returns to light.                    |
| `applyRevision(revision, target?)` | Pins components inside `target` to a revision. `null` uses the default. |
| `disableMotion(disabled, target?)` | Turns off component animation.                                          |

`target` defaults to `document.body`.

Licensed under the [Apache License, Version 2.0](../LICENSE).
