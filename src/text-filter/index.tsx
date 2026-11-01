// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TextFilterProps } from './interfaces';
import { InternalTextFilter } from './internal';

export type { TextFilterProps };

const TextFilter = React.forwardRef(
  (
    {
      filteringText,
      onChange,
      onDelayedChange,
      filteringPlaceholder,
      filteringAriaLabel,
      filteringClearAriaLabel,
      countText,
      disabled = false,
      ...props
    }: TextFilterProps,
    ref: React.Ref<TextFilterProps.Ref>
  ) => (
    <InternalTextFilter
      {...getBaseProps(props)}
      ref={ref}
      filteringText={filteringText}
      onChange={onChange}
      onDelayedChange={onDelayedChange}
      filteringPlaceholder={filteringPlaceholder}
      filteringAriaLabel={filteringAriaLabel}
      filteringClearAriaLabel={filteringClearAriaLabel}
      countText={countText}
      disabled={disabled}
    />
  )
);

TextFilter.displayName = 'TextFilter';

export default TextFilter;
