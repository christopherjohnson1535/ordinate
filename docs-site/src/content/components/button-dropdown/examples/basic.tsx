// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <SpaceBetween size="m" alignItems="center">
      <ButtonDropdown
        items={[
          { id: 'restart', text: 'Restart', description: 'Nodes restart one at a time.' },
          { id: 'scale', text: 'Change node count' },
          { id: 'logs', text: 'Download logs', iconName: 'download' },
          { id: 'delete', text: 'Delete', disabled: true, disabledReason: 'Stop the service before you delete it.' },
        ]}
        onItemClick={event => setLast(event.detail.id)}
      >
        Service actions
      </ButtonDropdown>
      <Box color="text-body-secondary" fontSize="body-s">
        {last ? `Chose "${last}".` : 'Nothing chosen yet.'}
      </Box>
    </SpaceBetween>
  );
}
