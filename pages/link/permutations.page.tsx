// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Link, { LinkProps } from '~components/link';

import styles from './styles.module.scss';

const fontSizes: LinkProps.FontSize[] = [
  'body-s',
  'body-m',
  'heading-xs',
  'heading-s',
  'heading-m',
  'heading-l',
  'heading-xl',
  'display-l',
];

export default function LinkPermutations() {
  const [followed, setFollowed] = useState<string>();

  return (
    <article className={styles.page}>
      <h1>Link permutations</h1>
      <p>
        The{' '}
        <Link variant="primary" href="#link/permutations">
          deployment guide
        </Link>{' '}
        explains each step. Check the{' '}
        <Link variant="primary" href="https://example.com" external={true} externalIconAriaLabel="Opens in a new tab">
          status page
        </Link>{' '}
        before you start.
      </p>
      <ul className={styles.list}>
        <li>
          <Link href="#link/permutations">Secondary link</Link>
        </li>
        <li>
          <Link href="https://example.com" external={true} externalIconAriaLabel="Opens in a new tab">
            Secondary external link
          </Link>
        </li>
        <li>
          Capacity <Link variant="info">Info</Link>
        </li>
        <li>
          <Link variant="value-large" href="#link/permutations" ariaLabel="12 running projects">
            12
          </Link>
        </li>
        <li>
          <Link
            onFollow={event => {
              event.preventDefault();
              setFollowed('Followed the button link');
            }}
          >
            Link without href
          </Link>
          {followed && <span> {followed}</span>}
        </li>
      </ul>
      <div className={styles.sizes}>
        {fontSizes.map(fontSize => (
          <Link key={fontSize} href="#link/permutations" fontSize={fontSize} variant="primary">
            {fontSize}
          </Link>
        ))}
      </div>
      <div className={styles.inverted}>
        <Link color="inverted" variant="primary" href="#link/permutations">
          Inverted primary
        </Link>
        <Link color="inverted" href="#link/permutations">
          Inverted secondary
        </Link>
      </div>
    </article>
  );
}
