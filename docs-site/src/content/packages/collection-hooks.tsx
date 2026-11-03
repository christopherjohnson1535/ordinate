// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { Example } from '../../parts/example';
import { CodeBlock, Command, DocSection, Notes, Prose, SubHeading } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const examples: Record<'schedule' | 'propertyFilter' | 'cards', LoadedExample> = {
  schedule: {
    meta: {
      id: 'schedule',
      title: 'A table with every step',
      description: (
        <p>
          Text filtering, sorting, five rows a page and multi-select, all from one call. Sort or filter and the
          selection clears; the filter counts matches across every page.
        </p>
      ),
    },
    load: () => import('./collection-hooks/schedule'),
    loadSource: () => import('./collection-hooks/schedule.tsx?raw').then(module => module.default),
  },
  propertyFilter: {
    meta: {
      id: 'property-filter',
      title: 'Property filtering',
      description: (
        <p>
          The filter starts on <code>Status = Running</code>. Try <code>Nodes &gt; 3</code>, <code>Image ^ web</code>{' '}
          or <code>Owner = Archives</code>, which matches inside a list.
        </p>
      ),
    },
    load: () => import('./collection-hooks/property-filter'),
    loadSource: () => import('./collection-hooks/property-filter.tsx?raw').then(module => module.default),
  },
  cards: {
    meta: {
      id: 'cards-actions',
      title: 'Cards, kept selection and actions',
      description: (
        <p>
          With <code>keepSelection</code> the bookings survive paging and filtering. The empty state and the header
          button change the state through <code>actions</code>.
        </p>
      ),
    },
    load: () => import('./collection-hooks/cards-actions'),
    loadSource: () => import('./collection-hooks/cards-actions.tsx?raw').then(module => module.default),
  },
};

interface Row {
  name: string;
  type: string;
  description: React.ReactNode;
}

/** A schedule of names, types and what they do, drawn as an embedded table. */
function Schedule({ caption, rows }: { caption: string; rows: ReadonlyArray<Row> }) {
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption={caption}
      trackBy="name"
      items={rows}
      ariaLabels={{ tableLabel: caption }}
      columnDefinitions={[
        { id: 'name', header: 'Name', cell: row => <code>{row.name}</code>, width: '30%', isRowHeader: true },
        { id: 'type', header: 'Type', cell: row => <code>{row.type}</code>, width: '26%' },
        { id: 'description', header: 'Description', cell: row => row.description },
      ]}
    />
  );
}

