// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Media from '~components/media';
import Plate from '~components/plate';

import { chairPhoto, harbourPhoto, PlanDrawing } from '../website-content-samples';

import styles from '../website-content.module.scss';

export default function PlatePermutations() {
  return (
    <article className={styles.page}>
      <h1>Plate permutations</h1>
      <section className={styles.section}>
        <h2>Selected work</h2>
        <div className={styles.columns}>
          <Plate
            headingLevel={2}
            href="#harbour-house"
            media={<Media src={harbourPhoto} alt="" aspectRatio="4:5" />}
            label="Plate I"
            title="Harbour House"
            meta="Lisbon, 2025"
            description="A net loft turned into a family home, keeping the original timber frame."
          />
          <Plate
            headingLevel={2}
            href="#oak-chair"
            media={<Media src={chairPhoto} alt="" aspectRatio="4:5" />}
            label="Plate II"
            title="Oak chair, no. 4"
            meta="Furniture, 2024"
          />
          <Plate
            headingLevel={2}
            href="#ground-floor"
            media={
              <Media aspectRatio="4:5" fit="contain">
                <PlanDrawing title="Plan of the reading room" />
              </Media>
            }
            label="Plate III"
            title="Reading room"
            meta="Porto, 2023"
            description="Drawings for a small public library."
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Without a link, without a picture, title only</h2>
        <div className={styles.columns}>
          <Plate
            media={<Media placeholderText="Photo to come" aspectRatio="3:2" />}
            label="Plate IV"
            title="Studio in the hills"
            meta="Sintra, 2026"
            description="Under construction."
          />
          <Plate label="No. 14" title="Plate without media" meta="2022" />
          <Plate title="Just a title" />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.narrow}>
          <Plate
            href="#harbour-house"
            media={<Media placeholderText="Photo" aspectRatio="4:3" />}
            label="Plate I"
            title="Harbour House and the long name of a project"
            meta="Lisbon, Portugal, 2025"
            description="A net loft turned into a family home."
          />
        </div>
      </section>
    </article>
  );
}
