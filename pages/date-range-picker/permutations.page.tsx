// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import FormField from '~components/form-field';

import styles from './styles.module.scss';

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
  { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
];

const dayOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
  { key: 'previous-30-days', amount: 30, unit: 'day', type: 'relative' },
  { key: 'previous-1-year', amount: 1, unit: 'year', type: 'relative' },
];

// Ranges longer than 90 days are refused, to show a consumer's own check.
function isValidRange(range: DateRangePickerProps.Value | null): DateRangePickerProps.ValidationResult {
  if (range?.type === 'absolute') {
    const days = (Date.parse(range.endDate) - Date.parse(range.startDate)) / 86_400_000;
    if (days > 90) {
      return { valid: false, errorMessage: 'Choose a range of 90 days or less.' };
    }
  }
  return { valid: true };
}

function Field({
  label,
  initial = null,
  errorText,
  warningText,
  ...props
}: Omit<DateRangePickerProps, 'value'> & {
  label: string;
  initial?: DateRangePickerProps.Value | null;
  errorText?: string;
  warningText?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <FormField
      label={label}
      errorText={errorText}
      warningText={warningText}
      description={`Value: ${JSON.stringify(value)}`}
    >
      <DateRangePicker {...props} value={value} onChange={event => setValue(event.detail.value)} />
    </FormField>
  );
}

export default function DateRangePickerPermutations() {
  return (
    <article className={styles.page}>
      <h1>Date range picker permutations</h1>
      <div className={styles.grid}>
        <Field
          label="Log window"
          placeholder="Filter by a date and time range"
          relativeOptions={relativeOptions}
          isValidRange={isValidRange}
        />
        <Field
          label="Absolute range"
          placeholder="Filter by a date and time range"
          relativeOptions={relativeOptions}
          initial={{ type: 'absolute', startDate: '2026-03-05T08:00:00', endDate: '2026-03-18T17:30:00' }}
          isValidRange={isValidRange}
        />
        <Field
          label="Relative range"
          relativeOptions={relativeOptions}
          initial={{ type: 'relative', amount: 30, unit: 'minute', key: 'previous-30-minutes' }}
        />
        <Field
          label="Dates only"
          placeholder="Choose a date range"
          dateOnly={true}
          relativeOptions={dayOptions}
          rangeSelectorMode="absolute-only"
          initial={{ type: 'absolute', startDate: '2026-03-05', endDate: '2026-03-12' }}
          isDateEnabled={date => date.getDay() !== 0 && date.getDay() !== 6}
          dateDisabledReason={() => 'Reports run on weekdays only.'}
        />
        <Field
          label="Relative only"
          placeholder="Choose a period"
          dateOnly={true}
          relativeOptions={dayOptions}
          rangeSelectorMode="relative-only"
          showClearButton={false}
        />
        <Field label="Hours and minutes" timeInputFormat="hh:mm" placeholder="Choose a range" />
        <Field
          label="Read-only"
          readOnly={true}
          initial={{ type: 'relative', amount: 6, unit: 'hour', key: 'previous-6-hours' }}
          relativeOptions={relativeOptions}
        />
        <Field label="Disabled" disabled={true} placeholder="Choose a range" />
        <Field label="Invalid" errorText="Choose a range that ends today." placeholder="Choose a range" />
        <Field label="Warning" warningText="Large ranges load slowly." placeholder="Choose a range" />
      </div>
    </article>
  );
}
