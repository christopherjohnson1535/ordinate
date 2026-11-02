// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Checkbox, { CheckboxProps } from '../../../lib/components/checkbox';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Checkbox', () => {
  test('is a native checkbox named by its label', () => {
    render(<Checkbox checked={true}>Enable logging</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Enable logging' });
    expect(checkbox).toBeChecked();
    expect(checkbox.tagName).toBe('INPUT');
  });

  test('fires onChange with the next state', () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={event => onChange(event.detail)}>
        Enable logging
      </Checkbox>
    );
    fireEvent.click(screen.getByLabelText('Enable logging'));
    expect(onChange).toHaveBeenCalledWith({ checked: true, indeterminate: false });
  });

  test('works as a controlled checkbox', () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox checked={checked} onChange={event => setChecked(event.detail.checked)}>
          Enable logging
        </Checkbox>
      );
    }
    render(<Controlled />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('stays unchanged when the parent ignores onChange', () => {
    render(<Checkbox checked={false}>Enable logging</Checkbox>);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('sets the native indeterminate property and reports checked when clicked', () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} indeterminate={true} onChange={event => onChange(event.detail)}>
        Select all
      </Checkbox>
    );
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith({ checked: true, indeterminate: false });
    expect(checkbox.indeterminate).toBe(true);
  });

  test('draws a tick only when checked; partly checked is a half fill', () => {
    const { container, rerender } = render(<Checkbox checked={true}>Back up nightly</Checkbox>);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    rerender(
      <Checkbox checked={false} indeterminate={true}>
        Back up nightly
      </Checkbox>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(0);
    rerender(<Checkbox checked={false}>Back up nightly</Checkbox>);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  test('does not fire onChange when disabled', () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} disabled={true} onChange={onChange}>
        Enable logging
      </Checkbox>
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('is focusable but does not change when read-only', () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={true} readOnly={true} onChange={onChange}>
        Enable logging
      </Checkbox>
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-readonly', 'true');
    expect(checkbox).not.toBeDisabled();
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
    expect(checkbox).toBeChecked();
  });

  test('describes itself with the description', () => {
    render(
      <Checkbox checked={false} description="Keeps logs for 30 days.">
        Enable logging
      </Checkbox>
    );
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Keeps logs for 30 days.');
  });

  test('uses ariaLabel without a visible label', () => {
    render(<Checkbox checked={false} ariaLabel="Select row north-annex" />);
    expect(screen.getByRole('checkbox', { name: 'Select row north-annex' })).toBeInTheDocument();
  });

  test('fires onFocus and onBlur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<Checkbox checked={false} ariaLabel="Select" onFocus={onFocus} onBlur={onBlur} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.focus(checkbox);
    fireEvent.blur(checkbox);
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  test('takes its name and description from a form field and keeps its own label', () => {
    render(
      <FormField label="Notifications" description="Sent to the project owner.">
        <Checkbox checked={false} description="At most one a day.">
          Email me about failed deploys
        </Checkbox>
      </FormField>
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAccessibleName('Notifications Email me about failed deploys');
    expect(checkbox).toHaveAccessibleDescription('Sent to the project owner. At most one a day.');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'logging', 'data-testid': 'logging', className: 'custom' } as unknown as CheckboxProps;
    render(<Checkbox {...props} checked={false} />);
    const root = screen.getByTestId('logging');
    expect(root).toHaveAttribute('id', 'logging');
    expect(root).not.toHaveClass('custom');
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<CheckboxProps.Ref>();
    render(<Checkbox ref={ref} checked={false} ariaLabel="Select" />);
    ref.current?.focus();
    expect(screen.getByRole('checkbox')).toHaveFocus();
  });
});

describe('Checkbox test utilities and accessibility', () => {
  test('the wrapper reads and clicks the checkbox', () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} indeterminate={true} description="Includes archived." onChange={onChange}>
        Select all
      </Checkbox>
    );
    const checkbox = createWrapper().findCheckbox()!;
    expect(checkbox.findLabel()!.getText()).toBe('Select all');
    expect(checkbox.findDescription()!.getText()).toBe('Includes archived.');
    expect(checkbox.isChecked()).toBe(false);
    expect(checkbox.isIndeterminate()).toBe(true);
    expect(checkbox.isDisabled()).toBe(false);
    checkbox.findNativeInput().click();
    expect(onChange).toHaveBeenCalledOnce();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <Checkbox checked={false}>Unchecked</Checkbox>
        <Checkbox checked={true} description="With a description.">
          Checked
        </Checkbox>
        <Checkbox checked={false} indeterminate={true}>
          Indeterminate
        </Checkbox>
        <Checkbox checked={true} disabled={true}>
          Disabled
        </Checkbox>
        <Checkbox checked={true} readOnly={true}>
          Read-only
        </Checkbox>
        <Checkbox checked={false} ariaLabel="No visible label" />
        <FormField label="Notifications">
          <Checkbox checked={false}>Email me</Checkbox>
        </FormField>
      </form>
    );
    await expectNoAxeViolations(container);
  });
});
