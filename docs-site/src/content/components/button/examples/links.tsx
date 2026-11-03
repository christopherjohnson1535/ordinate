// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function Links() {
  return (
    <SpaceBetween direction="horizontal" size="s" alignItems="center">
      <Button variant="primary" href="#/components/button">
        Edit settings
      </Button>
      <Button href="#/components/button">Open the log</Button>
      <Button href="https://github.com/christopherjohnson1535/ordinate" external={true}>
        Source on GitHub
      </Button>
    </SpaceBetween>
  );
}
