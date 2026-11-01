# @ordinate-ui/collection-hooks

State for lists of items in [Ordinate](../README.md): text and property filtering, sorting, pagination and selection. `useCollection` takes all items, keeps the state, and returns the items to show along with props to spread onto the table or cards, the filter and the pagination.

```tsx
import { useCollection } from '@ordinate-ui/collection-hooks';

import Pagination from '@ordinate-ui/components/pagination';
import Table from '@ordinate-ui/components/table';
import TextFilter from '@ordinate-ui/components/text-filter';

function Instances({ instances }) {
  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(instances, {
    filtering: { empty: 'No instances', noMatch: 'No instances match the filter' },
    sorting: { defaultState: { sortingColumn: columns[0] } },
    pagination: { pageSize: 20 },
    selection: { trackBy: 'id' },
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      filter={<TextFilter {...filterProps} countText={`${filteredItemsCount} matches`} />}
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
```

Each step runs in a fixed order: text filter, property filter, sort, then the current page. Changing the filter or the sorting goes back to page 1. If the current page stops existing, for example after a filter or a larger page size, the last page is shown.

## Options

| Option                                  | Meaning                                                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filtering.filteringFunction`           | `(item, text, fields) => boolean`. By default an item matches when one of its string, number or boolean fields contains the text, ignoring case. |
| `filtering.fields`                      | The fields the default function searches. All of the item's own fields by default.                                                               |
| `filtering.defaultFilteringText`        | The text the filter starts with.                                                                                                                 |
| `filtering.empty`, `filtering.noMatch`  | Content for the collection when there are no items at all, or when no item matches.                                                              |
| `propertyFiltering.filteringProperties` | The properties a property filter can match: `key`, `propertyLabel`, `groupValuesLabel`, `operators`, `defaultOperator`.                          |
| `propertyFiltering.defaultQuery`        | The query the filter starts with: `{ tokens, operation }`.                                                                                       |
| `propertyFiltering.filteringFunction`   | `(item, query) => boolean`, to replace the built-in token matching.                                                                              |
| `propertyFiltering.empty`, `noMatch`    | Used when `filtering` does not set them.                                                                                                         |
| `sorting.defaultState`                  | `{ sortingColumn, isDescending }`. The column sorts by its `sortingComparator`, or else by its `sortingField`.                                   |
| `pagination.pageSize`                   | Items per page. 10 by default.                                                                                                                   |
| `pagination.defaultPage`                | The page shown first, counting from 1.                                                                                                           |
| `selection.defaultSelectedItems`        | The items selected at first.                                                                                                                     |
| `selection.keepSelection`               | Keeps the selection when the filter, sorting or page changes. Without it those changes clear the selection.                                      |
| `selection.trackBy`                     | A field name or function that identifies an item, passed on to the collection.                                                                   |

Leave out an option to turn that step off. `filteredItemsCount` is only set when `filtering` or `propertyFiltering` is.

## Property filter matching

| Operator             | Matches when the item's value                                  |
| -------------------- | -------------------------------------------------------------- |
| `=`, `!=`            | equals, or does not equal, the token value                     |
| `:`, `!:`            | contains, or does not contain, the token value, ignoring case  |
| `^`, `!^`            | starts, or does not start, with the token value, ignoring case |
| `>`, `<`, `>=`, `<=` | compares to the token value                                    |

Numbers compare as numbers when the token value reads as one, so `cpu > 50` works with a typed `"50"`. Other values compare as text in natural order. Items without a value never pass a comparison. A field holding a list matches a positive operator when any entry matches, and a negated operator only when every entry does.

A token without `propertyKey` is free text: it matches when any filtering property contains the value (for `!:`, when none does). A token for an unknown property, or with an operator the property does not list, matches nothing. A property supports its `defaultOperator` (`=` unless set) and every operator in `operators`. An operator can bring its own rule as `{ operator, match: (itemValue, tokenValue) => boolean }`.

Tokens combine with `and` or `or`, set by the query's `operation`.

## Result

| Field                 | Spread onto                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`               | The items for the current page.                                                                                                                                  |
| `collectionProps`     | Table or Cards: `empty`, and with the matching options `sortingColumn`, `sortingDescending`, `onSortingChange`, `selectedItems`, `onSelectionChange`, `trackBy`. |
| `filterProps`         | TextFilter: `filteringText`, `onChange`.                                                                                                                         |
| `propertyFilterProps` | PropertyFilter: `query`, `onChange`, `filteringProperties`, and `filteringOptions` listing each property's distinct values.                                      |
| `paginationProps`     | Pagination: `currentPageIndex`, `pagesCount`, `onChange`.                                                                                                        |
| `actions`             | `setFiltering`, `setPropertyFiltering`, `setSorting`, `setCurrentPage` and `setSelectedItems`, to change the state from elsewhere.                               |

Licensed under the [Apache License, Version 2.0](../LICENSE).
