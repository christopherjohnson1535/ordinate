// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '~collection-hooks';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import ContentLayout from '~components/content-layout';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Measure, { MeasureProps } from '~components/measure';
import Pagination from '~components/pagination';
import ProgressBar from '~components/progress-bar';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import Stamp from '~components/stamp';
import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';
import Table, { TableProps } from '~components/table';
import Tabs from '~components/tabs';
import TextContent from '~components/text-content';
import TitleBlock from '~components/title-block';
import TopNavigation from '~components/top-navigation';

import styles from './console.module.scss';

type Status = 'Running' | 'Starting' | 'Stopped' | 'Failed';

interface Service {
  name: string;
  status: Status;
  image: string;
  nodes: number;
}

const services: Service[] = [
  { name: 'north-annex-web', status: 'Running', image: 'web:v2', nodes: 8 },
  { name: 'gallery-east', status: 'Starting', image: 'web:v2', nodes: 4 },
  { name: 'atrium-api', status: 'Running', image: 'api:v7', nodes: 6 },
  { name: 'archive-batch', status: 'Stopped', image: 'batch:v3', nodes: 0 },
  { name: 'vault-store', status: 'Failed', image: 'store:v12', nodes: 2 },
  { name: 'lobby-cache', status: 'Running', image: 'cache:v4', nodes: 2 },
  { name: 'reading-room', status: 'Running', image: 'web:v2', nodes: 3 },
];

// Each service keeps its tag, S1 to S7, however the schedule is sorted, filtered or paged.
const serviceTag = (service: Service) => `S${services.indexOf(service) + 1}`;

const statusTypes: Record<Status, StatusIndicatorProps.State> = {
  Running: 'complete',
  Starting: 'underway',
  Stopped: 'halted',
  Failed: 'fault',
};

const metrics: MeasureProps[] = [
  { label: 'Nodes in service', value: 20, max: 32, unit: 'nodes' },
  { label: 'Requests per minute', value: 4210, description: 'last 24 h' },
  { label: 'Slowest 5% of requests', value: 182, unit: 'ms', max: 250, limit: 200, limitLabel: 'target 200 ms' },
  { label: 'Uptime', value: '99.98%', current: 99.98, max: 100, description: 'last 30 days' },
];

const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name', isRowHeader: true },
  {
    id: 'status',
    header: 'Status',
    cell: item => <StatusIndicator state={statusTypes[item.status]}>{item.status}</StatusIndicator>,
    sortingField: 'status',
  },
  { id: 'image', header: 'Image', cell: item => <Box variant="code">{item.image}</Box>, sortingField: 'image' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, sortingField: 'nodes' },
];

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'name', propertyLabel: 'Name', groupValuesLabel: 'Names', operators: [':', '!:', '=', '!='] },
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Statuses', operators: ['=', '!='] },
  { key: 'image', propertyLabel: 'Image', groupValuesLabel: 'Images', operators: ['=', '!=', '^'] },
  { key: 'nodes', propertyLabel: 'Nodes', groupValuesLabel: 'Node counts', operators: ['=', '>', '<', '>=', '<='] },
];

const contentDisplayOptions = columnDefinitions.map(({ id, header }) => ({
  id: id!,
  label: String(header),
  alwaysVisible: id === 'name',
}));

// The index of the drawing set: sheets numbered A-01 onwards, account pages in a second set.
const sheets: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Overview', href: '#/overview', code: 'A-01' },
  { type: 'link', text: 'Services', href: '#/services', code: 'A-02' },
  { type: 'link', text: 'Deployments', href: '#/deployments', code: 'A-03' },
  { type: 'link', text: 'Logs', href: '#/logs', code: 'A-04' },
  { type: 'link', text: 'Settings', href: '#/settings', code: 'A-05' },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Account',
    code: 'Set B',
    items: [
      { type: 'link', text: 'People and access', href: '#/people', code: 'B-01' },
      { type: 'link', text: 'Billing', href: '#/billing', code: 'B-02' },
    ],
  },
];

