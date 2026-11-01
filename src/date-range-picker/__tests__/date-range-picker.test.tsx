// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
];

type Value = DateRangePickerProps.Value | null;

function Controlled({
  onChangeSpy,
  ...props
}: Partial<DateRangePickerProps> & { onChangeSpy?: (value: Value) => void }) {
  const [value, setValue] = useState<Value>(props.value ?? null);
  return (
    <FormField label="Time range">
      <DateRangePicker
        locale="en-US"
        relativeOptions={relativeOptions}
        placeholder="Filter by a range"
        {...props}
        value={value}
        onChange={event => {
          onChangeSpy?.(event.detail.value);
          setValue(event.detail.value);
        }}
      />
    </FormField>
  );
}

const wrapper = () => createWrapper().findDateRangePicker()!;
const focusedLabel = () => document.activeElement?.getAttribute('aria-label');
const absolute = (startDate: string, endDate: string): DateRangePickerProps.AbsoluteValue => ({
  type: 'absolute',
  startDate,
  endDate,
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 18, 10));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('DateRangePicker', () => {
  test('shows the placeholder in a labelled trigger', () => {
    render(<Controlled />);
    const trigger = wrapper().findTrigger().getElement();
    expect(trigger).toHaveAccessibleName('Time range Filter by a range');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper().findDropdown()).toBeNull();
  });

  test('formats absolute and relative values in the trigger', () => {
    const { unmount } = render(<Controlled value={absolute('2026-03-05T08:00:00', '2026-03-18T17:30:00')} />);
    expect(wrapper().getTriggerText()).toMatch(/^Mar 5, 2026, 08:00:00\s?–\s?Mar 18, 2026, 17:30:00$/);
    unmount();
    const { unmount: unmount2 } = render(<Controlled value={absolute('2026-03-05', '2026-03-12')} dateOnly={true} />);
    expect(wrapper().getTriggerText()).toMatch(/^Mar 5\s?–\s?12, 2026$/);
    unmount2();
    render(<Controlled value={{ type: 'relative', amount: 1, unit: 'hour', key: 'previous-1-hour' }} />);
    expect(wrapper().getTriggerText()).toBe('Last hour');
  });

  test('opens on the relative ranges when there is no value', () => {
    render(<Controlled />);
    wrapper().openDropdown();
    expect(screen.getByRole('dialog', { name: 'Choose a date range' })).toBeInTheDocument();
    expect(wrapper().findModeSwitch()!.findSelectedSegment()!.getText()).toBe('Relative range');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    expect(radios[0]).toHaveAccessibleName('Last 5 minutes');
    expect(radios[1]).toHaveAccessibleName('Last hour');
    expect(radios[2]).toHaveAccessibleName('Last 7 days');
    expect(radios[3]).toHaveAccessibleName('Custom range');
    expect(wrapper().findRelativeRanges()!.getElement()).toHaveAccessibleName('Choose a range');
    expect(document.activeElement).toBe(screen.getAllByRole('radio')[0]);
  });

  test('applies a relative option', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().openDropdown();
    fireEvent.click(screen.getByRole('radio', { name: 'Last hour' }));
    wrapper().findApplyButton()!.click();
    expect(onChange).toHaveBeenCalledWith({ type: 'relative', amount: 1, unit: 'hour', key: 'previous-1-hour' });
    expect(wrapper().findDropdown()).toBeNull();
    expect(wrapper().findTrigger().getElement()).toHaveFocus();
    expect(wrapper().getTriggerText()).toBe('Last hour');
  });

  test('applies a custom duration and checks it', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().openDropdown();
    fireEvent.click(screen.getByRole('radio', { name: /Custom range/ }));
    wrapper().findApplyButton()!.click();
    expect(wrapper().findValidationError()!.getText()).toBe('Enter a whole number of 1 or more.');
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Duration' }), { target: { value: '3' } });
    expect(wrapper().findValidationError()).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Unit of time/ }));
    fireEvent.click(screen.getByRole('option', { name: 'days' }));
    wrapper().findApplyButton()!.click();
    expect(onChange).toHaveBeenCalledWith({ type: 'relative', amount: 3, unit: 'day' });
    expect(wrapper().getTriggerText()).toBe('Last 3 days');
  });

  test('asks for a range when none is chosen', () => {
    render(<Controlled />);
    wrapper().openDropdown();
    wrapper().findApplyButton()!.click();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a range.');
  });

  test('shows two months and picks a range in absolute mode', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} rangeSelectorMode="absolute-only" />);
    wrapper().openDropdown();
    expect(wrapper().findModeSwitch()).toBeNull();
    const calendar = wrapper().findCalendar()!;
    expect(calendar.findTitles().map(title => title.getText())).toEqual(['March 2026', 'April 2026']);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    expect(focusedLabel()).toBe('Today, Wednesday, March 18, 2026');

    calendar.findDate('2026-04-02')!.click();
    expect(wrapper().findStartDateInput()!.getInputValue()).toBe('2026/04/02');
    expect(wrapper().findStartTimeInput()!.getInputValue()).toBe('00:00:00');
    calendar.findDate('2026-03-25')!.click();
    expect(wrapper().findStartDateInput()!.getInputValue()).toBe('2026/03/25');
    expect(wrapper().findEndDateInput()!.getInputValue()).toBe('2026/04/02');
    expect(wrapper().findEndTimeInput()!.getInputValue()).toBe('23:59:59');
    expect(calendar.findDate('2026-03-30')!.getElement()).toHaveAttribute('aria-selected', 'false');
    expect(calendar.findSelectedDates()).toHaveLength(2);

    wrapper().findApplyButton()!.click();
    expect(onChange).toHaveBeenCalledWith(absolute('2026-03-25T00:00:00', '2026-04-02T23:59:59'));
  });

  test('takes typed dates and times', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} rangeSelectorMode="absolute-only" timeInputFormat="hh:mm" />);
    wrapper().openDropdown();
    wrapper().findStartDateInput()!.setInputValue('2025-12-30');
    wrapper().findStartTimeInput()!.setInputValue('09:15');
    wrapper().findEndDateInput()!.setInputValue('2026-01-02');
    expect(wrapper().findCalendar()!.findTitles()[0].getText()).toBe('December 2025');
    wrapper().findApplyButton()!.click();
    expect(onChange).toHaveBeenCalledWith(absolute('2025-12-30T09:15:00', '2026-01-02T23:59:00'));
  });

  test('refuses incomplete and reversed ranges', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} rangeSelectorMode="absolute-only" />);
    wrapper().openDropdown();
    wrapper().findStartDateInput()!.setInputValue('2026-03-10');
    wrapper().findApplyButton()!.click();
    expect(wrapper().findValidationError()!.getText()).toBe('Enter a complete start and end date.');
    wrapper().findEndDateInput()!.setInputValue('2026-03-09');
    wrapper().findApplyButton()!.click();
    expect(wrapper().findValidationError()!.getText()).toBe('The end must be after the start.');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('runs isValidRange before applying', () => {
    const onChange = vi.fn();
    const isValidRange = vi.fn((): DateRangePickerProps.ValidationResult => ({
      valid: false,
      errorMessage: 'Too long a range.',
    }));
    render(
      <Controlled
        onChangeSpy={onChange}
        isValidRange={isValidRange}
        value={absolute('2026-03-01T00:00:00', '2026-03-31T23:59:59')}
      />
    );
    wrapper().openDropdown();
    wrapper().findApplyButton()!.click();
    expect(isValidRange).toHaveBeenCalledWith(absolute('2026-03-01T00:00:00', '2026-03-31T23:59:59'));
    expect(wrapper().findValidationError()!.getText()).toBe('Too long a range.');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('returns plain dates with dateOnly', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} rangeSelectorMode="absolute-only" dateOnly={true} />);
    wrapper().openDropdown();
    expect(wrapper().findStartTimeInput()).toBeNull();
    wrapper().findCalendar()!.findDate('2026-03-02')!.click();
    wrapper().findCalendar()!.findDate('2026-03-06')!.click();
    wrapper().findApplyButton()!.click();
    expect(onChange).toHaveBeenCalledWith(absolute('2026-03-02', '2026-03-06'));
  });

  test('moves through both months with the keyboard and pages with the buttons', () => {
    render(<Controlled rangeSelectorMode="absolute-only" />);
    wrapper().openDropdown();
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(focusedLabel()).toBe('Saturday, April 18, 2026');
    expect(wrapper().findCalendar()!.findTitles()[0].getText()).toBe('March 2026');
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(focusedLabel()).toBe('Monday, May 18, 2026');
    expect(wrapper().findCalendar()!.findTitles()[0].getText()).toBe('April 2026');
    wrapper().findCalendar()!.findPreviousButton()!.click();
    wrapper().findCalendar()!.findPreviousButton()!.click();
    expect(wrapper().findCalendar()!.findTitles()[0].getText()).toBe('February 2026');
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
  });

  test('switches modes', () => {
    render(<Controlled value={absolute('2026-03-05T00:00:00', '2026-03-06T00:00:00')} />);
    wrapper().openDropdown();
    expect(wrapper().findModeSwitch()!.findSelectedSegment()!.getText()).toBe('Absolute range');
    wrapper().findModeSwitch()!.findSegmentById('relative')!.click();
    expect(wrapper().findRelativeRanges()).not.toBeNull();
    expect(wrapper().findCalendar()).toBeNull();
  });

  test('cancels without changing the value', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().openDropdown();
    fireEvent.click(screen.getByRole('radio', { name: 'Last hour' }));
    wrapper().findCancelButton()!.click();
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper().findDropdown()).toBeNull();
    expect(wrapper().findTrigger().getElement()).toHaveFocus();
  });

  test('closes with Escape', () => {
    render(<Controlled />);
    wrapper().openDropdown();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(wrapper().findDropdown()).toBeNull();
    expect(wrapper().findTrigger().getElement()).toHaveFocus();
  });

  test('keeps Tab inside the popup', () => {
    render(<Controlled />);
    wrapper().openDropdown();
    const apply = wrapper().findApplyButton()!.getElement();
    act(() => apply.focus());
    fireEvent.keyDown(apply, { key: 'Tab' });
    expect(document.activeElement).toHaveAttribute('data-segment-id', 'relative');
  });

  test('clears the value', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} value={{ type: 'relative', amount: 5, unit: 'minute' }} />);
    wrapper().openDropdown();
    expect(screen.getByRole('radio', { name: 'Last 5 minutes' })).toBeChecked();
    wrapper().findClearButton()!.click();
    expect(onChange).toHaveBeenCalledWith(null);
    expect(wrapper().getTriggerText()).toBe('Filter by a range');
  });

  test('hides the clear button when asked', () => {
    render(<Controlled showClearButton={false} />);
    wrapper().openDropdown();
    expect(wrapper().findClearButton()).toBeNull();
    expect(wrapper().findCancelButton()!.getText()).toBe('Cancel');
  });

  test('cannot open while read-only or disabled', () => {
    const { unmount } = render(<Controlled readOnly={true} />);
    wrapper().openDropdown();
    expect(wrapper().findDropdown()).toBeNull();
    expect(wrapper().findTrigger().getElement()).toHaveAttribute('aria-disabled', 'true');
    unmount();
    render(<Controlled disabled={true} />);
    expect(wrapper().findTrigger().getElement()).toBeDisabled();
  });

  test('takes strings and formatting from i18nStrings', () => {
    render(
      <Controlled
        value={{ type: 'relative', amount: 5, unit: 'minute', key: 'previous-5-minutes' }}
        i18nStrings={{
          applyButtonLabel: 'Use range',
          formatRelativeRange: range => `Past ${range.amount} ${range.unit}(s)`,
        }}
      />
    );
    expect(wrapper().getTriggerText()).toBe('Past 5 minute(s)');
    wrapper().openDropdown();
    expect(screen.getByRole('button', { name: 'Use range' })).toBeInTheDocument();
  });

  test('has no accessibility violations, closed and in both modes', async () => {
    const { container } = render(<Controlled />);
    await expectNoAxeViolations(container);
    wrapper().openDropdown();
    await expectNoAxeViolations(container);
    wrapper().findModeSwitch()!.findSegmentById('absolute')!.click();
    await expectNoAxeViolations(container);
  }, 30000);
});
