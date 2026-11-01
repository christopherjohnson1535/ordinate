// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Icon from '~components/icon';
import Token from '~components/token';

import styles from './styles.module.scss';

function DismissibleToken() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Token label="US East" description="Virginia" onDismiss={() => setVisible(false)} dismissLabel="Remove US East" />
  ) : (
    <button type="button" onClick={() => setVisible(true)}>
      Bring it back
    </button>
  );
}

export default function TokenPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Token</Box>

      <section className={styles.section}>
        <Box variant="h2">Normal</Box>
        <div className={styles.row}>
          <Token label="US East" />
          <DismissibleToken />
          <Token label="EU North" labelTag="eu-north-1" icon={<Icon name="globe" />} onDismiss={() => {}} />
          <Token
            label="AP South"
            description="Mumbai"
            tags={['3 zones', 'Low carbon']}
            icon={<Icon name="location-pin" />}
            onDismiss={() => {}}
          />
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Disabled and read-only</Box>
        <div className={styles.row}>
          <Token label="EU Central" description="Frankfurt" disabled={true} onDismiss={() => {}} />
          <Token label="EU Central" icon={<Icon name="globe" />} disabled={true} />
          <Token label="US West" description="Oregon" readOnly={true} onDismiss={() => {}} />
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Long label</Box>
        <div className={styles.narrow}>
          <Token
            label="A region with a name far too long to fit on one line"
            description="And a description that is long as well"
            onDismiss={() => {}}
          />
        </div>
      </section>

      <section className={styles.section}>
        <Box variant="h2">Inline</Box>
        <p className={styles.prose}>
          Compare <Token variant="inline" label="report.pdf" icon={<Icon name="file" size="small" />} /> with{' '}
          <Token variant="inline" label="summary.md" onDismiss={() => {}} /> and{' '}
          <span className={styles['inline-limit']}>
            <Token
              variant="inline"
              label="quarterly-telemetry-export-2026-10-31.parquet"
              tooltipContent="/archive/telemetry/2026/10/quarterly-telemetry-export-2026-10-31.parquet"
              onDismiss={() => {}}
            />
          </span>{' '}
          before the review, but leave out{' '}
          <Token variant="inline" label="draft.txt" disabled={true} onDismiss={() => {}} />.
        </p>
      </section>
    </div>
  );
}
