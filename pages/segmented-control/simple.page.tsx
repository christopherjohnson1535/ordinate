// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';

import styles from './styles.module.scss';

const periods: SegmentedControlProps.Option[] = [
  { id: 'day', text: 'Day' },
  { id: 'week', text: 'Week' },
  { id: 'month', text: 'Month' },
  { id: 'year', text: 'Year' },
];

const views: SegmentedControlProps.Option[] = [
  { id: 'list', iconName: 'list-view', iconAlt: 'List' },
  { id: 'grid', iconName: 'grid-view', iconAlt: 'Grid' },
  { id: 'map', iconName: 'map', iconAlt: 'Map' },
];

const layouts: SegmentedControlProps.Option[] = [
  { id: 'horizontal', text: 'Horizontal', iconName: 'layout-horizontal' },
  { id: 'vertical', text: 'Vertical', iconName: 'layout-vertical' },
  { id: 'full', text: 'Full', iconName: 'layout-full', disabled: true },
];

function Example({ initial, ...props }: Omit<SegmentedControlProps, 'selectedId'> & { initial: string | null }) {
  const [selectedId, setSelectedId] = useState(initial);
  return (
    <SegmentedControl {...props} selectedId={selectedId} onChange={event => setSelectedId(event.detail.selectedId)} />
  );
}

export default function SegmentedControlSimple() {
  return (
    <article className={styles.page}>
      <h1>Segmented control</h1>
      <section className={styles.section}>
        <h2>Text</h2>
        <Example label="Period" options={periods} initial="week" />
      </section>
      <section className={styles.section}>
        <h2>Icons only</h2>
        <Example label="View" options={views} initial="grid" />
      </section>
      <section className={styles.section}>
        <h2>Icons and text, one disabled</h2>
        <Example label="Layout" options={layouts} initial="horizontal" />
      </section>
      <section className={styles.section}>
        <h2>Selected segment disabled</h2>
        <Example label="Layout" options={layouts} initial="full" />
      </section>
      <section className={styles.section}>
        <h2>Nothing selected</h2>
        <Example label="Period" options={periods} initial={null} />
      </section>
      <section className={styles.section}>
        <h2>Labelled by visible text, in a toolbar</h2>
        <div className={styles.toolbar}>
          <span id="segmented-range-label" className={styles.label}>
            Range
          </span>
          <Example ariaLabelledby="segmented-range-label" options={periods.slice(0, 3)} initial="day" />
          <Example label="View" options={views.slice(0, 2)} initial="list" />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow container</h2>
        <div className={styles.narrow}>
          <Example label="Layout" options={layouts} initial="vertical" />
        </div>
      </section>
    </article>
  );
}
