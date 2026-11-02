// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import { isSameDay, isSameMonth } from '../../dates/arithmetic';
import { getMonthGrid, getYearGrid } from '../../dates/grid';
import { formatIsoDate } from '../../dates/iso';
import { formatDayNumber, formatFullDate, formatMonthName, formatMonthYear, getWeekdayNames } from '../../dates/locale';

import styles from './styles.css.js';

export { tabStopSelector, useGridKeyboard } from './use-grid-keyboard';

const maxShortWeekdayLength = 4;

/**
 * How one cell is drawn, beyond being enabled or not.
 */
export interface CellState {
  selected?: boolean;
  /**
   * The cell lies inside a selected or previewed range.
   */
  inRange?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
}

interface SharedGridProps {
  locale: string;
  /**
   * The date that holds the tab stop. Only the grid that shows it has a tabbable cell.
   */
  focusedDate: Date;
  today: Date;
  /**
   * Prepended to the accessible name of today's cell, or of the current month.
   */
  currentAriaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  isEnabled(date: Date): boolean;
  getCellState(date: Date): CellState;
  /**
   * Explains why a disabled cell is disabled. It is read as the cell's description.
   */
  getDisabledReason?(date: Date): string | undefined;
  onSelect(date: Date): void;
  onFocusDate(date: Date): void;
  onHoverDate?(date: Date | null): void;
  onKeyDown(event: React.KeyboardEvent): void;
}

interface CellProps extends SharedGridProps {
  date: Date;
  label: string;
  text: string;
  isCurrent: boolean;
  isFocused: boolean;
  outside?: boolean;
  className?: string;
}

// Voice control users name a cell by what it shows, so the accessible name must contain the
// visible text as a word: a month shown as "Jan" is named "Jan, January 2026".
function includesWord(label: string, word: string): boolean {
  return label
    .toLocaleLowerCase()
    .split(/[\s,.]+/)
    .includes(word.toLocaleLowerCase());
}

function GridCell({
  date,
  label,
  text,
  isCurrent,
  isFocused,
  outside = false,
  className,
  currentAriaLabel,
  isEnabled,
  getCellState,
  getDisabledReason,
  onSelect,
  onFocusDate,
  onHoverDate,
}: CellProps) {
  const reasonId = useId();
  const enabled = isEnabled(date);
  const state = getCellState(date);
  const reason = enabled ? undefined : getDisabledReason?.(date);
  const named = includesWord(label, text) ? label : `${text}, ${label}`;
  const name = isCurrent && currentAriaLabel ? `${currentAriaLabel}, ${named}` : named;
  return (
    <td
      role="gridcell"
      className={clsx(
        styles.cell,
        className,
        outside && styles.outside,
        !enabled && styles.disabled,
        isCurrent && styles.current,
        state.selected && styles.selected,
        state.inRange && styles['in-range'],
        state.rangeStart && styles['range-start'],
        state.rangeEnd && styles['range-end']
      )}
      tabIndex={isFocused ? 0 : -1}
      aria-label={name}
      aria-selected={Boolean(state.selected)}
      aria-disabled={enabled ? undefined : true}
      aria-current={isCurrent ? 'date' : undefined}
      aria-describedby={reason ? reasonId : undefined}
      data-date={formatIsoDate(date)}
      onClick={event => {
        // Popups keep focus where it was on a press, so the clicked day takes it here.
        event.currentTarget.focus();
        onFocusDate(date);
        if (enabled) {
          onSelect(date);
        }
      }}
      onFocus={() => {
        if (!isFocused) {
          onFocusDate(date);
        }
      }}
      onMouseEnter={onHoverDate && (() => onHoverDate(date))}
    >
      <span className={styles.mark} aria-hidden="true">
        {text}
      </span>
      {reason && (
        <span id={reasonId} hidden={true}>
          {reason}
        </span>
      )}
    </td>
  );
}

export interface MonthGridProps extends SharedGridProps {
  /**
   * Any day in the month to show.
   */
  month: Date;
  weekStart: number;
  /**
   * Shows the days of the neighboring months that complete the first and last weeks. When two
   * months are shown side by side, leave them out so no day appears twice.
   */
  showOutsideDays?: boolean;
}

