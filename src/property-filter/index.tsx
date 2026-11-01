// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PropertyFilterProps } from './interfaces';
import { InternalPropertyFilter } from './internal';

export type { PropertyFilterProps };

const PropertyFilter = React.forwardRef(
  (
    {
      query,
      onChange,
      filteringProperties,
      filteringOptions = [],
      filteringPlaceholder,
      filteringAriaLabel,
      countText,
      disableFreeTextFiltering = false,
      hideOperations = false,
      tokenLimit,
      disabled = false,
      expandToViewport = false,
      asyncProperties = false,
      onLoadItems,
      filteringStatusType = 'finished',
      filteringLoadingText,
      filteringFinishedText,
      filteringErrorText,
      filteringRecoveryText,
      filteringEmpty,
      customControl,
      customFilterActions,
      i18nStrings,
      ...props
    }: PropertyFilterProps,
    ref: React.Ref<PropertyFilterProps.Ref>
  ) => (
    <InternalPropertyFilter
      {...getBaseProps(props)}
      ref={ref}
      query={query}
      onChange={onChange}
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      filteringPlaceholder={filteringPlaceholder}
      filteringAriaLabel={filteringAriaLabel}
      countText={countText}
      disableFreeTextFiltering={disableFreeTextFiltering}
      hideOperations={hideOperations}
      tokenLimit={tokenLimit}
      disabled={disabled}
      expandToViewport={expandToViewport}
      asyncProperties={asyncProperties}
      onLoadItems={onLoadItems}
      filteringStatusType={filteringStatusType}
      filteringLoadingText={filteringLoadingText}
      filteringFinishedText={filteringFinishedText}
      filteringErrorText={filteringErrorText}
      filteringRecoveryText={filteringRecoveryText}
      filteringEmpty={filteringEmpty}
      customControl={customControl}
      customFilterActions={customFilterActions}
      i18nStrings={i18nStrings}
    />
  )
);

PropertyFilter.displayName = 'PropertyFilter';

export default PropertyFilter;