function findSheet(items: ReadonlyArray<SideNavigationProps.Item>, href: string): SideNavigationProps.Link | undefined {
  for (const item of items) {
    if (item.type === 'link' && item.href === href) {
      return item;
    }
    if (item.type === 'section-group') {
      const found = findSheet(item.items, href);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

function EmptyState({ title }: { title: string }) {
  return (
    <Box textAlign="center" color="text-body-secondary">
      <Box variant="strong">{title}</Box>
    </Box>
  );
}

interface ServicesTableProps {
  selected: Service | null;
  onSelect: (service: Service) => void;
}

function ServicesTable({ selected, onSelect }: ServicesTableProps) {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 5,
    stripedRows: false,
    contentDisplay: contentDisplayOptions.map(({ id }) => ({ id, visible: true })),
  });
  const { items, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(services, {
    propertyFiltering: {
      filteringProperties,
      empty: <EmptyState title="No services" />,
      noMatch: <EmptyState title="No services match the filter" />,
    },
    sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
    pagination: { pageSize: preferences.pageSize },
    selection: { trackBy: 'name' },
  });

  return (
    <Table
      {...collectionProps}
      selectedItems={selected ? [selected] : []}
      onSelectionChange={event => onSelect(event.detail.selectedItems[0])}
      items={items}
      caption="Schedule of services"
      rowTag={serviceTag}
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences.contentDisplay}
      stripedRows={preferences.stripedRows}
      selectionType="single"
      variant="container"
      ariaLabels={{ tableLabel: 'Services', itemSelectionLabel: (_, item) => `Select ${item.name}` }}
      header={
        <Header
          counter={`(${services.length})`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button disabled={!selected}>{selected ? `Restart ${serviceTag(selected)}` : 'Restart'}</Button>
              <Button variant="primary">Add service</Button>
            </SpaceBetween>
          }
        >
          Services
        </Header>
      }
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringPlaceholder="Find services"
          filteringAriaLabel="Find services"
          countText={filteredItemsCount === undefined ? undefined : `${filteredItemsCount} of ${services.length}`}
        />
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        <CollectionPreferences
          preferences={preferences}
          onConfirm={event => setPreferences(event.detail)}
          pageSizePreference={{
            title: 'Rows per page',
            options: [
              { value: 5, label: '5 services' },
              { value: 10, label: '10 services' },
            ],
          }}
          stripedRowsPreference={{}}
          contentDisplayPreference={{ title: 'Columns', options: contentDisplayOptions }}
        />
      }
    />
  );
}

