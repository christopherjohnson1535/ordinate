// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Cards, { CardsProps } from '~components/cards';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import Pagination from '~components/pagination';
import StatusIndicator from '~components/status-indicator';

import styles from './styles.module.scss';

interface Node {
  id: string;
  name: string;
  type: string;
  zone: string;
  state: 'running' | 'stopped' | 'pending';
  retired?: boolean;
}

const nodes: Node[] = [
  { id: 'n1', name: 'node-01', type: 'm7.large', zone: 'us-east-1a', state: 'running' },
  { id: 'n2', name: 'node-02', type: 'm7.xlarge', zone: 'us-east-1b', state: 'running' },
  { id: 'n3', name: 'node-03', type: 'c7.large', zone: 'us-east-1c', state: 'stopped' },
  { id: 'n4', name: 'node-04', type: 'c7.2xlarge', zone: 'us-east-1a', state: 'pending', retired: true },
  { id: 'n5', name: 'node-05-with-a-much-longer-name', type: 'r7.large', zone: 'us-east-1b', state: 'running' },
];

const stateLabels = { running: 'Running', stopped: 'Stopped', pending: 'Pending' } as const;
const stateTypes = { running: 'complete', stopped: 'halted', pending: 'waiting' } as const;

const cardDefinition: CardsProps.CardDefinition<Node> = {
  header: item => <Link href={`#${item.id}`}>{item.name}</Link>,
  sections: [
    { id: 'type', header: 'Type', content: item => item.type, width: 50 },
    { id: 'zone', header: 'Zone', content: item => item.zone, width: 50 },
    {
      id: 'state',
      header: 'State',
      content: item => <StatusIndicator state={stateTypes[item.state]}>{stateLabels[item.state]}</StatusIndicator>,
    },
  ],
};

const plainDefinition: CardsProps.CardDefinition<Node> = { ...cardDefinition, header: item => item.name };

function SelectableCards(props: Partial<CardsProps<Node>>) {
  const [selectedItems, setSelectedItems] = useState<ReadonlyArray<Node>>([nodes[1]]);
  return (
    <Cards
      items={nodes}
      cardDefinition={cardDefinition}
      trackBy="id"
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
      isItemDisabled={item => Boolean(item.retired)}
      header={
        <Header counter={`(${selectedItems.length}/${nodes.length})`} actions={<Button>Restart</Button>}>
          Nodes
        </Header>
      }
      filter={
        <div className={styles.filter}>
          <Input type="search" value="" placeholder="Find nodes" ariaLabel="Find nodes" />
        </div>
      }
      pagination={<Pagination currentPageIndex={1} pagesCount={3} />}
      preferences={<Button variant="icon" iconName="adjust" ariaLabel="Preferences" />}
      {...props}
    />
  );
}

function SingleSelect() {
  const [selectedItems, setSelectedItems] = useState<ReadonlyArray<Node>>([]);
  return (
    <Cards
      items={nodes.slice(0, 3)}
      cardDefinition={plainDefinition}
      cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 3 }]}
      trackBy="id"
      selectionType="single"
      selectedItems={selectedItems}
      onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
      entireCardClickable={true}
      visibleSections={['type', 'state']}
      ariaLabels={{ selectionGroupLabel: 'Node to resize' }}
      header={<Header description="Click anywhere on a card to choose it.">Choose a node</Header>}
    />
  );
}

export default function CardsPermutations() {
  return (
    <div className={styles.page}>
      <Box variant="h1">Cards</Box>

      <SelectableCards cardsPerRow={[{ cards: 1 }, { minWidth: 560, cards: 2 }, { minWidth: 900, cards: 3 }]} />

      <SingleSelect />

      <Cards
        items={nodes.slice(0, 4)}
        cardDefinition={cardDefinition}
        variant="full-page"
        cardsPerRow={[{ cards: 2 }, { minWidth: 900, cards: 4 }]}
        header={<Header variant="h2">Full page</Header>}
      />

      <Cards
        items={[]}
        cardDefinition={cardDefinition}
        loading={true}
        loadingText="Loading nodes"
        header={<Header>Loading</Header>}
      />

      <Cards
        items={[]}
        cardDefinition={cardDefinition}
        header={<Header>Empty</Header>}
        empty={
          <Box textAlign="center">
            <Box variant="p">No nodes yet.</Box>
            <Button>Create node</Button>
          </Box>
        }
      />
    </div>
  );
}
