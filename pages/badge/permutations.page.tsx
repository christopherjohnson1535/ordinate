// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge, { BadgeProps } from '~components/badge';

import styles from './styles.module.scss';

const tones: BadgeProps.Tone[] = ['neutral', 'note', 'complete', 'fault'];

const severities: { tone: BadgeProps.Tone; label: string }[] = [
  { tone: 'critical', label: 'Critical' },
  { tone: 'high', label: 'High' },
  { tone: 'medium', label: 'Medium' },
  { tone: 'low', label: 'Low' },
  { tone: 'neutral', label: 'Neutral' },
];

export default function BadgePermutations() {
  return (
    <article className={styles.page}>
      <h1>Badge permutations</h1>
      <section className={styles.section}>
        <h2>Tones</h2>
        <div className={styles.row}>
          {tones.map(tone => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
          <Badge>12</Badge>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Severity</h2>
        <div className={styles.row}>
          {severities.map(({ tone, label }) => (
            <Badge key={tone} tone={tone}>
              {label}
            </Badge>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>In text</h2>
        <p>
          Query builder <Badge tone="note">Beta</Badge>
        </p>
        <h3 className={styles.heading}>
          Open findings <Badge>24</Badge>
        </h3>
      </section>
    </article>
  );
}
