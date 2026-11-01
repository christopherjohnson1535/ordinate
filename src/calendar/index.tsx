// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CalendarProps } from './interfaces';
import { InternalCalendar } from './internal';

export type { CalendarProps };

const Calendar = React.forwardRef(
  (
    {
      value,
      onChange,
      isDateEnabled,
      dateDisabledReason,
      locale,
      startOfWeek,
      granularity = 'day',
      ariaLabelledby,
      ariaDescribedby,
      ariaLabel,
      i18nStrings,
      ...props
    }: CalendarProps,
    ref: React.Ref<CalendarProps.Ref>
  ) => (
    <InternalCalendar
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      isDateEnabled={isDateEnabled}
      dateDisabledReason={dateDisabledReason}
      locale={locale}
      startOfWeek={startOfWeek}
      granularity={granularity}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      i18nStrings={i18nStrings}
    />
  )
);

Calendar.displayName = 'Calendar';

export default Calendar;
