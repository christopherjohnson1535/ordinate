// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';

export default function HeadingLevel() {
  return (
    <SpaceBetween size="s">
      <Header variant="h2" headingTagOverride="h3" description="Set as an h3, under the page's h2 sections.">
        Maintenance window
      </Header>
      <Box>Sundays from 02:00 to 04:00 UTC.</Box>
    </SpaceBetween>
  );
}
