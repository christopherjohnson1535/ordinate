// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '@ordinate/components/link';

import styles from './pager.module.scss';

interface Target {
  text: string;
  href: string;
}

/** Links to the previous and next sheets, at the foot of a guide. */
export function PagerLinks({ previous, next }: { previous?: Target; next?: Target }) {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav className={styles.pager} aria-label="Previous and next sheets">
      <div className={styles.previous}>
        {previous && (
          <>
            <span className={styles.label}>Previous sheet</span>
            <Link href={previous.href} fontSize="heading-s">
              {previous.text}
            </Link>
          </>
        )}
      </div>
      <div className={styles.next}>
        {next && (
          <>
            <span className={styles.label}>Next sheet</span>
            <Link href={next.href} fontSize="heading-s">
              {next.text}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
