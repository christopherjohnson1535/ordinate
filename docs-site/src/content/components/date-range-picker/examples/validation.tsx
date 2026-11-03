// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import DateRangePicker, { DateRangePickerProps } from '@ordinate/components/date-range-picker';
import FormField from '@ordinate/components/form-field';

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
  { key: 'previous-30-days', amount: 30, unit: 'day', type: 'relative' },
];

const dayInMs = 86_400_000;
const unitInDays: Record<DateRangePickerProps.TimeUnit, number> = {
  second: 1 / 86_400,
  minute: 1 / 1440,
  hour: 1 / 24,
  day: 1,
  week: 7,
  month: 31,
  year: 366,
};

// The usage report keeps 31 days of data.
function isValidRange(range: DateRangePickerProps.Value | null): DateRangePickerProps.ValidationResult {
  if (range === null) {
    return { valid: false, errorMessage: 'Choose a range for the report.' };
  }
  const days =
    range.type === 'absolute'
      ? (Date.parse(range.endDate) - Date.parse(range.startDate)) / dayInMs
      : range.amount * unitInDays[range.unit];
  return days > 31 ? { valid: false, errorMessage: 'Choose a range of 31 days or less.' } : { valid: true };
}

export default function Validation() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>(null);

  return (
    <FormField label="Report period" constraintText="Up to 31 days.">
      <DateRangePicker
        value={value}
        onChange={event => setValue(event.detail.value)}
        relativeOptions={relativeOptions}
        isValidRange={isValidRange}
        dateOnly={true}
        showClearButton={false}
        placeholder="Choose a report period"
      />
    </FormField>
  );
}
