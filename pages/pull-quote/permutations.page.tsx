// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PullQuote from '~components/pull-quote';

import styles from '../website-content.module.scss';

export default function PullQuotePermutations() {
  return (
    <article className={styles.page}>
      <h1>Pull quote permutations</h1>
      <section className={styles.section}>
        <h2>Hanging</h2>
        <div className={styles.measure}>
          <PullQuote variant="hanging" attribution="Mara Lindqvist, harbour master">
            We stopped fighting the water. The water was always going to win.
          </PullQuote>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Default, in the flow of text</h2>
        <div className={styles.stack}>
          <p className={styles.prose}>
            The storm took the sea wall in a single night. In the weeks after, the town met in the school hall to decide
            whether to build it again, higher and further out.
          </p>
          <div className={styles.measure}>
            <PullQuote attribution="Tomás Reyes, sail maker">The marsh is the wall now.</PullQuote>
          </div>
          <p className={styles.prose}>
            They chose the marsh. Three years on, the samphire is back, and so are the people who come to pick it.
          </p>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Ruled, several paragraphs, no attribution</h2>
        <div className={styles.measure}>
          <PullQuote variant="ruled">
            <p>Bread takes the time it takes.</p>
            <p>We just stopped pretending otherwise.</p>
          </PullQuote>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <PullQuote variant="hanging" attribution="Mara Lindqvist">
            We stopped fighting the water. The water was always going to win.
          </PullQuote>
        </div>
      </section>
    </article>
  );
}
