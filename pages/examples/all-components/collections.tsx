// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '~collection-hooks';
import ActionCard from '~components/action-card';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Cards from '~components/cards';
import Checkbox from '~components/checkbox';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import Icon from '~components/icon';
import ItemCard from '~components/item-card';
import Link from '~components/link';
import List from '~components/list';
import Pagination from '~components/pagination';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table, { TableProps } from '~components/table';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';
import TextFilter from '~components/text-filter';
import Token from '~components/token';
import TokenGroup, { TokenGroupProps } from '~components/token-group';

import { Service, services, serviceTag, statusTypes, stayOnPage } from './samples';
import { Cell, Group, Readout } from './specimen';

const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name', isRowHeader: true },
  {
    id: 'status',
    header: 'Status',
    cell: item => <StatusIndicator type={statusTypes[item.status]}>{item.status}</StatusIndicator>,
    sortingField: 'status',
  },
  { id: 'image', header: 'Image', cell: item => <Box variant="code">{item.image}</Box>, sortingField: 'image' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, sortingField: 'nodes' },
];

function TableSpecimen() {
  const [selected, setSelected] = useState<Service[]>([services[0]]);
  const { items, collectionProps, paginationProps } = useCollection(services, {
    sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
    pagination: { pageSize: 5 },
  });
  return (
    <Table
      {...collectionProps}
      items={items}
      caption="Schedule of services"
      rowTag={serviceTag}
      columnDefinitions={columnDefinitions}
      selectionType="single"
      selectedItems={selected}
      onSelectionChange={event => setSelected([...event.detail.selectedItems])}
      variant="container"
      ariaLabels={{ tableLabel: 'Services', itemSelectionLabel: (_, item) => `Select ${item.name}` }}
      header={
        <Header
          headingTagOverride="h4"
          counter={`(${services.length})`}
          actions={
            <Button disabled={selected.length === 0}>Restart {selected[0] ? serviceTag(selected[0]) : ''}</Button>
          }
        >
          Services
        </Header>
      }
      pagination={<Pagination {...paginationProps} ariaLabels={{ pageLabel: page => `Services, page ${page}` }} />}
    />
  );
}

interface Part {
  number: string;
  name: string;
  material: string;
}

const parts: Part[] = [
  { number: 'A-101', name: 'Base plate', material: 'Cast iron' },
  { number: 'A-102', name: 'Bearing housing', material: 'Bronze' },
  { number: 'A-103', name: 'Main shaft', material: 'Steel, turned' },
];

function TableRootSpecimen() {
  return (
    <TableRoot caption="Parts list">
      <TableHead>
        <TableRow>
          <TableHeaderCell rowTagColumn={true} />
          <TableHeaderCell>Part no.</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Material</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map((part, index) => (
          <TableRow key={part.number} selected={index === 1}>
            <TableBodyCell rowTag={`P${index + 1}`} />
            <TableBodyCell>
              <Box variant="code">{part.number}</Box>
            </TableBodyCell>
            <TableBodyCell isRowHeader={true}>{part.name}</TableBodyCell>
            <TableBodyCell>{part.material}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}

interface Bike {
  name: string;
  frame: string;
  price: string;
  status: 'In stock' | 'Reserved';
}

const bikes: Bike[] = [
  { name: 'Shore Road tourer', frame: 'Steel, 56 cm', price: '£640', status: 'In stock' },
  { name: 'Leith town bike', frame: 'Aluminium, 52 cm', price: '£420', status: 'Reserved' },
];

function CardsSpecimen() {
  const [selected, setSelected] = useState<Bike[]>([]);
  return (
    <Cards
      items={bikes}
      trackBy="name"
      selectionType="multi"
      selectedItems={selected}
      onSelectionChange={event => setSelected([...event.detail.selectedItems])}
      cardsPerRow={[{ cards: 1 }, { minWidth: 360, cards: 2 }]}
      ariaLabels={{
        selectionGroupLabel: 'Bikes for sale',
        itemSelectionLabel: (_, item) => `Select ${item.name}`,
      }}
      cardDefinition={{
        header: item => item.name,
        sections: [
          { id: 'frame', header: 'Frame', content: item => item.frame },
          { id: 'price', header: 'Price', content: item => item.price },
          {
            id: 'status',
            header: 'Status',
            content: item => (
              <StatusIndicator type={item.status === 'In stock' ? 'success' : 'pending'}>{item.status}</StatusIndicator>
            ),
          },
        ],
      }}
    />
  );
}

function CollectionPreferencesSpecimen() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 10,
    wrapLines: false,
    stripedRows: true,
  });
  return (
    <>
      <CollectionPreferences
        title="Schedule preferences"
        confirmLabel="Apply"
        cancelLabel="Cancel"
        preferences={preferences}
        onConfirm={event => setPreferences(event.detail)}
        pageSizePreference={{
          title: 'Rows per page',
          options: [
            { value: 10, label: '10 services' },
            { value: 25, label: '25 services' },
          ],
        }}
        wrapLinesPreference={{ label: 'Wrap lines' }}
        stripedRowsPreference={{ label: 'Striped rows' }}
      />
      <Readout>
        {preferences.pageSize} rows, {preferences.stripedRows ? 'striped' : 'plain'}
      </Readout>
    </>
  );
}

