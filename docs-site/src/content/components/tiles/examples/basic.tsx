// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Tiles from '@ordinate/components/tiles';

export default function Basic() {
  const [deployment, setDeployment] = useState<string | null>('service');

  return (
    <FormField stretch={true} label="Deployment type" description="You cannot change this after the first deploy.">
      <Tiles
        value={deployment}
        onChange={event => setDeployment(event.detail.value)}
        items={[
          {
            value: 'service',
            label: 'Service',
            description: 'Runs all the time behind a load balancer. For APIs such as atrium-api.',
          },
          {
            value: 'job',
            label: 'Scheduled job',
            description: 'Starts on a timetable, runs to the end and stops. For reports and clean-up.',
          },
          {
            value: 'worker',
            label: 'Worker',
            description: 'Takes tasks from a queue, scaling with its length. For uploads and exports.',
          },
        ]}
      />
    </FormField>
  );
}
