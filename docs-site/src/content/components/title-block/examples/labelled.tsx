// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import TitleBlock from '@ordinate/components/title-block';

export default function Labelled() {
  return (
    <SpaceBetween size="s">
      <Box variant="h3" tagOverride="h3">
        <span id="order-2041">Your order</span>
      </Box>
      <TitleBlock
        ariaLabelledby="order-2041"
        items={[
          { label: 'Order', value: '#2041' },
          { label: 'Collect', value: 'Saturday, 9:30' },
          { label: 'Shop', value: 'Hill Street' },
        ]}
      />
    </SpaceBetween>
  );
}
