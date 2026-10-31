// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge, { BadgeProps } from '~components/badge';

import styles from './styles.module.scss';

const colors: BadgeProps.Color[] = ['grey', 'blue', 'green', 'red'];

const severities: { color: BadgeProps.Color; label: string }[] = [
  { color: 'severity-critical', label: 'Critical' },
  { color: 'severity-high', label: 'High' },
  { color: 'severity-medium', label: 'Medium' },
  { color: 'severity-low', label: 'Low' },
  { color: 'severity-neutral', label: 'Neutral' },
];

export default function BadgePermutations() {
  return (
    <article className={styles.page}>
      <h1>Badge permutations</h1>
      <section className={styles.section}>
        <h2>Colors</h2>
        <div className={styles.row}>
          {colors.map(color => (
            <Badge key={color} color={color}>
              {color}
            </Badge>
          ))}
          <Badge>12</Badge>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Severity</h2>
        <div className={styles.row}>
          {severities.map(({ color, label }) => (
            <Badge key={color} color={color}>
              {label}
            </Badge>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>In text</h2>
        <p>
          Query builder <Badge color="blue">Beta</Badge>
        </p>
        <h3 className={styles.heading}>
          Open findings <Badge>24</Badge>
        </h3>
      </section>
    </article>
  );
}
