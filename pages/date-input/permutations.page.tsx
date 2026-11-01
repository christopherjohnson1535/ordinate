// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import DateInput, { DateInputProps } from '~components/date-input';
import FormField from '~components/form-field';

import styles from './styles.module.scss';

function Field({
  label,
  initial = '',
  errorText,
  warningText,
  ...props
}: Omit<DateInputProps, 'value'> & { label: string; initial?: string; errorText?: string; warningText?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <FormField label={label} errorText={errorText} warningText={warningText} description={`Value: "${value}"`}>
      <DateInput {...props} value={value} onChange={event => setValue(event.detail.value)} />
    </FormField>
  );
}

export default function DateInputPermutations() {
  return (
    <article className={styles.page}>
      <h1>Date input permutations</h1>
      <div className={styles.grid}>
        <Field label="Empty" placeholder="YYYY/MM/DD" />
        <Field label="Filled" initial="2026-03-05" placeholder="YYYY/MM/DD" />
        <Field label="Partial" initial="2026-03" placeholder="YYYY/MM/DD" />
        <Field label="Month granularity" granularity="month" initial="2026-03" placeholder="YYYY/MM" />
        <Field label="Read-only" readOnly={true} initial="2026-03-05" />
        <Field label="Disabled" disabled={true} initial="2026-03-05" />
        <Field label="Invalid" initial="2026-03-05" errorText="Choose a date in the future." />
        <Field label="Warning" initial="2026-03-05" warningText="This date is a public holiday." />
      </div>
    </article>
  );
}
