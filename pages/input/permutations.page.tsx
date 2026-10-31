// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Input, { InputProps } from '~components/input';

import styles from './styles.module.scss';

function Controlled(props: Omit<InputProps, 'value' | 'onChange'> & { initial?: string }) {
  const { initial = '', ...rest } = props;
  const [value, setValue] = useState(initial);
  return <Input {...rest} value={value} onChange={event => setValue(event.detail.value)} />;
}

const states: { label: string; props: Partial<InputProps> }[] = [
  { label: 'Default', props: {} },
  { label: 'Read-only', props: { readOnly: true } },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Invalid', props: { invalid: true } },
  { label: 'Warning', props: { warning: true } },
];

export default function InputPermutations() {
  const [lastKey, setLastKey] = useState('');
  const [submitted, setSubmitted] = useState('');

  return (
    <article className={styles.page}>
      <h1>Input permutations</h1>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th scope="col">State</th>
            <th scope="col">Text</th>
            <th scope="col">Search</th>
            <th scope="col">Inline label</th>
          </tr>
        </thead>
        <tbody>
          {states.map(({ label, props }) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>
                <Controlled {...props} ariaLabel={`${label} text`} initial="north-annex" />
              </td>
              <td>
                <Controlled {...props} type="search" ariaLabel={`${label} search`} initial="north" />
              </td>
              <td>
                <Controlled {...props} inlineLabelText="Region" initial="us-mountain-1" />
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row">Empty</th>
            <td>
              <Controlled ariaLabel="Empty text" placeholder="Project name" />
            </td>
            <td>
              <Controlled type="search" ariaLabel="Empty search" placeholder="Find projects" />
            </td>
            <td>
              <Controlled inlineLabelText="Region" placeholder="Choose a region" />
            </td>
          </tr>
        </tbody>
      </table>

      <section className={styles.section}>
        <h2>Native hints</h2>
        <div className={styles.fields}>
          <Controlled ariaLabel="Nodes, in steps of 2" type="number" step={2} inputMode="numeric" initial="4" />
          <Controlled ariaLabel="Any decimal" type="number" step="any" inputMode="decimal" initial="0.25" />
          <Controlled
            ariaLabel="Host name, no autocorrect"
            disableBrowserAutocorrect={true}
            spellcheck={false}
            initial="api.north-annex.internal"
          />
          <Controlled ariaLabel="Email" type="email" inputMode="email" autoComplete="email" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Key events</h2>
        <div className={styles.fields}>
          <Controlled
            ariaLabel="Press Enter to submit"
            placeholder="Press Enter to submit"
            onKeyDown={event => {
              setLastKey(event.detail.key);
              if (event.detail.key === 'Enter') {
                event.preventDefault();
                setSubmitted(new Date().toLocaleTimeString());
              }
            }}
          />
        </div>
        <p>
          Last key: {lastKey || 'none'}. Last submitted: {submitted || 'never'}.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Search with a custom clear label</h2>
        <div className={styles.fields}>
          <Controlled type="search" ariaLabel="Find logs" clearAriaLabel="Clear log search" initial="timeout" />
        </div>
      </section>
    </article>
  );
}
