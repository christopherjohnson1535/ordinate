// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import StatusIndicator from '~components/status-indicator';
import TitleBlock, { TitleBlockProps } from '~components/title-block';

import styles from './styles.module.scss';

const sheet: TitleBlockProps.Item[] = [
  { label: 'Project', value: 'North Annex, production' },
  { label: 'Sheet', value: 'A-02 Services' },
  { label: 'Revision', value: <Link href="#title-block/simple">△2, 31 Oct 2026</Link> },
  { label: 'Drawn', value: 'M. Okafor' },
  { label: 'Checked', value: 'D. Ruiz' },
  { label: 'Status', value: <StatusIndicator state="complete">Issued</StatusIndicator> },
];

const bakery: TitleBlockProps.Item[] = [
  { label: 'Order', value: '#2041' },
  { label: 'Collect', value: 'Saturday, 9:30' },
  { label: 'Shop', value: 'Hill Street' },
];

export default function TitleBlockSimple() {
  return (
    <article className={styles.page}>
      <h1>Title block</h1>

      <section className={styles.section}>
        <h2>Automatic columns</h2>
        <p className={styles.note}>Every cell shares one row while there is room.</p>
        <div className={styles.sheet}>
          <TitleBlock items={sheet} ariaLabel="Sheet details" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Three columns</h2>
        <div className={styles.sheet}>
          <TitleBlock items={sheet} columns={3} ariaLabel="Sheet details" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Narrow: the cells stack into a grid</h2>
        <div className={`${styles.sheet} ${styles.narrow}`}>
          <TitleBlock items={sheet} ariaLabel="Sheet details" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Few cells, on its own</h2>
        <TitleBlock items={bakery} ariaLabel="Order" />
      </section>
    </article>
  );
}
