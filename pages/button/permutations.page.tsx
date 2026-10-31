// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button, { ButtonProps } from '~components/button';

import styles from './styles.module.scss';

const variants: ButtonProps.Variant[] = ['normal', 'primary', 'link', 'destructive'];

const addIcon = (
  <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
    <path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function ButtonPermutations() {
  return (
    <article className={styles.page}>
      <h1>Button permutations</h1>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th scope="col">Variant</th>
            <th scope="col">Default</th>
            <th scope="col">Disabled</th>
            <th scope="col">Link</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(variant => (
            <tr key={variant}>
              <th scope="row">{variant}</th>
              <td>
                <Button variant={variant} formAction="none">
                  Save changes
                </Button>
              </td>
              <td>
                <Button variant={variant} formAction="none" disabled={true}>
                  Save changes
                </Button>
              </td>
              <td>
                <Button variant={variant} href="#button/permutations">
                  View log
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row">icon</th>
            <td>
              <Button variant="icon" formAction="none" ariaLabel="Add service" iconSvg={addIcon} />
            </td>
            <td>
              <Button variant="icon" formAction="none" ariaLabel="Add service" iconSvg={addIcon} disabled={true} />
            </td>
            <td />
          </tr>
        </tbody>
      </table>
      <div className={styles.full}>
        <Button variant="primary" formAction="none" fullWidth={true}>
          Full width
        </Button>
      </div>
    </article>
  );
}
