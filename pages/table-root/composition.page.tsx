// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell, { TableHeaderCellProps } from '~components/table-header-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';

import styles from './styles.module.scss';

interface Part {
  number: string;
  name: string;
  material: string;
  quantity: number;
}

const parts: Part[] = [
  { number: 'A-101', name: 'Base plate', material: 'Cast iron', quantity: 1 },
  { number: 'A-102', name: 'Bearing housing', material: 'Bronze', quantity: 2 },
  { number: 'A-103', name: 'Main shaft', material: 'Steel, turned', quantity: 1 },
  { number: 'A-104', name: 'Flywheel', material: 'Cast iron', quantity: 1 },
  { number: 'A-105', name: 'Hex bolt, 3/4 in.', material: 'Steel', quantity: 12 },
];

// A parts list built directly from the table parts, with its own sorting, selection and resizing.
function PartsList() {
  const [descending, setDescending] = useState(false);
  const [selected, setSelected] = useState<string[]>(['A-102']);
  const [nameWidth, setNameWidth] = useState(220);
  const rows = [...parts].sort((a, b) => (descending ? b.quantity - a.quantity : a.quantity - b.quantity));
  const allSelected = selected.length === parts.length;
  const sortingState: TableHeaderCellProps.SortingState = descending ? 'descending' : 'ascending';

  return (
    <TableRoot caption="Parts list" layout="fixed">
      <TableHead>
        <TableRow>
          <TableHeaderCell rowTagColumn={true} />
          <TableHeaderCell
            selectionType="multi"
            selected={allSelected}
            indeterminate={selected.length > 0 && !allSelected}
            onSelectionChange={event => setSelected(event.detail.selected ? parts.map(part => part.number) : [])}
          />
          <TableHeaderCell width={110}>Part no.</TableHeaderCell>
          <TableHeaderCell resizable={true} width={nameWidth} onResize={event => setNameWidth(event.detail.width)}>
            Name
          </TableHeaderCell>
          <TableHeaderCell>Material</TableHeaderCell>
          <TableHeaderCell
            width={120}
            sortingState={sortingState}
            onSortingChange={event => setDescending(event.detail.descending)}
          >
            Quantity
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(part => {
          const isSelected = selected.includes(part.number);
          return (
            <TableRow key={part.number} selected={isSelected}>
              <TableBodyCell rowTag={`P${parts.indexOf(part) + 1}`} />
              <TableBodyCell
                selectionType="multi"
                selected={isSelected}
                selectionAriaLabel={`Select ${part.name}`}
                onSelectionChange={event =>
                  setSelected(
                    event.detail.selected ? [...selected, part.number] : selected.filter(n => n !== part.number)
                  )
                }
              />
              <TableBodyCell>
                <Box variant="code">{part.number}</Box>
              </TableBodyCell>
              <TableBodyCell isRowHeader={true}>{part.name}</TableBodyCell>
              <TableBodyCell>{part.material}</TableBodyCell>
              <TableBodyCell>
                <Box variant="code">{part.quantity}</Box>
              </TableBodyCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
}

function Plain({ compact = false, striped = false }: { compact?: boolean; striped?: boolean }) {
  return (
    <TableRoot ariaLabel="Materials" contentDensity={compact ? 'compact' : 'comfortable'} stripedRows={striped}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Material</TableHeaderCell>
          <TableHeaderCell sortingState="unsorted">Density (g/cm³)</TableHeaderCell>
          <TableHeaderCell>Use</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          ['Cast iron', '7.20', 'Frames, flywheels'],
          ['Bronze', '8.80', 'Bearings, bushings'],
          ['Steel', '7.85', 'Shafts, fasteners'],
          ['Brass', '8.50', 'Fittings'],
        ].map(([material, density, use]) => (
          <TableRow key={material}>
            <TableBodyCell isRowHeader={true}>{material}</TableBodyCell>
            <TableBodyCell>
              <Box variant="code">{density}</Box>
            </TableBodyCell>
            <TableBodyCell>{use}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}

export default function TablePartsComposition() {
  return (
    <article className={styles.page}>
      <h1>Table parts</h1>
      <section className={styles.section}>
        <h2>Composed parts list</h2>
        <PartsList />
      </section>
      <section className={styles.section}>
        <h2>Plain</h2>
        <Plain />
      </section>
      <section className={styles.section}>
        <h2>Striped, compact</h2>
        <Plain compact={true} striped={true} />
      </section>
      <section className={styles.section}>
        <h2>Sticky header in a scrolling area</h2>
        {/* Keyboard users can only scroll this area once it can take focus. */}
        <div className={styles.scroller} tabIndex={0} role="region" aria-label="Long list, scrolls">
          <TableRoot caption="Long list" stickyHeader={true}>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Row</TableHeaderCell>
                <TableHeaderCell>Value</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 30 }, (_, index) => (
                <TableRow key={index}>
                  <TableBodyCell>Row {index + 1}</TableBodyCell>
                  <TableBodyCell>
                    <Box variant="code">{(index * 1.618).toFixed(3)}</Box>
                  </TableBodyCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </div>
      </section>
    </article>
  );
}
