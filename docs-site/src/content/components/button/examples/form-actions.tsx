// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function FormActions() {
  const [result, setResult] = useState('Nothing saved yet.');

  return (
    <SpaceBetween size="m">
      <Box float="right">
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="link" onClick={() => setResult('Changes discarded.')}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setResult('Changes saved.')}>
            Save changes
          </Button>
        </SpaceBetween>
      </Box>
      <Box color="text-body-secondary" fontSize="body-s">
        {result}
      </Box>
    </SpaceBetween>
  );
}
