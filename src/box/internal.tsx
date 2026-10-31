// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BoxProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalBoxProps extends BoxProps {
  /**
   * Lets other components position the box. Not part of the public API.
   */
  className?: string;
}

const variantTags: Partial<Record<BoxProps.Variant, BoxProps.TagName>> = {
  'key-label': 'div',
  'value-large': 'span',
  'inline-code': 'code',
};

const spacingSides = ['horizontal', 'vertical', 'top', 'right', 'bottom', 'left'] as const;

function spacingClassNames(property: 'margin' | 'padding', value: BoxProps.SpacingSize | BoxProps.Spacing | undefined) {
  if (value === undefined) {
    return [];
  }
  if (typeof value === 'string') {
    return [styles[`${property}-${value}`]];
  }
  return spacingSides.filter(side => value[side]).map(side => styles[`${property}-${side}-${value[side]}`]);
}

export function InternalBox({
  variant = 'div',
  tagOverride,
  display,
  margin,
  padding,
  textAlign,
  float,
  fontSize,
  fontWeight,
  color,
  className,
  children,
  ...rest
}: InternalBoxProps) {
  const Tag = (tagOverride ?? variantTags[variant] ?? variant) as React.ElementType;

  return (
    <Tag
      {...rest}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        fontSize && styles[`font-size-${fontSize}`],
        fontWeight && styles[`font-weight-${fontWeight}`],
        color && styles[`color-${color}`],
        display && styles[`display-${display}`],
        textAlign && styles[`text-align-${textAlign}`],
        float && styles[`float-${float}`],
        spacingClassNames('margin', margin),
        spacingClassNames('padding', padding),
        className
      )}
    >
      {children}
    </Tag>
  );
}
