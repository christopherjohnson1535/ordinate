// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { KeyValuePairsProps } from './interfaces';
import { InternalKeyValuePairs } from './internal';

export type { KeyValuePairsProps };

export default function KeyValuePairs({ items, columns = 1, ariaLabel, ariaLabelledby, ...props }: KeyValuePairsProps) {
  return (
    <InternalKeyValuePairs
      {...getBaseProps(props)}
      items={items}
      columns={columns}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
