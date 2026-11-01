// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DateRangePickerProps } from './interfaces';
import { InternalDateRangePicker } from './internal';

export type { DateRangePickerProps };

const DateRangePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      relativeOptions,
      rangeSelectorMode = 'default',
      isValidRange,
      isDateEnabled,
      dateDisabledReason,
      timeInputFormat = 'hh:mm:ss',
      dateOnly = false,
      showClearButton = true,
      placeholder,
      locale,
      startOfWeek,
      expandToViewport = false,
      disabled = false,
      readOnly = false,
      ariaLabel,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      i18nStrings,
      ...props
    }: DateRangePickerProps,
    ref: React.Ref<DateRangePickerProps.Ref>
  ) => (
    <InternalDateRangePicker
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      relativeOptions={relativeOptions}
      rangeSelectorMode={rangeSelectorMode}
      isValidRange={isValidRange}
      isDateEnabled={isDateEnabled}
      dateDisabledReason={dateDisabledReason}
      timeInputFormat={timeInputFormat}
      dateOnly={dateOnly}
      showClearButton={showClearButton}
      placeholder={placeholder}
      locale={locale}
      startOfWeek={startOfWeek}
      expandToViewport={expandToViewport}
      disabled={disabled}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
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

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
