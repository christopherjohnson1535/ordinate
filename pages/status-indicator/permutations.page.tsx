// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';

import styles from './styles.module.scss';

const types: { type: StatusIndicatorProps.State; label: string }[] = [
  { type: 'fault', label: 'Failed' },
  { type: 'caution', label: 'Degraded' },
  { type: 'complete', label: 'Running' },
  { type: 'note', label: 'Scheduled' },
  { type: 'halted', label: 'Stopped' },
  { type: 'waiting', label: 'Pending' },
  { type: 'underway', label: 'Provisioning' },
  { type: 'loading', label: 'Loading' },
];

const colors: StatusIndicatorProps.Tone[] = ['fault', 'caution', 'complete', 'note', 'neutral'];

const longText = 'Waiting for north-annex-04 to finish draining connections before the restart';

export default function StatusIndicatorPermutations() {
  return (
    <article className={styles.page}>
      <h1>Status indicator permutations</h1>
      <section className={styles.section}>
        <h2>States</h2>
        {types.map(({ type, label }) => (
          <div key={type}>
            <StatusIndicator state={type}>{label}</StatusIndicator>
          </div>
        ))}
      </section>
      <section className={styles.section}>
        <h2>Tone</h2>
        {colors.map(color => (
          <div key={color}>
            <StatusIndicator state="underway" tone={color}>
              In progress, {color}
            </StatusIndicator>
          </div>
        ))}
      </section>
      <section className={styles.section}>
        <h2>Icon label</h2>
        <div>
          <StatusIndicator state="fault" iconAriaLabel="Error">
            2 minutes ago
          </StatusIndicator>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Long text</h2>
        <div className={styles.narrow}>
          <StatusIndicator state="waiting">{longText}</StatusIndicator>
        </div>
        <div className={styles.narrow}>
          <StatusIndicator state="waiting" wrapText={false}>
            {longText}
          </StatusIndicator>
        </div>
      </section>
    </article>
  );
}
