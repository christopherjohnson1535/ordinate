// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableRootProps } from './interfaces';
import { InternalTableRoot } from './internal';

export type { TableRootProps };

export default function TableRoot({
  children,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaRowcount,
  stickyHeader = false,
  stickyHeaderVerticalOffset = 0,
  stripedRows = false,
  wrapLines = false,
  contentDensity = 'comfortable',
  layout = 'auto',
  ...props
}: TableRootProps) {
  return (
    <InternalTableRoot
      {...getBaseProps(props)}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      ariaRowcount={ariaRowcount}
      stickyHeader={stickyHeader}
      stickyHeaderVerticalOffset={stickyHeaderVerticalOffset}
      stripedRows={stripedRows}
      wrapLines={wrapLines}
      contentDensity={contentDensity}
      layout={layout}
    >
      {children}
    </InternalTableRoot>
  );
}
