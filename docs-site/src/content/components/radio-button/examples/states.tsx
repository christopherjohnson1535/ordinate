// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import FormField from '@ordinate/components/form-field';
import RadioButton from '@ordinate/components/radio-button';
import SpaceBetween from '@ordinate/components/space-between';

export default function States() {
  const [tier, setTier] = useState('standard');

  return (
    <ColumnLayout columns={2}>
      <FormField label="Storage tier" layout="stacked">
        <SpaceBetween size="xs">
          <RadioButton name="tier" value="standard" checked={tier === 'standard'} onSelect={() => setTier('standard')}>
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
      </FormField>
      <FormField label="Region" description="Set by your organization." layout="stacked">
        <SpaceBetween size="xs">
          <RadioButton name="region" value="us-mountain-1" checked={true} readOnly={true}>
            us-mountain-1
          </RadioButton>
          <RadioButton name="region" value="us-coast-2" checked={false} readOnly={true}>
            us-coast-2
          </RadioButton>
        </SpaceBetween>
      </FormField>
    </ColumnLayout>
  );
}
