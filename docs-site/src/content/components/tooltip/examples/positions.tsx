// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import Tooltip from '@ordinate/components/tooltip';

export default function Positions() {
  return (
    <SpaceBetween direction="horizontal" size="m">
      <Tooltip position="top" content="Shown above">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip position="right" content="Shown at the end">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip position="bottom" content="Shown below">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip position="left" content="Shown at the start">
        <Button>Left</Button>
      </Tooltip>
    </SpaceBetween>
  );
}
