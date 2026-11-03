// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [followed, setFollowed] = useState('Nothing followed yet.');

  return (
    <SpaceBetween size="m">
      <BreadcrumbGroup
        ariaLabel="Breadcrumbs"
        items={[
          { text: 'Projects', href: '#/projects' },
          { text: 'North Annex', href: '#/projects/north-annex' },
          { text: 'Services', href: '#/projects/north-annex/services' },
          { text: 'atrium-api', href: '#/projects/north-annex/services/atrium-api' },
        ]}
        onFollow={event => {
          // A client-side router would navigate here instead of the browser.
          event.preventDefault();
          setFollowed(`Followed ${event.detail.text} (${event.detail.href})`);
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {followed}
      </Box>
    </SpaceBetween>
  );
}
