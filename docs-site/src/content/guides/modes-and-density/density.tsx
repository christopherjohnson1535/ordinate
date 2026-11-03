// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import StatusIndicator from '@ordinate/components/status-indicator';
import Table from '@ordinate/components/table';
import { applyDensity, Density } from '@ordinate/global-styles';

const nodes = [
  { id: 'na-01', state: 'Running', load: '42%' },
  { id: 'na-02', state: 'Running', load: '57%' },
  { id: 'na-03', state: 'Draining', load: '12%' },
];

function Nodes({ density }: { density: Density }) {
  return (
    <Table
      items={nodes}
      trackBy="id"
      caption={`${density} density`}
      columnDefinitions={[
        { id: 'id', header: 'Node', cell: item => item.id, isRowHeader: true, contentType: 'identifier' },
        {
          id: 'state',
          header: 'State',
          cell: item => (
            <StatusIndicator state={item.state === 'Running' ? 'complete' : 'underway'}>{item.state}</StatusIndicator>
          ),
        },
        { id: 'load', header: 'Load', cell: item => item.load, contentType: 'number' },
      ]}
    />
  );
}

export default function DensitySideBySide() {
  const comfortable = useRef<HTMLDivElement>(null);
  const compact = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (comfortable.current && compact.current) {
      applyDensity(Density.Comfortable, comfortable.current);
      applyDensity(Density.Compact, compact.current);
    }
  }, []);

  return (
    <ColumnLayout columns={2}>
      <div ref={comfortable}>
        <Nodes density={Density.Comfortable} />
      </div>
      <div ref={compact}>
        <Nodes density={Density.Compact} />
      </div>
    </ColumnLayout>
  );
}
