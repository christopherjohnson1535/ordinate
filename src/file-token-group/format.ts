// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { I18nContext } from '../internal/i18n/context';

const sizeUnits = ['B', 'KB', 'MB', 'GB'] as const;
const sizeStep = 1000;

/**
 * Formats a size in bytes with the largest unit that keeps the number at 1 or more, such as "1.25 MB".
 */
export function formatFileSize(sizeInBytes: number, locale: string): string {
  let size = sizeInBytes;
  let unit = 0;
  while (size >= sizeStep && unit < sizeUnits.length - 1) {
    size /= sizeStep;
    unit++;
  }
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: unit === 0 ? 0 : 2 }).format(size);
  return `${number} ${sizeUnits[unit]}`;
}

export function formatFileLastModified(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

/**
 * The locale numbers and dates are formatted in: the `I18nProvider` locale, then the page language.
 */
export function useFormatLocale(): string {
  const { locale } = useContext(I18nContext);
  const documentLocale = typeof document === 'undefined' ? null : document.documentElement.lang;
  const requested = locale ?? (documentLocale || 'en');
  // A malformed tag would make Intl throw, so fall back to English.
  try {
    return Intl.NumberFormat.supportedLocalesOf(requested).length > 0 ? requested : 'en';
  } catch {
    return 'en';
  }
}
