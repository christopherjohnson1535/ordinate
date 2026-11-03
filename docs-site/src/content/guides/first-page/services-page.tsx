// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import ContentLayout from '@ordinate/components/content-layout';
import Header from '@ordinate/components/header';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import SideNavigation from '@ordinate/components/side-navigation';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';

interface Service {
  name: string;
  status: 'Running' | 'Restarting' | 'Stopped';
  image: string;
  nodes: number;
}

const initialServices: Service[] = [
  { name: 'north-annex-web', status: 'Running', image: 'web:v2', nodes: 8 },
  { name: 'atrium-api', status: 'Running', image: 'api:v7', nodes: 6 },
  { name: 'gallery-east', status: 'Running', image: 'web:v2', nodes: 4 },
  { name: 'archive-batch', status: 'Stopped', image: 'batch:v3', nodes: 0 },
];

const states: Record<Service['status'], StatusIndicatorProps.State> = {
  Running: 'complete',
  Restarting: 'underway',
  Stopped: 'halted',
};

const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true, contentType: 'identifier' },
  {
    id: 'status',
    header: 'Status',
    cell: item => <StatusIndicator state={states[item.status]}>{item.status}</StatusIndicator>,
  },
  { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, contentType: 'number' },
];

export default function ServicesPage() {
  const [activeHref, setActiveHref] = useState('#services');
  const [services, setServices] = useState(initialServices);
  const [selected, setSelected] = useState<Service[]>([]);
  const target = selected[0];

  const restart = () => {
    setServices(current => current.map(item => (item.name === target.name ? { ...item, status: 'Restarting' } : item)));
    setSelected([]);
  };

  return (
    <AppLayout
      disableBodyScroll={true}
      toolsHide={true}
      navigation={
        <SideNavigation
          header={{ text: 'North Annex', href: '#overview' }}
          activeHref={activeHref}
          onFollow={event => {
            event.preventDefault();
            setActiveHref(event.detail.href);
          }}
          items={[
            { type: 'link', text: 'Overview', href: '#overview' },
            { type: 'link', text: 'Services', href: '#services' },
            { type: 'link', text: 'Deployments', href: '#deployments' },
          ]}
        />
      }
      content={
        <ContentLayout header={<Header variant="h1">Services</Header>}>
          <SpaceBetween size="l">
            <Container kind="configuration" reference="C1" heading="Environment" measure="3 settings">
              <KeyValuePairs
                columns={3}
                items={[
                  { label: 'Project', value: 'North Annex' },
                  { label: 'Region', value: 'us-mountain-1' },
                  { label: 'Owner', value: 'Dana Ruiz' },
                ]}
              />
            </Container>
            <Table
              items={services}
              columnDefinitions={columnDefinitions}
              trackBy="name"
              kind="resource"
              reference="R1"
              selectionType="single"
              selectedItems={selected}
              onSelectionChange={event => setSelected(event.detail.selectedItems)}
              ariaLabels={{ itemSelectionLabel: (_, item) => `Select ${item.name}` }}
              header={
                <Header
                  counter={`(${services.length})`}
                  actions={
                    <Button disabled={!target} onClick={restart}>
                      Restart
                    </Button>
                  }
                >
                  Services
                </Header>
              }
              footer={
                <Box color="text-body-secondary" fontSize="body-s">
                  {target ? `${target.name} is picked.` : 'Pick a service to restart it.'}
                </Box>
              }
            />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
