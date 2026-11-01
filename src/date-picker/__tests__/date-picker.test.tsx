// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import DatePicker, { DatePickerProps } from '../../../lib/components/date-picker';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled({ onChangeSpy, ...props }: Partial<DatePickerProps> & { onChangeSpy?: (value: string) => void }) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <FormField label="Delivery date">
      <DatePicker
        locale="en-US"
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

const wrapper = () => createWrapper().findDatePicker()!;
const focusedLabel = () => document.activeElement?.getAttribute('aria-label');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 18, 10));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('DatePicker', () => {
  test('renders a labelled input and a button that names the selected date', () => {
    render(<Controlled value="2026-03-05" />);
    expect(screen.getByRole('textbox', { name: 'Delivery date' })).toHaveValue('2026/03/05');
    const button = wrapper().findOpenCalendarButton().getElement();
    expect(button).toHaveAccessibleName('Choose date, selected date is Thursday, March 5, 2026');
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper().findCalendar()).toBeNull();
  });

  test('names the button without a selected date', () => {
    render(<Controlled value="2026-03" />);
    expect(wrapper().findOpenCalendarButton().getElement()).toHaveAccessibleName('Choose date');
  });

  test('opens the calendar and moves focus to the selected date', () => {
    render(<Controlled value="2026-03-05" />);
    wrapper().openCalendar();
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    expect(wrapper().findOpenCalendarButton().getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(focusedLabel()).toBe('Thursday, March 5, 2026');
  });

  test('picks a date, closes and returns focus to the button', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-05" onChangeSpy={onChange} />);
    wrapper().openCalendar();
    wrapper().findCalendar()!.findDate('2026-03-20')!.click();
    expect(onChange).toHaveBeenCalledWith('2026-03-20');
    expect(wrapper().findCalendar()).toBeNull();
    expect(wrapper().findOpenCalendarButton().getElement()).toHaveFocus();
    expect(wrapper().getInputValue()).toBe('2026/03/20');
  });

  test('picks a date with the keyboard', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-05" onChangeSpy={onChange} />);
    wrapper().openCalendar();
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('2026-03-12');
    expect(wrapper().findCalendar()).toBeNull();
  });

  test('closes when the selected date is picked again, without firing onChange', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-05" onChangeSpy={onChange} />);
    wrapper().openCalendar();
    wrapper().findCalendar()!.findDate('2026-03-05')!.click();
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper().findCalendar()).toBeNull();
  });

  test('closes with Escape and returns focus', () => {
    render(<Controlled value="2026-03-05" />);
    wrapper().openCalendar();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(wrapper().findCalendar()).toBeNull();
    expect(wrapper().findOpenCalendarButton().getElement()).toHaveFocus();
  });

  test('closes on a click outside', () => {
    render(
      <>
        <Controlled value="2026-03-05" />
        <button type="button">Elsewhere</button>
      </>
    );
    wrapper().openCalendar();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(wrapper().findCalendar()).toBeNull();
  });

  test('keeps Tab inside the open calendar', () => {
    render(<Controlled value="2026-03-05" />);
    wrapper().openCalendar();
    // The focused day is the last stop in the popup, after the paging buttons.
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
    expect(focusedLabel()).toBe('Previous month');
    fireEvent.keyDown(document.activeElement!, { key: 'Tab', shiftKey: true });
    expect(focusedLabel()).toBe('Thursday, March 5, 2026');
  });

  test('shows a typed date in the calendar', () => {
    render(<Controlled />);
    wrapper().setInputValue('2027-01-15');
    wrapper().openCalendar();
    expect(wrapper().findCalendar()!.findTitle().getText()).toBe('January 2027');
    expect(focusedLabel()).toBe('Friday, January 15, 2027');
  });

  test('disables dates with isDateEnabled', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-05" onChangeSpy={onChange} isDateEnabled={date => date.getDate() !== 20} />);
    wrapper().openCalendar();
    wrapper().findCalendar()!.findDate('2026-03-20')!.click();
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper().findCalendar()).not.toBeNull();
  });

  test('picks months with month granularity', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03" granularity="month" onChangeSpy={onChange} />);
    expect(wrapper().findOpenCalendarButton().getElement()).toHaveAccessibleName(
      'Choose month, selected month is March 2026'
    );
    wrapper().openCalendar();
    wrapper().findCalendar()!.findDate('2026-07-01')!.click();
    expect(onChange).toHaveBeenCalledWith('2026-07');
  });

  test('cannot open while disabled or read-only', () => {
    const { unmount } = render(<Controlled value="2026-03-05" disabled={true} />);
    expect(wrapper().findOpenCalendarButton().isDisabled()).toBe(true);
    unmount();
    render(<Controlled value="2026-03-05" readOnly={true} />);
    expect(wrapper().findOpenCalendarButton().isDisabled()).toBe(true);
    expect(wrapper().findDateInput().isReadOnly()).toBe(true);
  });

  test('uses the openCalendarAriaLabel prop', () => {
    render(<Controlled value="2026-03-05" openCalendarAriaLabel="Show calendar" />);
    expect(screen.getByRole('button', { name: 'Show calendar' })).toBeInTheDocument();
  });

  test('focuses the input through its ref', () => {
    const ref = React.createRef<DatePickerProps.Ref>();
    render(<DatePicker ref={ref} ariaLabel="Date" value="" />);
    act(() => ref.current!.focus());
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveFocus();
  });

  test('has no accessibility violations, closed and open', async () => {
    const { container } = render(<Controlled value="2026-03-05" placeholder="YYYY/MM/DD" />);
    await expectNoAxeViolations(container);
    wrapper().openCalendar();
    await expectNoAxeViolations(container);
  });
});
