// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import DateInput from '@ordinate/components/date-input';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function States() {
  return (
    <SpaceBetween size="l">
      <FormField label="Survey completed" description="Set by the surveyor when the report was signed.">
        <DateInput value="2026-10-02" readOnly={true} />
      </FormField>
      <FormField label="Handover date" description="Available once the snagging list is closed.">
        <DateInput value="" placeholder="YYYY/MM/DD" disabled={true} />
      </FormField>
    </SpaceBetween>
  );
}
