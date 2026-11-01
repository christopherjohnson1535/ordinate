// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TokenGroupProps } from './interfaces';
import { InternalTokenGroup } from './internal';

export type { TokenGroupProps };

export default function TokenGroup({
  items,
  onDismiss,
  alignment = 'horizontal',
  limit,
  readOnly = false,
  ariaLabel,
  i18nStrings,
  ...props
}: TokenGroupProps) {
  return (
    <InternalTokenGroup
      {...getBaseProps(props)}
      items={items}
      onDismiss={onDismiss}
      alignment={alignment}
      limit={limit}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
      i18nStrings={i18nStrings}
    />
  );
}