function Overview() {
  return (
    <SpaceBetween size="l">
      <Container kind="configuration" reference="C1" heading="Environment" measure="4 settings">
        <KeyValuePairs
          columns={4}
          items={[
            { label: 'Environment', value: 'North Annex, production' },
            { label: 'Region', value: 'us-mountain-1' },
            { label: 'Nodes', value: '20 of 32' },
            { label: 'Revision', value: 'Set in the top bar' },
          ]}
        />
      </Container>
      <Container kind="resource" reference="R1" heading="Health" measure="Last 24 hours">
        <ColumnLayout columns={4} borders="vertical" variant="text-grid">
          {metrics.map(metric => (
            <Measure key={String(metric.label)} {...metric} />
          ))}
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}

// The phase 3 gate: the console page from Sheet 3 of the concept canvas, built only from Ordinate.
function ServiceDetail({ service }: { service: Service }) {
  return (
    <SpaceBetween size="l">
      <KeyValuePairs
        columns={1}
        items={[
          {
            label: 'Status',
            value: <StatusIndicator state={statusTypes[service.status]}>{service.status}</StatusIndicator>,
          },
          { label: 'Image', value: <Box variant="code">{service.image}</Box> },
          { label: 'Nodes', value: `${service.nodes} of 8` },
        ]}
      />
      {service.image === 'web:v2' && (
        <ProgressBar value={60} label="web:v2 is rolling out" additionalInfo="3 of 5 replicas are ready." />
      )}
    </SpaceBetween>
  );
}

export default function Console() {
  const [selectedService, setSelectedService] = useState<Service | null>(services[0]);
  const [activeHref, setActiveHref] = useState('#/services');
  const [activeTabId, setActiveTabId] = useState('services');
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [splitPanelPreferences, setSplitPanelPreferences] = useState<AppLayoutProps.SplitPanelPreferences>({
    position: 'side',
  });
  const [toolsOpen, setToolsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const sheet = findSheet(sheets, activeHref);
  const [flashes, setFlashes] = useState<FlashbarProps.MessageDefinition[]>([
    {
      id: 'vault-store',
      type: 'fault',
      header: 'vault-store failed its health check.',
      content: 'Check the logs before you redeploy it.',
      action: <Button onClick={() => setActiveTabId('logs')}>Open logs</Button>,
      dismissible: true,
      onDismiss: () => setFlashes([]),
    },
  ]);

  return (
    <div className={styles.region}>
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
          { type: 'button', text: 'Docs', href: '#/docs' },
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
      <div className={styles.layout}>
        <AppLayout
          disableBodyScroll={true}
          contentType="table"
          navigation={
            <SideNavigation
              header={{ text: 'North Annex', href: '#/' }}
              activeHref={activeHref}
              onFollow={event => {
                event.preventDefault();
                if (event.detail.href) {
                  setActiveHref(event.detail.href);
                }
              }}
              items={sheets}
            />
          }
          breadcrumbs={
            <BreadcrumbGroup
              items={[
                { text: 'Projects', href: '#/projects' },
                { text: 'North Annex', href: '#/projects/north-annex' },
              ]}
              onFollow={event => event.preventDefault()}
            />
          }
          notifications={<Flashbar items={flashes} />}
          titleBlock={
            <TitleBlock
              ariaLabel="Sheet"
              items={[
                { label: 'Project', value: 'North Annex, production' },
                { label: 'Sheet', value: sheet ? `${sheet.code} ${sheet.text}` : 'A-02 Services' },
                { label: 'Revision', value: '△2, 31 Oct 2026' },
                { label: 'Checked', value: 'D. Ruiz' },
              ]}
            />
          }
          tools={
            <HelpPanel header="Services">
              <p>Each service runs one image on a set of nodes. Restart a service to roll its nodes one at a time.</p>
            </HelpPanel>
          }
          toolsOpen={toolsOpen}
          onToolsChange={event => setToolsOpen(event.detail.open)}
          splitPanelOpen={splitPanelOpen}
          onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
          splitPanelPreferences={splitPanelPreferences}
          onSplitPanelPreferencesChange={event => setSplitPanelPreferences(event.detail)}
          splitPanel={
            selectedService && (
              <SplitPanel
                header={selectedService.name}
                headerTag={serviceTag(selectedService)}
                headerDescription="maxUnavailable 0, maxSurge 1"
              >
                <ServiceDetail service={selectedService} />
              </SplitPanel>
            )
          }
          content={
            <ContentLayout
              header={
                <Header
                  variant="h1"
                  code="Sheet A-02"
                  description="North Annex, production · us-mountain-1"
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button>Preview changes</Button>
                      <Button variant="primary">Deploy</Button>
                    </SpaceBetween>
                  }
                >
                  North Annex <Stamp type="success">Running</Stamp>
                </Header>
              }
            >
              <SpaceBetween size="l">
                <Overview />
                <Tabs
                  activeTabId={activeTabId}
                  onChange={event => setActiveTabId(event.detail.activeTabId)}
                  tabs={[
                    {
                      id: 'services',
                      label: 'Services',
                      content: <ServicesTable selected={selectedService} onSelect={setSelectedService} />,
                    },
                    {
                      id: 'deployments',
                      label: 'Deployments',
                      content: (
                        <Container>
                          <Box color="text-body-secondary">web:v2 is rolling out; see the Rollout panel.</Box>
                        </Container>
                      ),
                    },
                    {
                      id: 'logs',
                      label: 'Logs',
                      content: (
                        <Container kind="resource" reference="R2" heading="vault-store" measure="Last 3 lines">
                          <TextContent>
                            <pre>
                              {'14:02:11 health check failed: connection refused\n'}
                              {'14:02:41 health check failed: connection refused\n'}
                              {'14:03:11 marked unhealthy after 3 failures'}
                            </pre>
                          </TextContent>
                        </Container>
                      ),
                    },
                  ]}
                />
              </SpaceBetween>
            </ContentLayout>
          }
        />
      </div>
    </div>
  );
}
