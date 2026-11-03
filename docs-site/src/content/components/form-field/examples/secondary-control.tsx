// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function SecondaryControl() {
  const [token, setToken] = useState('ann-7f3k29qd');
  const [result, setResult] = useState('Nothing copied yet.');

  return (
    <SpaceBetween size="l">
      <FormField
        label="Deploy token"
        description="Used by the build runner to push images."
        secondaryControl={
          <Button
            formAction="none"
            fullWidth={true}
            onClick={() => setToken(`ann-${Math.random().toString(36).slice(2, 10)}`)}
          >
            Rotate
          </Button>
        }
      >
        <Input value={token} readOnly={true} />
      </FormField>
      <FormField
        label="Endpoint"
        stretch={true}
        secondaryControl={
          <Button formAction="none" iconName="copy" onClick={() => setResult('Endpoint copied.')}>
            Copy endpoint
          </Button>
        }
      >
        <Input value="https://api.north-annex.internal" readOnly={true} />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        {result}
      </Box>
    </SpaceBetween>
  );
}
