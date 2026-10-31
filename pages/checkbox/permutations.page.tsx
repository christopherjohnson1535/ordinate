// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';

import styles from '../form-controls.module.scss';

const regions = ['us-mountain-1', 'us-coastal-2', 'eu-north-1'];

export default function CheckboxPermutations() {
  const [logging, setLogging] = useState(true);
  const [selected, setSelected] = useState<string[]>(['us-mountain-1']);

  const allSelected = selected.length === regions.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <article className={styles.page}>
      <h1>Checkbox</h1>

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
            {(['unchecked', 'checked', 'indeterminate'] as const).map(state => (
              <tr key={state}>
                <th scope="row">{state}</th>
                {[{}, { disabled: true }, { readOnly: true }].map((props, index) => (
                  <td key={index}>
                    <Checkbox checked={state === 'checked'} indeterminate={state === 'indeterminate'} {...props}>
                      Enable logging
                    </Checkbox>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2>Interactive</h2>
        <div className={styles.stack}>
          <Checkbox
            checked={logging}
            onChange={event => setLogging(event.detail.checked)}
            description="Keeps request logs for 30 days."
          >
            Enable logging
          </Checkbox>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={event => setSelected(event.detail.checked ? regions : [])}
          >
            All regions
          </Checkbox>
          <div className={styles.indent}>
            {regions.map(region => (
              <Checkbox
                key={region}
                checked={selected.includes(region)}
                onChange={event =>
                  setSelected(event.detail.checked ? [...selected, region] : selected.filter(value => value !== region))
                }
              >
                {region}
              </Checkbox>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>In a form field</h2>
        <div className={styles.form}>
          <FormField label="Notifications" description="Sent to the project owner.">
            <Checkbox checked={logging} onChange={event => setLogging(event.detail.checked)}>
              Email me about failed deploys
            </Checkbox>
          </FormField>
        </div>
      </section>
    </article>
  );
}
