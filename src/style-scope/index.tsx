// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { StyleScopeProps } from './interfaces';
import { InternalStyleScope } from './internal';

export type { StyleScopeProps };

/**
 * Gives everything inside it a style, mode, density or revision, in markup. It renders on the
 * server as well as in the browser, so a server-rendered page (an Astro layout, for example)
 * can set a website style without running `applyStyle`. Settings left out are inherited.
 */
export default function StyleScope({
  styleName,
  mode,
  density,
  revision,
  tagOverride,
  ariaLabel,
  children,
  ...props
}: StyleScopeProps) {
  return (
    <InternalStyleScope
      {...getBaseProps(props)}
      styleName={styleName}
      mode={mode}
      density={density}
      revision={revision}
      tagOverride={tagOverride}
      ariaLabel={ariaLabel}
    >
      {children}
    </InternalStyleScope>
  );
}
