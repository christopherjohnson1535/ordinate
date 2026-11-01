// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useRef } from 'react';
import clsx from 'clsx';

import { InternalContainer } from '../container/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalStatusIndicator } from '../status-indicator/internal';
import { InternalTableBody } from '../table-body/internal';
import { InternalTableBodyCell } from '../table-body-cell/internal';
import { InternalTableHead } from '../table-head/internal';
import { InternalTableHeaderCell } from '../table-header-cell/internal';
import { InternalTableRoot } from '../table-root/internal';
import { InternalTableRow } from '../table-row/internal';
import { HeaderArea } from './header-area';
import { TableProps } from './interfaces';
import { columnKeyAttribute, useColumnWidths } from './use-column-widths';
import { useSelection } from './use-selection';
import { getRowKey, getVisibleColumns, isSortable, isSortingColumn, VisibleColumn } from './utils';

import styles from './styles.css.js';

export function InternalTable<T>({
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
  ...rest
}: TableProps<T>) {
  const i18n = useInternalI18n('table');
  const tableRef = useRef<HTMLTableElement>(null);
  const radioGroupName = useId();

  const visibleColumns = getVisibleColumns(columnDefinitions, columnDisplay);
  const selection = useSelection({ items, selectedItems, selectionType, trackBy, isItemDisabled, onSelectionChange });
  const widths = useColumnWidths({
    enabled: resizableColumns,
    columnDefinitions,
    visibleColumns,
    tableRef,
    onColumnWidthsChange,
  });

  const columnCount = visibleColumns.length + (selectionType ? 1 : 0) + (rowTag ? 1 : 0);
  const rowNumberOffset = firstIndex ?? 1;
  const selectionState = { selectedItems };
  const hasSheet = variant === 'container' || variant === 'full-page';

  const sortingStateOf = (column: VisibleColumn<T>) => {
    if (!isSortable(column.definition)) {
      return undefined;
    }
    if (!isSortingColumn(column.definition, sortingColumn)) {
      return 'unsorted';
    }
    return sortingDescending ? 'descending' : 'ascending';
  };

  const headerRow = (
    <InternalTableRow ariaRowindex={firstIndex !== undefined ? 1 : undefined}>
      {rowTag && <InternalTableHeaderCell rowTagColumn={true} />}
      {selectionType && (
        <InternalTableHeaderCell
          selectionType={selectionType}
          selected={selection.allSelected}
          indeterminate={selection.someSelected}
          selectionDisabled={selection.noneSelectable}
          selectionAriaLabel={
            selectionType === 'multi'
              ? ariaLabels?.allItemsSelectionLabel?.(selectionState)
              : ariaLabels?.selectionGroupLabel
          }
          onSelectionChange={event => selection.selectAll(event.detail.selected)}
        />
      )}
      {visibleColumns.map(column => {
        const { definition, key } = column;
        return (
          <InternalTableHeaderCell
            key={key}
            {...{ [columnKeyAttribute]: key }}
            sortingState={sortingStateOf(column)}
            sortingDisabled={sortingDisabled}
            onSortingChange={event =>
              fireNonCancelableEvent(onSortingChange, {
                sortingColumn: definition,
                isDescending: event.detail.descending,
              })
            }
            width={resizableColumns ? widths.widthOf(key) : definition.width}
            minWidth={definition.minWidth}
            maxWidth={definition.maxWidth}
            resizable={resizableColumns}
            resizerRoleDescription={ariaLabels?.resizerRoleDescription}
            onResize={event => widths.resize(key, event.detail.width)}
            onResizeEnd={event => widths.commit(key, event.detail.width)}
          >
            {definition.header}
          </InternalTableHeaderCell>
        );
      })}
    </InternalTableRow>
  );

  const messageRow = (content: React.ReactNode, className: string) => (
    <InternalTableRow message={true}>
      <InternalTableBodyCell colSpan={columnCount} message={true}>
        <div className={className}>{content}</div>
      </InternalTableBodyCell>
    </InternalTableRow>
  );

  const itemRows = items.map((item, index) => {
    const selected = selectionType ? selection.isSelected(item) : false;
    return (
      <InternalTableRow
        key={getRowKey(trackBy, item, index)}
        selected={selected}
        ariaRowindex={firstIndex !== undefined ? firstIndex + index + 1 : undefined}
        onClick={onRowClick ? () => fireNonCancelableEvent(onRowClick, { rowIndex: index, item }) : undefined}
      >
        {rowTag && <InternalTableBodyCell rowTag={rowTag(item, index)} />}
        {selectionType && (
          <InternalTableBodyCell
            selectionType={selectionType}
            selected={selected}
            selectionDisabled={selection.isDisabled(item)}
            selectionName={radioGroupName}
            selectionAriaLabel={i18n('itemSelectionLabel', ariaLabels?.itemSelectionLabel?.(selectionState, item), {
              rowNumber: rowNumberOffset + index,
            })}
            onSelectionChange={event => selection.selectItem(index, event.detail.selected, event.detail.shiftKey)}
          />
        )}
        {visibleColumns.map(({ definition, key }) => (
          <InternalTableBodyCell
            key={key}
            isRowHeader={definition.isRowHeader}
            verticalAlign={definition.verticalAlign}
          >
            {definition.cell(item)}
          </InternalTableBodyCell>
        ))}
      </InternalTableRow>
    );
  });

  const bodyRows = loading
    ? messageRow(
        <InternalStatusIndicator type="loading">{i18n('loadingText', loadingText)}</InternalStatusIndicator>,
        styles.loading
      )
    : items.length === 0
      ? messageRow(empty, styles.empty)
      : itemRows;

  const table = (
    <InternalTableRoot
      tableRef={tableRef}
      caption={caption}
      ariaLabel={ariaLabels?.tableLabel}
      ariaRowcount={totalItemsCount !== undefined ? totalItemsCount + 1 : undefined}
      stickyHeader={stickyHeader}
      stickyHeaderVerticalOffset={stickyHeaderVerticalOffset}
      stripedRows={stripedRows}
      wrapLines={wrapLines}
      contentDensity={contentDensity}
      layout={widths.layout}
      minInlineSize={widths.minTableWidth}
      edgeInset={hasSheet ? 'container' : 'flush'}
      ruleWeight={hasSheet ? 'heavy' : 'light'}
      className={hasSheet && !footer ? styles['rows-end-sheet'] : undefined}
    >
      <InternalTableHead>{headerRow}</InternalTableHead>
      <InternalTableBody>{bodyRows}</InternalTableBody>
    </InternalTableRoot>
  );

  const liveRegion = renderAriaLive && !loading && (
    <InternalLiveRegion hidden={true}>
      {renderAriaLive({
        firstIndex: rowNumberOffset,
        lastIndex: rowNumberOffset + items.length - 1,
        visibleItemsCount: items.length,
        totalItemsCount,
      })}
    </InternalLiveRegion>
  );

  const headerArea = (
    <HeaderArea
      header={header}
      filter={filter}
      pagination={pagination}
      preferences={preferences}
      className={!hasSheet || variant === 'full-page' ? styles['header-area-outside'] : undefined}
    />
  );

  const footerSlot = footer ? <div className={styles['footer-slot']}>{footer}</div> : undefined;

  if (variant === 'container') {
    return (
      <InternalContainer
        {...rest}
        className={clsx(styles.root, styles[`variant-${variant}`], styles.sheet)}
        header={headerArea}
        footer={footerSlot}
        disableContentPaddings={true}
      >
        {table}
        {liveRegion}
      </InternalContainer>
    );
  }

  return (
    <div {...rest} className={clsx(styles.root, styles[`variant-${variant}`])}>
      {headerArea}
      {variant === 'full-page' ? (
        <InternalContainer className={styles.sheet} footer={footerSlot} disableContentPaddings={true}>
          {table}
        </InternalContainer>
      ) : (
        <>
          {table}
          {footerSlot && <div className={styles['footer-outside']}>{footerSlot}</div>}
        </>
      )}
      {liveRegion}
    </div>
  );
}
