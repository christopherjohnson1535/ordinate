// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import RadioButton, { RadioButtonProps } from '../../../lib/components/radio-button';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('RadioButton', () => {
  test('is a native radio button with its name and value', () => {
    render(
      <RadioButton checked={true} name="plan" value="team">
        Team
      </RadioButton>
    );
    const radio = screen.getByRole('radio', { name: 'Team' });
    expect(radio).toBeChecked();
    expect(radio).toHaveAttribute('name', 'plan');
    expect(radio).toHaveAttribute('value', 'team');
  });

  test('fires onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(
      <RadioButton checked={false} name="plan" onSelect={onSelect}>
        Team
      </RadioButton>
    );
    fireEvent.click(screen.getByLabelText('Team'));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  test('does not fire onSelect when read-only or disabled', () => {
    const onSelect = vi.fn();
    render(
      <>
        <RadioButton checked={false} name="plan" readOnly={true} onSelect={onSelect}>
          Team
        </RadioButton>
        <RadioButton checked={false} name="plan" disabled={true} onSelect={onSelect}>
          Enterprise
        </RadioButton>
      </>
    );
    const [readOnly, disabled] = screen.getAllByRole('radio');
    expect(readOnly).toHaveAttribute('aria-disabled', 'true');
    expect(disabled).toBeDisabled();
    fireEvent.click(readOnly);
    fireEvent.click(disabled);
    expect(onSelect).not.toHaveBeenCalled();
    expect(readOnly).not.toBeChecked();
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<RadioButtonProps.Ref>();
    render(<RadioButton ref={ref} checked={false} name="plan" ariaLabel="Team" />);
    ref.current?.focus();
    expect(screen.getByRole('radio')).toHaveFocus();
  });
});

describe('RadioButton test utilities and accessibility', () => {
  test('the wrapper reads the parts', () => {
    render(
      <RadioButton checked={true} name="plan" description="Up to 20 people.">
        Team
      </RadioButton>
    );
    const radio = createWrapper().findRadioButton()!;
    expect(radio.findLabel()!.getText()).toBe('Team');
    expect(radio.findDescription()!.getText()).toBe('Up to 20 people.');
    expect(radio.isChecked()).toBe(true);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <div role="radiogroup" aria-label="Plan">
        <RadioButton checked={true} name="plan" description="Up to 20 people.">
          Team
        </RadioButton>
        <RadioButton checked={false} name="plan" disabled={true}>
          Enterprise
        </RadioButton>
      </div>
    );
    await expectNoAxeViolations(container);
  });
});
