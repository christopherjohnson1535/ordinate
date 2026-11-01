// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TitleBlockProps } from './interfaces';
import { InternalTitleBlock } from './internal';

export type { TitleBlockProps };

export default function TitleBlock({ items, columns = 'auto', ariaLabel, ariaLabelledby, ...props }: TitleBlockProps) {
  return (
    <InternalTitleBlock
      {...getBaseProps(props)}
      items={items}
      columns={columns}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
