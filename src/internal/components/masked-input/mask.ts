// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * One run of digits in a mask, such as the month in a date.
 */
export interface MaskSegment {
  length: number;
  min: number;
  /**
   * The largest value. A function receives the values of the segments before this one, with
   * `NaN` for any that are not complete, so a day can depend on its month and year.
   */
  max: number | ((previous: ReadonlyArray<number>) => number);
}

export interface Mask {
  segments: ReadonlyArray<MaskSegment>;
  /**
   * The character shown between segments.
   */
  separator: string;
  /**
   * Other characters the user may type or paste in place of the separator.
   */
  separatorAliases?: ReadonlyArray<string>;
}

export interface MaskSelection {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface MaskEdit {
  value: string;
  caret: number;
}

const isDigit = (char: string) => char >= '0' && char <= '9';

function isSeparator(char: string, mask: Mask): boolean {
  return char === mask.separator || (mask.separatorAliases?.includes(char) ?? false);
}

function totalLength(mask: Mask): number {
  return mask.segments.reduce((sum, segment) => sum + segment.length, 0);
}

function toDigits(value: string): string {
  return Array.from(value).filter(isDigit).join('');
}

// Locates the segment that holds the digit at `index`, and the digit's position inside it.
function locate(mask: Mask, index: number): { segment: number; offset: number; start: number } | null {
  let start = 0;
  for (let segment = 0; segment < mask.segments.length; segment++) {
    const { length } = mask.segments[segment];
    if (index < start + length) {
      return { segment, offset: index - start, start };
    }
    start += length;
  }
  return null;
}

function segmentValues(mask: Mask, digits: string): number[] {
  let start = 0;
  return mask.segments.map(({ length }) => {
    const part = digits.slice(start, start + length);
    start += length;
    return part.length === length ? Number(part) : NaN;
  });
}

function maxOf(mask: Mask, segment: number, digits: string): number {
  const { max } = mask.segments[segment];
  return typeof max === 'number' ? max : max(segmentValues(mask, digits).slice(0, segment));
}

// Whether some completion of a segment's leading digits lands between its min and max.
function isFeasible(mask: Mask, segment: number, prefix: string, digits: string): boolean {
  const { length, min } = mask.segments[segment];
  const max = maxOf(mask, segment, digits);
  const lowest = Number(prefix.padEnd(length, '0'));
  const highest = Number(prefix.padEnd(length, '9'));
  if (prefix.length === length) {
    return lowest >= min && lowest <= max;
  }
  return lowest <= max && highest >= min;
}

/**
 * The number of leading digits that form a valid, possibly partial, value.
 */
export function getValidLength(mask: Mask, digits: string): number {
  const limit = Math.min(digits.length, totalLength(mask));
  for (let index = 0; index < limit; index++) {
    const place = locate(mask, index)!;
    const prefix = digits.slice(place.start, index + 1);
    if (!isFeasible(mask, place.segment, prefix, digits.slice(0, index + 1))) {
      return index;
    }
  }
  return limit;
}

/**
 * Writes digits into the mask. A separator follows every complete segment except the last, so
 * it appears as soon as the user finishes typing a segment.
 */
export function formatDigits(mask: Mask, digits: string): string {
  let output = '';
  let start = 0;
  for (let segment = 0; segment < mask.segments.length && start < digits.length; segment++) {
    const { length } = mask.segments[segment];
    const part = digits.slice(start, start + length);
    output += part;
    start += length;
    if (part.length === length && segment < mask.segments.length - 1) {
      output += mask.separator;
    }
  }
  return output;
}

// The caret position after `count` digits of a formatted value, past any separator that follows.
function caretAfterDigits(formatted: string, count: number): number {
  let seen = 0;
  let position = 0;
  while (position < formatted.length && seen < count) {
    if (isDigit(formatted[position])) {
      seen++;
    }
    position++;
  }
  while (count > 0 && position < formatted.length && !isDigit(formatted[position])) {
    position++;
  }
  return position;
}

function digitsBefore(value: string, position: number): number {
  return toDigits(value.slice(0, position)).length;
}

function finish(mask: Mask, digits: string, caretDigits: number): MaskEdit {
  const valid = digits.slice(0, getValidLength(mask, digits));
  const value = formatDigits(mask, valid);
  return { value, caret: caretAfterDigits(value, Math.min(caretDigits, valid.length)) };
}

// Adds a digit at the end, padding a segment with a leading zero when the digit could not start it,
// as with 4 for a month, which can only mean April.
function appendDigit(mask: Mask, digits: string, digit: string): string | null {
  const place = locate(mask, digits.length);
  if (!place) {
    return null;
  }
  const { length } = mask.segments[place.segment];
  if (place.offset === 0 && length > 1) {
    const max = maxOf(mask, place.segment, digits);
    if (Number(digit.padEnd(length, '0')) > max) {
      const padded = digits + digit.padStart(length, '0');
      return isFeasible(mask, place.segment, digit.padStart(length, '0'), padded) ? padded : null;
    }
  }
  const next = digits + digit;
  return getValidLength(mask, next) === next.length ? next : null;
}

// Replaces a digit in place. When the plain replacement makes its segment impossible, as typing 1 over
// the 0 of month 03 would, the rest of the segment is zeroed so the user can carry on typing. Later
// segments that no longer fit, such as day 31 after the month changes to February, are dropped.
function overwriteDigit(mask: Mask, digits: string, index: number, digit: string): string | null {
  const place = locate(mask, index)!;
  const end = Math.min(place.start + mask.segments[place.segment].length, digits.length);
  const candidates = [
    digits.slice(0, index) + digit + digits.slice(index + 1),
    digits.slice(0, index) + digit + '0'.repeat(end - index - 1) + digits.slice(end),
  ];
  const next = candidates.find(candidate => getValidLength(mask, candidate) >= end);
  return next === undefined ? null : next.slice(0, getValidLength(mask, next));
}

// A separator typed after a partial segment completes it with leading zeros, as in 2026/3/ for March.
function padSegment(mask: Mask, digits: string): string | null {
  const place = locate(mask, digits.length);
  if (!place || place.offset === 0) {
    return null;
  }
  const { length } = mask.segments[place.segment];
  const part = digits.slice(place.start).padStart(length, '0');
  const next = digits.slice(0, place.start) + part;
  return getValidLength(mask, next) === next.length ? next : null;
}

/**
 * Types or pastes `text` over the selection. Digits fill segments from the caret, overwriting digits
 * after it; separators complete a partial last segment; other characters are ignored. A character
 * that would make the value impossible, such as a 13th month, is dropped.
 */
export function insertText(mask: Mask, { value, selectionStart, selectionEnd }: MaskSelection, text: string): MaskEdit {
  const current = toDigits(value);
  let index = digitsBefore(value, selectionStart);
  let digits = current.slice(0, index) + current.slice(digitsBefore(value, selectionEnd));
  digits = digits.slice(0, getValidLength(mask, digits));
  index = Math.min(index, digits.length);

  for (const char of Array.from(text)) {
    let next: string | null = null;
    if (isDigit(char)) {
      next = index >= digits.length ? appendDigit(mask, digits, char) : overwriteDigit(mask, digits, index, char);
    } else if (isSeparator(char, mask) && index >= digits.length) {
      next = padSegment(mask, digits);
    }
    if (next !== null) {
      // Padding can add more than one digit, so the caret follows the change in length when appending.
      index = index >= digits.length ? next.length : Math.min(index + 1, next.length);
      digits = next;
    }
  }
  return finish(mask, digits, index);
}

/**
 * Deletes the selection, or the digit before the caret (`backward`) or after it (`forward`).
 * Separators are stepped over, and digits after the deletion move up to fill the gap.
 */
export function deleteText(
  mask: Mask,
  { value, selectionStart, selectionEnd }: MaskSelection,
  direction: 'backward' | 'forward'
): MaskEdit {
  const digits = toDigits(value);
  let from = digitsBefore(value, selectionStart);
  let to = digitsBefore(value, selectionEnd);
  if (from === to) {
    if (direction === 'backward') {
      from = Math.max(from - 1, 0);
    } else {
      to = Math.min(to + 1, digits.length);
    }
  }
  return finish(mask, digits.slice(0, from) + digits.slice(to), from);
}

/**
 * Brings any text, such as a value set from outside or entered by autofill, into the mask.
 */
export function normalizeText(mask: Mask, text: string): string {
  return insertText(mask, { value: '', selectionStart: 0, selectionEnd: 0 }, text).value;
}
