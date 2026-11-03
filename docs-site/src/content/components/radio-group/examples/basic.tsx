// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import RadioGroup from '@ordinate/components/radio-group';

export default function Basic() {
  const [rollout, setRollout] = useState<string | null>('rolling');

  return (
    <FormField label="Rollout" description="How atrium-api moves to the new image.">
      <RadioGroup
        value={rollout}
        onChange={event => setRollout(event.detail.value)}
        items={[
          {
            value: 'rolling',
            label: 'Rolling',
            description: 'Replaces one node at a time. No downtime; takes about 20 minutes.',
          },
          {
            value: 'blue-green',
            label: 'Blue/green',
            description: 'Starts a second set of 6 nodes, then switches traffic. Doubles the cost for an hour.',
          },
          {
            value: 'all-at-once',
            label: 'All at once',
            description: 'Restarts every node together. Fastest, with a short outage.',
          },
        ]}
      />
    </FormField>
  );
}
