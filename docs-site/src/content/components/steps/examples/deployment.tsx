// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';
import Steps from '@ordinate/components/steps';

export default function Deployment() {
  return (
    <SpaceBetween size="s">
      <Box variant="h4" id="steps-rollout-title">
        Rollout of web:v2
      </Box>
      <Steps
        ariaLabelledby="steps-rollout-title"
        steps={[
          { header: 'Check out revision 4f2a91c', status: 'complete', details: '09:14:02 UTC' },
          { header: 'Build image web:v2', status: 'complete', details: '4 minutes 12 seconds' },
          {
            header: 'Run integration tests',
            status: 'caution',
            statusIconAriaLabel: 'Passed with warnings',
            details: (
              <>
                212 passed, 3 skipped.{' '}
                <Link variant="primary" href="#/components/steps">
                  View the report
                </Link>
              </>
            ),
          },
          {
            header: 'Roll out to north-annex-web',
            status: 'loading',
            statusIconAriaLabel: 'In progress',
            details: '3 of 8 nodes updated',
          },
          { header: 'Verify health checks', status: 'waiting', statusIconAriaLabel: 'Not started' },
        ]}
      />
    </SpaceBetween>
  );
}