const optionRows: ReadonlyArray<Row> = [
  {
    name: 'filtering',
    type: 'object',
    description: 'Turns on text filtering. Runs first, before property filtering, sorting and paging.',
  },
  {
    name: 'filtering.filteringFunction',
    type: '(item, text, fields?) => boolean',
    description: (
      <>
        Decides whether an item matches the text. The default trims the text, ignores case, and matches when one of{' '}
        <code>fields</code>, or any of the item&apos;s own string, number, boolean or bigint properties, contains it.
        Empty text matches every item.
      </>
    ),
  },
  {
    name: 'filtering.fields',
    type: 'ReadonlyArray<string>',
    description: 'The properties the default function searches. Leave it out to search all of them.',
  },
  { name: 'filtering.defaultFilteringText', type: 'string', description: 'The text the filter starts with.' },
  {
    name: 'filtering.empty',
    type: 'ReactNode',
    description: (
      <>
        Passed to the collection as <code>empty</code> when there are no items at all.
      </>
    ),
  },
  {
    name: 'filtering.noMatch',
    type: 'ReactNode',
    description: (
      <>
        Passed as <code>empty</code> instead when there are items but none matches.
      </>
    ),
  },
  {
    name: 'propertyFiltering',
    type: 'object',
    description: 'Turns on property filtering. Runs after the text filter.',
  },
  {
    name: 'propertyFiltering.filteringProperties',
    type: 'ReadonlyArray<FilteringProperty>',
    description: (
      <>
        Required. The properties a token can name: <code>key</code>, <code>propertyLabel</code>,{' '}
        <code>groupValuesLabel</code>, <code>group</code>, <code>defaultOperator</code> (<code>=</code> unless set) and{' '}
        <code>operators</code>. An entry of <code>operators</code> is an operator, or{' '}
        <code>{'{ operator, match }'}</code> with a matching rule of its own.
      </>
    ),
  },
  {
    name: 'propertyFiltering.defaultQuery',
    type: 'PropertyFilterQuery',
    description: (
      <>
        The query the filter starts with: <code>{'{ tokens, operation }'}</code>. Defaults to no tokens and{' '}
        <code>and</code>.
      </>
    ),
  },
  {
    name: 'propertyFiltering.filteringFunction',
    type: '(item, query) => boolean',
    description: 'Replaces the built-in token matching for the whole query.',
  },
  {
    name: 'propertyFiltering.empty',
    type: 'ReactNode',
    description: (
      <>
        Used when <code>filtering.empty</code> is not set.
      </>
    ),
  },
  {
    name: 'propertyFiltering.noMatch',
    type: 'ReactNode',
    description: (
      <>
        Used when <code>filtering.noMatch</code> is not set.
      </>
    ),
  },
  {
    name: 'sorting',
    type: 'object',
    description: (
      <>
        Turns on sorting and adds the sorting props to <code>collectionProps</code>. Runs after both filters.
      </>
    ),
  },
  {
    name: 'sorting.defaultState',
    type: 'SortingState<T>',
    description: (
      <>
        <code>{'{ sortingColumn, isDescending }'}</code>. Pass one of your column definitions as the column; the hook
        reads its <code>sortingComparator</code>, or else its <code>sortingField</code>. Without it the items keep their
        order until the user sorts.
      </>
    ),
  },
  { name: 'pagination', type: 'object', description: 'Turns on paging. Without it every item is on page 1.' },
  {
    name: 'pagination.pageSize',
    type: 'number',
    description: 'Items per page. 10 when it is left out or is not a number of at least 1.',
  },
  {
    name: 'pagination.defaultPage',
    type: 'number',
    description: 'The page shown first, counting from 1. Defaults to 1.',
  },
  {
    name: 'selection',
    type: 'object',
    description: (
      <>
        Turns on selection and adds the selection props to <code>collectionProps</code>.
      </>
    ),
  },
  {
    name: 'selection.defaultSelectedItems',
    type: 'ReadonlyArray<T>',
    description: 'The items selected at first.',
  },
  {
    name: 'selection.keepSelection',
    type: 'boolean',
    description:
      'Keeps the selection when the filters, the sorting or the page change. By default any of those changes clears it, so the user never acts on items they can no longer see.',
  },
  {
    name: 'selection.trackBy',
    type: 'string | (item) => string',
    description: (
      <>
        Passed on to the collection as <code>trackBy</code>, so selected items are recognized after the data reloads.
        The hook itself compares selected items by reference.
      </>
    ),
  },
];

const resultRows: ReadonlyArray<Row> = [
  {
    name: 'items',
    type: 'ReadonlyArray<T>',
    description: 'The items to render: filtered, sorted and cut to the current page.',
  },
  {
    name: 'filteredItemsCount',
    type: 'number | undefined',
    description: (
      <>
        How many items pass both filters, across all pages. <code>undefined</code> unless <code>filtering</code> or{' '}
        <code>propertyFiltering</code> is set.
      </>
    ),
  },
  {
    name: 'collectionProps',
    type: 'CollectionProps<T>',
    description: (
      <>
        For Table or Cards: <code>empty</code> always; <code>sortingColumn</code>, <code>sortingDescending</code> and{' '}
        <code>onSortingChange</code> with <code>sorting</code>; <code>selectedItems</code>,{' '}
        <code>onSelectionChange</code> and <code>trackBy</code> with <code>selection</code>.
      </>
    ),
  },
  {
    name: 'filterProps',
    type: 'FilterProps',
    description: (
      <>
        For TextFilter: <code>filteringText</code> and <code>onChange</code>.
      </>
    ),
  },
  {
    name: 'propertyFilterProps',
    type: 'PropertyFilterProps',
    description: (
      <>
        For PropertyFilter: <code>query</code>, <code>onChange</code>, <code>filteringProperties</code> with plain
        operator names, and <code>filteringOptions</code>, the distinct values of each property across all items in the
        order they first appear.
      </>
    ),
  },
  {
    name: 'paginationProps',
    type: 'PaginationProps',
    description: (
      <>
        For Pagination: <code>currentPageIndex</code>, <code>pagesCount</code> and <code>onChange</code>. An empty
        collection still has one page.
      </>
    ),
  },
  {
    name: 'actions',
    type: 'CollectionActions<T>',
    description: (
      <>
        <code>setFiltering(text)</code>, <code>setPropertyFiltering(query)</code>, <code>setSorting(state)</code>,{' '}
        <code>setCurrentPage(index)</code> and <code>setSelectedItems(items)</code>, to change the state from anywhere
        else on the page, such as a Clear filter button in the empty state.
      </>
    ),
  },
];

