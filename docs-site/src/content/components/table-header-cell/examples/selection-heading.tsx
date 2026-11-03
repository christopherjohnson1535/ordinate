// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const fixtures = [
  { code: 'L1', name: 'Pendant, reading room', lamps: 12, locked: false },
  { code: 'L2', name: 'Wall washer, gallery', lamps: 8, locked: false },
  { code: 'L3', name: 'Emergency bulkhead', lamps: 6, locked: true },
  { code: 'L4', name: 'Downlight, entrance', lamps: 10, locked: false },
];
const selectable = fixtures.filter(fixture => !fixture.locked).map(fixture => fixture.code);

export default function SelectionHeading() {
  const [picked, setPicked] = useState<string[]>(['L2']);
  const all = picked.length === selectable.length;

  return (
    <TableRoot caption="Light fittings">
      <TableHead>
        <TableRow>
          <TableHeaderCell
            selectionType="multi"
            selected={all}
            indeterminate={picked.length > 0 && !all}
            selectionAriaLabel="Select all fittings"
            onSelectionChange={event => setPicked(event.detail.selected ? selectable : [])}
          />
          <TableHeaderCell>Fitting</TableHeaderCell>
          <TableHeaderCell contentType="number">Lamps</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fixtures.map(fixture => {
          const selected = picked.includes(fixture.code);
          return (
            <TableRow key={fixture.code} selected={selected}>
              <TableBodyCell
                selectionType="multi"
                selected={selected}
                selectionDisabled={fixture.locked}
                selectionAriaLabel={`Select ${fixture.name}`}
                onSelectionChange={event =>
                  setPicked(event.detail.selected ? [...picked, fixture.code] : picked.filter(c => c !== fixture.code))
                }
              />
              <TableBodyCell isRowHeader={true}>
                {fixture.locked ? `${fixture.name} (fixed by the fire strategy)` : fixture.name}
              </TableBodyCell>
              <TableBodyCell contentType="number">{fixture.lamps}</TableBodyCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
}
