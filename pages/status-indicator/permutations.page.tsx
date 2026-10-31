// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';

import styles from './styles.module.scss';

const types: { type: StatusIndicatorProps.Type; label: string }[] = [
  { type: 'error', label: 'Failed' },
  { type: 'warning', label: 'Degraded' },
  { type: 'success', label: 'Running' },
  { type: 'info', label: 'Scheduled' },
  { type: 'stopped', label: 'Stopped' },
  { type: 'pending', label: 'Pending' },
  { type: 'in-progress', label: 'Provisioning' },
  { type: 'loading', label: 'Loading' },
];

const colors: StatusIndicatorProps.Color[] = ['red', 'yellow', 'green', 'blue', 'grey'];

const longText = 'Waiting for north-annex-04 to finish draining connections before the restart';

export default function StatusIndicatorPermutations() {
  return (
    <article className={styles.page}>
      <h1>Status indicator permutations</h1>
      <section className={styles.section}>
        <h2>Types</h2>
        {types.map(({ type, label }) => (
          <div key={type}>
            <StatusIndicator type={type}>{label}</StatusIndicator>
          </div>
        ))}
      </section>
      <section className={styles.section}>
        <h2>Color override</h2>
        {colors.map(color => (
          <div key={color}>
            <StatusIndicator type="in-progress" colorOverride={color}>
              In progress, {color}
            </StatusIndicator>
          </div>
        ))}
      </section>
      <section className={styles.section}>
        <h2>Icon label</h2>
        <div>
          <StatusIndicator type="error" iconAriaLabel="Error">
            2 minutes ago
          </StatusIndicator>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Long text</h2>
        <div className={styles.narrow}>
          <StatusIndicator type="pending">{longText}</StatusIndicator>
        </div>
        <div className={styles.narrow}>
          <StatusIndicator type="pending" wrapText={false}>
            {longText}
          </StatusIndicator>
        </div>
      </section>
    </article>
  );
}
