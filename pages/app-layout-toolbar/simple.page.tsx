// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayoutToolbar, { AppLayoutToolbarProps } from '~components/app-layout-toolbar';
import BreadcrumbGroup from '~components/breadcrumb-group';

import styles from './styles.module.scss';

const drawers: AppLayoutToolbarProps.Drawer[] = [
  { id: 'help', ariaLabel: 'Help panel', iconName: 'status-info' },
  { id: 'activity', ariaLabel: 'Activity', iconName: 'history' },
  { id: 'notifications', ariaLabel: 'Notifications', iconName: 'notification', badge: true },
];

const breadcrumbs = (
  <BreadcrumbGroup
    items={[
      { text: 'Compute', href: '#/' },
      { text: 'Projects', href: '#/projects' },
      { text: 'north-annex', href: '#/projects/north-annex' },
    ]}
    onFollow={event => event.preventDefault()}
  />
);

export default function AppLayoutToolbarSimple() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('activity');

  return (
    <article className={styles.page}>
      <h1>App layout toolbar</h1>
      <p className={styles.note}>
        The app layout uses this toolbar on narrow screens and in its toolbar variant. It can also stand alone above
        custom page frames.
      </p>
      <section className={styles.section}>
        <h2>Navigation toggle, breadcrumbs and drawer triggers</h2>
        <div className={styles.frame}>
          <AppLayoutToolbar
            breadcrumbs={breadcrumbs}
            navigationOpen={navigationOpen}
            onNavigationChange={event => setNavigationOpen(event.detail.open)}
            drawers={drawers}
            activeDrawerId={activeDrawerId}
            onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
          />
        </div>
        <p className={styles.note}>
          Navigation {navigationOpen ? 'open' : 'closed'}; active drawer: {activeDrawerId ?? 'none'}.
        </p>
      </section>
      <section className={styles.section}>
        <h2>Breadcrumbs only</h2>
        <div className={styles.frame}>
          <AppLayoutToolbar breadcrumbs={breadcrumbs} navigationHide={true} />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Narrow</h2>
        <div className={`${styles.frame} ${styles.narrow}`}>
          <AppLayoutToolbar
            breadcrumbs={breadcrumbs}
            navigationOpen={navigationOpen}
            onNavigationChange={event => setNavigationOpen(event.detail.open)}
            drawers={drawers}
            activeDrawerId={activeDrawerId}
            onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
          />
        </div>
      </section>
    </article>
  );
}
