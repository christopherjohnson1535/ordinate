// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';

export default function Groups() {
  const [wrapLines, setWrapLines] = useState(true);
  const [timestamps, setTimestamps] = useState(false);
  const [last, setLast] = useState('Nothing chosen yet.');

  return (
    <SpaceBetween size="m" alignItems="center">
      <ButtonDropdown
        items={[
          {
            text: 'Display',
            items: [
              { id: 'wrap', text: 'Wrap long lines', itemType: 'checkbox', checked: wrapLines },
              { id: 'timestamps', text: 'Show timestamps', itemType: 'checkbox', checked: timestamps },
            ],
          },
          {
            text: 'Log',
            items: [
              { id: 'copy', text: 'Copy visible lines', secondaryText: 'Ctrl+C' },
              { id: 'clear', text: 'Clear the view', secondaryText: 'Ctrl+L' },
            ],
          },
        ]}
        onItemClick={event => {
          const { id, checked } = event.detail;
          if (id === 'wrap') {
            setWrapLines(Boolean(checked));
          } else if (id === 'timestamps') {
            setTimestamps(Boolean(checked));
          } else {
            setLast(`Chose "${id}".`);
          }
        }}
      >
        View
      </ButtonDropdown>
      <Box color="text-body-secondary" fontSize="body-s">
        Wrapping {wrapLines ? 'on' : 'off'}, timestamps {timestamps ? 'on' : 'off'}. {last}
      </Box>
    </SpaceBetween>
  );
}
