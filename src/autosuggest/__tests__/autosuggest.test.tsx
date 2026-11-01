// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import FormField from '../../../lib/components/form-field';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const hosts: AutosuggestProps.Options = [
  { value: 'east-1.example.com', label: 'East 1', description: 'Virginia' },
  { value: 'east-2.example.com', label: 'East 2', disabled: true },
  { value: 'west-1.example.com', label: 'West 1', tags: ['Primary'] },
  { value: 'north-1.example.com', label: 'North 1' },
];

const grouped: AutosuggestProps.Options = [
  {
    label: 'East',
    options: [
      { value: 'east-1', label: 'East 1' },
      { value: 'east-2', label: 'East 2' },
    ],
  },
  { label: 'West', options: [{ value: 'west-1', label: 'West 1' }] },
];

type ControlledProps = Partial<AutosuggestProps> & {
  onChangeSpy?: (value: string) => void;
  onSelectSpy?: (detail: AutosuggestProps.SelectDetail) => void;
};

function Controlled({ onChangeSpy, onSelectSpy, value: initial = '', ...rest }: ControlledProps) {
  const [value, setValue] = useState(initial);
  return (
    <Autosuggest
      ariaLabel="Host"
      options={hosts}
      {...rest}
      value={value}
      onChange={event => {
        onChangeSpy?.(event.detail.value);
        setValue(event.detail.value);
      }}
      onSelect={event => onSelectSpy?.(event.detail)}
    />
  );
}

const getInput = () => screen.getByRole('combobox');
const type = (text: string) => fireEvent.change(getInput(), { target: { value: text } });
const highlightedText = () => {
  const id = getInput().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id)?.textContent : null;
};

