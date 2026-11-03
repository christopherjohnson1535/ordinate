// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useState } from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import RadioButton from '@ordinate/components/radio-button';
import SpaceBetween from '@ordinate/components/space-between';

export default function States() {
  const [tier, setTier] = useState('standard');
  const tierId = useId();
  const regionId = useId();

  return (
    <ColumnLayout columns={2}>
      <SpaceBetween size="s">
        <Box variant="h4" tagOverride="h3" id={tierId}>
          Storage tier
        </Box>
        <div role="radiogroup" aria-labelledby={tierId}>
          <SpaceBetween size="xs">
            <RadioButton
              name="tier"
              value="standard"
              checked={tier === 'standard'}
              onSelect={() => setTier('standard')}
            >
              Standard
            </RadioButton>
            <RadioButton name="tier" value="archive" checked={tier === 'archive'} onSelect={() => setTier('archive')}>
              Archive
            </RadioButton>
            <RadioButton
              name="tier"
              value="fast"
              checked={false}
              disabled={true}
              description="Not offered in us-mountain-1."
            >
              Fast
            </RadioButton>
          </SpaceBetween>
        </div>
      </SpaceBetween>
      <SpaceBetween size="s">
        <Box variant="h4" tagOverride="h3" id={regionId}>
          Region, set by your organization
        </Box>
        <div role="radiogroup" aria-labelledby={regionId}>
          <SpaceBetween size="xs">
            <RadioButton name="region" value="us-mountain-1" checked={true} readOnly={true}>
              us-mountain-1
            </RadioButton>
            <RadioButton name="region" value="us-coast-2" checked={false} readOnly={true}>
              us-coast-2
            </RadioButton>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </ColumnLayout>
  );
}
