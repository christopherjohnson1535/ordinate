// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Icon from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';
import Token from '@ordinate/components/token';

export default function Inline() {
  return (
    <SpaceBetween size="s">
      <Box>
        atrium-api runs <Token variant="inline" label="api:v7" /> on six nodes, and north-annex-web runs{' '}
        <Token variant="inline" label="web:v2" />.
      </Box>
      <Box>
        Attached:{' '}
        <Token
          variant="inline"
          icon={<Icon name="file" />}
          label="north-annex-ground-floor-plan-revision-c-issued-for-construction.pdf"
          tooltipContent="drawings/north-annex/A-02/north-annex-ground-floor-plan-revision-c-issued-for-construction.pdf"
        />
      </Box>
    </SpaceBetween>
  );
}
