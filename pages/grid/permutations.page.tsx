// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Grid, { GridProps } from '~components/grid';

import styles from './styles.module.scss';

interface Example {
  title: string;
  definition: GridProps.ElementDefinition[];
  disableGutters?: boolean;
}

const examples: Example[] = [
  {
    title: 'Equal columns',
    definition: Array.from({ length: 4 }, () => ({ colspan: 3 })),
  },
  {
    title: 'Responsive: stacked, then halves at xs, then quarters at m',
    definition: Array.from({ length: 4 }, () => ({ colspan: { default: 12, xs: 6, m: 3 } })),
  },
  {
    title: 'Main and aside',
    definition: [{ colspan: { default: 12, s: 8 } }, { colspan: { default: 12, s: 4 } }],
  },
  {
    title: 'Offsets',
    definition: [
      { colspan: 4, offset: 2 },
      { colspan: 4, offset: 2 },
      { colspan: 6, offset: 3 },
    ],
  },
  {
    title: 'Push and pull swap the columns from xs up',
    definition: [
      { colspan: { default: 12, xs: 4 }, push: { xs: 8 } },
      { colspan: { default: 12, xs: 8 }, pull: { xs: 4 } },
    ],
  },
  {
    title: 'Wrapping rows',
    definition: [{ colspan: 5 }, { colspan: 5 }, { colspan: 4 }, { colspan: 8 }],
  },
  {
    title: 'Gutters disabled',
    definition: Array.from({ length: 3 }, () => ({ colspan: 4 })),
    disableGutters: true,
  },
];

function describe(definition: GridProps.ElementDefinition) {
  return Object.entries(definition)
    .map(([name, value]) => `${name} ${typeof value === 'number' ? value : JSON.stringify(value)}`)
    .join(', ');
}

export default function GridPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Grid</Box>
      {examples.map(({ title, definition, disableGutters }) => (
        <section key={title} className={styles.section}>
          <Box variant="h2">{title}</Box>
          <div className={styles.resizable}>
            <Grid gridDefinition={definition} disableGutters={disableGutters}>
              {definition.map((item, index) => (
                <div key={index} className={item.push || item.pull ? `${styles.cell} ${styles.moved}` : styles.cell}>
                  {index + 1}: {describe(item)}
                </div>
              ))}
            </Grid>
          </div>
        </section>
      ))}
    </div>
  );
}
