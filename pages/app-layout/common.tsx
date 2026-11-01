// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import Container from '~components/container';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import KeyValuePairs from '~components/key-value-pairs';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

// The dev shell already frames each page, so the demos give the layout a region of fixed
// height and set `disableBodyScroll`, which makes the layout scroll inside that region.
export function DemoFrame({ children, narrow = false }: { children: React.ReactNode; narrow?: boolean }) {
  return <div className={narrow ? `${styles.frame} ${styles.narrow}` : styles.frame}>{children}</div>;
}

export function DemoPage({
  title,
  description,
  controls,
  children,
}: {
  title: string;
  description: React.ReactNode;
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className={styles.page}>
      <h1>{title}</h1>
      <p className={styles.note}>{description}</p>
      {controls && <div className={styles.controls}>{controls}</div>}
      {children}
    </article>
  );
}

export function Navigation() {
  const [activeHref, setActiveHref] = useState('#/projects');
  return (
    <SideNavigation
      header={{ text: 'Compute', href: '#/' }}
      activeHref={activeHref}
      onFollow={event => {
        event.preventDefault();
        if (event.detail.href) {
          setActiveHref(event.detail.href);
        }
      }}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/dashboard', code: 'A-01' },
        { type: 'link', text: 'Projects', href: '#/projects', code: 'A-02' },
        {
          type: 'section',
          text: 'Networking',
          code: 'Set B',
          items: [
            { type: 'link', text: 'Endpoints', href: '#/endpoints', code: 'B-01' },
            { type: 'link', text: 'Firewalls', href: '#/firewalls', code: 'B-02' },
          ],
        },
        { type: 'divider' },
        { type: 'link', text: 'Billing', href: '#/billing', code: 'C-01' },
      ]}
    />
  );
}

export function Breadcrumbs({ current = 'north-annex' }: { current?: string }) {
  return (
    <BreadcrumbGroup
      items={[
        { text: 'Compute', href: '#/' },
        { text: 'Projects', href: '#/projects' },
        { text: current, href: '#/projects/north-annex' },
      ]}
      onFollow={event => event.preventDefault()}
    />
  );
}

export function Help() {
  return (
    <HelpPanel
      header="Projects"
      footer={
        <>
          <h3>Learn more</h3>
          <ul>
            <li>
              <a href="#/docs/projects">Working with projects</a>
            </li>
            <li>
              <a href="#/docs/regions">Choosing a region</a>
            </li>
          </ul>
        </>
      }
    >
      <p>A project groups the nodes, endpoints and storage of one environment. Each project runs in a single region.</p>
      <h3>Status</h3>
      <ul>
        <li>
          <strong>Running</strong>: every node passed its last health check.
        </li>
        <li>
          <strong>Restarting</strong>: nodes restart one at a time.
        </li>
      </ul>
      <p>
        Use <code>ordinate status</code> to check a project from the command line.
      </p>
    </HelpPanel>
  );
}

export function ProjectContent({ sections = 3, info }: { sections?: number; info?: React.ReactNode }) {
  return (
    <SpaceBetween size="l">
      <Header variant="h1" info={info} description="Production environment for the annex.">
        north-annex
      </Header>
      {Array.from({ length: sections }, (_, index) => (
        <Container key={index} header={<Header>{index === 0 ? 'Overview' : `Section ${index + 1}`}</Header>}>
          <KeyValuePairs
            columns={3}
            items={[
              { label: 'Region', value: 'us-mountain-1' },
              { label: 'Nodes', value: '20' },
              { label: 'Tier', value: 'Standard' },
              { label: 'Created', value: 'September 12, 2026' },
              { label: 'Owner', value: 'Dana Ruiz' },
              { label: 'Endpoint', value: 'north-annex.ordinate.dev' },
            ]}
          />
        </Container>
      ))}
    </SpaceBetween>
  );
}
