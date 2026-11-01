// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import IndexList, { IndexListProps } from '~components/index-list';

import styles from '../website-content.module.scss';

const contents: IndexListProps.Item[] = [
  { id: 'tide', label: 'What the tide leaves behind', value: '4', href: '#tide' },
  { id: 'sail', label: 'The last sail maker on the east quay', value: '12', href: '#sail' },
  { id: 'walk', label: 'On walking slowly', value: '21', href: '#walk' },
  { id: 'letters', label: 'Letters', value: '28', href: '#letters' },
];

const prices: IndexListProps.Item[] = [
  { id: 'cut', label: 'Haircut', value: '$32', meta: 'Wash, cut and dry' },
  { id: 'beard', label: 'Beard trim', value: '$15' },
  { id: 'kids', label: 'Children under twelve', value: '$20' },
  { id: 'colour', label: 'Colour', value: 'Ask us' },
];

const projects: IndexListProps.Item[] = [
  { id: 'harbour', label: 'Harbour House', meta: 'Residential', value: '2025', href: '#harbour' },
  { id: 'library', label: 'Reading Room', meta: 'Public library', value: '2023', href: '#library' },
  { id: 'chair', label: 'Oak chair, no. 4', meta: 'Furniture', value: '2024', href: '#chair' },
  { id: 'hills', label: 'Studio in the Hills', meta: 'Workplace, under construction', value: '2026' },
];

export default function IndexListPermutations() {
  return (
    <article className={styles.page}>
      <h1>Index list permutations</h1>
      <section className={styles.section}>
        <h2>Leaders: contents and price list</h2>
        <div className={styles.columns}>
          <IndexList ariaLabel="Contents" ordered={true} items={contents} />
          <IndexList ariaLabel="Prices" items={prices} />
          <IndexList ariaLabel="Prices" size="large" items={prices.slice(0, 3)} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Numbered: project index</h2>
        <IndexList ariaLabel="Selected projects" variant="numbered" ordered={true} items={projects} />
      </section>
      <section className={styles.section}>
        <h2>Numbered, large, own numbers</h2>
        <IndexList
          ariaLabel="Work"
          variant="numbered"
          size="large"
          items={projects.map((project, index) => ({ ...project, number: `P-${index + 11}` }))}
        />
      </section>
      <section className={styles.section}>
        <h2>Numbered without numbers or meta</h2>
        <IndexList
          ariaLabel="Clients"
          variant="numbered"
          items={projects.map(({ id, label, value }) => ({ id, label, value }))}
        />
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={styles.columns}>
          <div className={styles.narrow}>
            <IndexList ariaLabel="Selected projects" variant="numbered" size="large" ordered={true} items={projects} />
          </div>
          <div className={styles.narrow}>
            <IndexList ariaLabel="Prices" items={prices} ordered={true} />
          </div>
        </div>
      </section>
    </article>
  );
}
