// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Spinner, { SpinnerProps } from '~components/spinner';

import styles from './styles.module.scss';

const sizes: SpinnerProps.Size[] = ['normal', 'big', 'large'];
const variants: SpinnerProps.Variant[] = ['normal', 'disabled'];

export default function SpinnerPermutations() {
  return (
    <article className={styles.page}>
      <h1>Spinner permutations</h1>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th scope="col">Variant</th>
            {sizes.map(size => (
              <th key={size} scope="col">
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map(variant => (
            <tr key={variant}>
              <th scope="row">{variant}</th>
              {sizes.map(size => (
                <td key={size}>
                  <Spinner size={size} variant={variant} />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row">inverted</th>
            {sizes.map(size => (
              <td key={size}>
                <span className={styles.inverted}>
                  <Spinner size={size} variant="inverted" />
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p>
        <Spinner /> Loading instances
      </p>
      <div>
        <Button variant="primary" formAction="none">
          <Spinner variant="inverted" /> Deploying
        </Button>
      </div>
    </article>
  );
}
