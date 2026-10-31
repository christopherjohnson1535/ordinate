// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Toggle from '~components/toggle';

import styles from '../form-controls.module.scss';

export default function TogglePermutations() {
  const [scaling, setScaling] = useState(true);
  const [alerts, setAlerts] = useState(false);

  return (
    <article className={styles.page}>
      <h1>Toggle</h1>

      <section className={styles.section}>
        <h2>States</h2>
        <table className={styles.grid}>
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Default</th>
              <th scope="col">Disabled</th>
              <th scope="col">Read-only</th>
            </tr>
          </thead>
          <tbody>
            {[false, true].map(checked => (
              <tr key={String(checked)}>
                <th scope="row">{checked ? 'on' : 'off'}</th>
                {[{}, { disabled: true }, { readOnly: true }].map((props, index) => (
                  <td key={index}>
                    <Toggle checked={checked} {...props}>
                      Auto-scaling
                    </Toggle>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2>Interactive</h2>
        <div className={styles.form}>
          <Toggle
            checked={scaling}
            onChange={event => setScaling(event.detail.checked)}
            description="Adds nodes when CPU stays above 70% for five minutes."
          >
            Auto-scaling
          </Toggle>
          <FormField label="Alerts" description="Applies to every region.">
            <Toggle checked={alerts} onChange={event => setAlerts(event.detail.checked)}>
              Page the on-call engineer
            </Toggle>
          </FormField>
        </div>
      </section>
    </article>
  );
}
