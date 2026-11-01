// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HowItWorks, { HowItWorksProps } from '~components/how-it-works';

import styles from './styles.module.scss';

const repair: HowItWorksProps.Step[] = [
  { title: 'Book a slot', description: 'Pick a time online or call the shop. Same-week slots most weeks.' },
  { title: 'Get a quote', description: 'We check the bike with you and price the work before we start.' },
  { title: 'Ride home', description: 'Most repairs are done the same day. We text you when it is ready.' },
];

function Wheel({ spokes }: { spokes: number }) {
  return (
    <svg width="96" height="64" viewBox="0 0 96 64" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="48" cy="32" r="26" strokeWidth="1.5" />
      {Array.from({ length: spokes }, (_, index) => {
        const angle = (index / spokes) * Math.PI;
        return (
          <path
            key={index}
            d={`M${48 - 26 * Math.cos(angle)} ${32 - 26 * Math.sin(angle)}L${48 + 26 * Math.cos(angle)} ${32 + 26 * Math.sin(angle)}`}
            strokeWidth="0.75"
          />
        );
      })}
    </svg>
  );
}

function Example({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// A bike shop's repair process, side by side, stacked, with drawings, and with more steps than fit
// in a row.
export default function HowItWorksPermutations() {
  return (
    <div className={styles.page}>
      <Example title="Horizontal, three steps">
        <h3 className={styles.heading}>How a repair works</h3>
        <HowItWorks steps={repair} headingLevel={4} />
      </Example>
      <Example title="Vertical">
        <div className={styles.narrow}>
          <HowItWorks steps={repair} orientation="vertical" ariaLabel="How a repair works" />
        </div>
      </Example>
      <Example title="With drawings">
        <HowItWorks steps={repair.map((step, index) => ({ ...step, media: <Wheel spokes={(index + 1) * 3} /> }))} />
      </Example>
      <Example title="Ten steps, wrapping">
        <HowItWorks
          orientation="vertical"
          steps={Array.from({ length: 10 }, (_, index) => ({
            title: `Step ${index + 1}`,
            description:
              index % 3 === 0 ? 'A longer description that wraps onto a second line at this width.' : undefined,
          }))}
        />
      </Example>
    </div>
  );
}
