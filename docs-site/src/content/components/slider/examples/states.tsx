// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Slider from '@ordinate/components/slider';

const percent = (value: number) => `${value}%`;

export default function States() {
  const [budget, setBudget] = useState(95);
  const [sampling, setSampling] = useState(60);

  return (
    <Form>
      <FormField
        label="Budget alert"
        description="Of the monthly budget for north-annex."
        errorText={budget > 90 ? 'Set the alert at 90% or lower, so there is time to act.' : undefined}
      >
        <Slider
          value={budget}
          onChange={event => setBudget(event.detail.value)}
          min={50}
          max={100}
          step={5}
          valueFormatter={percent}
        />
      </FormField>
      <FormField
        label="Trace sampling"
        warningText={sampling > 50 ? 'Above 50%, tracing slows requests noticeably.' : undefined}
      >
        <Slider
          value={sampling}
          onChange={event => setSampling(event.detail.value)}
          min={0}
          max={100}
          step={10}
          valueFormatter={percent}
        />
      </FormField>
      <FormField label="Storage quota" description="Set by your organization.">
        <Slider value={40} min={0} max={100} readOnly={true} valueFormatter={value => `${value} TiB`} />
      </FormField>
      <FormField label="GPU nodes" description="Not offered in us-mountain-1.">
        <Slider value={0} min={0} max={8} disabled={true} />
      </FormField>
    </Form>
  );
}
