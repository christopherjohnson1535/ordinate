// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useState } from 'react';

import { InternalDateInput } from '../date-input/internal';
import { InternalFormField } from '../form-field/internal';
import { CellState, GridHeader, MonthGrid, useGridKeyboard } from '../internal/components/calendar-grid';
import {
  addMonths,
  compareDays,
  compareMonths,
  isDayBetween,
  isSameDay,
  startOfMonth,
  today as getToday,
} from '../internal/dates/arithmetic';
import { parseIsoDate } from '../internal/dates/iso';
import { formatFullDate, formatMonthYear } from '../internal/dates/locale';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalTimeInput } from '../time-input/internal';
import { DateRangePickerProps } from './interfaces';
import { AbsoluteDraft, pickDay } from './range';
import { useMonthCount } from './use-month-count';

import styles from './styles.css.js';

export interface AbsoluteRangeLabels {
  startDateLabel?: string;
  endDateLabel?: string;
  startTimeLabel?: string;
  endTimeLabel?: string;
  datePlaceholder?: string;
  timePlaceholder?: string;
  constraintText?: string;
  previousMonthAriaLabel?: string;
  nextMonthAriaLabel?: string;
  todayAriaLabel?: string;
  selectedRangeAnnouncement(startDate: string, endDate: string): string | undefined;
}

export interface AbsoluteRangeProps {
  draft: AbsoluteDraft;
  onChange(draft: AbsoluteDraft): void;
  locale: string;
  weekStart: number;
  dateOnly: boolean;
  timeInputFormat: DateRangePickerProps.TimeInputFormat;
  isDateEnabled?: (date: Date) => boolean;
  dateDisabledReason?: (date: Date) => string;
  labels: AbsoluteRangeLabels;
}

export interface AbsoluteRangeRef {
  focus(): void;
}

// Keeps the focused date within the months on show, moving the first month only as far as needed.
function getFirstMonth(first: Date, focused: Date, monthCount: number): Date {
  if (compareMonths(focused, first) < 0) {
    return startOfMonth(focused);
  }
  if (compareMonths(focused, first) > monthCount - 1) {
    return startOfMonth(addMonths(focused, -(monthCount - 1)));
  }
  return first;
}

/**
 * The absolute half of the date range picker: one or two month grids that pick the start and end
 * days, and inputs for the start and end dates and times.
 */