const operatorRows: ReadonlyArray<Row> = [
  { name: '=', type: 'equals', description: 'The value equals the token value. Numbers compare as numbers.' },
  { name: '!=', type: 'does not equal', description: 'The value does not equal the token value.' },
  { name: ':', type: 'contains', description: 'The value contains the token value, ignoring case.' },
  { name: '!:', type: 'does not contain', description: 'The value does not contain the token value, ignoring case.' },
  { name: '^', type: 'starts with', description: 'The value starts with the token value, ignoring case.' },
  { name: '!^', type: 'does not start with', description: 'The value does not start with it, ignoring case.' },
  {
    name: '>  <  >=  <=',
    type: 'compares',
    description:
      'Numerically when the item holds a number and the token reads as one, so a typed "50" works; otherwise as text in natural order. A missing value never passes.',
  },
];

const usage = `
import { useCollection } from '@ordinate/collection-hooks';
import Pagination from '@ordinate/components/pagination';
import Table from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';

function Instances({ instances }) {
  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(instances, {
    filtering: { empty: 'No instances', noMatch: 'No instance matches the filter' },
    sorting: { defaultState: { sortingColumn: columns[0] } },
    pagination: { pageSize: 20 },
    selection: { trackBy: 'id' },
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      selectionType="multi"
      filter={<TextFilter {...filterProps} countText={\`\${filteredItemsCount} matches\`} />}
      pagination={<Pagination {...paginationProps} />}
    />
  );
}`;

const customOperator = `
const filteringProperties: FilteringProperty[] = [
  {
    key: 'started',
    propertyLabel: 'Started',
    operators: [
      // Dates are stored as Date objects; compare them by day.
      { operator: '>', match: (value, token) => value instanceof Date && value > new Date(String(token)) },
      { operator: '<', match: (value, token) => value instanceof Date && value < new Date(String(token)) },
    ],
  },
];`;

