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

describe('Input attributes', () => {
  test('passes the native hints', () => {
    render(
      <Input
        ariaLabel="Capacity"
        value="3"
        type="number"
        inputMode="numeric"
        step={2}
        spellcheck={false}
        disableBrowserAutocorrect={true}
      />
    );
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('step', '2');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(input).toHaveAttribute('autocorrect', 'off');
    expect(input).toHaveAttribute('autocapitalize', 'off');
  });

  test('leaves autocorrect and spell check to the browser by default', () => {
    render(<Input ariaLabel="Name" value="" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('autocorrect');
    expect(input).not.toHaveAttribute('autocapitalize');
    expect(input).not.toHaveAttribute('spellcheck');
  });

  test('autoFocus focuses the input on mount', () => {
    render(<Input ariaLabel="Name" value="" autoFocus={true} />);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  test('ariaLabel replaces the label from the form field', () => {
    render(
      <FormField label="Project name">
        <Input value="" ariaLabel="Project name, required" />
      </FormField>
    );
    expect(screen.getByRole('textbox', { name: 'Project name, required' })).toBeInTheDocument();
  });
});

describe('Input key events', () => {
  test('fires onKeyDown and onKeyUp with the key detail', () => {
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    render(
      <Input
        ariaLabel="Name"
        value=""
        onKeyDown={event => onKeyDown(event.detail)}
        onKeyUp={event => onKeyUp(event.detail)}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    fireEvent.keyUp(input, { key: 'a' });
    expect(onKeyDown).toHaveBeenCalledWith({
      key: 'Enter',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      isComposing: false,
    });
    expect(onKeyUp).toHaveBeenCalledWith(expect.objectContaining({ key: 'a', ctrlKey: false }));
  });

  test('preventDefault in onKeyDown prevents the native default', () => {
    render(<Input ariaLabel="Name" value="" onKeyDown={event => event.preventDefault()} />);
    const keydown = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    screen.getByRole('textbox').dispatchEvent(keydown);
    expect(keydown.defaultPrevented).toBe(true);
  });
});

describe('Input search', () => {
  function Search({ initial = 'north' }: { initial?: string }) {
    const [value, setValue] = useState(initial);
    return (
      <Input
        type="search"
        ariaLabel="Find projects"
        clearAriaLabel="Clear search"
        value={value}
        onChange={event => setValue(event.detail.value)}
      />
    );
  }

  test('shows a clear button only while there is a value', () => {
    const { unmount } = render(<Search initial="" />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    unmount();
    render(<Search />);
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  test('the clear button empties the input and returns focus to it', () => {
    render(<Search />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  test('has no clear button when disabled or read-only', () => {
    render(
      <>
        <Input type="search" ariaLabel="Disabled" value="north" disabled={true} />
        <Input type="search" ariaLabel="Read-only" value="north" readOnly={true} />
      </>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('the clear button does not submit the form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Search />
      </form>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('Input inline label', () => {
  test('labels the input', () => {
    render(<Input inlineLabelText="Region" value="us-mountain-1" />);
    expect(screen.getByRole('textbox', { name: 'Region' })).toBeInTheDocument();
  });

  test('uses the controlId when given', () => {
    render(<Input inlineLabelText="Region" value="" controlId="region" />);
    expect(screen.getByRole('textbox', { name: 'Region' })).toHaveAttribute('id', 'region');
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
    expect(input).toHaveAccessibleDescription(/Enter at least 1 node\. Number of nodes\.$/);
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

  test('the wrapper finds the search parts and clears the value', () => {
    function Search() {
      const [value, setValue] = useState('north');
      return <Input type="search" ariaLabel="Find" value={value} onChange={event => setValue(event.detail.value)} />;
    }
    render(<Search />);
    const input = createWrapper().findInput()!;
    expect(input.findSearchIcon()).not.toBeNull();
    input.findClearButton()!.click();
    expect(input.getInputValue()).toBe('');
    expect(input.findClearButton()).toBeNull();
  });

  test('the wrapper reads the inline label and state', () => {
    render(<Input inlineLabelText="Region" value="us-mountain-1" readOnly={true} />);
    const input = createWrapper().findInput()!;
    expect(input.findInlineLabel()!.getText()).toBe('Region');
    expect(input.isReadOnly()).toBe(true);
    expect(input.isDisabled()).toBe(false);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <Input type="search" ariaLabel="Find projects" value="north" />
        <Input inlineLabelText="Region" value="us-mountain-1" />
        <Input inlineLabelText="Zone" value="" disabled={true} />
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
