// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Header from '@ordinate/components/header';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';
import Table, { TableProps } from '@ordinate/components/table';

interface Service {
  name: string;
  image: string;
  nodes: number;
}

const services: Service[] = [
  { name: 'north-annex-web', image: 'web:v2', nodes: 8 },
  { name: 'gallery-east', image: 'web:v2', nodes: 4 },
  { name: 'atrium-api', image: 'api:v7', nodes: 6 },
  { name: 'archive-batch', image: 'batch:v3', nodes: 0 },
];

// Tags come from the item's place in the full list, so sorting or paging never changes them.
const tagOf = (service: Service) => `S${services.indexOf(service) + 1}`;

export default function RowTags() {
  const [opened, setOpened] = useState<Service | null>(null);

  const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
    {
      id: 'name',
      header: 'Name',
      // The link gives keyboard users the same way in as the row click.
      cell: item => (
        <Link
          href="#/components/table"
          onFollow={event => {
            event.preventDefault();
            setOpened(item);
          }}
        >
          {item.name}
        </Link>
      ),
      isRowHeader: true,
    },
    { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
    { id: 'nodes', header: 'Nodes', cell: item => item.nodes, contentType: 'number' },
  ];

  return (
    <SpaceBetween size="s">
      <Table
        items={services}
        columnDefinitions={columnDefinitions}
        trackBy="name"
        rowTag={tagOf}
        caption="Schedule of services"
        onRowClick={event => setOpened(event.detail.item)}
        header={<Header description="Click a row to open its notes.">Services</Header>}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {opened
          ? `Notes on ${tagOf(opened)}: ${opened.name} runs ${opened.image} on ${opened.nodes} nodes.`
          : 'No row opened.'}
      </Box>
    </SpaceBetween>
  );
}
