// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TextFilter, { TextFilterProps } from '~components/text-filter';

import styles from './styles.module.scss';

const instances = [
  'web-frontend-01',
  'web-frontend-02',
  'api-gateway',
  'billing-worker',
  'search-indexer',
  'metrics-collector',
  'mail-relay',
  'cache-primary',
  'cache-replica',
];

function Controlled({ filteringText: initial = '', ...rest }: Partial<TextFilterProps>) {
  const [filteringText, setFilteringText] = useState(initial);
  return (
    <TextFilter
      {...rest}
      filteringText={filteringText}
      onChange={event => setFilteringText(event.detail.filteringText)}
    />
  );
}

function FilteredList() {
  const [filteringText, setFilteringText] = useState('');
  const [delayedText, setDelayedText] = useState('');
  const matches = instances.filter(name => name.includes(filteringText.trim().toLowerCase()));
  return (
    <div className={styles.stack}>
      <TextFilter
        filteringText={filteringText}
        filteringPlaceholder="Find instances"
        filteringAriaLabel="Find instances"
        countText={`${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
        onChange={event => setFilteringText(event.detail.filteringText)}
        onDelayedChange={event => setDelayedText(event.detail.filteringText)}
      />
      <ul className={styles.list}>
        {matches.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p className={styles.note}>Delayed change: “{delayedText}”</p>
    </div>
  );
}

export default function TextFilterPermutations() {
  return (
    <article className={styles.page}>
      <h1>Text filter</h1>
      <section className={styles.section}>
        <h2>Filtering a list</h2>
        <FilteredList />
      </section>
      <section className={styles.section}>
        <h2>States</h2>
        <div className={styles.stack}>
          <Controlled filteringPlaceholder="Find instances" filteringAriaLabel="Empty" />
          <Controlled filteringText="cache" countText="2 matches" filteringAriaLabel="With text and count" />
          <Controlled filteringText="a long filter that keeps on going" countText="0 matches" />
          <Controlled filteringText="cache" countText="2 matches" disabled={true} filteringAriaLabel="Disabled" />
          <Controlled filteringPlaceholder="Find instances" disabled={true} filteringAriaLabel="Disabled, empty" />
        </div>
      </section>
    </article>
  );
}
