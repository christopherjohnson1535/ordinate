// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import FormField from '@ordinate/components/form-field';
import TimeInput from '@ordinate/components/time-input';

export default function Formats() {
  const [hour, setHour] = useState('06');
  const [minute, setMinute] = useState('06:15');
  const [second, setSecond] = useState('06:15:42');

  return (
    <ColumnLayout columns={3}>
      <FormField label="Backup hour" constraintText="hh" layout="stacked">
        <TimeInput value={hour} onChange={event => setHour(event.detail.value)} format="hh" placeholder="hh" />
      </FormField>
      <FormField label="Backup starts" constraintText="hh:mm" layout="stacked">
        <TimeInput value={minute} onChange={event => setMinute(event.detail.value)} format="hh:mm" placeholder="hh:mm" />
      </FormField>
      <FormField label="Last entry" constraintText="hh:mm:ss" layout="stacked">
        <TimeInput value={second} onChange={event => setSecond(event.detail.value)} placeholder="hh:mm:ss" />
      </FormField>
    </ColumnLayout>
  );
}
