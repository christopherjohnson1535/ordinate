// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge, { BadgeProps } from '@ordinate/components/badge';
import Header from '@ordinate/components/header';
import Table, { TableProps } from '@ordinate/components/table';

interface Finding {
  id: string;
  title: string;
  service: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  open: number;
}

const findings: Finding[] = [
  { id: 'F-0412', title: 'Public read on a storage bucket', service: 'vault-store', severity: 'Critical', open: 1 },
  { id: 'F-0408', title: 'TLS 1.0 still accepted', service: 'atrium-api', severity: 'High', open: 2 },
  { id: 'F-0397', title: 'Agent 3.2 out of support', service: 'north-annex-web', severity: 'Medium', open: 3 },
  { id: 'F-0391', title: 'Verbose error pages', service: 'gallery-east', severity: 'Low', open: 1 },
];

const tones: Record<Finding['severity'], BadgeProps.Tone> = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

const columnDefinitions: TableProps.ColumnDefinition<Finding>[] = [
  { id: 'id', header: 'Finding', cell: item => item.id, contentType: 'identifier' },
  { id: 'title', header: 'Title', cell: item => item.title, isRowHeader: true },
  { id: 'service', header: 'Service', cell: item => item.service, contentType: 'identifier' },
  { id: 'severity', header: 'Severity', cell: item => <Badge tone={tones[item.severity]}>{item.severity}</Badge> },
  { id: 'open', header: 'Open', cell: item => item.open, contentType: 'number' },
];

export default function InATable() {
  return (
    <Table
      items={findings}
      columnDefinitions={columnDefinitions}
      trackBy="id"
      kind="policy"
      caption="Schedule of open findings"
      header={<Header counter={`(${findings.length})`}>Security findings</Header>}
    />
  );
}
