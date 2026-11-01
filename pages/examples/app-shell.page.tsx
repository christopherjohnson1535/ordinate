// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Container from '~components/container';
import ExpandableSection from '~components/expandable-section';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Header from '~components/header';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import ProgressBar from '~components/progress-bar';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Tabs from '~components/tabs';
import TextContent from '~components/text-content';
import TitleBlock from '~components/title-block';
import TopNavigation from '~components/top-navigation';

import styles from './app-shell.module.scss';

const logo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<rect width="28" height="28" fill="#131416"/><path d="M14 5v18M5 14h18" stroke="#fff" stroke-width="2"/></svg>'
  );

const followWithoutReload = (navigate: (href: string) => void) => (event: CustomEvent<{ href?: string }>) => {
  event.preventDefault();
  if (event.detail.href) {
    navigate(event.detail.href);
  }
};

type Status = 'running' | 'restarting';

const restartDuration = 2500;

// Holds the project status and the page's notifications. A restart starts from the click
// handler; the effect only owns the timer that finishes it.
function useProject() {
  const [status, setStatus] = useState<Status>('running');
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>(() => [
    {
      id: 'maintenance',
      type: 'info',
      header: 'Scheduled maintenance on November 4',
      content: 'Nodes in us-mountain-1 restart one at a time between 02:00 and 04:00 MST.',
      dismissible: true,
    },
  ]);
  const show = (item: FlashbarProps.MessageDefinition) =>
    setItems(current => [item, ...current.filter(existing => existing.id !== item.id)]);

  const restart = () => {
    setStatus('restarting');
    show({
      id: 'restart',
      type: 'in-progress',
      loading: true,
      header: 'Restarting north-annex',
      content: 'Draining connections before each node restarts.',
    });
  };

  useEffect(() => {
    if (status !== 'restarting') {
      return;
    }
    const timer = window.setTimeout(() => {
      setStatus('running');
      show({
        id: 'restart',
        type: 'success',
        header: 'north-annex restarted',
        content: 'All 20 nodes are healthy.',
        dismissible: true,
      });
    }, restartDuration);
    return () => window.clearTimeout(timer);
  }, [status]);

  const flashes = items.map(item =>
    item.dismissible
      ? { ...item, onDismiss: () => setItems(current => current.filter(existing => existing.id !== item.id)) }
      : item
  );
  return { status, flashes, restart };
}

function DetailsTab({ status }: { status: Status }) {
  return (
    <SpaceBetween size="l">
      <Container header={<Header>Overview</Header>}>
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'Status',
              value:
                status === 'restarting' ? (
                  <StatusIndicator type="in-progress">Restarting</StatusIndicator>
                ) : (
                  <StatusIndicator type="success">Running</StatusIndicator>
                ),
            },
            { label: 'Region', value: 'us-mountain-1' },
            { label: 'Nodes', value: '20' },
            { label: 'Tier', value: 'Standard' },
            { label: 'Created', value: 'September 12, 2026' },
            { label: 'Endpoint', value: <Link href="#examples/app-shell">north-annex.ordinate.dev</Link> },
          ]}
        />
      </Container>
      <Container header={<Header description="Resets on the first of each month.">Usage this month</Header>}>
        <SpaceBetween size="m">
          <ProgressBar value={64} label="Compute hours" additionalInfo="6,400 of 10,000 hours" />
          <ProgressBar value={22} label="Storage" additionalInfo="220 of 1,000 GiB" />
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

function ActivityTab() {
  return (
    <Container header={<Header counter={<Badge>3</Badge>}>Recent events</Header>}>
      <SpaceBetween size="s">
        <ExpandableSection headerText="Node 14 replaced" defaultExpanded={true}>
          <Box color="text-body-secondary">The health check failed three times in a row, so the node was replaced.</Box>
        </ExpandableSection>
        <ExpandableSection headerText="Settings changed by Dana Ruiz">
          <Box color="text-body-secondary">Automatic scaling was turned off.</Box>
        </ExpandableSection>
        <ExpandableSection headerText="Certificate renewed">
          <Box color="text-body-secondary">The new certificate expires on October 2, 2027.</Box>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );
}

