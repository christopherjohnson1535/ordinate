// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '@ordinate/components/header';
import Stamp, { StampProps } from '@ordinate/components/stamp';
import Table, { TableProps } from '@ordinate/components/table';

interface Drawing {
  number: string;
  title: string;
  revision: string;
  state: 'Issued' | 'Draft' | 'Superseded';
}

const drawings: Drawing[] = [
  { number: 'NA-101', title: 'Rack layout, hall A', revision: 'C', state: 'Issued' },
  { number: 'NA-102', title: 'Rack layout, hall B', revision: 'D', state: 'Draft' },
  { number: 'NA-110', title: 'Power distribution', revision: 'B', state: 'Issued' },
  { number: 'NA-087', title: 'Cooling plan', revision: 'A', state: 'Superseded' },
];

const types: Record<Drawing['state'], StampProps.Type> = {
  Issued: 'complete',
  Draft: 'draft',
  Superseded: 'neutral',
};

const columnDefinitions: TableProps.ColumnDefinition<Drawing>[] = [
  { id: 'number', header: 'Drawing', cell: item => item.number, contentType: 'identifier' },
  { id: 'title', header: 'Title', cell: item => item.title, isRowHeader: true },
  { id: 'revision', header: 'Rev.', cell: item => item.revision, contentType: 'identifier' },
  {
    id: 'state',
    header: 'State',
    cell: item => (
      <Stamp type={types[item.state]} size="small" rotation="none">
        {item.state}
      </Stamp>
    ),
  },
];

export default function Small() {
  return (
    <Table
      items={drawings}
      columnDefinitions={columnDefinitions}
      trackBy="number"
      caption="Schedule of drawings"
      header={<Header counter={`(${drawings.length})`}>Drawing register</Header>}
    />
  );
}
