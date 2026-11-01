// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Media, { MediaProps } from '~components/media';

import { chairPhoto, harbourPhoto, logoPicture, PlanDrawing } from '../website-content-samples';

import styles from '../website-content.module.scss';

const ratios: MediaProps.AspectRatio[] = ['1:1', '4:3', '3:2', '16:9', '4:5', 'auto'];

export default function MediaPermutations() {
  return (
    <article className={styles.page}>
      <h1>Media permutations</h1>
      <section className={styles.section}>
        <h2>Placeholders in every shape</h2>
        <div className={styles.columns}>
          {ratios.map(ratio => (
            <Media key={ratio} aspectRatio={ratio} placeholderText={`Photo ${ratio}`} />
          ))}
          <Media />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Images: cover and contain</h2>
        <div className={styles.columns}>
          <Media src={harbourPhoto} alt="Harbour houses seen from the water" aspectRatio="4:5" />
          <Media src={chairPhoto} alt="An oak chair against a pale wall" aspectRatio="16:9" fit="contain" />
          <Media src={logoPicture} alt="Corner Cycles" aspectRatio="1:1" fit="contain" />
          <Media src={harbourPhoto} alt="Harbour houses seen from the water" aspectRatio="auto" />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Your own content</h2>
        <div className={styles.columns}>
          <Media aspectRatio="3:2" fit="contain">
            <PlanDrawing />
          </Media>
          <Media aspectRatio="16:9">
            <picture>
              <img src={harbourPhoto} alt="Harbour houses, from a picture element" />
            </picture>
          </Media>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <Media aspectRatio="4:3" placeholderText="Photo of the counter with fresh loaves, taken in the morning" />
        </div>
      </section>
    </article>
  );
}
