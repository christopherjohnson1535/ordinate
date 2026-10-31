// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import RadioButton from '~components/radio-button';
import RadioGroup, { RadioGroupProps } from '~components/radio-group';

import styles from '../form-controls.module.scss';

const plans: RadioGroupProps.Item[] = [
  { value: 'free', label: 'Free', description: 'One project and community support.' },
  { value: 'team', label: 'Team', description: 'Up to 20 people.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Contact sales to upgrade.', disabled: true },
];

const sizes: RadioGroupProps.Item[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export default function RadioGroupPermutations() {
  const [plan, setPlan] = useState<string | null>('team');
  const [size, setSize] = useState<string | null>(null);
  const [backup, setBackup] = useState('daily');

  return (
    <article className={styles.page}>
      <h1>Radio group</h1>

      <section className={styles.section}>
        <h2>In a form field</h2>
        <div className={styles.form}>
          <FormField label="Plan" description="You can change it later.">
            <RadioGroup value={plan} items={plans} onChange={event => setPlan(event.detail.value)} />
          </FormField>
          <FormField label="Node size" constraintText="No selection yet.">
            <RadioGroup
              value={size}
              items={sizes}
              direction="horizontal"
              onChange={event => setSize(event.detail.value)}
            />
          </FormField>
          <FormField label="Region" description="Set by your organization.">
            <RadioGroup value="medium" items={sizes} readOnly={true} />
          </FormField>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Standalone radio buttons</h2>
        <div className={styles.stack} role="radiogroup" aria-label="Backups">
          {['hourly', 'daily', 'weekly'].map(value => (
            <RadioButton
              key={value}
              name="backup"
              value={value}
              checked={backup === value}
              onSelect={() => setBackup(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </RadioButton>
          ))}
          <RadioButton name="backup" value="never" checked={false} disabled={true}>
            Never
          </RadioButton>
        </div>
      </section>
    </article>
  );
}
