// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Steps from '@ordinate/components/steps';

export default function Horizontal() {
  return (
    <Steps
      orientation="horizontal"
      ariaLabel="Repair of a Pashley Roadster"
      steps={[
        { header: 'Booked in', status: 'complete', statusIconAriaLabel: 'Done', details: 'Tue 9:00' },
        { header: 'On the stand', status: 'complete', statusIconAriaLabel: 'Done', details: 'Tue 10:30' },
        { header: 'Waiting for parts', status: 'underway', statusIconAriaLabel: 'In progress', details: 'Due Wed' },
        { header: 'Ready to collect', status: 'waiting', statusIconAriaLabel: 'Not started' },
      ]}
    />
  );
}
