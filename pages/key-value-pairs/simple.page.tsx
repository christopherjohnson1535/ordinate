// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import KeyValuePairs, { KeyValuePairsProps } from '~components/key-value-pairs';
import Link from '~components/link';
import ProgressBar from '~components/progress-bar';
import StatusIndicator from '~components/status-indicator';

import styles from './styles.module.scss';

const pairs: KeyValuePairsProps.Pair[] = [
  { label: 'Instance ID', value: 'i-0f3a2c91d4' },
  { label: 'State', value: <StatusIndicator type="success">Running</StatusIndicator> },
  {
    label: 'Region',
    value: 'north-annex',
    info: (
      <Link variant="info" href="#">
        Info
      </Link>
    ),
  },
  { label: 'Image', value: <Link href="#">ordinate-base-2026.10</Link> },
  {
    label: 'Disk used',
    value: <ProgressBar variant="key-value" value={72} additionalInfo="144 of 200 GB" ariaLabel="Disk used" />,
  },
  { label: 'Launched', value: '31 October 2026, 09:14 UTC' },
  { label: 'Owner', value: 'platform-team@north-annex.example' },
  { label: 'Tags', value: 'env:prod, team:platform, cost-centre:4410' },
];

const grouped: KeyValuePairsProps['items'] = [
  {
    type: 'group',
    title: 'Network',
    items: [
      { label: 'Private address', value: '10.0.4.12' },
      { label: 'Public address', value: '203.0.113.40' },
      { label: 'Subnet', value: 'subnet-7' },
    ],
  },
  {
    type: 'group',
    title: 'Storage',
    items: [
      { label: 'Root volume', value: 'vol-0a4e, 50 GB' },
      { label: 'Data volume', value: 'vol-77c1, 200 GB' },
    ],
  },
  {
    type: 'group',
    title: 'Security',
    items: [
      { label: 'Key pair', value: 'deploy-2026' },
      { label: 'Groups', value: 'web, ssh-bastion' },
    ],
  },
];

export default function KeyValuePairsSimple() {
  return (
    <article className={styles.page}>
      <h1>Key-value pairs</h1>

      {([1, 2, 3, 4] as const).map(columns => (
        <section key={columns} className={styles.section}>
          <h2>
            {columns} {columns === 1 ? 'column' : 'columns'}
          </h2>
          <Container heading="Instance details">
            <KeyValuePairs columns={columns} items={pairs} ariaLabel="Instance details" />
          </Container>
        </section>
      ))}

      <section className={styles.section}>
        <h2>Groups</h2>
        <Container heading="Configuration">
          <KeyValuePairs columns={3} items={grouped} />
        </Container>
      </section>

      <section className={styles.section}>
        <h2>Four columns in a narrow space</h2>
        <div className={styles.narrow}>
          <Container>
            <KeyValuePairs columns={4} items={pairs.slice(0, 4)} />
          </Container>
        </div>
      </section>
    </article>
  );
}
