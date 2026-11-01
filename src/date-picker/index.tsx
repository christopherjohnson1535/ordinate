// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DatePickerProps } from './interfaces';
import { InternalDatePicker } from './internal';

export type { DatePickerProps };

const DatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      isDateEnabled,
      dateDisabledReason,
      granularity = 'day',
      placeholder,
      openCalendarAriaLabel,
      locale,
      startOfWeek,
      expandToViewport = false,
      disabled = false,
      readOnly = false,
      autoFocus = false,
      ariaLabel,
      ariaRequired,
      name,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      i18nStrings,
      ...props
    }: DatePickerProps,
    ref: React.Ref<DatePickerProps.Ref>
  ) => (
    <InternalDatePicker
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      isDateEnabled={isDateEnabled}
      dateDisabledReason={dateDisabledReason}
      granularity={granularity}
      placeholder={placeholder}
      openCalendarAriaLabel={openCalendarAriaLabel}
      locale={locale}
      startOfWeek={startOfWeek}
      expandToViewport={expandToViewport}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
      i18nStrings={i18nStrings}
    />
  )
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
