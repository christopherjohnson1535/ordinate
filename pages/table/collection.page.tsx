// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Header from '~components/header';
import Input from '~components/input';
import Pagination from '~components/pagination';
import Table, { TableProps } from '~components/table';
import Toggle from '~components/toggle';

import { columnDefinitions, Instance, makeInstances, sortItems } from './data';

import styles from './styles.module.scss';

const allItems = makeInstances(64);
const pageSize = 12;

// A complete collection view: filtering, sorting, paging, selection, resizing and column visibility,
// all held by the page, since the table itself is controlled.
export default function TableCollection() {
  const [filterText, setFilterText] = useState('');
  const [sorting, setSorting] = useState<TableProps.SortingState<Instance>>({ sortingColumn: columnDefinitions[0] });
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Instance[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [widths, setWidths] = useState<ReadonlyArray<number>>([]);
  const [settings, setSettings] = useState({ stickyHeader: true, resizableColumns: true, stripedRows: false });
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const filtered = useMemo(
    () => allItems.filter(item => `${item.name} ${item.id} ${item.type}`.includes(filterText.trim())),
    [filterText]
  );
  const sorted = useMemo(
    () => sortItems(filtered, sorting.sortingColumn, Boolean(sorting.isDescending)),
    [filtered, sorting]
  );
  const pagesCount = Math.max(Math.ceil(sorted.length / pageSize), 1);
  const currentPage = Math.min(page, pagesCount);
  const items = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstIndex = (currentPage - 1) * pageSize + 1;

  const definitions = columnDefinitions.map((definition, index) => ({ ...definition, width: widths[index] }));

  return (
    <article className={styles.page}>
      <div className={styles.settings}>
        {(Object.keys(settings) as (keyof typeof settings)[]).map(key => (
          <Toggle
            key={key}
            checked={settings[key]}
            onChange={event => setSettings({ ...settings, [key]: event.detail.checked })}
          >
            {key}
          </Toggle>
        ))}
      </div>

      <Table
        {...settings}
        items={items}
        columnDefinitions={definitions}
        columnDisplay={columnDefinitions.map(({ id }) => ({ id: id!, visible: !hiddenColumns.includes(id!) }))}
        trackBy="id"
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
        isItemDisabled={item => item.state === 'error'}
        sortingColumn={sorting.sortingColumn}
        sortingDescending={sorting.isDescending}
        onSortingChange={event => setSorting(event.detail)}
        onColumnWidthsChange={event => setWidths(event.detail.widths)}
        onRowClick={event => setLastClicked(event.detail.item.name)}
        firstIndex={firstIndex}
        totalItemsCount={sorted.length}
        renderAriaLive={({ firstIndex: first, lastIndex, totalItemsCount }) =>
          `Showing instances ${first} to ${lastIndex} of ${totalItemsCount}`
        }
        ariaLabels={{
          tableLabel: 'Instances',
          itemSelectionLabel: (_, item) => `Select ${item.name}`,
          allItemsSelectionLabel: () => 'Select all instances on this page',
        }}
        header={
          <Header
            counter={selectedItems.length ? `(${selectedItems.length}/${sorted.length})` : `(${sorted.length})`}
            description={
              lastClicked ? `Last clicked: ${lastClicked}` : 'Click a row, sort a column, or drag a heading edge.'
            }
            actions={
              <Button disabled={selectedItems.length === 0} onClick={() => setSelectedItems([])}>
                Clear selection
              </Button>
            }
          >
            Instances
          </Header>
        }
        filter={
          <Input
            type="search"
            value={filterText}
            placeholder="Find instances"
            ariaLabel="Find instances"
            onChange={event => {
              setFilterText(event.detail.value);
              setPage(1);
            }}
          />
        }
        pagination={
          <Pagination
            currentPageIndex={currentPage}
            pagesCount={pagesCount}
            onChange={event => setPage(event.detail.currentPageIndex)}
          />
        }
        preferences={
          <ButtonDropdown
            variant="icon"
            ariaLabel="Columns"
            items={columnDefinitions.map(({ id, header }) => ({
              id: id!,
              text: `${hiddenColumns.includes(id!) ? 'Show' : 'Hide'} ${String(header)}`,
            }))}
            onItemClick={event =>
              setHiddenColumns(hidden =>
                hidden.includes(event.detail.id)
                  ? hidden.filter(id => id !== event.detail.id)
                  : [...hidden, event.detail.id]
              )
            }
          />
        }
        empty={
          <Box textAlign="center">
            <Box variant="strong">No matches</Box>
            <Box variant="p">No instances match the filter.</Box>
            <Button onClick={() => setFilterText('')}>Clear filter</Button>
          </Box>
        }
      />

      <Box variant="p">Below the table, so the page scrolls and the sticky header can be seen.</Box>
      <div style={{ blockSize: 600 }} />
    </article>
  );
}
