// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Media from '~components/media';
import Testimonial from '~components/testimonial';

import { harbourPhoto } from '../website-content-samples';

import styles from '../website-content.module.scss';

export default function TestimonialPermutations() {
  return (
    <article className={styles.page}>
      <h1>Testimonial permutations</h1>
      <p className={styles.prose}>
        Sample quotes for the dev page only. On a real site, use real words with permission.
      </p>
      <section className={styles.section}>
        <h2>Default and accent</h2>
        <div className={styles.columns}>
          <Testimonial
            quote="They had my bike back the same afternoon, and explained exactly what they'd done."
            name="Priya S."
            detail="Riverside"
            media={<Media src={harbourPhoto} alt="" aspectRatio="1:1" />}
          />
          <Testimonial
            tone="accent"
            quote="The best sourdough in the neighbourhood. I plan my Saturdays around it."
            name="Sam O."
            detail="Owner, Corner Books"
            media={<Media aspectRatio="1:1" />}
          />
          <Testimonial quote="Friendly, quick and fairly priced." name="Jo" />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Quote only, several paragraphs</h2>
        <div className={styles.columns}>
          <Testimonial quote="Honest advice." />
          <Testimonial
            quote={
              <>
                <p>I came in for a flat tire and left knowing how to fix one myself.</p>
                <p>That's the kind of shop this is.</p>
              </>
            }
            name="Ana R."
            detail="Old Town"
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <Testimonial
            tone="accent"
            quote="They had my bike back the same afternoon, and explained exactly what they'd done."
            name="Priya Subramanian-Whitfield"
            detail="Riverside, a long neighbourhood name"
            media={<Media aspectRatio="1:1" />}
          />
        </div>
      </section>
    </article>
  );
}
