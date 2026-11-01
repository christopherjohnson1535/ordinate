// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import TimeInput, { TimeInputProps } from '~components/time-input';

import styles from './styles.module.scss';

function Field({
  label,
  initial = '',
  errorText,
  warningText,
  ...props
}: Omit<TimeInputProps, 'value'> & { label: string; initial?: string; errorText?: string; warningText?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <FormField label={label} errorText={errorText} warningText={warningText} description={`Value: "${value}"`}>
      <TimeInput {...props} value={value} onChange={event => setValue(event.detail.value)} />
    </FormField>
  );
}

export default function TimeInputPermutations() {
  return (
    <article className={styles.page}>
      <h1>Time input permutations</h1>
      <div className={styles.grid}>
        <Field label="Hours, minutes, seconds" placeholder="hh:mm:ss" />
        <Field label="Hours and minutes" format="hh:mm" initial="09:30" placeholder="hh:mm" />
        <Field label="Hours" format="hh" initial="17" placeholder="hh" />
        <Field label="12-hour clock" format="hh:mm" use24Hour={false} initial="11:45" placeholder="hh:mm" />
        <Field label="Read-only" readOnly={true} initial="14:30:00" />
        <Field label="Disabled" disabled={true} initial="14:30:00" />
        <Field label="Invalid" initial="03:00:00" errorText="Choose a time within business hours." />
        <Field label="Warning" initial="23:59:59" warningText="Runs late at night." />
      </div>
    </article>
  );
}
