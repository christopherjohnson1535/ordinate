// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import Table, { TableProps } from '@ordinate/components/table';

interface Alarm {
  id: string;
  metric: string;
  threshold: string;
}

const alarms: Alarm[] = [
  { id: 'AL-31', metric: 'CPU above limit, atrium-api', threshold: '> 85 %' },
  { id: 'AL-32', metric: 'Disk filling, vault-store', threshold: '> 90 %' },
];

const columnDefinitions: TableProps.ColumnDefinition<Alarm>[] = [
  { id: 'id', header: 'Alarm', cell: item => item.id, contentType: 'identifier' },
  { id: 'metric', header: 'Condition', cell: item => item.metric, isRowHeader: true },
  { id: 'threshold', header: 'Threshold', cell: item => item.threshold, contentType: 'number' },
];

export default function EmptyAndLoading() {
  const [state, setState] = useState('loading');

  // Loading ends after a moment, as if the request came back.
  useEffect(() => {
    if (state !== 'loading') {
      return;
    }
    const timer = window.setTimeout(() => setState('empty'), 1800);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="State of the table"
        selectedId={state}
        onChange={event => setState(event.detail.selectedId)}
        options={[
          { id: 'loading', text: 'Loading' },
          { id: 'empty', text: 'Empty' },
          { id: 'items', text: 'With items' },
        ]}
      />
      <Table
        items={state === 'items' ? alarms : []}
        columnDefinitions={columnDefinitions}
        trackBy="id"
        kind="policy"
        loading={state === 'loading'}
        loadingText="Loading alarms"
        header={<Header>Alarms</Header>}
        empty={
          <Box textAlign="center">
            <Box variant="strong">No alarms</Box>
            <Box variant="p" color="text-body-secondary">
              This project has no alarms yet.
            </Box>
            <Button onClick={() => setState('items')}>Create alarm</Button>
          </Box>
        }
      />
    </SpaceBetween>
  );
}
