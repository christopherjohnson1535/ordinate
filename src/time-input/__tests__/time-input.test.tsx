// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import TimeInput, { TimeInputProps } from '../../../lib/components/time-input';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled({ onChangeSpy, ...props }: Partial<TimeInputProps> & { onChangeSpy?: (value: string) => void }) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <TimeInput
      ariaLabel="Start time"
      {...props}
      value={value}
      onChange={event => {
        onChangeSpy?.(event.detail.value);
        setValue(event.detail.value);
      }}
    />
  );
}

const wrapper = () => createWrapper().findTimeInput()!;

describe('TimeInput', () => {
  test('types hours, minutes and seconds with separators added', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().typeText('14');
    expect(onChange).toHaveBeenLastCalledWith('14:');
    wrapper().typeText('3005');
    expect(onChange).toHaveBeenLastCalledWith('14:30:05');
    expect(wrapper().getInputValue()).toBe('14:30:05');
  });

  test('pads digits that cannot start a part', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().typeText('77');
    expect(onChange).toHaveBeenLastCalledWith('07:07:');
  });

  test('follows the format', () => {
    const onChange = vi.fn();
    render(<Controlled format="hh:mm" onChangeSpy={onChange} />);
    wrapper().typeText('093015');
    expect(onChange).toHaveBeenLastCalledWith('09:30');
  });

  test('takes hours only with the hh format', () => {
    const onChange = vi.fn();
    render(<Controlled format="hh" onChangeSpy={onChange} />);
    wrapper().typeText('2330');
    expect(onChange).toHaveBeenLastCalledWith('23');
  });

  test('refuses hours past 23, or past 12 on a 12-hour clock', () => {
    const onChange = vi.fn();
    const { unmount } = render(<Controlled onChangeSpy={onChange} />);
    wrapper().typeText('24');
    expect(wrapper().getInputValue()).toBe('2');
    unmount();
    render(<Controlled use24Hour={false} onChangeSpy={onChange} />);
    wrapper().typeText('13');
    expect(wrapper().getInputValue()).toBe('1');
  });

  test('brings autofilled and pasted text into the mask', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    wrapper().setInputValue('9:05:30');
    expect(onChange).toHaveBeenLastCalledWith('09:05:30');
    const input = wrapper().findNativeInput().getElement();
    input.setSelectionRange(0, input.value.length);
    fireEvent.paste(input, { clipboardData: { getData: () => '18.45.00' } });
    expect(onChange).toHaveBeenLastCalledWith('18:45:00');
  });

  test('deletes with Backspace and Delete', () => {
    const onChange = vi.fn();
    render(<Controlled value="12:34:56" onChangeSpy={onChange} />);
    const input = wrapper().findNativeInput();
    input.getElement().setSelectionRange(8, 8);
    input.keydown('Backspace');
    expect(onChange).toHaveBeenLastCalledWith('12:34:5');
    input.getElement().setSelectionRange(0, 0);
    input.keydown('Delete');
    expect(onChange).toHaveBeenLastCalledWith('23:45:');
  });

  test('does not change while read-only, and can be disabled', () => {
    const onChange = vi.fn();
    const { unmount } = render(<Controlled value="12:00:00" readOnly={true} onChangeSpy={onChange} />);
    wrapper().typeText('1');
    expect(onChange).not.toHaveBeenCalled();
    unmount();
    render(<TimeInput ariaLabel="Start time" value="" disabled={true} />);
    expect(wrapper().isDisabled()).toBe(true);
  });

  test('takes its label and warning state from a form field', () => {
    render(
      <FormField label="Start time" warningText="Runs late at night">
        <TimeInput value="23:30:00" />
      </FormField>
    );
    expect(screen.getByRole('textbox', { name: 'Start time' })).toHaveAccessibleDescription(/Runs late at night/);
  });

  test('fires focus and blur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<TimeInput ariaLabel="Start time" value="" onFocus={onFocus} onBlur={onBlur} />);
    wrapper().focus();
    wrapper().blur();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Start time">
        <TimeInput value="09:30:00" placeholder="hh:mm:ss" />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
