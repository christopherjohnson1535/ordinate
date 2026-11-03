// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import ExpandableSection from '@ordinate/components/expandable-section';
import SpaceBetween from '@ordinate/components/space-between';

export default function Default() {
  return (
    <SpaceBetween size="m">
      <ExpandableSection headerText="Retry policy" defaultExpanded={true}>
        Failed requests are retried with exponential backoff, starting at 2 seconds and stopping after 5 attempts.
      </ExpandableSection>
      <ExpandableSection headerText="Advanced settings" headerDescription="Timeouts, keep-alive and request logging">
        <SpaceBetween size="xxs">
          <Box>Connection timeout: 10 s</Box>
          <Box>Keep-alive: 60 s</Box>
          <Box>Request logging: errors only</Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
