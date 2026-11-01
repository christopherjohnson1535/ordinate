// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import {
  deleteText,
  formatDigits,
  getValidLength,
  insertText,
  normalizeText,
} from '../../../lib/components/internal/components/masked-input/mask';
import {
  createDateMask,
  createTimeMask,
  dateDisplayToValue,
  dateValueToDisplay,
} from '../../../lib/components/internal/components/masked-input/masks';

const date = createDateMask('day');
const month = createDateMask('month');
const time = createTimeMask('hh:mm:ss', true);

// Types each character at the end of the value, as a user typing from empty would.
function type(mask: typeof date, text: string, start = '') {
  let value = start;
  for (const char of text) {
    value = insertText(mask, { value, selectionStart: value.length, selectionEnd: value.length }, char).value;
  }
  return value;
}

describe('masked input editing', () => {
  test('inserts separators as segments fill', () => {
    expect(type(date, '2026')).toBe('2026/');
    expect(type(date, '202603')).toBe('2026/03/');
    expect(type(date, '20260305')).toBe('2026/03/05');
    expect(type(date, '2026030512')).toBe('2026/03/05');
  });

  test('pads a digit that cannot start its segment', () => {
    expect(type(date, '20264')).toBe('2026/04/');
    expect(type(date, '2026045')).toBe('2026/04/05');
    expect(type(time, '7')).toBe('07:');
    expect(type(time, '079')).toBe('07:09:');
  });

  test('completes a partial segment when a separator is typed', () => {
    expect(type(date, '20261/')).toBe('2026/01/');
    expect(type(date, '2026-3-5')).toBe('2026/03/05');
    expect(type(time, '1:2:3')).toBe('01:02:3');
    expect(type(time, '1:2:3:')).toBe('01:02:03');
  });

  test('refuses digits that make the value impossible', () => {
    expect(type(date, '202613')).toBe('2026/1');
    expect(type(date, '2026000')).toBe('2026/0');
    expect(type(date, '20250229')).toBe('2025/02/2');
    expect(type(date, '20240229')).toBe('2024/02/29');
    expect(type(date, '20260431')).toBe('2026/04/3');
    expect(type(time, '24')).toBe('2');
    // 6 cannot start the minutes, so it means 06 rather than 60.
    expect(type(time, '2360')).toBe('23:06:0');
    expect(type(time, '12:6')).toBe('12:06:');
  });

  test('ignores letters and stray separators', () => {
    expect(type(date, 'x2026//03')).toBe('2026/03/');
    expect(type(date, '/')).toBe('');
  });

  test('replaces the selection with typed text', () => {
    const value = '2026/03/05';
    expect(insertText(date, { value, selectionStart: 0, selectionEnd: value.length }, '1999')).toEqual({
      value: '1999/',
      caret: 5,
    });
  });

  test('overwrites digits in the middle, keeping the caret moving forward', () => {
    const value = '2026/03/05';
    expect(insertText(date, { value, selectionStart: 2, selectionEnd: 2 }, '1')).toEqual({
      value: '2016/03/05',
      caret: 3,
    });
  });

  test('zeroes the rest of a segment when an overwrite would make it impossible', () => {
    const value = '2026/03/05';
    const first = insertText(date, { value, selectionStart: 5, selectionEnd: 5 }, '1');
    expect(first).toEqual({ value: '2026/10/05', caret: 6 });
    expect(insertText(date, { value: first.value, selectionStart: 6, selectionEnd: 6 }, '1').value).toBe('2026/11/05');
  });

  test('drops later segments that no longer fit after an overwrite', () => {
    const value = '2026/01/31';
    expect(insertText(date, { value, selectionStart: 6, selectionEnd: 6 }, '2').value).toBe('2026/02/');
  });

  test('pastes over the selection, accepting ISO separators', () => {
    expect(insertText(date, { value: '', selectionStart: 0, selectionEnd: 0 }, '2026-03-05').value).toBe('2026/03/05');
    expect(insertText(date, { value: '2020/01/01', selectionStart: 0, selectionEnd: 10 }, ' 2026-3-5 ').value).toBe(
      '2026/03/05'
    );
  });

  test('deletes backward over separators', () => {
    expect(deleteText(date, { value: '2026/03/', selectionStart: 8, selectionEnd: 8 }, 'backward')).toEqual({
      value: '2026/0',
      caret: 6,
    });
    expect(deleteText(date, { value: '2026/', selectionStart: 5, selectionEnd: 5 }, 'backward')).toEqual({
      value: '202',
      caret: 3,
    });
    expect(deleteText(date, { value: '', selectionStart: 0, selectionEnd: 0 }, 'backward')).toEqual({
      value: '',
      caret: 0,
    });
  });

  test('deletes forward and deletes selections', () => {
    expect(deleteText(time, { value: '12:34:51', selectionStart: 6, selectionEnd: 6 }, 'forward').value).toBe(
      '12:34:1'
    );
    expect(deleteText(date, { value: '2026/03/05', selectionStart: 0, selectionEnd: 10 }, 'backward').value).toBe('');
  });

  test('truncates at the first impossible digit after digits shift', () => {
    // Removing the 1 of month 12 shifts 2 into the month's first place, which cannot start a month.
    expect(deleteText(date, { value: '2026/12/15', selectionStart: 6, selectionEnd: 6 }, 'backward').value).toBe(
      '2026/'
    );
  });

  test('normalizes text from outside', () => {
    expect(normalizeText(date, '2026-03-05')).toBe('2026/03/05');
    expect(normalizeText(month, '2026-03-05')).toBe('2026/03');
    expect(normalizeText(time, '9:5')).toBe('09:5');
  });

  test('limits the hours of a 12-hour clock', () => {
    const twelve = createTimeMask('hh:mm', false);
    expect(type(twelve, '13')).toBe('1');
    expect(type(twelve, '00')).toBe('0');
    expect(type(twelve, '1230')).toBe('12:30');
  });

  test('exposes the formatting helpers', () => {
    expect(formatDigits(date, '202603')).toBe('2026/03/');
    expect(getValidLength(date, '202613')).toBe(5);
    expect(dateValueToDisplay('2026-03-')).toBe('2026/03/');
    expect(dateDisplayToValue('2026/03/05')).toBe('2026-03-05');
  });
});
