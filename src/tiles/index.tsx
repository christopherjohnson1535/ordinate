// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TilesProps } from './interfaces';
import { InternalTiles } from './internal';

export type { TilesProps };

const Tiles = React.forwardRef(
  (
    {
      value,
      items,
      onChange,
      columns,
      name,
      readOnly = false,
      ariaLabel,
      ariaRequired,
      ariaControls,
      ariaLabelledby,
      ariaDescribedby,
      ...props
    }: TilesProps,
    ref: React.Ref<TilesProps.Ref>
  ) => (
    <InternalTiles
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      items={items}
      onChange={onChange}
      columns={columns}
      name={name}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      ariaControls={ariaControls}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    />
  )
);

Tiles.displayName = 'Tiles';

export default Tiles;
