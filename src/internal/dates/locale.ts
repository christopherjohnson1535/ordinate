// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createDate } from './arithmetic';

const fallbackLocale = 'en-US';

// Regions whose week starts on a day other than Monday, from the Unicode CLDR week data. Used only
// where the browser does not report week information itself.
const sundayRegions = new Set(
  'AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' '
  )
);
const saturdayRegions = new Set('AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '));
const fridayRegions = new Set(['MV']);

interface WeekInfo {
  firstDay: number;
}

interface LocaleWithWeekInfo extends Intl.Locale {
  getWeekInfo?: () => WeekInfo;
  weekInfo?: WeekInfo;
}

function isSupported(locale: string): boolean {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0;
  } catch {
    return false;
  }
}

/**
 * The locale to format dates in: the one given, then the page's `lang`, then the runtime's
 * default. Unknown or malformed tags fall through to the next choice.
 */
export function resolveLocale(locale?: string | null): string {
  const documentLocale = typeof document === 'undefined' ? null : document.documentElement.lang;
  for (const candidate of [locale, documentLocale]) {
    if (candidate && isSupported(candidate)) {
      return candidate;
    }
  }
  try {
    return new Intl.DateTimeFormat().resolvedOptions().locale || fallbackLocale;
  } catch {
    return fallbackLocale;
  }
}

/**
 * The first day of the week in `locale`, from 0 for Sunday to 6 for Saturday.
 */
export function getWeekStart(locale: string): number {
  let intlLocale: LocaleWithWeekInfo;
  try {
    intlLocale = new Intl.Locale(locale) as LocaleWithWeekInfo;
  } catch {
    return 1;
  }
  const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
  if (info) {
    // Week info counts from 1 for Monday to 7 for Sunday.
    return info.firstDay % 7;
  }
  const region = intlLocale.maximize().region ?? '';
  if (sundayRegions.has(region)) {
    return 0;
  }
  if (saturdayRegions.has(region)) {
    return 6;
  }
  if (fridayRegions.has(region)) {
    return 5;
  }
  return 1;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

/**
 * A cached `Intl.DateTimeFormat`, since a month grid formats dozens of dates on every render.
 */
export function getDateFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Weekday names in display order for a week that starts on `weekStart`.
 */
export function getWeekdayNames(
  locale: string,
  weekStart: number,
  width: 'narrow' | 'short' | 'long'
): { day: number; name: string }[] {
  const formatter = getDateFormatter(locale, { weekday: width });
  return Array.from({ length: 7 }, (_, index) => {
    const day = (weekStart + index) % 7;
    // January 1, 2023 was a Sunday, so its week gives every weekday in order.
    return { day, name: formatter.format(createDate(2023, 0, 1 + day)) };
  });
}

export function formatMonthYear(date: Date, locale: string): string {
  return getDateFormatter(locale, { year: 'numeric', month: 'long' }).format(date);
}

export function formatYear(date: Date, locale: string): string {
  return getDateFormatter(locale, { year: 'numeric' }).format(date);
}

export function formatMonthName(date: Date, locale: string, width: 'short' | 'long'): string {
  return getDateFormatter(locale, { month: width }).format(date);
}

export function formatDayNumber(date: Date, locale: string): string {
  return getDateFormatter(locale, { day: 'numeric' }).format(date);
}

/**
 * A day written out in full, such as "Thursday, March 5, 2026", for accessible names.
 */
export function formatFullDate(date: Date, locale: string): string {
  return getDateFormatter(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}
