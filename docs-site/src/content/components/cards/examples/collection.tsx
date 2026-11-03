// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import Cards from '@ordinate/components/cards';
import CollectionPreferences, { CollectionPreferencesProps } from '@ordinate/components/collection-preferences';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import TextFilter from '@ordinate/components/text-filter';

interface Sheet {
  id: string;
  title: string;
  floor: string;
  revision: string;
  drawnBy: string;
}

const people = ['Dana Ruiz', 'Sam Okafor', 'Lee Park'];
const floors = ['Ground', 'First', 'Second', 'Roof'];
const subjects = ['plan', 'electrical', 'plumbing', 'fire escape'];

const sheets: Sheet[] = floors.flatMap((floor, f) =>
  subjects.map((subject, s) => ({
    id: `A-${f}${s + 1}`,
    title: `${floor} floor ${subject}`,
    floor,
    revision: String.fromCharCode(65 + ((f + s) % 4)),
    drawnBy: people[(f + s) % people.length],
  }))
);

const sections = [
  { id: 'floor', label: 'Floor' },
  { id: 'revision', label: 'Revision' },
  { id: 'drawnBy', label: 'Drawn by' },
];

export default function Collection() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({ pageSize: 6 });
  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(sheets, {
    filtering: { fields: ['id', 'title', 'drawnBy'], noMatch: 'No sheets match the filter.' },
    pagination: { pageSize: preferences.pageSize },
    selection: { trackBy: 'id' },
  });

  return (
    <Cards
      {...collectionProps}
      items={items}
      selectionType="single"
      ariaLabels={{ itemSelectionLabel: (_, sheet) => `Select sheet ${sheet.id}` }}
      cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 800, cards: 3 }]}
      header={<Header counter={`(${sheets.length})`}>Drawing sheets</Header>}
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find sheets"
          filteringAriaLabel="Find sheets by number, title or author"
          countText={`${filteredItemsCount} matches`}
        />
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        <CollectionPreferences
          title="Sheet preferences"
          preferences={preferences}
          onConfirm={event => setPreferences(event.detail)}
          pageSizePreference={{ options: [{ value: 6 }, { value: 12 }] }}
          contentDisplayPreference={{ title: 'Card sections', options: sections }}
        />
      }
      visibleSections={preferences.contentDisplay?.filter(item => item.visible).map(item => item.id)}
      cardDefinition={{
        header: sheet => sheet.title,
        reference: sheet => sheet.id,
        sections: [
          { id: 'floor', header: 'Floor', content: sheet => sheet.floor, width: 50 },
          { id: 'revision', header: 'Revision', content: sheet => sheet.revision, width: 50 },
          { id: 'drawnBy', header: 'Drawn by', content: sheet => sheet.drawnBy },
        ],
      }}
    />
  );
}
