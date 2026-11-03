// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import Tooltip from '@ordinate/components/tooltip';

export default function IconButtons() {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Tooltip content="Refresh the node list">
        <Button variant="icon" iconName="refresh" ariaLabel="Refresh" />
      </Tooltip>
      <Tooltip content="Download the log of na-03">
        <Button variant="icon" iconName="download" ariaLabel="Download log" />
      </Tooltip>
      <Tooltip content="Remove na-03. Running jobs move to other nodes first.">
        <Button variant="icon" iconName="remove" ariaLabel="Remove node" />
      </Tooltip>
    </SpaceBetween>
  );
}
