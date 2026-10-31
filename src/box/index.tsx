// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { BoxProps } from './interfaces';
import { InternalBox } from './internal';

export type { BoxProps };

export default function Box({
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
  children,
  ...props
}: BoxProps) {
  return (
    <InternalBox
      {...getBaseProps(props)}
      variant={variant}
      tagOverride={tagOverride}
      display={display}
      margin={margin}
      padding={padding}
      textAlign={textAlign}
      float={float}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
    >
      {children}
    </InternalBox>
  );
}
