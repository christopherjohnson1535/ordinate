// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import ErrorBoundary from '@ordinate/components/error-boundary';
import SpaceBetween from '@ordinate/components/space-between';

function UsageSummary({ broken }: { broken: boolean }) {
  if (broken) {
    throw new Error('The usage report for north-annex is malformed.');
  }
  return <Box>north-annex used 4,120 instance hours and 2.4 TB of transfer this month.</Box>;
}

export default function Recover() {
  const [broken, setBroken] = useState(false);
  // Changing the key mounts a new boundary, which clears the error and renders the content again.
  const [attempt, setAttempt] = useState(0);
  const [reported, setReported] = useState('Nothing reported yet.');

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="xs">
        <Button onClick={() => setBroken(true)} disabled={broken}>
          Break the report
        </Button>
        <Button
          variant="primary"
          disabled={!broken}
          onClick={() => {
            setBroken(false);
            setAttempt(current => current + 1);
          }}
        >
          Recover
        </Button>
      </SpaceBetween>
      <Container heading="Usage this month">
        <ErrorBoundary
          key={attempt}
          errorBoundaryId="usage-summary"
          feedbackHref="#/components/error-boundary"
          onError={event => setReported(`${event.detail.errorBoundaryId}: ${event.detail.error.message}`)}
        >
          <UsageSummary broken={broken} />
        </ErrorBoundary>
      </Container>
      <Box color="text-body-secondary" fontSize="body-s">
        onError: {reported}
      </Box>
    </SpaceBetween>
  );
}
