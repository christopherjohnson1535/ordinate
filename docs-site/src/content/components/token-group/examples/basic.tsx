// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import TokenGroup, { TokenGroupProps } from '@ordinate/components/token-group';

const zones: TokenGroupProps.Item[] = [
  { label: 'us-mountain-1a', description: 'Denver' },
  { label: 'us-mountain-1b', description: 'Denver' },
  { label: 'us-coastal-2a', description: 'Portland' },
  { label: 'eu-north-1a', description: 'Stockholm' },
];

export default function Basic() {
  const [items, setItems] = useState(zones);

  if (items.length === 0) {
    return (
      <Box>
        <Button onClick={() => setItems(zones)}>Pick the zones again</Button>
      </Box>
    );
  }

  return (
    <TokenGroup
      ariaLabel="Picked zones"
      items={items}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.itemIndex))}
    />
  );
}