export const AbsoluteRange = React.forwardRef(
  (
    {
      draft,
      onChange,
      locale,
      weekStart,
      dateOnly,
      timeInputFormat,
      isDateEnabled,
      dateDisabledReason,
      labels,
    }: AbsoluteRangeProps,
    ref: React.Ref<AbsoluteRangeRef>
  ) => {
    const baseId = useId();
    const today = getToday();
    const monthCount = useMonthCount();
    const start = parseIsoDate(draft.startDate);
    const end = parseIsoDate(draft.endDate);

    const [focusedDate, setFocusedDate] = useState(() => start ?? today);
    const [firstMonth, setFirstMonth] = useState(() => startOfMonth(start ?? today));
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    const focusDate = (date: Date) => {
      setFocusedDate(date);
      setFirstMonth(current => getFirstMonth(current, date, monthCount));
    };

    // A start date typed into the input brings its month into view.
    useEffect(() => {
      const typed = parseIsoDate(draft.startDate);
      if (typed) {
        setFocusedDate(typed);
        setFirstMonth(current => getFirstMonth(current, typed, monthCount));
      }
    }, [draft.startDate, monthCount]);

    const isEnabled = (date: Date) => isDateEnabled?.(date) ?? true;
    const pick = (date: Date) => {
      if (isEnabled(date)) {
        onChange(pickDay(draft, date, timeInputFormat));
      }
    };

    const keyboard = useGridKeyboard({ granularity: 'day', weekStart, focusedDate, onMove: focusDate, onSelect: pick });
    useImperativeHandle(ref, () => ({ focus: keyboard.focus }));

    const page = (step: number) => {
      setFirstMonth(current => addMonths(current, step));
      setFocusedDate(current => addMonths(current, step));
    };

    // While only the start is chosen, the range to the day under the pointer is previewed.
    const previewEnd = start && !end ? hoveredDate : end;
    const [low, high] =
      start && previewEnd && compareDays(previewEnd, start) < 0 ? [previewEnd, start] : [start, previewEnd ?? start];
    const getCellState = (date: Date): CellState => ({
      selected: isSameDay(date, start) || isSameDay(date, end),
      inRange: !!low && !!high && isDayBetween(date, low, high),
      rangeStart: isSameDay(date, low),
      rangeEnd: isSameDay(date, high),
    });

    const months = Array.from({ length: monthCount }, (_, index) => addMonths(firstMonth, index));
    const announcement =
      start && end ? labels.selectedRangeAnnouncement(formatFullDate(start, locale), formatFullDate(end, locale)) : '';

    const update = (patch: Partial<AbsoluteDraft>) => onChange({ ...draft, ...patch });

    return (
      <div className={styles.absolute}>
        <div ref={keyboard.containerRef} className={styles.months}>
          {months.map((month, index) => {
            const titleId = `${baseId}month${index}`;
            return (
              <div key={index} className={styles.month}>
                <GridHeader
                  title={formatMonthYear(month, locale)}
                  titleId={titleId}
                  previousAriaLabel={labels.previousMonthAriaLabel}
                  nextAriaLabel={labels.nextMonthAriaLabel}
                  onPrevious={index === 0 ? () => page(-1) : undefined}
                  onNext={index === months.length - 1 ? () => page(1) : undefined}
                />
                <MonthGrid
                  month={month}
                  weekStart={weekStart}
                  locale={locale}
                  focusedDate={focusedDate}
                  today={today}
                  currentAriaLabel={labels.todayAriaLabel}
                  ariaLabelledby={titleId}
                  showOutsideDays={false}
                  isEnabled={isEnabled}
                  getCellState={getCellState}
                  getDisabledReason={dateDisabledReason}
                  onSelect={pick}
                  onFocusDate={focusDate}
                  onHoverDate={setHoveredDate}
                  onKeyDown={keyboard.onKeyDown}
                />
              </div>
            );
          })}
        </div>
        <InternalLiveRegion hidden={true}>{announcement}</InternalLiveRegion>
        <div className={dateOnly ? styles['inputs-date-only'] : styles.inputs}>
          <InternalFormField label={labels.startDateLabel} stretch={true}>
            <InternalDateInput
              className={styles['start-date']}
              value={draft.startDate}
              placeholder={labels.datePlaceholder}
              onChange={event => update({ startDate: event.detail.value })}
            />
          </InternalFormField>
          {!dateOnly && (
            <InternalFormField label={labels.startTimeLabel} stretch={true}>
              <InternalTimeInput
                className={styles['start-time']}
                value={draft.startTime}
                format={timeInputFormat}
                placeholder={labels.timePlaceholder}
                onChange={event => update({ startTime: event.detail.value })}
              />
            </InternalFormField>
          )}
          <InternalFormField label={labels.endDateLabel} stretch={true}>
            <InternalDateInput
              className={styles['end-date']}
              value={draft.endDate}
              placeholder={labels.datePlaceholder}
              onChange={event => update({ endDate: event.detail.value })}
            />
          </InternalFormField>
          {!dateOnly && (
            <InternalFormField label={labels.endTimeLabel} stretch={true}>
              <InternalTimeInput
                className={styles['end-time']}
                value={draft.endTime}
                format={timeInputFormat}
                placeholder={labels.timePlaceholder}
                onChange={event => update({ endTime: event.detail.value })}
              />
            </InternalFormField>
          )}
        </div>
        {labels.constraintText && <p className={styles.constraint}>{labels.constraintText}</p>}
      </div>
    );
  }
);
