// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SpaceBetween from '@ordinate/components/space-between';
import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';
import Toggle from '@ordinate/components/toggle';

const materials = [
  { name: 'Cast iron', density: '7.20', use: 'Frames, flywheels and base plates that need mass and damping.' },
  { name: 'Bronze', density: '8.80', use: 'Bearings and bushings that run against a steel shaft.' },
  { name: 'Steel', density: '7.85', use: 'Shafts and fasteners.' },
  { name: 'Brass', density: '8.50', use: 'Fittings, gauges and small turned parts.' },
];

export default function DensityAndStripes() {
  const [compact, setCompact] = useState(true);
  const [striped, setStriped] = useState(true);
  const [wrap, setWrap] = useState(false);

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="l">
        <Toggle checked={compact} onChange={event => setCompact(event.detail.checked)}>
          Compact
        </Toggle>
        <Toggle checked={striped} onChange={event => setStriped(event.detail.checked)}>
          Striped rows
        </Toggle>
        <Toggle checked={wrap} onChange={event => setWrap(event.detail.checked)}>
          Wrap lines
        </Toggle>
      </SpaceBetween>
      <TableRoot
        caption="Materials"
        contentDensity={compact ? 'compact' : 'comfortable'}
        stripedRows={striped}
        wrapLines={wrap}
      >
        <TableHead>
          <TableRow>
            <TableHeaderCell>Material</TableHeaderCell>
            <TableHeaderCell contentType="number">Density (g/cm³)</TableHeaderCell>
            <TableHeaderCell>Use</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map(material => (
            <TableRow key={material.name}>
              <TableBodyCell isRowHeader={true}>{material.name}</TableBodyCell>
              <TableBodyCell contentType="number">{material.density}</TableBodyCell>
              <TableBodyCell>{material.use}</TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </SpaceBetween>
  );
}
