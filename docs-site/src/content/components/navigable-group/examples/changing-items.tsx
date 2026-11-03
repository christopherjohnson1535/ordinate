// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Button from '@ordinate/components/button';
import NavigableGroup, { NavigableGroupProps } from '@ordinate/components/navigable-group';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

export default function ChangingItems() {
  const group = useRef<NavigableGroupProps.Ref>(null);
  const [locked, setLocked] = useState(false);

  return (
    <SpaceBetween size="m">
      <NavigableGroup
        ref={group}
        navigationDirection="horizontal"
        role="toolbar"
        ariaLabel="Sheet actions"
        getItemKey={element => element.dataset.action ?? ''}
      >
        <SpaceBetween direction="horizontal" size="xs">
          <Button data-action="print">Print</Button>
          <Button data-action="export">Export</Button>
          <Button data-action="revise" disabled={locked}>
            Revise
          </Button>
          <Button data-action="issue" disabled={locked}>
            Issue
          </Button>
        </SpaceBetween>
      </NavigableGroup>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Toggle checked={locked} onChange={event => setLocked(event.detail.checked)}>
          Sheet locked
        </Toggle>
        <Button variant="link" onClick={() => group.current?.focus()}>
          Focus the toolbar
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}
