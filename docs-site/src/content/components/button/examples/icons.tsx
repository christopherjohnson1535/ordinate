// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function Icons() {
  return (
    <SpaceBetween direction="horizontal" size="s" alignItems="center">
      <Button iconName="add">Add node</Button>
      <Button iconName="chevron-right" iconAlign="right">
        Next step
      </Button>
      <Button iconName="download" variant="link">
        Download report
      </Button>
      <Button variant="icon" iconName="refresh" ariaLabel="Refresh the list" />
      <Button variant="icon" iconName="adjust" ariaLabel="Table preferences" />
    </SpaceBetween>
  );
}
