// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import DatePicker from '@ordinate/components/date-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function States() {
  return (
    <SpaceBetween size="l">
      <FormField label="Permit issued" description="Recorded by the council.">
        <DatePicker value="2026-09-08" readOnly={true} />
      </FormField>
      <FormField label="Completion date" description="Set once every inspection has passed.">
        <DatePicker value="" placeholder="YYYY/MM/DD" disabled={true} />
      </FormField>
    </SpaceBetween>
  );
}
