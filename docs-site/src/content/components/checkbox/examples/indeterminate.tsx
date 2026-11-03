// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Checkbox from '@ordinate/components/checkbox';
import SpaceBetween from '@ordinate/components/space-between';

const regions = ['us-mountain-1', 'us-coast-2', 'eu-north-1'];

export default function Indeterminate() {
  const [selected, setSelected] = useState<string[]>(['us-mountain-1']);
  const all = selected.length === regions.length;
  const some = selected.length > 0 && !all;

  return (
    <SpaceBetween size="xs">
      <Checkbox
        checked={all}
        indeterminate={some}
        ariaControls="replica-regions"
        onChange={event => setSelected(event.detail.checked ? regions : [])}
      >
        Replicate to all regions
      </Checkbox>
      <Box padding={{ left: 'l' }}>
        <div id="replica-regions">
          <SpaceBetween size="xs">
            {regions.map(region => (
              <Checkbox
                key={region}
                checked={selected.includes(region)}
                onChange={event =>
                  setSelected(event.detail.checked ? [...selected, region] : selected.filter(value => value !== region))
                }
              >
                {region}
              </Checkbox>
            ))}
          </SpaceBetween>
        </div>
      </Box>
    </SpaceBetween>
  );
}
