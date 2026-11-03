// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import CollectionPreferences, { CollectionPreferencesProps } from '@ordinate/components/collection-preferences';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import Table, { TableProps } from '@ordinate/components/table';

interface Deployment {
  id: string;
  service: string;
  image: string;
  by: string;
  note: string;
}

const people = ['Dana Ruiz', 'Sam Okafor', 'Lee Park'];
const services = ['north-annex-web', 'atrium-api', 'archive-batch', 'lobby-cache'];

const deployments: Deployment[] = Array.from({ length: 18 }, (_, index) => ({
  id: `d-${1240 - index}`,
  service: services[index % services.length],
  image: `v${(index % 5) + 2}.${index % 3}`,
  by: people[index % people.length],
  note: index % 2 ? 'Scheduled release' : 'Raises the connection limit and moves logs to the new bucket',
}));

const columns: TableProps.ColumnDefinition<Deployment>[] = [
  { id: 'id', header: 'ID', cell: item => item.id, contentType: 'identifier', isRowHeader: true },
  { id: 'service', header: 'Service', cell: item => item.service },
  { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
  { id: 'by', header: 'Deployed by', cell: item => item.by },
  { id: 'note', header: 'Note', cell: item => item.note },
];

export default function TablePreferences() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 5,
    wrapLines: false,
    stripedRows: false,
    contentDensity: 'comfortable',
  });
  const { items, collectionProps, paginationProps } = useCollection(deployments, {
    pagination: { pageSize: preferences.pageSize },
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      columnDisplay={preferences.contentDisplay}
      wrapLines={preferences.wrapLines}
      stripedRows={preferences.stripedRows}
      contentDensity={preferences.contentDensity}
      header={<Header counter={`(${deployments.length})`}>Deployments</Header>}
      pagination={<Pagination {...paginationProps} />}
      preferences={
        <CollectionPreferences
          title="Deployment preferences"
          preferences={preferences}
          onConfirm={event => setPreferences(event.detail)}
          pageSizePreference={{
            options: [
              { value: 5, label: '5 deployments' },
              { value: 10, label: '10 deployments' },
            ],
          }}
          wrapLinesPreference={{}}
          stripedRowsPreference={{}}
          contentDensityPreference={{}}
          contentDisplayPreference={{
            options: columns.map(column => ({
              id: column.id!,
              label: String(column.header),
              alwaysVisible: column.id === 'id',
            })),
          }}
        />
      }
    />
  );
}
