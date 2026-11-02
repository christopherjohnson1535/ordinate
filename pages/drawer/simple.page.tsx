// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Drawer from '~components/drawer';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';

import styles from './styles.module.scss';

const events = [
  'Node 14 replaced after three failed health checks.',
  'Automatic scaling turned off by Dana Ruiz.',
  'Certificate renewed until October 2, 2027.',
  'Firewall rule web-ingress updated.',
  'Snapshot nightly-0412 completed.',
  'Endpoint north-annex.ordinate.dev verified.',
];

export default function DrawerSimple() {
  return (
    <article className={styles.page}>
      <h1>Drawer</h1>
      <p className={styles.note}>
        Drawers fill the panels the app layout opens from its drawer triggers. Each frame is a fixed-height drawer slot,
        so the footer stays at the bottom while the content scrolls.
      </p>
      <div className={styles.row}>
        <section className={styles.section}>
          <h2>Header, content and footer</h2>
          <div className={`${styles.frame} ${styles.tall}`}>
            <Drawer
              kind="resource"
              reference="R4"
              header="Activity"
              footer={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" formAction="none">
                    Clear
                  </Button>
                  <Button formAction="none">Done</Button>
                </SpaceBetween>
              }
            >
              <TextContent>
                <ul>
                  {events.map(event => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
                <p>Older events are kept for 30 days.</p>
              </TextContent>
            </Drawer>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Loading</h2>
          <div className={`${styles.frame} ${styles.tall}`}>
            <Drawer header="Assistant" loading={true} loadingText="Starting the assistant" />
          </div>
        </section>
        <section className={styles.section}>
          <h2>Without content paddings</h2>
          <div className={`${styles.frame} ${styles.tall}`}>
            <Drawer header="Recent nodes" disableContentPaddings={true}>
              <ul className={styles.list}>
                {['na-01', 'na-02', 'na-03', 'na-04'].map(node => (
                  <li key={node}>{node}</li>
                ))}
              </ul>
            </Drawer>
          </div>
        </section>
      </div>
    </article>
  );
}
