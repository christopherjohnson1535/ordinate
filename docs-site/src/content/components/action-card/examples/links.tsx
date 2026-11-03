// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ActionCard from '@ordinate/components/action-card';
import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import SpaceBetween from '@ordinate/components/space-between';

export default function Links() {
  const [route, setRoute] = useState('No page opened yet.');

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={2}>
        <ActionCard
          header="Review open deployments"
          description="Three deployments are waiting for approval."
          iconName="list-view"
          href="#/deployments"
          onFollow={event => {
            event.preventDefault();
            setRoute(`Routed on the client to ${event.detail.href}`);
          }}
        />
        <ActionCard
          header="Read the release notes"
          description="What changed in version 4.2. Opens in a new tab."
          iconName="open-outside"
          href="https://example.com"
          target="_blank"
        />
      </ColumnLayout>
      <Box color="text-body-secondary" fontSize="body-s">
        {route}
      </Box>
    </SpaceBetween>
  );
}