describe('Autosuggest', () => {
  test('renders an input with the combobox pattern', () => {
    render(<Autosuggest ariaLabel="Host" value="" options={hosts} placeholder="Find a host" />);
    const input = getInput();
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('placeholder', 'Find a host');
    expect(input).toHaveAccessibleName('Host');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('typing fires onChange, opens the list and filters the suggestions', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    type('west');
    expect(onChange).toHaveBeenCalledWith('west');
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    expect(getInput()).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    const options = screen.getAllByRole('option');
    expect(options.map(option => option.textContent)).toEqual(['Use: "west"', 'West 1Primary']);
  });

  test('choosing a suggestion fills the input and fires onSelect', () => {
    const onSelect = vi.fn();
    render(<Controlled onSelectSpy={onSelect} />);
    type('e');
    fireEvent.click(screen.getByRole('option', { name: /North 1/ }));
    expect(onSelect).toHaveBeenCalledWith({ value: 'north-1.example.com', selectedOption: hosts[3] });
    expect(getInput()).toHaveValue('north-1.example.com');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('choosing the entered text option fires onSelect without an option', () => {
    const onSelect = vi.fn();
    render(<Controlled onSelectSpy={onSelect} />);
    type('south');
    fireEvent.click(screen.getByRole('option', { name: 'Use: "south"' }));
    expect(onSelect).toHaveBeenCalledWith({ value: 'south' });
    expect(getInput()).toHaveValue('south');
  });

  test('labels the entered text option with enteredTextLabel or hides it', () => {
    const { unmount } = render(<Controlled enteredTextLabel={value => `Search for ${value}`} />);
    type('west');
    expect(screen.getByRole('option', { name: 'Search for west' })).toBeInTheDocument();
    unmount();
    render(<Controlled hideEnteredTextOption={true} />);
    type('west');
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  test('ignores disabled suggestions', () => {
    const onSelect = vi.fn();
    render(<Controlled onSelectSpy={onSelect} hideEnteredTextOption={true} />);
    type('east');
    fireEvent.click(screen.getByRole('option', { name: 'East 2' }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('manual filtering shows every suggestion', () => {
    render(<Controlled filteringType="manual" hideEnteredTextOption={true} />);
    type('zzz');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  test('renders groups', () => {
    render(<Controlled options={grouped} hideEnteredTextOption={true} />);
    type('east');
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveAccessibleName('East');
  });

  test('does not open when disabled or read-only', () => {
    const { rerender } = render(<Autosuggest ariaLabel="Host" value="" options={hosts} disabled={true} />);
    expect(getInput()).toBeDisabled();
    rerender(<Autosuggest ariaLabel="Host" value="east" options={hosts} readOnly={true} />);
    fireEvent.click(getInput());
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('marks itself invalid', () => {
    render(<Autosuggest ariaLabel="Host" value="" options={hosts} invalid={true} />);
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });

  test('exposes focus() and select() through its ref', () => {
    const ref = React.createRef<AutosuggestProps.Ref>();
    render(<Autosuggest ref={ref} ariaLabel="Host" value="east" options={hosts} />);
    act(() => ref.current?.focus());
    expect(getInput()).toHaveFocus();
    act(() => ref.current?.select());
    expect((getInput() as HTMLInputElement).selectionEnd).toBe(4);
  });

  test('fires onFocus and onBlur, and closes on blur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <>
        <Controlled onFocus={onFocus} onBlur={onBlur} />
        <button>After</button>
      </>
    );
    act(() => getInput().focus());
    type('w');
    expect(onFocus).toHaveBeenCalledTimes(1);
    act(() => screen.getByRole('button', { name: 'After' }).focus());
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('closes when the user presses the mouse outside', () => {
    render(
      <>
        <button>Outside</button>
        <Controlled />
      </>
    );
    type('w');
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Autosuggest keyboard', () => {
  test('ArrowDown opens the list at the first option and ArrowUp at the last', () => {
    const { unmount } = render(<Controlled hideEnteredTextOption={true} />);
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(highlightedText()).toContain('East 1');
    unmount();
    render(<Controlled hideEnteredTextOption={true} />);
    fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
    expect(highlightedText()).toContain('North 1');
  });

  test('arrows move the highlight, skipping disabled options, and Enter chooses', () => {
    const onSelect = vi.fn();
    render(<Controlled onSelectSpy={onSelect} />);
    act(() => getInput().focus());
    type('east');
    expect(getInput()).not.toHaveAttribute('aria-activedescendant');
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(highlightedText()).toBe('Use: "east"');
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(highlightedText()).toContain('East 1');
    expect(screen.getByRole('option', { name: /East 1/ })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(highlightedText()).toContain('East 1');
    const enter = fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(enter).toBe(false);
    expect(onSelect).toHaveBeenCalledWith({ value: 'east-1.example.com', selectedOption: hosts[0] });
    expect(getInput()).toHaveFocus();
  });

  test('Enter without a highlight closes the list and does not prevent form submission', () => {
    const onSelect = vi.fn();
    render(<Controlled onSelectSpy={onSelect} />);
    type('east');
    const enter = fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(enter).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('Escape closes the list, then clears the text', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    type('east');
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getInput()).toHaveValue('east');
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(getInput()).toHaveValue('');
  });

  test('Escape inside a modal closes only the list', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Connect" onDismiss={onDismiss}>
        <Controlled />
      </Modal>
    );
    type('east');
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

describe('Autosuggest status', () => {
  test('calls onLoadItems as the text changes', () => {
    const onLoadItems = vi.fn();
    render(<Controlled onLoadItems={event => onLoadItems(event.detail)} />);
    type('we');
    expect(onLoadItems).toHaveBeenLastCalledWith({ filteringText: 'we', firstPage: true, samePage: false });
  });

  test('shows the loading text and the empty state', () => {
    const { unmount } = render(<Controlled options={[]} statusType="loading" loadingText="Loading hosts" />);
    type('w');
    expect(screen.getByText('Loading hosts')).toBeInTheDocument();
    unmount();
    render(<Controlled options={[]} empty="No hosts" hideEnteredTextOption={true} />);
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(screen.getByText('No hosts')).toBeInTheDocument();
  });

  test('shows the error and retries', () => {
    const onLoadItems = vi.fn();
    render(
      <Controlled
        statusType="error"
        errorText="Could not load hosts."
        recoveryText="Retry"
        onLoadItems={event => onLoadItems(event.detail)}
      />
    );
    type('w');
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onLoadItems).toHaveBeenLastCalledWith({ filteringText: 'w', firstPage: false, samePage: true });
  });

  test('does not open an empty list', () => {
    render(<Controlled options={[]} hideEnteredTextOption={true} />);
    type('w');
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Autosuggest in a form field', () => {
  test('takes its label, description and error from the field', () => {
    render(
      <FormField label="Host" description="The server to connect to." errorText="Enter a host.">
        <Autosuggest value="" options={hosts} />
      </FormField>
    );
    expect(getInput()).toHaveAccessibleName('Host');
    expect(getInput()).toHaveAccessibleDescription('Enter a host. The server to connect to.');
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Autosuggest test utilities and accessibility', () => {
  test('the wrapper types and selects suggestions', () => {
    const onSelect = vi.fn();
    render(<Controlled onSelectSpy={onSelect} />);
    const autosuggest = createWrapper().findAutosuggest()!;
    autosuggest.setInputValue('1');
    expect(autosuggest.isOpen()).toBe(true);
    expect(autosuggest.findEnteredTextOption()!.getText()).toBe('Use: "1"');
    expect(autosuggest.findOptions()).toHaveLength(4);
    autosuggest.selectSuggestion('west-1.example.com');
    expect(onSelect).toHaveBeenLastCalledWith({ value: 'west-1.example.com', selectedOption: hosts[2] });
    expect(autosuggest.findNativeInput().getElement()).toHaveValue('west-1.example.com');
  });

  test('has no accessibility violations when closed', async () => {
    const { container } = render(
      <FormField label="Host" description="The server to connect to.">
        <Autosuggest value="east" options={hosts} />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when open', async () => {
    const { container } = render(
      <FormField label="Host">
        <Controlled options={grouped} statusType="error" errorText="Could not load hosts." recoveryText="Retry" />
      </FormField>
    );
    type('e');
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    await expectNoAxeViolations(container);
  });
});
