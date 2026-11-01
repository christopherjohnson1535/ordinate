// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { GridProps } from './interfaces';
import { InternalGrid } from './internal';

export type { GridProps };

export default function Grid({ gridDefinition, disableGutters = false, children, ...props }: GridProps) {
  return (
    <InternalGrid {...getBaseProps(props)} gridDefinition={gridDefinition} disableGutters={disableGutters}>
      {children}
    </InternalGrid>
  );
}
