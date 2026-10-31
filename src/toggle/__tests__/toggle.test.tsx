// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import Toggle, { ToggleProps } from '../../../lib/components/toggle';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Toggle', () => {
  test('is a native checkbox with the switch role', () => {
    render(<Toggle checked={true}>Auto-scaling</Toggle>);
    const toggle = screen.getByRole('switch', { name: 'Auto-scaling' });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAttribute('type', 'checkbox');
  });

  test('fires onChange with the next state', () => {
    const onChange = vi.fn();
    render(
      <Toggle checked={true} onChange={event => onChange(event.detail)}>
        Auto-scaling
      </Toggle>
    );
    fireEvent.click(screen.getByLabelText('Auto-scaling'));
    expect(onChange).toHaveBeenCalledWith({ checked: false });
  });

  test('works as a controlled toggle', () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <Toggle checked={checked} onChange={event => setChecked(event.detail.checked)}>
          Auto-scaling
        </Toggle>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
  });

  test('does not change when disabled or read-only', () => {
    const onChange = vi.fn();
    render(
      <>
        <Toggle checked={false} disabled={true} onChange={onChange}>
          Disabled
        </Toggle>
        <Toggle checked={false} readOnly={true} onChange={onChange}>
          Read-only
        </Toggle>
      </>
    );
    const disabled = screen.getByRole('switch', { name: 'Disabled' });
    const readOnly = screen.getByRole('switch', { name: 'Read-only' });
    expect(disabled).toBeDisabled();
    expect(readOnly).toHaveAttribute('aria-readonly', 'true');
    fireEvent.click(disabled);
    fireEvent.click(readOnly);
    expect(onChange).not.toHaveBeenCalled();
    expect(readOnly).not.toBeChecked();
  });

  test('describes itself with the description and form field', () => {
    render(
      <FormField label="Scaling" description="Applies to every region.">
        <Toggle checked={false} description="Adds nodes under load.">
          Auto-scaling
        </Toggle>
      </FormField>
    );
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAccessibleName('Scaling Auto-scaling');
    expect(toggle).toHaveAccessibleDescription('Applies to every region. Adds nodes under load.');
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<ToggleProps.Ref>();
    render(<Toggle ref={ref} checked={false} ariaLabel="Auto-scaling" />);
    ref.current?.focus();
    expect(screen.getByRole('switch')).toHaveFocus();
  });
});

describe('Toggle test utilities and accessibility', () => {
  test('the wrapper reads and clicks the toggle', () => {
    const onChange = vi.fn();
    render(
      <Toggle checked={true} description="Adds nodes under load." onChange={onChange}>
        Auto-scaling
      </Toggle>
    );
    const toggle = createWrapper().findToggle()!;
    expect(toggle.findLabel()!.getText()).toBe('Auto-scaling');
    expect(toggle.findDescription()!.getText()).toBe('Adds nodes under load.');
    expect(toggle.isChecked()).toBe(true);
    toggle.findNativeInput().click();
    expect(onChange).toHaveBeenCalledOnce();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <Toggle checked={false}>Off</Toggle>
        <Toggle checked={true} description="With a description.">
          On
        </Toggle>
        <Toggle checked={true} disabled={true}>
          Disabled
        </Toggle>
        <Toggle checked={true} readOnly={true}>
          Read-only
        </Toggle>
        <Toggle checked={false} ariaLabel="No visible label" />
      </form>
    );
    await expectNoAxeViolations(container);
  });
});
