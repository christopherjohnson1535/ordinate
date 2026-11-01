// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnchorNavigation from '~components/anchor-navigation';
import Box from '~components/box';
import Button from '~components/button';
import Icon from '~components/icon';
import Input from '~components/input';
import NavigableGroup from '~components/navigable-group';
import Pagination from '~components/pagination';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';
import TopNavigation from '~components/top-navigation';
import TreeView, { TreeViewProps } from '~components/tree-view';

import { AnnexBreadcrumbs, SheetIndex } from './samples';
import { Cell, Group, Readout } from './specimen';

import styles from './specimen.module.scss';

function AnchorNavigationSpecimen() {
  const [activeHref, setActiveHref] = useState('#scope');
  return (
    <AnchorNavigation
      activeHref={activeHref}
      onFollow={event => {
        event.preventDefault();
        setActiveHref(event.detail.href);
      }}
      anchors={[
        { text: 'Scope of work', href: '#scope', level: 1 },
        { text: 'Site and access', href: '#site', level: 1 },
        { text: 'Parking for deliveries', href: '#parking', level: 2 },
        { text: 'Programme', href: '#programme', level: 1 },
      ]}
    />
  );
}

function NavigableGroupSpecimen() {
  const [tool, setTool] = useState('Select');
  return (
    <>
      <NavigableGroup
        navigationDirection="horizontal"
        role="toolbar"
        ariaLabel="Drawing tools"
        loopFocus={true}
        getItemKey={element => element.textContent ?? ''}
      >
        <SpaceBetween direction="horizontal" size="xs">
          {['Select', 'Line', 'Dimension', 'Note'].map(name => (
            <Button key={name} onClick={() => setTool(name)}>
              {name}
            </Button>
          ))}
        </SpaceBetween>
      </NavigableGroup>
      <Readout>Tool: {tool}. Tab in, then use the arrow keys.</Readout>
    </>
  );
}

function PaginationSpecimen() {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      currentPageIndex={page}
      pagesCount={12}
      onChange={event => setPage(event.detail.currentPageIndex)}
      ariaLabels={{
        nextPageLabel: 'Next page of bookings',
        previousPageLabel: 'Previous page of bookings',
        pageLabel: number => `Bookings, page ${number}`,
      }}
    />
  );
}

function TabsSpecimen() {
  const [activeTabId, setActiveTabId] = useState('services');
  return (
    <Tabs
      activeTabId={activeTabId}
      onChange={event => setActiveTabId(event.detail.activeTabId)}
      ariaLabel="North Annex"
      tabs={[
        { id: 'services', label: 'Services', content: 'Seven services, five running.' },
        { id: 'deployments', label: 'Deployments', content: 'web:v2 is rolling out, 3 of 5 replicas ready.' },
        { id: 'logs', label: 'Logs', content: '14:03 vault-store marked unhealthy after 3 failures.' },
      ]}
    />
  );
}

function TopNavigationSpecimen() {
  const [command, setCommand] = useState('');
  return (
    <div className={styles.site}>
      <TopNavigation
        identity={{ href: '#/', title: 'Annex Console', onFollow: event => event.preventDefault() }}
        search={
          <Input
            type="search"
            value={command}
            placeholder="Go to a service, sheet or command"
            ariaLabel="Command line"
            onChange={event => setCommand(event.detail.value)}
          />
        }
        utilities={[
          { type: 'button', text: 'Docs', href: '#/docs', onClick: event => event.preventDefault() },
          {
            type: 'menu-dropdown',
            text: 'Dana Ruiz',
            description: 'dana@annex.example',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
      />
    </div>
  );
}

interface Entry {
  id: string;
  name: string;
  detail?: string;
  children?: Entry[];
}

const drawings: Entry[] = [
  {
    id: 'hut-3',
    name: 'Hut No. 3',
    detail: '3 sets',
    children: [
      {
        id: 'hut-3/plans',
        name: 'Plans',
        children: [
          { id: 'hut-3/plans/ground', name: 'A-101 Ground floor', detail: 'Rev △2' },
          { id: 'hut-3/plans/roof', name: 'A-102 Roof', detail: 'Rev △1' },
        ],
      },
      { id: 'hut-3/elevations', name: 'Elevations', children: [{ id: 'hut-3/elevations/south', name: 'A-201 South' }] },
      { id: 'hut-3/schedule', name: 'Door schedule', detail: 'Draft' },
    ],
  },
  {
    id: 'reading-room',
    name: 'Reading room',
    detail: '1 set',
    children: [{ id: 'reading-room/a', name: 'A-101 Plan' }],
  },
];

function TreeViewSpecimen() {
  const [expanded, setExpanded] = useState<ReadonlyArray<string>>(['hut-3', 'hut-3/plans']);
  const onItemToggle: TreeViewProps<Entry>['onItemToggle'] = event => {
    const { id, expanded: isExpanded } = event.detail;
    setExpanded(current => (isExpanded ? [...current, id] : current.filter(other => other !== id)));
  };
  return (
    <TreeView
      items={drawings}
      ariaLabel="Drawings"
      getItemId={entry => entry.id}
      getItemChildren={entry => entry.children}
      expandedItems={expanded}
      onItemToggle={onItemToggle}
      renderItem={entry => ({
        content: entry.name,
        secondaryContent: entry.detail,
        icon: <Icon name={entry.children ? 'folder' : 'file'} />,
      })}
    />
  );
}

export default function NavigationGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Navigation">
      <Cell name="AnchorNavigation">
        <AnchorNavigationSpecimen />
      </Cell>
      <Cell name="BreadcrumbGroup">
        <AnnexBreadcrumbs />
      </Cell>
      <Cell name="NavigableGroup">
        <NavigableGroupSpecimen />
      </Cell>
      <Cell name="Pagination">
        <PaginationSpecimen />
      </Cell>
      <Cell name="SideNavigation">
        <Box>
          <SheetIndex />
        </Box>
      </Cell>
      <Cell name="Tabs">
        <TabsSpecimen />
      </Cell>
      <Cell name="TopNavigation" wide={true}>
        <TopNavigationSpecimen />
      </Cell>
      <Cell name="TreeView" wide={true}>
        <TreeViewSpecimen />
      </Cell>
    </Group>
  );
}
