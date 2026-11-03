// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '@ordinate/components/alert';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import ErrorBoundary from '@ordinate/components/error-boundary';
import SpaceBetween from '@ordinate/components/space-between';

function NodeList({ broken }: { broken: boolean }) {
  if (broken) {
    throw new Error('Node north-annex-07 has no region.');
  }
  return <Box>12 nodes in us-mountain-1. All passed their last health check.</Box>;
}

export default function CustomFallback() {
  const [broken, setBroken] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = () => {
    setBroken(false);
    setAttempt(current => current + 1);
  };

  return (
    <SpaceBetween size="m">
      <Box>
        <Button onClick={() => setBroken(true)} disabled={broken}>
          Break the node list
        </Button>
      </Box>
      <ErrorBoundary
        key={attempt}
        errorBoundaryId="node-list"
        renderFallback={({ error }) => (
          <Alert type="fault" header="The node list could not be shown" action={<Button onClick={retry}>Try again</Button>}>
            {error.message} The rest of the page still works.
          </Alert>
        )}
      >
        <NodeList broken={broken} />
      </ErrorBoundary>
    </SpaceBetween>
  );
}
