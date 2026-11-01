// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { StyleScopeProps } from './interfaces';

import styles from './styles.css.js';

// The same global classes `@ordinate-ui/global-styles` sets, so a scope and applyStyle agree.
export function getScopeClassNames({
  styleName,
  mode,
  density,
  revision,
}: Pick<StyleScopeProps, 'styleName' | 'mode' | 'density' | 'revision'>): string[] {
  const classNames: string[] = [];
  if (styleName && styleName !== 'console') {
    classNames.push(`ord-style-${styleName}`);
  }
  if (mode) {
    classNames.push(`ord-${mode}-mode`);
  }
  if (density === 'compact') {
    classNames.push('ord-compact-mode');
  }
  if (revision) {
    classNames.push(`ord-revision-${revision.replace(/\./g, '-')}`);
  }
  return classNames;
}

export function InternalStyleScope({
  styleName,
  mode,
  density,
  revision,
  tagOverride = 'div',
  ariaLabel,
  children,
  ...rest
}: StyleScopeProps) {
  const Tag = tagOverride;
  return (
    <Tag
      {...rest}
      className={clsx(
        styles.root,
        mode && styles.painted,
        ...getScopeClassNames({ styleName, mode, density, revision })
      )}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}
