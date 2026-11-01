// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ControlGroupProps } from './interfaces';
import { InternalControlGroup } from './internal';

export type { ControlGroupProps };

export default function ControlGroup({
  children,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ...props
}: ControlGroupProps) {
  return (
    <InternalControlGroup
      {...getBaseProps(props)}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    >
      {children}
    </InternalControlGroup>
  );
}
