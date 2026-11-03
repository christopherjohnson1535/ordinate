// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Cards from '@ordinate/components/cards';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import SpaceBetween from '@ordinate/components/space-between';
import TextFilter from '@ordinate/components/text-filter';

interface Room {
  id: string;
  name: string;
  floor: string;
  seats: number;
}

const rooms: Room[] = [
  { id: 'r-101', name: 'Reading room', floor: 'Ground', seats: 40 },
  { id: 'r-102', name: 'Map room', floor: 'Ground', seats: 12 },
  { id: 'r-201', name: 'Drawing office', floor: 'First', seats: 18 },
  { id: 'r-202', name: 'Seminar room', floor: 'First', seats: 24 },
  { id: 'r-203', name: 'Print room', floor: 'First', seats: 6 },
  { id: 'r-301', name: 'Studio', floor: 'Second', seats: 10 },
  { id: 'r-302', name: 'Gallery', floor: 'Second', seats: 60 },
];

export default function CardsWithActions() {
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(rooms, {
    filtering: {
      fields: ['name', 'floor'],
      noMatch: (
        <SpaceBetween size="xs">
          <Box color="text-body-secondary">No room matches the filter.</Box>
          <Button onClick={() => actions.setFiltering('')}>Clear filter</Button>
        </SpaceBetween>
      ),
    },
    pagination: { pageSize: 3 },
    selection: { trackBy: 'id', keepSelection: true },
  });
  const picked = collectionProps.selectedItems ?? [];
  const seats = picked.reduce((total, room) => total + room.seats, 0);

  return (
    <Cards
      {...collectionProps}
      items={items}
      selectionType="multi"
      cardsPerRow={[{ cards: 1 }, { minWidth: 520, cards: 3 }]}
      ariaLabels={{ itemSelectionLabel: (_, room) => `Book ${room.name}`, cardsLabel: 'Rooms' }}
      cardDefinition={{
        header: room => room.name,
        reference: room => room.id.toUpperCase(),
        sections: [
          { id: 'floor', header: 'Floor', content: room => room.floor, width: 50 },
          { id: 'seats', header: 'Seats', content: room => room.seats, width: 50 },
        ],
      }}
      header={
        <Header
          counter={`(${rooms.length})`}
          description={picked.length > 0 ? `${picked.length} booked, ${seats} seats` : 'Nothing booked yet.'}
          actions={
            <Button disabled={picked.length === 0} onClick={() => actions.setSelectedItems([])}>
              Clear bookings
            </Button>
          }
        >
          Rooms
        </Header>
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find by name or floor"
          filteringAriaLabel="Find rooms"
          countText={`${filteredItemsCount} matches`}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
