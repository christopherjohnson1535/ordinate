// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Tiles, { TilesProps } from '~components/tiles';

import styles from '../form-controls.module.scss';

// Small elevation drawings of a rack, so the tiles show how images sit at the bottom.
function Rack({ units, label }: { units: number; label: string }) {
  return (
    <svg width="96" height="64" viewBox="0 0 96 64" role="img" aria-label={label} fill="none" stroke="currentColor">
      <rect x="28" y="4" width="40" height="56" strokeWidth="1.5" />
      {Array.from({ length: units }, (_, index) => (
        <g key={index}>
          <rect x="32" y={52 - index * 10} width="32" height="6" strokeWidth="1" />
          <circle cx="60" cy={55 - index * 10} r="1" fill="currentColor" stroke="none" />
        </g>
      ))}
      <path d="M20 60h56M24 4v56M22 4h4M22 60h4" strokeWidth="0.75" />
    </svg>
  );
}

const sizes: TilesProps.Item[] = [
  { value: 'small', label: 'Small', description: '2 vCPU, 4 GiB', image: <Rack units={1} label="One unit" /> },
  { value: 'medium', label: 'Medium', description: '8 vCPU, 32 GiB', image: <Rack units={3} label="Three units" /> },
  {
    value: 'large',
    label: 'Large',
    description: '32 vCPU, 128 GiB. Needs approval.',
    image: <Rack units={5} label="Five units" />,
    disabled: true,
  },
];

const plans: TilesProps.Item[] = [
  { value: 'free', label: 'Free', description: 'One project and community support.' },
  { value: 'team', label: 'Team', description: 'Up to 20 people, shared billing and audit logs.' },
  { value: 'business', label: 'Business', description: 'Single sign-on and a support plan.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Dedicated hardware and a named contact.' },
];

function useTile(initial: string | null) {
  const [value, setValue] = useState(initial);
  return { value, onChange: (event: { detail: TilesProps.ChangeDetail }) => setValue(event.detail.value) };
}

export default function TilesPermutations() {
  return (
    <article className={styles.page}>
      <h1>Tiles</h1>

      <section className={styles.section}>
        <h2>With images</h2>
        <FormField label="Node size" description="You can resize later.">
          <Tiles {...useTile('medium')} items={sizes} />
        </FormField>
      </section>

      <section className={styles.section}>
        <h2>Four tiles, default and four columns</h2>
        <FormField label="Plan" constraintText="No selection yet.">
          <Tiles {...useTile(null)} items={plans} />
        </FormField>
        <FormField label="Plan">
          <Tiles {...useTile('team')} items={plans} columns={4} />
        </FormField>
      </section>

      <section className={styles.section}>
        <h2>One column, read-only</h2>
        <FormField label="Plan" description="Set by your organization.">
          <Tiles value="business" items={plans} columns={1} readOnly={true} />
        </FormField>
      </section>
    </article>
  );
}
