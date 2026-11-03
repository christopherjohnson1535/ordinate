// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import CollectionPreferences, { CollectionPreferencesProps } from '@ordinate/components/collection-preferences';
import SpaceBetween from '@ordinate/components/space-between';

const options: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'name', label: 'Name', alwaysVisible: true },
  { id: 'status', label: 'Status' },
  { id: 'zone', label: 'Zone' },
  { id: 'type', label: 'Instance type' },
  { id: 'launched', label: 'Launched' },
];

export default function ContentDisplay() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: [
      { id: 'name', visible: true },
      { id: 'status', visible: true },
      { id: 'zone', visible: true },
      { id: 'type', visible: false },
      { id: 'launched', visible: false },
    ],
  });

  const shown = (preferences.contentDisplay ?? [])
    .filter(item => item.visible)
    .map(item => options.find(option => option.id === item.id)?.label);

  return (
    <SpaceBetween size="s" direction="horizontal" alignItems="center">
      <CollectionPreferences
        title="Instance preferences"
        preferences={preferences}
        onConfirm={event => setPreferences(event.detail)}
        contentDisplayPreference={{
          title: 'Columns',
          description: 'Choose which columns to show and in what order.',
          options,
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Columns: {shown.join(', ')}
      </Box>
    </SpaceBetween>
  );
}