function ItemCardSpecimen() {
  const [selected, setSelected] = useState(true);
  return (
    <ItemCard
      header={
        <Link href="#atrium-api" onFollow={stayOnPage}>
          atrium-api
        </Link>
      }
      description="api:v7 on 6 nodes"
      selected={selected}
      selectionControl={
        <Checkbox
          checked={selected}
          onChange={event => setSelected(event.detail.checked)}
          ariaLabel="Select atrium-api"
        />
      }
      actions={
        <ButtonDropdown
          variant="icon"
          ariaLabel="Actions for atrium-api"
          items={[
            { id: 'restart', text: 'Restart' },
            { id: 'logs', text: 'Open logs' },
          ]}
        />
      }
    >
      <StatusIndicator type="success">Running</StatusIndicator>
    </ItemCard>
  );
}

interface Stage {
  id: string;
  title: string;
  detail?: string;
}

function ListSpecimen() {
  const [stages, setStages] = useState<Stage[]>([
    { id: 'survey', title: 'Measured survey', detail: 'Done, 2 September' },
    { id: 'sketch', title: 'Sketch scheme', detail: 'With the client' },
    { id: 'planning', title: 'Planning drawings' },
    { id: 'tender', title: 'Tender package', detail: 'Out until 14 November' },
  ]);
  return (
    <List
      ariaLabel="Stages of Hut No. 3"
      items={stages}
      sortable={true}
      onSortingChange={event => setStages([...event.detail.items])}
      renderItem={stage => ({
        id: stage.id,
        content: stage.title,
        secondaryContent: stage.detail,
        icon: <Icon name="file" />,
      })}
    />
  );
}

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Statuses', operators: ['=', '!='] },
  { key: 'image', propertyLabel: 'Image', groupValuesLabel: 'Images', operators: ['=', '!=', '^'] },
];

const filteringOptions: PropertyFilterProps.FilteringOption[] = [
  ...['Running', 'Starting', 'Stopped', 'Failed'].map(value => ({ propertyKey: 'status', value })),
  ...['web:v2', 'api:v7', 'batch:v3'].map(value => ({ propertyKey: 'image', value })),
];

function PropertyFilterSpecimen() {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({
    operation: 'and',
    tokens: [
      { propertyKey: 'status', operator: '=', value: 'Running' },
      { propertyKey: 'image', operator: '^', value: 'web' },
    ],
  });
  return (
    <PropertyFilter
      query={query}
      onChange={event => setQuery(event.detail)}
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      filteringPlaceholder="Find services"
      filteringAriaLabel="Find services by property"
      countText="2 matches"
    />
  );
}

function TextFilterSpecimen() {
  const [text, setText] = useState('web');
  const matches = services.filter(service => service.name.includes(text) || service.image.includes(text));
  return (
    <>
      <TextFilter
        filteringText={text}
        onChange={event => setText(event.detail.filteringText)}
        filteringPlaceholder="Find services"
        filteringAriaLabel="Find services by name or image"
        countText={`${matches.length} matches`}
      />
      <Readout>{matches.map(service => service.name).join(', ') || 'No services match'}</Readout>
    </>
  );
}

function TokenGroupSpecimen() {
  const [items, setItems] = useState<TokenGroupProps.Item[]>([
    { label: 'us-mountain-1a', description: 'Denver' },
    { label: 'us-mountain-1b', description: 'Denver' },
    { label: 'us-coast-2a', description: 'Portland', iconName: 'caution' },
  ]);
  return (
    <TokenGroup
      ariaLabel="Zones"
      items={items}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.itemIndex))}
    />
  );
}

export default function CollectionsGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Collections">
      <Cell name="ActionCard">
        <ActionCard header="Book a repair" iconName="calendar" onClick={() => undefined} />
      </Cell>
      <Cell name="Cards" wide={true}>
        <CardsSpecimen />
      </Cell>
      <Cell name="CollectionPreferences" note="Opens the preferences in a modal.">
        <CollectionPreferencesSpecimen />
      </Cell>
      <Cell name="ItemCard">
        <ItemCardSpecimen />
      </Cell>
      <Cell name="List" note="Move the stages with the handles or the keyboard.">
        <ListSpecimen />
      </Cell>
      <Cell name="PropertyFilter">
        <PropertyFilterSpecimen />
      </Cell>
      <Cell name="Table" wide={true}>
        <TableSpecimen />
      </Cell>
      <Cell
        name="TableRoot"
        wide={true}
        note="With TableHead, TableHeaderCell, TableBody, TableRow and TableBodyCell, for tables you compose yourself."
      >
        <TableRootSpecimen />
      </Cell>
      <Cell name="TextFilter">
        <TextFilterSpecimen />
      </Cell>
      <Cell name="Token">
        <SpaceBetween size="xs">
          <Token label="capacity-plan.pdf" description="Drawing set, 2.4 MB" icon={<Icon name="file" />} />
          <Token variant="inline" label="web:v2" />
        </SpaceBetween>
      </Cell>
      <Cell name="TokenGroup">
        <TokenGroupSpecimen />
      </Cell>
    </Group>
  );
}
