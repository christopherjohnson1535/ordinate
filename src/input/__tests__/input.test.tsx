// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Input, { InputProps } from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Input', () => {
  test('fires onChange with the new value', () => {
    const onChange = vi.fn();
    render(<Input ariaLabel="Project name" value="" onChange={event => onChange(event.detail)} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'north-annex' } });
    expect(onChange).toHaveBeenCalledWith({ value: 'north-annex' });
  });

  test('works as a controlled input', () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <Input ariaLabel="Region" value={value} onChange={event => setValue(event.detail.value)} />;
    }
    render(<Controlled />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'us-mountain-1' } });
    expect(screen.getByRole('textbox')).toHaveValue('us-mountain-1');
  });

  test('maps autoComplete booleans to on and off', () => {
    const { rerender } = render(<Input ariaLabel="Name" value="" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'on');
    rerender(<Input ariaLabel="Name" value="" autoComplete={false} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off');
    rerender(<Input ariaLabel="Name" value="" autoComplete="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
  });

  test('marks itself invalid', () => {
    render(<Input ariaLabel="Capacity" value="0" invalid={true} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  test('exposes focus() and select() through its ref', () => {
    const ref = React.createRef<InputProps.Ref>();
    render(<Input ref={ref} ariaLabel="Name" value="north-annex" />);
    ref.current?.focus();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});

describe('FormField', () => {
  test('labels its control', () => {
    render(
      <FormField label="Project name">
        <Input value="" />
      </FormField>
    );
    expect(screen.getByRole('textbox', { name: 'Project name' })).toBeInTheDocument();
  });

  test('describes its control with the description and constraint', () => {
    render(
      <FormField label="Project name" description="Shown in the console." constraintText="Lowercase letters only.">
        <Input value="" />
      </FormField>
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Shown in the console. Lowercase letters only.');
  });

  test('an error marks the control invalid and is read first', () => {
    render(
      <FormField label="Capacity" description="Number of nodes." errorText="Enter at least 1 node.">
        <Input value="0" />
      </FormField>
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter at least 1 node. Number of nodes.');
  });

  test('uses the given controlId', () => {
    render(
      <FormField label="Region" controlId="region">
        <Input value="" />
      </FormField>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'region');
  });

  test('props on the control win over the field', () => {
    render(
      <FormField label="Capacity" errorText="Enter at least 1 node.">
        <Input value="3" invalid={false} />
      </FormField>
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Input and FormField test utilities and accessibility', () => {
  test('the wrapper types into the input', () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <Input ariaLabel="Name" value={value} onChange={event => setValue(event.detail.value)} />;
    }
    render(<Controlled />);
    const input = createWrapper().findInput()!;
    input.setInputValue('north-annex');
    expect(input.getInputValue()).toBe('north-annex');
  });

  test('the wrapper reads the form field parts', () => {
    render(
      <FormField label="Capacity" description="Number of nodes." errorText="Enter at least 1 node.">
        <Input value="0" />
      </FormField>
    );
    const field = createWrapper().findFormField()!;
    expect(field.findLabel()!.getText()).toBe('Capacity');
    expect(field.findError()!.getText()).toBe('Enter at least 1 node.');
    expect(field.findControl()!.findInput()).not.toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <FormField label="Project name" description="Shown in the console." constraintText="Lowercase only.">
          <Input value="north-annex" />
        </FormField>
        <FormField label="Capacity" errorText="Enter at least 1 node.">
          <Input value="0" type="number" />
        </FormField>
        <FormField label="Region">
          <Input value="us-mountain-1" readOnly={true} />
        </FormField>
      </form>
    );
    await expectNoAxeViolations(container);
  });
});
