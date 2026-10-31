// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import RadioGroup, { RadioGroupProps } from '../../../lib/components/radio-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: RadioGroupProps.Item[] = [
  { value: 'free', label: 'Free', description: 'One project.' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
];

describe('RadioGroup', () => {
  test('renders a named radiogroup with one radio per item', () => {
    render(<RadioGroup ariaLabel="Plan" value="team" items={items} />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Enterprise' })).toBeDisabled();
  });

  test('shares one generated name across the radio buttons', () => {
    render(<RadioGroup ariaLabel="Plan" value={null} items={items} />);
    const names = screen.getAllByRole('radio').map(radio => radio.getAttribute('name'));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  test('uses the given name', () => {
    render(<RadioGroup ariaLabel="Plan" name="plan" value={null} items={items} />);
    screen.getAllByRole('radio').forEach(radio => expect(radio).toHaveAttribute('name', 'plan'));
  });

  test('fires onChange with the selected value', () => {
    const onChange = vi.fn();
    render(<RadioGroup ariaLabel="Plan" value="free" items={items} onChange={event => onChange(event.detail)} />);
    fireEvent.click(screen.getByLabelText('Team'));
    expect(onChange).toHaveBeenCalledWith({ value: 'team' });
  });

  test('works as a controlled group', () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <RadioGroup ariaLabel="Plan" value={value} items={items} onChange={event => setValue(event.detail.value)} />
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByLabelText('Free'));
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    fireEvent.click(screen.getByLabelText('Team'));
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  });

  test('does not change when read-only', () => {
    const onChange = vi.fn();
    render(<RadioGroup ariaLabel="Plan" value="free" items={items} readOnly={true} onChange={onChange} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    fireEvent.click(screen.getByLabelText('Team'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
  });

  test('takes its name and description from a form field', () => {
    render(
      <FormField label="Plan" description="You can change it later.">
        <RadioGroup value="free" items={items} />
      </FormField>
    );
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAccessibleDescription('You can change it later.');
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription('One project.');
  });

  test('uses item controlIds', () => {
    render(<RadioGroup ariaLabel="Plan" value={null} items={[{ value: 'free', label: 'Free', controlId: 'free' }]} />);
    expect(screen.getByRole('radio')).toHaveAttribute('id', 'free');
  });

  test('focus() moves to the selected item, or the first one that can be selected', () => {
    const ref = React.createRef<RadioGroupProps.Ref>();
    const { rerender } = render(<RadioGroup ref={ref} ariaLabel="Plan" value="team" items={items} />);
    ref.current?.focus();
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus();
    rerender(<RadioGroup ref={ref} ariaLabel="Plan" value={null} items={items} />);
    ref.current?.focus();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
  });
});

describe('RadioGroup test utilities and accessibility', () => {
  test('the wrapper finds buttons and inputs', () => {
    const onChange = vi.fn();
    render(<RadioGroup ariaLabel="Plan" value="free" items={items} onChange={event => onChange(event.detail)} />);
    const group = createWrapper().findRadioGroup()!;
    expect(group.findButtons()).toHaveLength(3);
    expect(group.findButtons()[0].findDescription()!.getText()).toBe('One project.');
    expect(group.getSelectedValue()).toBe('free');
    group.findInputByValue('team')!.click();
    expect(onChange).toHaveBeenCalledWith({ value: 'team' });
    expect(group.findInputByValue('missing')).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <FormField label="Plan" description="You can change it later.">
          <RadioGroup value="free" items={items} />
        </FormField>
        <RadioGroup ariaLabel="Region" value={null} direction="horizontal" items={items} readOnly={true} />
      </form>
    );
    await expectNoAxeViolations(container);
  });
});
