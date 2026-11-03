// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import CollectionPreferences, { CollectionPreferencesProps } from '@ordinate/components/collection-preferences';
import FormField from '@ordinate/components/form-field';
import RadioGroup from '@ordinate/components/radio-group';
import SpaceBetween from '@ordinate/components/space-between';

type View = 'table' | 'cards';

export default function Custom() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences<View>>({
    pageSize: 20,
    custom: 'table',
  });

  return (
    <SpaceBetween size="s" direction="horizontal" alignItems="center">
      <CollectionPreferences<View>
        title="Sheet preferences"
        confirmLabel="Apply"
        preferences={preferences}
        onConfirm={event => setPreferences(event.detail)}
        pageSizePreference={{ title: 'Sheets per page', options: [{ value: 20 }, { value: 50 }] }}
        customPreference={(view, setView) => (
          <FormField label="Show sheets as">
            <RadioGroup
              value={view ?? 'table'}
              onChange={event => setView(event.detail.value as View)}
              items={[
                { value: 'table', label: 'A schedule', description: 'One row per sheet' },
                { value: 'cards', label: 'Cards', description: 'With a thumbnail of each sheet' },
              ]}
            />
          </FormField>
        )}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {preferences.pageSize} sheets per page, shown as {preferences.custom === 'cards' ? 'cards' : 'a schedule'}
      </Box>
    </SpaceBetween>
  );
}
