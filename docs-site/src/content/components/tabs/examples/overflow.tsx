// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Tabs from '@ordinate/components/tabs';

const zones = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

export default function Overflow() {
  return (
    <Tabs
      ariaLabel="Zones of us-mountain-1"
      kind="resource"
      tabs={zones.map((zone, index) => ({
        id: zone,
        label: `us-mountain-1${zone}`,
        reference: `R${index + 1}`,
        content: (
          <Box color="text-body-secondary">
            Capacity report for zone us-mountain-1{zone}: {40 + index * 3}% of cores in use.
          </Box>
        ),
      }))}
    />
  );
}
