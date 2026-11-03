// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';
import TopNavigation from '@ordinate/components/top-navigation';

export default function Console() {
  const [command, setCommand] = useState('');
  const [log, setLog] = useState('Nothing chosen yet.');

  return (
    <SpaceBetween size="m">
      <TopNavigation
        identity={{
          href: '#/components/top-navigation',
          title: 'Annex Console',
          onFollow: event => {
            event.preventDefault();
            setLog('Went to the home page.');
          },
        }}
        search={
          <Input
            type="search"
            value={command}
            placeholder="Go to a service, sheet or command"
            ariaLabel="Command line"
            onChange={event => setCommand(event.detail.value)}
          />
        }
        utilities={[
          {
            type: 'button',
            text: 'Docs',
            iconName: 'file',
            href: 'https://example.com/docs',
            external: true,
            externalIconAriaLabel: 'Opens in a new tab',
          },
          {
            type: 'button',
            iconName: 'notification',
            ariaLabel: 'Notifications (2 unread)',
            badge: true,
            disableUtilityCollapse: true,
            onClick: () => setLog('Opened notifications.'),
          },
          {
            type: 'menu-dropdown',
            text: 'Dana Ruiz',
            iconName: 'person',
            title: 'Dana Ruiz',
            description: 'dana@annex.example',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'sign-out', text: 'Sign out', iconName: 'sign-out' },
            ],
            onItemClick: event => setLog(`Chose ${event.detail.id} from the account menu.`),
          },
        ]}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {log}
      </Box>
    </SpaceBetween>
  );
}