function Page() {
  return (
    <>
      <DocSection id="overview" number={1} title="Overview">
        <Prose>
          <p>
            Table, Cards and the filters are controlled: they show the items, page and filter text you give them and
            report what the user did. <code>useCollection</code> keeps that state for a list held in memory. Give it every
            item and the steps you want, and it returns the items for the current page with props to spread onto the
            collection, the filter and the pagination.
          </p>
          <p>
            The steps always run in the same order: text filter, property filter, sort, then the current page. Changing
            either filter or the sorting goes back to page 1. When the current page stops existing, after a filter or a
            larger page size, the last page that does is shown.
          </p>
        </Prose>
        <Command>npm install @ordinate/collection-hooks</Command>
        <CodeBlock label="instances.tsx" code={usage} />
        <Prose>
          <p>
            Leave an option out to turn that step off. The hook reads the options for their starting values once; later
            changes to them, such as a new <code>pageSize</code> from collection preferences, apply on the next render.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="examples" number={2} title="Examples">
        <Example example={examples.schedule} index={1} />
        <Example example={examples.propertyFilter} index={2} />
        <Example example={examples.cards} index={3} />
      </DocSection>

      <DocSection
        id="options"
        number={3}
        title="Options"
        description="The second argument, UseCollectionOptions<T>. Every group is optional."
      >
        <Schedule caption="Schedule of options" rows={optionRows} />
      </DocSection>

      <DocSection
        id="result"
        number={4}
        title="Result"
        description="What useCollection returns, UseCollectionResult<T>, and where each part goes."
      >
        <Schedule caption="Schedule of results" rows={resultRows} />
      </DocSection>

      <DocSection id="property-filter-matching" number={5} title="Property filter matching">
        <Prose>
          <p>
            A property accepts its <code>defaultOperator</code> and every operator in its <code>operators</code>. A token
            with another operator, or for a property that is not listed, matches nothing. Tokens combine with the
            query&apos;s <code>operation</code>: all of them for <code>and</code>, any of them for <code>or</code>.
          </p>
        </Prose>
        <Schedule caption="Schedule of operators" rows={operatorRows} />
        <Notes
          items={[
            <>
              An item value that is a list matches a positive operator when any entry matches, and a negated operator
              only when every entry does.
            </>,
            <>
              A token without <code>propertyKey</code> is free text: it matches when any filtering property matches it,
              or for a negated operator, when none does.
            </>,
            <>
              <code>=</code> treats <code>null</code>, <code>undefined</code> and empty text as the same missing value.
            </>,
          ]}
        />
        <SubHeading id="custom-operators">Custom operators</SubHeading>
        <Prose>
          <p>
            For values the built-in comparison does not understand, give the operator a <code>match</code> function. It
            receives the item&apos;s value and the token&apos;s value. A negated operator with its own rule returns the
            negated result itself.
          </p>
        </Prose>
        <CodeBlock label="filtering-properties.ts" code={customOperator} />
      </DocSection>

      <DocSection id="sorting-and-selection" number={6} title="Sorting and selection">
        <Notes
          items={[
            <>
              A column with a <code>sortingComparator</code> sorts by it. Otherwise the hook compares{' '}
              <code>sortingField</code> values: text in natural order, so <code>node-2</code> comes before{' '}
              <code>node-10</code>; dates by time; numbers as numbers.
            </>,
            'Items without a value in the sorting field stay at the end in both directions, so the data comes first.',
            'Sorting works on a copy. The array you pass in is never changed.',
            <>
              The table matches <code>sortingColumn</code> to a column definition by object, by{' '}
              <code>sortingField</code> or by <code>sortingComparator</code>, so pass one of the same column objects in{' '}
              <code>sorting.defaultState</code>.
            </>,
            <>
              Selecting does not change the page. Any other change clears the selection unless{' '}
              <code>keepSelection</code> is set.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="types" number={7} title="Types">
        <Prose>
          <p>
            The package exports the types it uses, for annotating column lists and filtering properties:{' '}
            <code>UseCollectionOptions</code>, <code>UseCollectionResult</code>, <code>CollectionActions</code>,{' '}
            <code>CollectionProps</code>, <code>FilterProps</code>, <code>PropertyFilterProps</code>,{' '}
            <code>PaginationProps</code>, <code>SortingColumn</code>, <code>SortingState</code>,{' '}
            <code>FilteringProperty</code>, <code>FilteringPropertyDefinition</code>, <code>FilteringOption</code>,{' '}
            <code>PropertyFilterQuery</code>, <code>PropertyFilterToken</code>, <code>PropertyFilterOperation</code>,{' '}
            <code>PropertyFilterOperator</code>, <code>PropertyFilterOperatorExtended</code>, <code>DetailEvent</code>{' '}
            and <code>DetailEventHandler</code>.
          </p>
          <p>
            For data that lives on a server, where filtering and paging happen in a request, keep the state yourself
            and pass the components the page the server returns. See <a href="#/components/table">Table</a>,{' '}
            <a href="#/components/cards">Cards</a>, <a href="#/components/text-filter">TextFilter</a>,{' '}
            <a href="#/components/property-filter">PropertyFilter</a> and{' '}
            <a href="#/components/pagination">Pagination</a>.
          </p>
        </Prose>
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'collection-hooks',
  title: 'Collection hooks',
  summary: 'Filter, sort, page and select a list held in memory with one hook, and spread the result onto a table.',
  order: 2,
  keywords: [
    'useCollection',
    '@ordinate/collection-hooks',
    'filtering',
    'property filter',
    'sorting',
    'pagination',
    'selection',
    'keepSelection',
    'trackBy',
  ],
  Page,
};

export default doc;
