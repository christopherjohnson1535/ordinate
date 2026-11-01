// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { daysInMonth } from '../../dates/arithmetic';
import { DateGranularity } from '../../dates/iso';
import { getTimePartCount, TimeFormat } from '../../dates/time';
import { Mask, MaskSegment } from './mask';

// Dates are shown as YYYY/MM/DD and stored as YYYY-MM-DD, so both characters are accepted while typing.
const dateDisplaySeparator = '/';
const dateValueSeparator = '-';

const yearSegment: MaskSegment = { length: 4, min: 1, max: 9999 };
const monthSegment: MaskSegment = { length: 2, min: 1, max: 12 };
const daySegment: MaskSegment = {
  length: 2,
  min: 1,
  max: ([year, month]) => {
    if (Number.isNaN(month)) {
      return 31;
    }
    // Without a year, February may still be in a leap year.
    return daysInMonth(Number.isNaN(year) ? 2000 : year, month - 1);
  },
};

export function createDateMask(granularity: DateGranularity): Mask {
  return {
    segments: granularity === 'month' ? [yearSegment, monthSegment] : [yearSegment, monthSegment, daySegment],
    separator: dateDisplaySeparator,
    separatorAliases: [dateValueSeparator, '.'],
  };
}

export function createTimeMask(format: TimeFormat, use24Hour: boolean): Mask {
  const hours: MaskSegment = use24Hour ? { length: 2, min: 0, max: 23 } : { length: 2, min: 1, max: 12 };
  const sixty: MaskSegment = { length: 2, min: 0, max: 59 };
  return {
    segments: [hours, sixty, sixty].slice(0, getTimePartCount(format)),
    separator: ':',
    separatorAliases: ['.'],
  };
}

/**
 * The text shown in a date input for an ISO value, which may be partial.
 */
export function dateValueToDisplay(value: string): string {
  return value.split(dateValueSeparator).join(dateDisplaySeparator);
}

/**
 * The ISO value, possibly partial, for the text in a date input.
 */
export function dateDisplayToValue(display: string): string {
  return display.split(dateDisplaySeparator).join(dateValueSeparator);
}
