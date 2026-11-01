// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Figure from '~components/figure';
import Media from '~components/media';

import { harbourPhoto, PlanDrawing } from '../website-content-samples';

import styles from '../website-content.module.scss';

export default function FigurePermutations() {
  return (
    <article className={styles.page}>
      <h1>Figure permutations</h1>
      <section className={styles.section}>
        <h2>Label, caption and credit</h2>
        <div className={styles.split}>
          <Figure
            media={<Media src={harbourPhoto} alt="Harbour houses seen from the water" aspectRatio="16:9" />}
            label="Fig. 1"
            caption="The east quay at low tide, with the net lofts restored in 2024 on the right."
            credit="Photo: Ana Ruiz"
          />
          <Figure
            media={
              <Media aspectRatio="4:3" fit="contain">
                <PlanDrawing />
              </Media>
            }
            label="Plate III"
            caption="Ground floor, as surveyed."
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Caption only, credit only, no caption</h2>
        <div className={styles.columns}>
          <Figure media={<Media placeholderText="Photo" />} caption="Morning light in the reading room." />
          <Figure media={<Media placeholderText="Photo" />} credit="Courtesy of the town archive" />
          <Figure media={<Media placeholderText="Photo" />} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <Figure
            media={<Media placeholderText="Photo" aspectRatio="1:1" />}
            label="Fig. 12"
            caption="A long caption that has to wrap over several lines when the figure sits in a phone-width column."
            credit="Photo: Ana Ruiz"
          />
        </div>
      </section>
    </article>
  );
}
