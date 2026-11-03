// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonGroup from '@ordinate/components/button-group';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [last, setLast] = useState('Nothing clicked yet.');

  return (
    <SpaceBetween size="m" alignItems="center">
      <ButtonGroup
        ariaLabel="Log actions"
        items={[
          { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
          { type: 'icon-button', id: 'download', text: 'Download log', iconName: 'download' },
          { type: 'icon-button', id: 'copy', text: 'Copy link', iconName: 'copy', popoverFeedback: 'Link copied' },
          { type: 'icon-button', id: 'fullscreen', text: 'Full screen', iconName: 'fullscreen' },
        ]}
        onItemClick={event => setLast(`Clicked "${event.detail.id}".`)}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {last}
      </Box>
    </SpaceBetween>
  );
}
