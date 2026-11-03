// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import Cards from '@ordinate/components/cards';
import Header from '@ordinate/components/header';
import Link from '@ordinate/components/link';
import StatusIndicator from '@ordinate/components/status-indicator';

interface Node {
  id: string;
  name: string;
  type: string;
  zone: string;
  running: boolean;
}

const nodes: Node[] = [
  { id: 'R1', name: 'node-01', type: 'm7.large', zone: 'us-mountain-1a', running: true },
  { id: 'R2', name: 'node-02', type: 'm7.xlarge', zone: 'us-mountain-1b', running: true },
  { id: 'R3', name: 'node-03', type: 'c7.large', zone: 'us-mountain-1c', running: false },
];

export default function Basic() {
  return (
    <Cards
      items={nodes}
      trackBy="id"
      kind="resource"
      cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 3 }]}
      header={
        <Header counter={`(${nodes.length})`} actions={<Button>Add node</Button>}>
          Nodes
        </Header>
      }
      cardDefinition={{
        header: node => <Link href="#/components/cards">{node.name}</Link>,
        reference: node => node.id,
        sections: [
          { id: 'type', header: 'Type', content: node => node.type, width: 50 },
          {
            id: 'status',
            header: 'Status',
            content: node => (
              <StatusIndicator state={node.running ? 'complete' : 'halted'}>
                {node.running ? 'Running' : 'Stopped'}
              </StatusIndicator>
            ),
            width: 50,
          },
          { id: 'zone', header: 'Zone', content: node => node.zone },
        ],
      }}
    />
  );
}
