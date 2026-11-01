// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { HeaderProps } from './interfaces';
import { InternalHeader } from './internal';

export type { HeaderProps };

export default function Header({
  variant = 'h2',
  headingTagOverride,
  description,
  actions,
  counter,
  info,
  code,
  children,
  ...props
}: HeaderProps) {
  return (
    <InternalHeader
      {...getBaseProps(props)}
      variant={variant}
      headingTagOverride={headingTagOverride}
      description={description}
      actions={actions}
      counter={counter}
      info={info}
      code={code}
    >
      {children}
    </InternalHeader>
  );
}
