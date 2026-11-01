// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import SegmentedControl from '~components/segmented-control';

import styles from '../form-controls.module.scss';

type Preferences = CollectionPreferencesProps.Preferences<string>;

const columns: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'name', label: 'Instance name', alwaysVisible: true },
  { id: 'id', label: 'Instance ID' },
  { id: 'zone', label: 'Availability zone' },
  { id: 'status', label: 'Status' },
  { id: 'type', label: 'Instance type' },
  { id: 'cpu', label: 'CPU utilization' },
  { id: 'launched', label: 'Launch time, shown with a long label that wraps onto a second line' },
];

const pageSizePreference: CollectionPreferencesProps.PageSizePreference = {
  options: [
    { value: 10, label: '10 instances' },
    { value: 20, label: '20 instances' },
    { value: 50, label: '50 instances' },
  ],
};

const stickyColumnsPreference: CollectionPreferencesProps.StickyColumnsPreference = {
  firstColumns: {
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'First column' },
      { value: 2, label: 'First two columns' },
    ],
  },
  lastColumns: {
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Last column' },
    ],
  },
};

const initialPreferences: Preferences = {
  pageSize: 20,
  wrapLines: false,
  stripedRows: true,
  contentDensity: 'comfortable',
  stickyColumns: { first: 1, last: 0 },
  contentDisplay: columns.map(column => ({ id: column.id, visible: column.id !== 'type' })),
  custom: 'table',
};

function Example(props: Omit<CollectionPreferencesProps<string>, 'preferences' | 'onConfirm'>) {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [lastEvent, setLastEvent] = useState('none yet');
  return (
    <div className={styles.stack}>
      <div>
        <CollectionPreferences<string>
          {...props}
          preferences={preferences}
          onConfirm={event => {
            setPreferences(event.detail);
            setLastEvent('confirmed');
          }}
          onCancel={() => setLastEvent('cancelled')}
        />
      </div>
      <p>Last event: {lastEvent}</p>
      <pre>{JSON.stringify({ ...preferences, contentDisplay: undefined }, null, 0)}</pre>
      <pre>
        Columns:{' '}
        {preferences
          .contentDisplay!.filter(item => item.visible)
          .map(item => item.id)
          .join(', ')}
      </pre>
    </div>
  );
}

export default function CollectionPreferencesPermutations() {
  return (
    <article className={styles.page}>
      <h1>Collection preferences</h1>

      <section className={styles.section}>
        <h2>Every preference</h2>
        <Example
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={{}}
          stripedRowsPreference={{}}
          contentDensityPreference={{}}
          stickyColumnsPreference={stickyColumnsPreference}
          contentDisplayPreference={{ options: columns }}
          data-testid="every-preference"
        />
      </section>

      <section className={styles.section}>
        <h2>Columns only</h2>
        <Example
          title="Column settings"
          contentDisplayPreference={{
            title: 'Visible columns',
            description: 'Turn columns on or off and move them into place.',
            options: columns.slice(0, 5),
          }}
          data-testid="columns-only"
        />
      </section>

      <section className={styles.section}>
        <h2>Settings only, with a custom preference</h2>
        <Example
          pageSizePreference={{ title: 'Rows per page', options: [{ value: 10 }, { value: 20 }, { value: 50 }] }}
          wrapLinesPreference={{ label: 'Wrap long names', description: 'Names longer than the column wrap.' }}
          customPreference={(value, setValue) => (
            <SegmentedControl
              label="View"
              selectedId={value ?? 'table'}
              options={[
                { id: 'table', text: 'Table' },
                { id: 'cards', text: 'Cards' },
              ]}
              onChange={event => setValue(event.detail.selectedId)}
            />
          )}
          data-testid="settings-only"
        />
      </section>

      <section className={styles.section}>
        <h2>Disabled</h2>
        <Example disabled={true} pageSizePreference={pageSizePreference} />
      </section>
    </article>
  );
}
