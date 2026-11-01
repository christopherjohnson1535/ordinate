// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CardsProps } from './interfaces';
import { InternalCards } from './internal';

export type { CardsProps };

export default function Cards<T>({
  items,
  cardDefinition,
  cardsPerRow,
  trackBy,
  selectionType,
  selectedItems,
  onSelectionChange,
  isItemDisabled,
  loading = false,
  loadingText,
  empty,
  header,
  filter,
  pagination,
  preferences,
  visibleSections,
  ariaLabels,
  variant = 'container',
  entireCardClickable = false,
  ...props
}: CardsProps<T>) {
  return (
    <InternalCards<T>
      {...getBaseProps(props)}
      items={items}
      cardDefinition={cardDefinition}
      cardsPerRow={cardsPerRow}
      trackBy={trackBy}
      selectionType={selectionType}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      isItemDisabled={isItemDisabled}
      loading={loading}
      loadingText={loadingText}
      empty={empty}
      header={header}
      filter={filter}
      pagination={pagination}
      preferences={preferences}
      visibleSections={visibleSections}
      ariaLabels={ariaLabels}
      variant={variant}
      entireCardClickable={entireCardClickable}
    />
  );
}