/**
 * A month as a WAI-ARIA grid of days. It draws the days and reports clicks and focus; the host
 * owns the focused and selected dates and handles keys through `useGridKeyboard`.
 */
export function MonthGrid(props: MonthGridProps) {
  const {
    month,
    weekStart,
    locale,
    focusedDate,
    today,
    showOutsideDays = true,
    ariaLabelledby,
    ariaDescribedby,
    onHoverDate,
    onKeyDown,
  } = props;
  const shortWeekdays = getWeekdayNames(locale, weekStart, 'short');
  // Some locales, such as Arabic, have short names too wide for a day column; their narrow names fit.
  const weekdays = shortWeekdays.some(({ name }) => name.length > maxShortWeekdayLength)
    ? getWeekdayNames(locale, weekStart, 'narrow')
    : shortWeekdays;
  const longWeekdays = getWeekdayNames(locale, weekStart, 'long');
  return (
    <table
      role="grid"
      className={styles.grid}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      onKeyDown={onKeyDown}
      onMouseLeave={onHoverDate && (() => onHoverDate(null))}
    >
      <thead>
        <tr>
          {weekdays.map(({ day, name }, index) => (
            <th key={day} scope="col" className={styles.weekday}>
              <span aria-hidden="true">{name}</span>
              <span className={styles['screenreader-only']}>{longWeekdays[index].name}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {getMonthGrid(month, weekStart).map(week => (
          <tr key={formatIsoDate(week[0])}>
            {week.map(date => {
              const outside = !isSameMonth(date, month);
              if (outside && !showOutsideDays) {
                return <td key={formatIsoDate(date)} role="gridcell" className={styles.cell} />;
              }
              return (
                <GridCell
                  {...props}
                  key={formatIsoDate(date)}
                  date={date}
                  label={formatFullDate(date, locale)}
                  text={formatDayNumber(date, locale)}
                  isCurrent={isSameDay(date, today)}
                  isFocused={isSameDay(date, focusedDate) && !outside}
                  outside={outside}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface YearGridProps extends SharedGridProps {
  /**
   * Any day in the year to show.
   */
  year: Date;
}

/**
 * A year as a WAI-ARIA grid of months, for picking a month rather than a day.
 */
export function YearGrid(props: YearGridProps) {
  const { year, locale, focusedDate, today, ariaLabelledby, ariaDescribedby, onHoverDate, onKeyDown } = props;
  return (
    <table
      role="grid"
      className={clsx(styles.grid, styles['year-grid'])}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      onKeyDown={onKeyDown}
      onMouseLeave={onHoverDate && (() => onHoverDate(null))}
    >
      <tbody>
        {getYearGrid(year).map(row => (
          <tr key={row[0].getMonth()}>
            {row.map(date => (
              <GridCell
                {...props}
                key={date.getMonth()}
                className={styles['month-cell']}
                date={date}
                label={formatMonthYear(date, locale)}
                text={formatMonthName(date, locale, 'short')}
                isCurrent={isSameMonth(date, today)}
                isFocused={isSameMonth(date, focusedDate)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface GridHeaderProps {
  title: string;
  titleId: string;
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  /**
   * Leave out to hide the button, as on the inner side of two months shown side by side.
   */
  onPrevious?: () => void;
  onNext?: () => void;
}

/**
 * The title of a month or year grid with the buttons that page to the previous and next one.
 * The title is a polite live region, so paging is announced.
 */
export function GridHeader({ title, titleId, previousAriaLabel, nextAriaLabel, onPrevious, onNext }: GridHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles['header-slot']}>
        {onPrevious && (
          <InternalButton
            className={styles['page-button']}
            variant="icon"
            formAction="none"
            iconName="chevron-left"
            ariaLabel={previousAriaLabel}
            onClick={onPrevious}
          />
        )}
      </div>
      <div id={titleId} className={styles.title} aria-live="polite">
        {title}
      </div>
      <div className={styles['header-slot']}>
        {onNext && (
          <InternalButton
            className={styles['page-button']}
            variant="icon"
            formAction="none"
            iconName="chevron-right"
            ariaLabel={nextAriaLabel}
            onClick={onNext}
          />
        )}
      </div>
    </div>
  );
}
