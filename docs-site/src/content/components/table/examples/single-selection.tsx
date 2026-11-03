// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import Table, { TableProps } from '@ordinate/components/table';

interface Environment {
  name: string;
  region: string;
  revision: string;
  nodes: number;
}

const environments: Environment[] = [
  { name: 'North Annex, production', region: 'us-mountain-1', revision: 'r-218', nodes: 20 },
  { name: 'North Annex, staging', region: 'us-mountain-1', revision: 'r-221', nodes: 6 },
  { name: 'Gallery, production', region: 'eu-west-1', revision: 'r-209', nodes: 12 },
  { name: 'Gallery, preview', region: 'eu-west-1', revision: 'r-222', nodes: 2 },
];

const columnDefinitions: TableProps.ColumnDefinition<Environment>[] = [
  { id: 'name', header: 'Environment', cell: item => item.name, isRowHeader: true },
  { id: 'region', header: 'Region', cell: item => item.region, contentType: 'identifier' },
  { id: 'revision', header: 'Revision', cell: item => item.revision, contentType: 'identifier' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, contentType: 'number' },
];

export default function SingleSelection() {
  const [selectedItems, setSelectedItems] = useState<Environment[]>([environments[1]]);
  const [result, setResult] = useState('');
  const selected = selectedItems[0];

  return (
    <SpaceBetween size="s">
      <Table
        items={environments}
        columnDefinitions={columnDefinitions}
        trackBy="name"
        kind="configuration"
        selectionType="single"
        selectedItems={selectedItems}
        onSelectionChange={event => {
          setSelectedItems(event.detail.selectedItems);
          setResult('');
        }}
        ariaLabels={{
          selectionGroupLabel: 'Environment to promote',
          itemSelectionLabel: (_, item) => `Select ${item.name}`,
        }}
        header={
          <Header
            counter={`(${environments.length})`}
            actions={
              <Button
                variant="primary"
                disabled={!selected}
                onClick={() => setResult(`Promoting ${selected.revision} from ${selected.name}.`)}
              >
                Promote revision
              </Button>
            }
          >
            Environments
          </Header>
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {result || `Picked: ${selected ? selected.name : 'nothing'}`}
      </Box>
    </SpaceBetween>
  );
}
