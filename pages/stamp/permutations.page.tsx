// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Header from '~components/header';
import Stamp, { StampProps } from '~components/stamp';
import Table from '~components/table';

import styles from './styles.module.scss';

const types: { type: StampProps.Type; text: string }[] = [
  { type: 'complete', text: 'Approved' },
  { type: 'caution', text: 'Expiring' },
  { type: 'fault', text: 'Failed' },
  { type: 'note', text: 'For review' },
  { type: 'neutral', text: 'Archived' },
  { type: 'draft', text: 'Draft' },
];

const services = [
  {
    name: 'north-annex-web',
    state: (
      <Stamp type="complete" size="small" rotation="none">
        Running
      </Stamp>
    ),
  },
  {
    name: 'vault-store',
    state: (
      <Stamp type="fault" size="small" rotation="none">
        Failed
      </Stamp>
    ),
  },
  {
    name: 'archive-batch',
    state: (
      <Stamp type="neutral" size="small" rotation="none">
        Stopped
      </Stamp>
    ),
  },
];

export default function StampPermutations() {
  return (
    <article className={styles.page}>
      <h1>Stamp permutations</h1>
      {(['medium', 'small'] as const).map(size => (
        <section key={size} className={styles.section}>
          <h2>Types, {size}</h2>
          <div className={styles.row}>
            {types.map(({ type, text }) => (
              <Stamp key={type} type={type} size={size}>
                {text}
              </Stamp>
            ))}
          </div>
          <div className={styles.row}>
            {types.map(({ type, text }) => (
              <Stamp key={type} type={type} size={size} rotation="none">
                {text}
              </Stamp>
            ))}
          </div>
        </section>
      ))}
      <section className={styles.section}>
        <h2>On a sheet</h2>
        <div className={styles.sheet}>
          <div className={styles.row}>
            {types.map(({ type, text }) => (
              <Stamp key={type} type={type}>
                {text}
              </Stamp>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Beside a page title</h2>
        <Header variant="h1" description="North Annex, production · us-mountain-1">
          North Annex <Stamp type="complete">Running</Stamp>
        </Header>
        <Header variant="h2">
          Release notes, rev 4{' '}
          <Stamp type="draft" size="small">
            Draft
          </Stamp>
        </Header>
      </section>
      <section className={styles.section}>
        <h2>In a table and in text</h2>
        <Table
          variant="embedded"
          items={services}
          columnDefinitions={[
            { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
            { id: 'state', header: 'State', cell: item => item.state },
          ]}
          ariaLabels={{ tableLabel: 'Services' }}
        />
        <Box>
          The plan was{' '}
          <Stamp type="note" size="small">
            Issued
          </Stamp>{' '}
          on Monday and can no longer be edited.
        </Box>
        <Box>
          A very long stamp in a narrow column is cut short:{' '}
          <span style={{ display: 'inline-block', inlineSize: 120 }}>
            <Stamp type="caution" size="small">
              Awaiting second signature
            </Stamp>
          </span>
        </Box>
      </section>
    </article>
  );
}
