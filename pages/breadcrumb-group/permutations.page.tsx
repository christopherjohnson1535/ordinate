// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '~components/breadcrumb-group';

import styles from './styles.module.scss';

const items: BreadcrumbGroupProps.Item[] = [
  { text: 'Projects', href: '#/projects' },
  { text: 'north-annex', href: '#/projects/north-annex' },
  { text: 'Nodes', href: '#/projects/north-annex/nodes' },
  { text: 'na-01', href: '#/projects/north-annex/nodes/na-01' },
  { text: 'Logs', href: '#/projects/north-annex/nodes/na-01/logs' },
];

export default function BreadcrumbGroupPermutations() {
  const [followed, setFollowed] = useState<string>();
  const onFollow: BreadcrumbGroupProps['onFollow'] = event => {
    event.preventDefault();
    setFollowed(event.detail.href);
  };

  return (
    <article className={styles.page}>
      <h1>Breadcrumb group</h1>

      <section className={styles.section}>
        <h2>Full path</h2>
        <BreadcrumbGroup items={items} onFollow={onFollow} />
        <p className={styles.note}>Last followed: {followed ?? 'nothing yet'}</p>
      </section>

      <section className={styles.section}>
        <h2>Two levels</h2>
        <BreadcrumbGroup items={items.slice(0, 2)} onFollow={onFollow} />
      </section>

      <section className={styles.section}>
        <h2>Current page only</h2>
        <BreadcrumbGroup items={items.slice(0, 1)} />
      </section>

      <section className={styles.section}>
        <h2>Collapsed in a narrow space</h2>
        <div className={styles.narrow}>
          <BreadcrumbGroup items={items} onFollow={onFollow} />
        </div>
        <div className={styles.narrower}>
          <BreadcrumbGroup
            items={[...items.slice(0, 4), { text: 'A very long log stream name for the current page', href: '#' }]}
            onFollow={onFollow}
          />
        </div>
      </section>
    </article>
  );
}
