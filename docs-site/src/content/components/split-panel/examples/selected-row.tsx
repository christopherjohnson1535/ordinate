// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import SplitPanel from '@ordinate/components/split-panel';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table from '@ordinate/components/table';

interface Service {
  tag: string;
  name: string;
  image: string;
  nodes: number;
  state: StatusIndicatorProps.State;
  status: string;
}

const services: Service[] = [
  { tag: 'S1', name: 'north-annex-web', image: 'web:v2', nodes: 8, state: 'complete', status: 'Running' },
  { tag: 'S2', name: 'atrium-api', image: 'api:v7', nodes: 6, state: 'complete', status: 'Running' },
  { tag: 'S3', name: 'vault-store', image: 'store:v12', nodes: 2, state: 'fault', status: 'Failed' },
];

export default function SelectedRow() {
  const [selected, setSelected] = useState<Service[]>([services[2]]);
  const [open, setOpen] = useState(true);
  const service = selected[0];

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      toolsHide={true}
      contentType="table"
      splitPanelOpen={open}
      onSplitPanelToggle={event => setOpen(event.detail.open)}
      splitPanel={
        <SplitPanel
          header={service ? service.name : 'No service selected'}
          headerTag={service?.tag}
          headerDescription={service ? `${service.image} on ${service.nodes} nodes` : undefined}
        >
          {service ? (
            <KeyValuePairs
              columns={2}
              items={[
                { label: 'Status', value: <StatusIndicator state={service.state}>{service.status}</StatusIndicator> },
                { label: 'Region', value: 'us-mountain-1' },
              ]}
            />
          ) : (
            'Select a service to see its details.'
          )}
        </SplitPanel>
      }
      content={
        <Table
          variant="full-page"
          header="Services"
          items={services}
          trackBy="name"
          rowTag={item => item.tag}
          selectionType="single"
          selectedItems={selected}
          onSelectionChange={event => setSelected(event.detail.selectedItems)}
          columnDefinitions={[
            { id: 'name', header: 'Name', cell: item => item.name },
            { id: 'image', header: 'Image', cell: item => item.image },
            { id: 'status', header: 'Status', cell: item => item.status },
          ]}
        />
      }
    />
  );
}
