// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '@ordinate/components/container';
import Table, { TableProps } from '@ordinate/components/table';

interface Rule {
  port: string;
  protocol: string;
  source: string;
  note: string;
}

const rules: Rule[] = [
  { port: '443', protocol: 'TCP', source: '0.0.0.0/0', note: 'Public HTTPS to the north-annex-web load balancer.' },
  { port: '5432', protocol: 'TCP', source: '10.20.0.0/16', note: 'Database, from the application subnet only.' },
  { port: '22', protocol: 'TCP', source: '10.20.8.14/32', note: 'SSH from the bastion host, for on-call staff.' },
];

const columnDefinitions: TableProps.ColumnDefinition<Rule>[] = [
  { id: 'port', header: 'Port', cell: item => item.port, contentType: 'number', isRowHeader: true },
  { id: 'protocol', header: 'Protocol', cell: item => item.protocol, contentType: 'identifier' },
  { id: 'source', header: 'Source', cell: item => item.source, contentType: 'identifier' },
  { id: 'note', header: 'Note', cell: item => item.note, verticalAlign: 'top' },
];

export default function Embedded() {
  return (
    <Container
      kind="policy"
      reference="P1"
      heading="Inbound rules"
      description="Traffic the North Annex network accepts."
      measure={`${rules.length} rules`}
    >
      <Table
        items={rules}
        columnDefinitions={columnDefinitions}
        trackBy="port"
        variant="embedded"
        wrapLines={true}
        ariaLabels={{ tableLabel: 'Inbound rules' }}
      />
    </Container>
  );
}
