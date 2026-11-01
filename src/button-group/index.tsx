// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps } from './interfaces';
import { InternalButtonGroup } from './internal';

export type { ButtonGroupProps };

const ButtonGroup = React.forwardRef(
  (
    { items, onItemClick, variant = 'icon', ariaLabel, ...props }: ButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => (
    <InternalButtonGroup
      {...getBaseProps(props)}
      ref={ref}
      items={items}
      onItemClick={onItemClick}
      variant={variant}
      ariaLabel={ariaLabel}
    />
  )
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
