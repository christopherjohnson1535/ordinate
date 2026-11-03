// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import SegmentedControl from '@ordinate/components/segmented-control';

export default function WithLabel() {
  const [tier, setTier] = useState('standard');

  return (
    <FormField
      label="Storage tier"
      description="Archive is for projects older than a year."
      constraintText="Archive needs a retention policy on the project."
    >
      <SegmentedControl
        label="Storage tier"
        selectedId={tier}
        onChange={event => setTier(event.detail.selectedId)}
        options={[
          { id: 'fast', text: 'Fast' },
          { id: 'standard', text: 'Standard' },
          { id: 'archive', text: 'Archive', disabled: true },
        ]}
      />
    </FormField>
  );
}
