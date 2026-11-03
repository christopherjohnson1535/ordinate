// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import ExpandableSection from '@ordinate/components/expandable-section';
import SpaceBetween from '@ordinate/components/space-between';

export default function Controlled() {
  const [expanded, setExpanded] = useState(false);

  return (
    <SpaceBetween size="m">
      <Button onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide the log' : 'Show the log'}</Button>
      <ExpandableSection
        headerText="Deployment log"
        expanded={expanded}
        onChange={event => setExpanded(event.detail.expanded)}
      >
        <SpaceBetween size="xxs">
          <Box variant="samp">09:14 build 2026.11.02-3 started</Box>
          <Box variant="samp">09:17 image pushed to the registry</Box>
          <Box variant="samp">09:21 rollout finished on 12 of 12 nodes</Box>
        </SpaceBetween>
      </ExpandableSection>
      <Box color="text-body-secondary" fontSize="body-s">
        The log is {expanded ? 'open' : 'closed'}.
      </Box>
    </SpaceBetween>
  );
}
