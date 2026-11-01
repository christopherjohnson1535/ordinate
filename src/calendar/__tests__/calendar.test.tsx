// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import Calendar, { CalendarProps } from '../../../lib/components/calendar';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled({ onChangeSpy, ...props }: Partial<CalendarProps> & { onChangeSpy?: (value: string) => void }) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <Calendar
      ariaLabel="Delivery date"
      locale="en-US"
      {...props}
      value={value}
      onChange={event => {
        onChangeSpy?.(event.detail.value);
        setValue(event.detail.value);
      }}
    />
  );
}

const wrapper = () => createWrapper().findCalendar()!;
const focusedLabel = () => document.activeElement?.getAttribute('aria-label');
const press = (key: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(document.activeElement!, { key, ...init });

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 18, 10));
});

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.dir = '';
});

describe('Calendar', () => {
  test('shows the selected month as a grid of days', () => {
    render(<Controlled value="2026-03-05" />);
    expect(wrapper().findTitle().getText()).toBe('March 2026');
    expect(screen.getByRole('group', { name: 'Delivery date' })).toBeInTheDocument();
    expect(screen.getByRole('grid')).toHaveAccessibleName('March 2026');
    expect(screen.getAllByRole('columnheader').map(header => header.textContent)).toEqual([
      'SunSunday',
      'MonMonday',
      'TueTuesday',
      'WedWednesday',
      'ThuThursday',
      'FriFriday',
      'SatSaturday',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(7);
    const selected = screen.getByRole('gridcell', { name: 'Thursday, March 5, 2026' });
    expect(selected).toHaveAttribute('aria-selected', 'true');
    expect(selected).toHaveAttribute('tabindex', '0');
    expect(wrapper().findSelectedDates()).toHaveLength(1);
  });

  test('marks today', () => {
    render(<Controlled value="" />);
    const today = wrapper().findCurrentDate()!.getElement();
    expect(today).toHaveAttribute('data-date', '2026-03-18');
    expect(today).toHaveAccessibleName('Today, Wednesday, March 18, 2026');
    expect(wrapper().findFocusableDate()!.getElement()).toBe(today);
  });

  test('starts the week on the locale first day, or as asked', () => {
    const { unmount } = render(<Controlled value="2026-03-05" locale="de-DE" />);
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Montag');
    unmount();
    render(<Controlled value="2026-03-05" startOfWeek={6} />);
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Saturday');
  });

  test('fires onChange when a day is clicked', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-05" onChangeSpy={onChange} />);
    wrapper().findDate('2026-03-12')!.click();
    expect(onChange).toHaveBeenCalledWith('2026-03-12');
    expect(screen.getByRole('gridcell', { name: 'Thursday, March 12, 2026' })).toHaveAttribute('aria-selected', 'true');
  });

  test('does not select disabled days, and explains why they are disabled', () => {
    const onChange = vi.fn();
    render(
      <Controlled
        value="2026-03-05"
        onChangeSpy={onChange}
        isDateEnabled={date => date.getDay() !== 0}
        dateDisabledReason={() => 'Closed on Sundays'}
      />
    );
    const sunday = wrapper().findDate('2026-03-08')!;
    expect(sunday.getElement()).toHaveAttribute('aria-disabled', 'true');
    expect(sunday.getElement()).toHaveAccessibleDescription('Closed on Sundays');
    sunday.click();
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.mouseEnter(sunday.getElement());
    expect(wrapper().findDisabledReason()!.getText()).toBe('Closed on Sundays');
  });

  test('moves focus with the arrow keys, Home, End and Page keys', () => {
    render(<Controlled value="2026-03-18" />);
    act(() => wrapper().findFocusableDate()!.focus());
    press('ArrowRight');
    expect(focusedLabel()).toBe('Thursday, March 19, 2026');
    press('ArrowDown');
    expect(focusedLabel()).toBe('Thursday, March 26, 2026');
    press('ArrowLeft');
    press('ArrowUp');
    expect(focusedLabel()).toBe('Today, Wednesday, March 18, 2026');
    press('Home');
    expect(focusedLabel()).toBe('Sunday, March 15, 2026');
    press('End');
    expect(focusedLabel()).toBe('Saturday, March 21, 2026');
    press('PageDown');
    expect(focusedLabel()).toBe('Tuesday, April 21, 2026');
    expect(wrapper().findTitle().getText()).toBe('April 2026');
    press('PageUp', { shiftKey: true });
    expect(focusedLabel()).toBe('Monday, April 21, 2025');
  });

  test('moves into the next month past the last day', () => {
    render(<Controlled value="2026-03-31" />);
    act(() => wrapper().findFocusableDate()!.focus());
    press('ArrowRight');
    expect(focusedLabel()).toBe('Wednesday, April 1, 2026');
    expect(wrapper().findTitle().getText()).toBe('April 2026');
  });

  test('follows the reading direction for left and right', () => {
    document.documentElement.dir = 'rtl';
    render(
      <div style={{ direction: 'rtl' }}>
        <Controlled value="2026-03-18" />
      </div>
    );
    act(() => wrapper().findFocusableDate()!.focus());
    press('ArrowLeft');
    expect(focusedLabel()).toBe('Thursday, March 19, 2026');
  });

  test('selects the focused day with Enter or Space', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-18" onChangeSpy={onChange} />);
    act(() => wrapper().findFocusableDate()!.focus());
    press('ArrowRight');
    press('Enter');
    expect(onChange).toHaveBeenLastCalledWith('2026-03-19');
    press('ArrowRight');
    press(' ');
    expect(onChange).toHaveBeenLastCalledWith('2026-03-20');
  });

  test('pages through months with the header buttons', () => {
    render(<Controlled value="2026-03-05" />);
    wrapper().findNextButton()!.click();
    expect(wrapper().findTitle().getText()).toBe('April 2026');
    expect(wrapper().findFocusableDate()!.getElement()).toHaveAttribute('data-date', '2026-04-05');
    wrapper().findPreviousButton()!.click();
    wrapper().findPreviousButton()!.click();
    expect(wrapper().findTitle().getText()).toBe('February 2026');
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
  });

  test('follows a value changed from outside', () => {
    const { rerender } = render(<Calendar locale="en-US" ariaLabel="Date" value="2026-03-05" />);
    rerender(<Calendar locale="en-US" ariaLabel="Date" value="2027-01-10" />);
    expect(wrapper().findTitle().getText()).toBe('January 2027');
  });

  test('picks months with month granularity', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03" granularity="month" onChangeSpy={onChange} />);
    expect(wrapper().findTitle().getText()).toBe('2026');
    expect(screen.getByRole('gridcell', { name: 'This month, Mar, March 2026' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    act(() => wrapper().findFocusableDate()!.focus());
    press('ArrowDown');
    expect(focusedLabel()).toBe('Jun, June 2026');
    press('PageDown');
    expect(focusedLabel()).toBe('Jun, June 2027');
    press('Enter');
    expect(onChange).toHaveBeenLastCalledWith('2027-06');
    expect(screen.getByRole('button', { name: 'Next year' })).toBeInTheDocument();
  });

  test('takes labels from i18nStrings and from the provider', () => {
    const { unmount } = render(
      <Controlled value="2026-03-05" i18nStrings={{ previousMonthAriaLabel: 'Back', todayAriaLabel: 'Now' }} />
    );
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(wrapper().findCurrentDate()!.getElement()).toHaveAccessibleName('Now, Wednesday, March 18, 2026');
    unmount();
    render(
      <I18nProvider
        locale="en"
        messages={[{ '@ordinate/components': { en: { calendar: { nextMonthAriaLabel: 'Forward' } } } }]}
      >
        <Controlled value="2026-03-05" />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument();
  });

  test('focuses the tab stop through its ref', () => {
    const ref = React.createRef<CalendarProps.Ref>();
    render(<Calendar ref={ref} locale="en-US" ariaLabel="Date" value="2026-03-05" />);
    act(() => ref.current!.focus());
    expect(focusedLabel()).toBe('Thursday, March 5, 2026');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Controlled
        value="2026-03-05"
        isDateEnabled={date => date.getDay() !== 0}
        dateDisabledReason={() => 'Closed on Sundays'}
      />
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations with month granularity', async () => {
    const { container } = render(<Controlled value="2026-03" granularity="month" />);
    await expectNoAxeViolations(container);
  });
});
