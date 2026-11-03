// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Steps from '@ordinate/components/steps';

export default function Failed() {
  return (
    <Steps
      ariaLabel="Volume setup"
      steps={[
        { header: 'Create volume vol-0a51', status: 'complete', statusIconAriaLabel: 'Done' },
        {
          header: 'Attach the volume to na-04',
          status: 'fault',
          statusIconAriaLabel: 'Failed',
          details: 'na-04 is in zone us-mountain-1b and the volume is in 1a. Create the volume in 1b and try again.',
        },
        { header: 'Format and mount', status: 'halted', statusIconAriaLabel: 'Not run' },
      ]}
    />
  );
}
