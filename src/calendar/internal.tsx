// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useState } from 'react';
import clsx from 'clsx';

import { GridHeader, MonthGrid, useGridKeyboard, YearGrid } from '../internal/components/calendar-grid';
import {
  addMonths,
  addYears,
  isSameDay,
  isSameMonth,
  startOfMonth,
  today as getToday,
} from '../internal/dates/arithmetic';
import { formatIsoValue, parseIsoValue } from '../internal/dates/iso';
import { formatMonthYear, formatYear, getWeekStart, resolveLocale } from '../internal/dates/locale';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { CalendarProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalCalendarProps extends CalendarProps {
  /**
   * Lets other components position the calendar. Not part of the public API.
   */
  className?: string;
  /**
   * Called whenever the user picks an enabled date, even the one already selected, so a popup
   * can close. Not part of the public API.
   */
  onPick?: (value: string) => void;
}

export const InternalCalendar = React.forwardRef(
  (
    {
      value,
      onChange,
      isDateEnabled,
      dateDisabledReason,
      locale: localeProp,
      startOfWeek,
      granularity = 'day',
      ariaLabelledby,
      ariaDescribedby,
      ariaLabel,
      i18nStrings,
      className,
      onPick,
      ...rest
    }: InternalCalendarProps,
    ref: React.Ref<CalendarProps.Ref>
  ) => {
    const i18n = useInternalI18n('calendar');
    const baseId = useId();
    const titleId = `${baseId}title`;
    const locale = resolveLocale(localeProp);
    const weekStart = startOfWeek ?? getWeekStart(locale);
    const isMonthPicker = granularity === 'month';
    const today = getToday();

    const selected = parseIsoValue(value, granularity);
    const [focusedDate, setFocusedDate] = useState(() => selected ?? (isMonthPicker ? startOfMonth(today) : today));
    // The date under the pointer, or the focused date while the grid has focus, whose disabled reason is shown.
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [gridHasFocus, setGridHasFocus] = useState(false);

    // A value chosen elsewhere, such as typed into a date input, brings its month into view.
    useEffect(() => {
      const next = parseIsoValue(value, granularity);
      if (next) {
        setFocusedDate(next);
      }
    }, [value, granularity]);

    const isEnabled = (date: Date) => isDateEnabled?.(date) ?? true;
    const isSelected = (date: Date) => (isMonthPicker ? isSameMonth(date, selected) : isSameDay(date, selected));

    const select = (date: Date) => {
      if (!isEnabled(date)) {
        return;
      }
      const next = formatIsoValue(date, granularity);
      if (!isSelected(date)) {
        fireNonCancelableEvent(onChange, { value: next });
      }
      onPick?.(next);
    };

    const keyboard = useGridKeyboard({
      granularity,
      weekStart,
      focusedDate,
      onMove: setFocusedDate,
      onSelect: select,
    });
    useImperativeHandle(ref, () => ({ focus: keyboard.focus }));

    const page = (step: number) =>
      setFocusedDate(current => (isMonthPicker ? addYears(current, step) : addMonths(current, step)));

    const reasonDate = hoveredDate ?? (gridHasFocus ? focusedDate : null);
    const reason = reasonDate && !isEnabled(reasonDate) ? dateDisabledReason?.(reasonDate) : undefined;

    const gridProps = {
      locale,
      focusedDate,
      today,
      ariaLabelledby: [ariaLabelledby, titleId].filter(Boolean).join(' '),
      ariaDescribedby,
      isEnabled,
      getCellState: (date: Date) => ({ selected: isSelected(date) }),
      getDisabledReason: dateDisabledReason,
      onSelect: select,
      onFocusDate: setFocusedDate,
      onHoverDate: setHoveredDate,
      onKeyDown: keyboard.onKeyDown,
    };

    return (
      <div
        {...rest}
        ref={keyboard.containerRef}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
        className={clsx(styles.root, className)}
        onFocus={event => setGridHasFocus(event.target instanceof HTMLTableCellElement)}
        onBlur={() => setGridHasFocus(false)}
      >
        <GridHeader
          title={isMonthPicker ? formatYear(focusedDate, locale) : formatMonthYear(focusedDate, locale)}
          titleId={titleId}
          previousAriaLabel={
            isMonthPicker
              ? i18n('previousYearAriaLabel', i18nStrings?.previousYearAriaLabel)
              : i18n('previousMonthAriaLabel', i18nStrings?.previousMonthAriaLabel)
          }
          nextAriaLabel={
            isMonthPicker
              ? i18n('nextYearAriaLabel', i18nStrings?.nextYearAriaLabel)
              : i18n('nextMonthAriaLabel', i18nStrings?.nextMonthAriaLabel)
          }
          onPrevious={() => page(-1)}
          onNext={() => page(1)}
        />
        {isMonthPicker ? (
          <YearGrid
            {...gridProps}
            year={focusedDate}
            currentAriaLabel={i18n('currentMonthAriaLabel', i18nStrings?.currentMonthAriaLabel)}
          />
        ) : (
          <MonthGrid
            {...gridProps}
            month={focusedDate}
            weekStart={weekStart}
            currentAriaLabel={i18n('todayAriaLabel', i18nStrings?.todayAriaLabel)}
          />
        )}
        {dateDisabledReason && (
          <div className={styles['disabled-reason']} aria-hidden="true">
            {reason}
          </div>
        )}
      </div>
    );
  }
);
