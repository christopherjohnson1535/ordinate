// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Divider from '@ordinate/components/divider';
import SpaceBetween from '@ordinate/components/space-between';

export default function Label() {
  const [method, setMethod] = useState<string | null>(null);

  return (
    <SpaceBetween size="m">
      <Button fullWidth={true} variant="primary" onClick={() => setMethod('passkey')}>
        Sign in with a passkey
      </Button>
      <Divider>or</Divider>
      <Button fullWidth={true} onClick={() => setMethod('password')}>
        Sign in with a password
      </Button>
      <Box color="text-body-secondary" fontSize="body-s">
        {method ? `Signing in with a ${method}.` : 'Choose how to sign in.'}
      </Box>
    </SpaceBetween>
  );
}
