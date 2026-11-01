// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import DatePicker, { DatePickerProps } from '~components/date-picker';
import FormField from '~components/form-field';

import styles from './styles.module.scss';

function Field({
  label,
  initial = '',
  errorText,
  warningText,
  ...props
}: Omit<DatePickerProps, 'value'> & { label: string; initial?: string; errorText?: string; warningText?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <FormField label={label} errorText={errorText} warningText={warningText} description={`Value: "${value}"`}>
      <DatePicker {...props} value={value} onChange={event => setValue(event.detail.value)} />
    </FormField>
  );
}

const isWeekday = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6;

export default function DatePickerPermutations() {
  return (
    <article className={styles.page}>
      <h1>Date picker permutations</h1>
      <div className={styles.grid}>
        <Field label="Delivery date" placeholder="YYYY/MM/DD" />
        <Field label="Start date" initial="2026-03-05" placeholder="YYYY/MM/DD" />
        <Field
          label="Weekdays only"
          initial="2026-03-11"
          placeholder="YYYY/MM/DD"
          isDateEnabled={isWeekday}
          dateDisabledReason={() => 'Deliveries run on weekdays only.'}
        />
        <Field label="Billing month" granularity="month" initial="2026-03" placeholder="YYYY/MM" />
        <Field label="Read-only" readOnly={true} initial="2026-03-05" />
        <Field label="Disabled" disabled={true} initial="2026-03-05" />
        <Field label="Invalid" initial="2026-03-05" errorText="Choose a date in the future." />
        <Field label="Warning" initial="2026-03-05" warningText="This date is a public holiday." />
        <Field label="Expands to the viewport" expandToViewport={true} placeholder="YYYY/MM/DD" />
      </div>
    </article>
  );
}
