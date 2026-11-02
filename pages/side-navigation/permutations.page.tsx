// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

import styles from './styles.module.scss';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '#/dashboard' },
  { type: 'link', text: 'Projects', href: '#/projects', info: <Badge tone="note">3</Badge> },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Compute',
    items: [
      { type: 'link', text: 'Nodes', href: '#/nodes' },
      { type: 'link', text: 'Images', href: '#/images' },
      { type: 'link', text: 'Autoscaling', href: '#/autoscaling' },
    ],
  },
  {
    type: 'section',
    text: 'Storage',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Volumes', href: '#/volumes' },
      { type: 'link', text: 'Snapshots', href: '#/snapshots' },
    ],
  },
  {
    type: 'section-group',
    title: 'Administration',
    items: [
      {
        type: 'link-group',
        text: 'Access',
        href: '#/access',
        items: [
          { type: 'link', text: 'Roles', href: '#/roles' },
          { type: 'link', text: 'Policies', href: '#/policies' },
        ],
      },
      {
        type: 'expandable-link-group',
        text: 'Billing',
        href: '#/billing',
        items: [
          { type: 'link', text: 'Invoices', href: '#/invoices' },
          { type: 'link', text: 'Payment methods', href: '#/payment-methods' },
        ],
      },
    ],
  },
  { type: 'divider' },
  { type: 'link', text: 'Documentation', href: 'https://example.com/docs', external: true },
];

// Codes number the sheets like a drawing index, and section codes letter the sets.
const sheetIndex: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Overview', href: '#/overview', code: 'A-01' },
  { type: 'link', text: 'Services', href: '#/services', code: 'A-02' },
  { type: 'link', text: 'Deployments', href: '#/deployments', code: 'A-03', info: <Badge tone="note">2</Badge> },
  {
    type: 'link-group',
    text: 'Logs',
    href: '#/logs',
    code: 'A-04',
    items: [
      { type: 'link', text: 'Requests', href: '#/logs/requests', code: 'A-04a' },
      { type: 'link', text: 'Audit trail', href: '#/logs/audit' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Account',
    code: 'Set B',
    items: [
      { type: 'link', text: 'People and access', href: '#/people', code: 'B-01' },
      { type: 'link', text: 'Billing', href: '#/billing', code: 'B-02' },
    ],
  },
  {
    type: 'section-group',
    title: 'Reference',
    code: 'Set C',
    items: [
      {
        type: 'expandable-link-group',
        text: 'Guides',
        href: '#/guides',
        code: 'C-01',
        items: [{ type: 'link', text: 'Rolling out an image', href: '#/guides/rollout', code: 'C-01a' }],
      },
      { type: 'link', text: 'Status page', href: 'https://example.com/status', code: 'C-02', external: true },
    ],
  },
];

export default function SideNavigationPermutations() {
  const [indexHref, setIndexHref] = useState('#/services');
  const [activeHref, setActiveHref] = useState('#/nodes');
  const [changes, setChanges] = useState<string[]>([]);

  const onFollow: SideNavigationProps['onFollow'] = event => {
    if (!event.detail.external) {
      event.preventDefault();
      setActiveHref(event.detail.href);
    }
  };

  return (
    <article className={styles.page}>
      <h1>Side navigation</h1>
      <div className={styles.row}>
        <section className={styles.section}>
          <h2>Header, sections and groups</h2>
          <div className={styles.frame}>
            <SideNavigation
              header={{ text: 'Ordinate Cloud', href: '#/' }}
              items={items}
              activeHref={activeHref}
              onFollow={onFollow}
              onChange={event =>
                setChanges(current => [
                  ...current.slice(-2),
                  `${'text' in event.detail.item ? event.detail.item.text : ''} ${event.detail.expanded ? 'expanded' : 'collapsed'}`,
                ])
              }
            />
          </div>
          <p className={styles.note}>Current: {activeHref}</p>
          <p className={styles.note}>Changes: {changes.join(', ') || 'none'}</p>
        </section>

        <section className={styles.section}>
          <h2>Sheet index with codes and sets</h2>
          <div className={styles.frame}>
            <SideNavigation
              header={{ text: 'North Annex', href: '#/' }}
              items={sheetIndex}
              activeHref={indexHref}
              onFollow={event => {
                if (!event.detail.external) {
                  event.preventDefault();
                  setIndexHref(event.detail.href);
                }
              }}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2>Logo, active link in a collapsed group</h2>
          <div className={styles.frame}>
            <SideNavigation
              header={{
                text: 'Survey office',
                href: '#/',
                logo: {
                  src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Crect x="1" y="1" width="22" height="22" fill="none" stroke="%23777" stroke-width="2"/%3E%3Cpath d="M12 4v16M4 12h16" stroke="%23777" stroke-width="2"/%3E%3C/svg%3E',
                  alt: '',
                },
              }}
              items={[
                {
                  type: 'expandable-link-group',
                  text: 'Plates',
                  href: '#/plates',
                  items: [
                    { type: 'link', text: 'Plate I: Elevation', href: '#/plates/1' },
                    { type: 'link', text: 'Plate II: Section through the boiler house', href: '#/plates/2' },
                  ],
                },
                { type: 'link', text: 'Field notes', href: '#/notes' },
              ]}
              activeHref="#/plates/2"
              onFollow={event => event.preventDefault()}
            />
          </div>
        </section>
      </div>
    </article>
  );
}
