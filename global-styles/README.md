# @ordinate/global-styles

Fonts, base page styles, and the helpers that set mode, density and revision for [Ordinate](../README.md) components.

```ts
import {
  applyDensity,
  applyMode,
  applyRevision,
  Density,
  disableMotion,
  Mode,
  Revision,
} from '@ordinate/global-styles';
import '@ordinate/global-styles/index.css';

applyRevision(Revision.V2026_1);
applyMode(Mode.Dark);
applyDensity(Density.Compact);
```

| Function                           | Effect                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `applyMode(mode, target?)`         | Light, dark or system mode. `null` returns to light.                    |
| `applyRevision(revision, target?)` | Pins components inside `target` to a revision. `null` uses the default. |
| `applyDensity(density, target?)`   | Comfortable or compact density. `null` returns to comfortable.          |
| `disableMotion(disabled, target?)` | Turns off component animation.                                          |

`target` defaults to `document.body`. For brand colors, fonts and radii, see `applyTheme` in [THEMING.md](../docs/THEMING.md).

Licensed under the [Apache License, Version 2.0](../LICENSE).
