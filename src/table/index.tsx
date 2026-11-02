// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableProps } from './interfaces';
import { InternalTable } from './internal';

export type { TableProps };

export default function Table<T>({
  items,
  columnDefinitions,
  trackBy,
  loading = false,
  loadingText,
  empty,
  header,
  caption,
  rowTag,
  filter,
  pagination,
  preferences,
  footer,
  sortingColumn,
  sortingDescending = false,
  sortingDisabled = false,
  onSortingChange,
  selectionType,
  selectedItems = [],
  onSelectionChange,
  isItemDisabled,
  ariaLabels,
  columnDisplay,
  stickyHeader = false,
  stickyHeaderVerticalOffset = 0,
  stripedRows = false,
  wrapLines = false,
  contentDensity = 'comfortable',
  variant = 'container',
  resizableColumns = false,
  onColumnWidthsChange,
  firstIndex,
  totalItemsCount,
  onRowClick,
  renderAriaLive,
  kind = 'neutral',
  reference,
  ...props
}: TableProps<T>) {
  return (
    <InternalTable
      {...getBaseProps(props)}
      items={items}
      columnDefinitions={columnDefinitions}
      trackBy={trackBy}
      loading={loading}
      loadingText={loadingText}
      empty={empty}
      header={header}
      caption={caption}
      rowTag={rowTag}
      filter={filter}
      pagination={pagination}
      preferences={preferences}
      footer={footer}
      sortingColumn={sortingColumn}
      sortingDescending={sortingDescending}
      sortingDisabled={sortingDisabled}
      onSortingChange={onSortingChange}
      selectionType={selectionType}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      isItemDisabled={isItemDisabled}
      ariaLabels={ariaLabels}
      columnDisplay={columnDisplay}
      stickyHeader={stickyHeader}
      stickyHeaderVerticalOffset={stickyHeaderVerticalOffset}
      stripedRows={stripedRows}
      wrapLines={wrapLines}
      contentDensity={contentDensity}
      variant={variant}
      resizableColumns={resizableColumns}
      onColumnWidthsChange={onColumnWidthsChange}
      firstIndex={firstIndex}
      totalItemsCount={totalItemsCount}
      onRowClick={onRowClick}
      renderAriaLive={renderAriaLive}
      kind={kind}
      reference={reference}
    />
  );
}
