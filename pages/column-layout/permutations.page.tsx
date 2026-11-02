// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import ColumnLayout, { ColumnLayoutProps } from '~components/column-layout';
import Container from '~components/container';

import styles from './styles.module.scss';

// Children are listed directly, not inside a fragment, so each one takes its own cell.
function cells(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className={styles.cell}>
      Cell {index + 1}
    </div>
  ));
}

const facts = [
  ['Instance type', 'm5.large'],
  ['Zone', 'north-annex-1a'],
  ['State', 'Running'],
  ['Launched', '31 October 2026'],
  ['Private address', '10.0.4.12'],
  ['Image', 'ordinate-base-2026.10'],
];

function factCells() {
  return facts.map(([label, value]) => (
    <div key={label}>
      <Box variant="key-label">{label}</Box>
      <div>{value}</div>
    </div>
  ));
}

const borders: ReadonlyArray<ColumnLayoutProps.Borders> = ['vertical', 'horizontal', 'all'];

export default function ColumnLayoutPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Column layout</Box>

      {([1, 2, 3, 4] as const).map(columns => (
        <section key={columns} className={styles.section}>
          <Box variant="h2">{columns === 1 ? '1 column' : `${columns} columns`}</Box>
          <div className={styles.resizable}>
            <ColumnLayout columns={columns}>{cells(columns * 2)}</ColumnLayout>
          </div>
        </section>
      ))}

      {borders.map(value => (
        <section key={value} className={styles.section}>
          <Box variant="h2">Borders: {value}</Box>
          <div className={styles.resizable}>
            <ColumnLayout columns={3} borders={value}>
              {factCells()}
            </ColumnLayout>
          </div>
        </section>
      ))}

      <section className={styles.section}>
        <Box variant="h2">Text grid in a container</Box>
        <Container heading="Details">
          <ColumnLayout columns={3} variant="text-grid">
            {factCells()}
          </ColumnLayout>
        </Container>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Minimum column width of 180 pixels</Box>
        <div className={styles.resizable}>
          <ColumnLayout columns={4} minColumnWidth={180} borders="vertical">
            {cells(8)}
          </ColumnLayout>
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Gutters disabled</Box>
        <div className={styles.resizable}>
          <ColumnLayout columns={4} disableGutters={true}>
            {cells(4)}
          </ColumnLayout>
        </div>
      </section>
    </div>
  );
}
