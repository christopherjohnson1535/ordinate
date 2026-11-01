// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import DateInput, { DateInputProps } from '../../../lib/components/date-input';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled({ onChangeSpy, ...props }: Partial<DateInputProps> & { onChangeSpy?: (value: string) => void }) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <DateInput
      ariaLabel="Start date"
      {...props}
      value={value}
      onChange={event => {
        onChangeSpy?.(event.detail.value);
        setValue(event.detail.value);
      }}
    />
  );
}

const wrapper = () => createWrapper().findDateInput()!;

describe('DateInput', () => {
  test('shows an ISO value with slashes', () => {
    render(<DateInput ariaLabel="Start date" value="2026-03-05" />);
    expect(wrapper().getInputValue()).toBe('2026/03/05');
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveAttribute('inputmode', 'numeric');
  });

  test('fires ISO values, complete or partial, while the user types', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().typeText('2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-');
    wrapper().typeText('35');
    expect(onChange).toHaveBeenLastCalledWith('2026-03-05');
    expect(wrapper().getInputValue()).toBe('2026/03/05');
  });

  test('refuses impossible dates', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().typeText('2025022');
    expect(onChange).toHaveBeenLastCalledWith('2025-02-2');
    onChange.mockClear();
    wrapper().typeText('9');
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper().getInputValue()).toBe('2025/02/2');
  });

  test('deletes backward over separators', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-" onChangeSpy={onChange} />);
    const input = wrapper().findNativeInput();
    input.getElement().setSelectionRange(8, 8);
    input.keydown('Backspace');
    expect(onChange).toHaveBeenLastCalledWith('2026-0');
  });

  test('brings pasted and autofilled text into the mask', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().setInputValue('2026-3-5');
    expect(onChange).toHaveBeenLastCalledWith('2026-03-05');

    const input = wrapper().findNativeInput().getElement();
    input.setSelectionRange(0, input.value.length);
    fireEvent.paste(input, { clipboardData: { getData: () => '1999/12/31' } });
    expect(onChange).toHaveBeenLastCalledWith('1999-12-31');
  });

  test('takes year and month only with month granularity', () => {
    const onChange = vi.fn();
    render(<Controlled granularity="month" onChangeSpy={onChange} />);
    wrapper().typeText('20261205');
    expect(onChange).toHaveBeenLastCalledWith('2026-12');
  });

  test('leaves shortcuts and navigation keys to the browser', () => {
    render(<Controlled value="2026-03-05" />);
    const input = wrapper().findNativeInput().getElement();
    const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true, cancelable: true });
    input.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    const arrow = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true });
    input.dispatchEvent(arrow);
    expect(arrow.defaultPrevented).toBe(false);
  });

  test('does not change while read-only', () => {
    const onChange = vi.fn();
    render(<Controlled value="2026-03-05" readOnly={true} onChangeSpy={onChange} />);
    wrapper().typeText('1');
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper().isReadOnly()).toBe(true);
  });

  test('can be disabled', () => {
    render(<DateInput ariaLabel="Start date" value="" disabled={true} />);
    expect(wrapper().isDisabled()).toBe(true);
  });

  test('takes its label, description and error state from a form field', () => {
    render(
      <FormField label="Start date" description="The first day of the trip" errorText="Choose a later date">
        <DateInput value="2026-03-05" />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Start date' });
    expect(input).toHaveAccessibleDescription(/The first day of the trip/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('focuses through its ref', () => {
    const ref = React.createRef<DateInputProps.Ref>();
    render(<DateInput ref={ref} ariaLabel="Start date" value="" />);
    ref.current!.focus();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  test('puts id and data attributes on the root', () => {
    const { container } = render(<DateInput ariaLabel="Start date" value="" id="start" data-testid="start" />);
    expect(container.querySelectorAll('#start')).toHaveLength(1);
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'start');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Start date">
        <DateInput value="2026-03-05" placeholder="YYYY/MM/DD" />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
