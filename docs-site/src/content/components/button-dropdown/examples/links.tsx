// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';

export default function Links() {
  const [followed, setFollowed] = useState('Nothing followed yet.');

  return (
    <SpaceBetween size="m" alignItems="center">
      <ButtonDropdown
        items={[
          { id: 'settings', text: 'Project settings', href: '#/components/button-dropdown' },
          { id: 'billing', text: 'Billing', href: '#/components/button-dropdown' },
          { id: 'status', text: 'Status page', href: 'https://example.com', external: true },
        ]}
        onItemFollow={event => {
          if (!event.detail.external) {
            // Route on the client instead of letting the browser follow the link.
            event.preventDefault();
          }
          setFollowed(`Followed ${event.detail.href}.`);
        }}
      >
        Go to
      </ButtonDropdown>
      <Box color="text-body-secondary" fontSize="body-s">
        {followed}
      </Box>
    </SpaceBetween>
  );
}