function ConnectTab() {
  return (
    <Container header={<Header>Connect from the command line</Header>}>
      <TextContent>
        <p>Install the client, then sign in with your project key.</p>
        <pre>ordinate login --project north-annex</pre>
        <p>
          Read the <a href="#examples/app-shell">connection guide</a> for proxies and private networks.
        </p>
      </TextContent>
    </Container>
  );
}

// The phase 2 gate: an application shell with navigation, tabs and notifications, built only from Ordinate.
export default function AppShell() {
  const [activeHref, setActiveHref] = useState('#/projects');
  const [activeTabId, setActiveTabId] = useState('details');
  const [search, setSearch] = useState('');
  const { status, flashes, restart } = useProject();
  const navigate = followWithoutReload(setActiveHref);

  return (
    <div className={styles.frame}>
      <div className={styles.top}>
        <TopNavigation
          identity={{
            href: '#/',
            title: 'Annex Console',
            logo: { src: logo, alt: 'Annex' },
            onFollow: event => {
              event.preventDefault();
              setActiveHref('#/dashboard');
            },
          }}
          search={
            <Input
              type="search"
              value={search}
              placeholder="Search projects"
              ariaLabel="Search projects"
              onChange={event => setSearch(event.detail.value)}
            />
          }
          utilities={[
            {
              type: 'button',
              text: 'Docs',
              href: '#/docs',
              external: true,
              externalIconAriaLabel: 'Opens in a new tab',
            },
            { type: 'button', iconName: 'notification', ariaLabel: 'Notifications, 2 unread', badge: true },
            {
              type: 'menu-dropdown',
              text: 'Dana Ruiz',
              description: 'dana@annex.example',
              iconName: 'user-profile',
              items: [
                { id: 'profile', text: 'Profile' },
                { id: 'preferences', text: 'Preferences' },
                { id: 'signout', text: 'Sign out' },
              ],
            },
          ]}
        />
      </div>
      <div className={styles.side}>
        <SideNavigation
          header={{ text: 'Compute', href: '#/' }}
          activeHref={activeHref}
          onFollow={navigate}
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
            { type: 'link', text: 'Documentation', href: '#/docs', code: 'C-02', external: true },
          ]}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.body}>
          <SpaceBetween size="l">
            <Flashbar items={flashes} />
            <BreadcrumbGroup
              items={[
                { text: 'Compute', href: '#/' },
                { text: 'Projects', href: '#/projects' },
                { text: 'north-annex', href: '#/projects/north-annex' },
              ]}
              onFollow={navigate}
            />
            <Header
              variant="h1"
              description="Production environment for the annex."
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <ButtonDropdown
                    items={[
                      { id: 'restart', text: 'Restart', disabled: status === 'restarting' },
                      { id: 'snapshot', text: 'Take snapshot' },
                      { id: 'delete', text: 'Delete project' },
                    ]}
                    onItemClick={event => {
                      if (event.detail.id === 'restart') {
                        restart();
                      }
                    }}
                  >
                    Actions
                  </ButtonDropdown>
                  <Button variant="primary" href="#examples/settings-form">
                    Edit settings
                  </Button>
                </SpaceBetween>
              }
            >
              north-annex
            </Header>
            <Tabs
              activeTabId={activeTabId}
              onChange={event => setActiveTabId(event.detail.activeTabId)}
              tabs={[
                { id: 'details', label: 'Details', content: <DetailsTab status={status} /> },
                { id: 'activity', label: 'Activity', content: <ActivityTab /> },
                { id: 'connect', label: 'Connect', content: <ConnectTab /> },
                { id: 'logs', label: 'Logs', disabled: true, disabledReason: 'Logs are turned off for this project.' },
              ]}
            />
          </SpaceBetween>
        </div>
        <TitleBlock
          ariaLabel="Sheet"
          items={[
            { label: 'Project', value: 'north-annex' },
            { label: 'Sheet', value: 'A-02 Projects' },
            { label: 'Revision', value: '△3' },
            { label: 'Checked', value: 'D. Ruiz' },
          ]}
        />
      </div>
    </div>
  );
}
