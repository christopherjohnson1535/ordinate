// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Container from '~components/container';
import Tabs, { TabsProps } from '~components/tabs';

import styles from '../form-controls.module.scss';

const projectTabs: TabsProps.Tab[] = [
  { id: 'overview', label: 'Overview', content: 'Twelve nodes in us-mountain-1, last deployed two hours ago.' },
  { id: 'nodes', label: 'Nodes', content: 'na-01, na-02 and na-03 are running.' },
  { id: 'logs', label: 'Logs', content: 'No errors in the last 24 hours.' },
  { id: 'billing', label: 'Billing', disabled: true, disabledReason: 'Only project owners can see billing.' },
];

const manyTabs: TabsProps.Tab[] = Array.from({ length: 16 }, (_, index) => ({
  id: `zone-${index + 1}`,
  label: `Zone us-mountain-${index + 1}`,
  content: `Capacity report for zone ${index + 1}.`,
}));

export default function TabsPermutations() {
  const [active, setActive] = useState('overview');
  const [queries, setQueries] = useState([1, 2, 3]);
  const [activeQuery, setActiveQuery] = useState('query-1');

  const queryTabs: TabsProps.Tab[] = queries.map(query => ({
    id: `query-${query}`,
    label: `Query ${query}`,
    content: `SELECT * FROM nodes WHERE zone = ${query};`,
    dismissible: true,
    dismissLabel: `Close Query ${query}`,
    onDismiss: () => setQueries(current => current.filter(item => item !== query)),
    action:
      query === 1 ? (
        <Button variant="icon" iconName="edit" ariaLabel={`Rename Query ${query}`} formAction="none" />
      ) : null,
  }));

  return (
    <article className={styles.page}>
      <h1>Tabs</h1>

      <section className={styles.section}>
        <h2>Default</h2>
        <Tabs
          ariaLabel="Project"
          kind="resource"
          tabs={projectTabs.map((tab, index) => ({ ...tab, reference: `R${index + 1}` }))}
          activeTabId={active}
          onChange={event => setActive(event.detail.activeTabId)}
        />
      </section>

      <section className={styles.section}>
        <h2>Container</h2>
        <Tabs ariaLabel="Project details" variant="container" kind="configuration" tabs={projectTabs} />
      </section>

      <section className={styles.section}>
        <h2>Stacked</h2>
        <div>
          <Tabs ariaLabel="Settings" variant="stacked" tabs={projectTabs.slice(0, 3)} />
          <Tabs ariaLabel="More settings" variant="stacked" tabs={projectTabs.slice(1, 3)} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Dismissible with an action</h2>
        <Tabs
          ariaLabel="Queries"
          variant="container"
          tabs={queryTabs}
          activeTabId={activeQuery}
          onChange={event => setActiveQuery(event.detail.activeTabId)}
        />
      </section>

      <section className={styles.section}>
        <h2>Overflowing</h2>
        <Tabs ariaLabel="Zones" tabs={manyTabs} />
      </section>

      <section className={styles.section}>
        <h2>Links, without content padding</h2>
        <Container>
          <Tabs
            ariaLabel="Sections"
            disableContentPaddings={true}
            tabs={[
              { id: 'a', label: 'Summary', href: '#tabs/permutations', content: 'Summary content' },
              { id: 'b', label: 'History', href: '#tabs/permutations', content: 'History content' },
            ]}
          />
        </Container>
      </section>
    </article>
  );
}
