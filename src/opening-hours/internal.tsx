// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useSyncExternalStore } from 'react';
import clsx from 'clsx';

import { resolveLocale } from '../internal/dates/locale';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { dayIndexes, formatClockTime, formatDayName, parseClockTime, toDateTimeAttribute } from './format';
import { OpeningHoursProps } from './interfaces';

import styles from './styles.css.js';

interface DisplayRow {
  key: string;
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  closed: boolean;
  today: boolean;
}

// A page left open overnight shows the new day when the visitor comes back to it.
function subscribeToDayChange(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

const getVisitorDay = () => new Date().getDay();
const getServerDay = () => null;

/**
 * The visitor's day of the week, from 0 for Sunday. A server cannot know it, so server markup has no
 * day and hydration fills it in from the visitor's clock.
 */
function useVisitorDay(enabled: boolean): number | null {
  const day = useSyncExternalStore(subscribeToDayChange, getVisitorDay, getServerDay);
  return enabled ? day : null;
}

function TimeRange({
  opens,
  closes,
  locale,
  timeFormat,
}: {
  opens: string;
  closes: string;
  locale: string;
  timeFormat: OpeningHoursProps.TimeFormat | undefined;
}) {
  const times = [opens, closes].map((value, index) => {
    const parsed = parseClockTime(value);
    if (!parsed) {
      warnOnce('OpeningHours', `"${value}" is not a time on a 24-hour clock, such as 08:00 or 17:30.`);
      return <span key={index}>{value}</span>;
    }
    return (
      <time key={index} dateTime={toDateTimeAttribute(parsed)}>
        {formatClockTime(parsed, locale, timeFormat)}
      </time>
    );
  });
  return (
    <>
      {times[0]}
      {'\u2009\u2013\u2009'}
      {times[1]}
    </>
  );
}

export function InternalOpeningHours({
  days,
  rows,
  highlightToday = false,
  caption,
  closedText,
  todayText,
  timeFormat,
  locale: localeProp,
  variant = 'default',
  ...rest
}: OpeningHoursProps) {
  const i18n = useInternalI18n('opening-hours');
  const visitorDay = useVisitorDay(highlightToday && days !== undefined);
  const locale = resolveLocale(localeProp);
  const closedLabel = i18n('closedText', closedText);

  const displayRows: DisplayRow[] = days
    ? days.map((entry, index) => {
        const closed = entry.closed === true || !entry.opens || !entry.closes;
        return {
          key: `${entry.day}-${index}`,
          label: entry.label ?? formatDayName(entry.day, locale),
          value: closed ? (
            closedLabel
          ) : (
            <TimeRange opens={entry.opens!} closes={entry.closes!} locale={locale} timeFormat={timeFormat} />
          ),
          note: entry.note,
          closed,
          today: visitorDay === dayIndexes[entry.day],
        };
      })
    : (rows ?? []).map((row, index) => ({
        key: String(index),
        label: row.label,
        value: row.value,
        closed: false,
        today: false,
      }));

  return (
    <div {...rest} className={clsx(styles.root, styles[`variant-${variant}`])}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <tbody>
          {displayRows.map(row => (
            <tr key={row.key} className={clsx(styles.row, row.closed && styles.closed, row.today && styles.today)}>
              <th scope="row" className={styles.day}>
                <span className={styles['day-label']}>{row.label}</span>
                {row.today && (
                  <>
                    {/* Keeps the day and the mark apart when read as one name. */}
                    <span className={styles['screenreader-only']}>, </span>
                    <span className={styles['today-marker']}>{i18n('todayText', todayText)}</span>
                  </>
                )}
              </th>
              <td className={styles.hours}>
                <span className={styles.value}>{row.value}</span>
                {row.note && <span className={styles.note}>{row.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
