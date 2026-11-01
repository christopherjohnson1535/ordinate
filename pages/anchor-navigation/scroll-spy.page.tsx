// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnchorNavigation, { AnchorNavigationProps } from '~components/anchor-navigation';
import Box from '~components/box';

import styles from './styles.module.scss';

const anchors: AnchorNavigationProps.Anchor[] = [
  { text: 'Overview', href: '#overview', level: 1 },
  { text: 'Survey method', href: '#method', level: 1 },
  { text: 'Baseline', href: '#baseline', level: 2 },
  { text: 'Triangulation', href: '#triangulation', level: 2, info: 'Updated' },
  { text: 'Angles and stations', href: '#angles', level: 3 },
  { text: 'Levelling', href: '#levelling', level: 2 },
  { text: 'Results', href: '#results', level: 1, info: 'New' },
  { text: 'Plates', href: '#plates', level: 1 },
  { text: 'Errata', href: '#errata', level: 1 },
];

const paragraph =
  'The base line was measured twice with steel tapes held at a constant tension, and corrected for temperature and slope. Each bay was checked against the standard before the next was laid out, and the two measurements agreed to within a few parts in a million.';

export default function AnchorNavigationScrollSpy() {
  const [events, setEvents] = useState<string[]>([]);
  const [controlled, setControlled] = useState('#baseline');

  return (
    <div className={styles.layout}>
      <article className={styles.article}>
        <h1>Anchor navigation</h1>
        {anchors.map(anchor => {
          const Heading = anchor.level === 1 ? 'h2' : anchor.level === 2 ? 'h3' : 'h4';
          return (
            <section key={anchor.href} className={styles.section}>
              <Heading id={anchor.href.slice(1)}>{anchor.text}</Heading>
              <p>{paragraph}</p>
              {anchor.level === 1 && <p>{paragraph}</p>}
            </section>
          );
        })}
      </article>
      <aside className={styles.aside}>
        <div className={styles.panel}>
          <h2 id="toc-title" className={styles['panel-title']}>
            On this page
          </h2>
          <AnchorNavigation
            anchors={anchors}
            ariaLabelledby="toc-title"
            scrollSpyOffset={56}
            onActiveHrefChange={({ detail }) => setEvents(current => [...current.slice(-2), detail.href])}
          />
          <Box variant="small" color="text-body-secondary">
            Active changes: {events.join(', ') || 'none'}
          </Box>
        </div>
        <div className={styles.panel}>
          <h2 id="controlled-title" className={styles['panel-title']}>
            Controlled, following cancelled
          </h2>
          <AnchorNavigation
            anchors={anchors.slice(0, 6)}
            ariaLabelledby="controlled-title"
            activeHref={controlled}
            onFollow={event => {
              event.preventDefault();
              setControlled(event.detail.href);
            }}
          />
        </div>
      </aside>
    </div>
  );
}
