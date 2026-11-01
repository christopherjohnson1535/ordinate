// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const regions: MultiselectProps.Options = [
  { value: 'us-east', label: 'US East', description: 'Virginia' },
  { value: 'us-west', label: 'US West', labelTag: '3 zones' },
  { value: 'eu-central', label: 'EU Central', disabled: true },
  { value: 'eu-north', label: 'EU North', tags: ['Low carbon'] },
  { value: 'ap-south', label: 'AP South' },
];

const grouped: MultiselectProps.Options = [
  {
    label: 'Americas',
    options: [
      { value: 'us-east', label: 'US East' },
      { value: 'us-west', label: 'US West' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { value: 'eu-central', label: 'EU Central' },
      { value: 'eu-north', label: 'EU North' },
    ],
  },
];

type ControlledProps = Partial<MultiselectProps> & {
  onChangeSpy?: (detail: MultiselectProps.ChangeDetail) => void;
};

function Controlled({ onChangeSpy, selectedOptions = [], ...rest }: ControlledProps) {
  const [selected, setSelected] = useState(selectedOptions);
  return (
    <Multiselect
      ariaLabel="Regions"
      options={regions}
      {...rest}
      selectedOptions={selected}
      onChange={event => {
        onChangeSpy?.(event.detail);
        setSelected(event.detail.selectedOptions);
      }}
    />
  );
}

const getTrigger = () => screen.getByRole('button', { name: /^Regions/ });
const getListbox = () => screen.getByRole('listbox');
const values = (detail: MultiselectProps.ChangeDetail) => detail.selectedOptions.map(option => option.value);
const highlightedText = () => {
  const id = getListbox().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id)?.textContent : null;
};

describe('Multiselect', () => {
  test('renders a trigger with the listbox popup pattern and a placeholder', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[]} placeholder="Choose regions" />);
    expect(getTrigger()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(getTrigger()).toHaveAccessibleName('Regions Choose regions');
  });

  test('shows how many options are selected in the trigger', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[regions[0], regions[1]]} />);
    expect(getTrigger()).toHaveAccessibleName('Regions 2 options selected');
  });

  test('opens a multi-selectable listbox with checkbox indicators', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[{ value: 'us-west' }]} />);
    fireEvent.click(getTrigger());
    expect(getListbox()).toHaveAttribute('aria-multiselectable', 'true');
    expect(getListbox()).toHaveAccessibleName('Regions');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[2]).toHaveAttribute('aria-disabled', 'true');
  });

  test('adds and removes options and keeps the list open', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('option', { name: /US West/ }));
    expect(values(onChange.mock.lastCall![0])).toEqual(['us-west']);
    fireEvent.click(screen.getByRole('option', { name: 'AP South' }));
    expect(values(onChange.mock.lastCall![0])).toEqual(['us-west', 'ap-south']);
    fireEvent.click(screen.getByRole('option', { name: /US West/ }));
    expect(values(onChange.mock.lastCall![0])).toEqual(['ap-south']);
    expect(getListbox()).toBeInTheDocument();
  });

  test('closes after a choice when keepOpen is off', () => {
    render(<Controlled keepOpen={false} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('option', { name: 'AP South' }));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  test('ignores disabled options', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('option', { name: 'EU Central' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders groups with their options', () => {
    render(<Multiselect ariaLabel="Regions" options={grouped} selectedOptions={[]} />);
    fireEvent.click(getTrigger());
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAccessibleName('Americas');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  test('does not open when disabled or read-only', () => {
    const { rerender } = render(
      <Multiselect ariaLabel="Regions" options={regions} selectedOptions={[regions[0]]} disabled={true} />
    );
    expect(getTrigger()).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Remove US East' })).toBeNull();
    rerender(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[regions[0]]} readOnly={true} />);
    expect(getTrigger()).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(getTrigger());
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByText('US East')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove US East' })).toBeNull();
  });

  test('marks itself invalid', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[]} invalid={true} />);
    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<MultiselectProps.Ref>();
    render(<Multiselect ref={ref} ariaLabel="Regions" options={regions} selectedOptions={[]} />);
    act(() => ref.current?.focus());
    expect(getTrigger()).toHaveFocus();
  });

  test('fires onFocus and onBlur once for the whole control', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <>
        <Multiselect ariaLabel="Regions" options={regions} selectedOptions={[]} onFocus={onFocus} onBlur={onBlur} />
        <button>After</button>
      </>
    );
    act(() => getTrigger().focus());
    fireEvent.click(getTrigger());
    expect(onFocus).toHaveBeenCalledTimes(1);
    act(() => screen.getByRole('button', { name: 'After' }).focus());
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Multiselect tokens', () => {
  test('shows a token for each selected option, with labels from the options', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[{ value: 'us-east' }]} />);
    const tokens = createWrapper().findMultiselect()!.findTokens();
    expect(tokens).toHaveLength(1);
    expect(tokens[0].findLabel().getText()).toBe('US East');
    expect(tokens[0].findDescription()!.getText()).toBe('Virginia');
  });

  test('removes an option from its token and moves focus to the next token', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} selectedOptions={[regions[0], regions[1], regions[4]]} />);
    const remove = screen.getByRole('button', { name: 'Remove US East' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(values(onChange.mock.lastCall![0])).toEqual(['us-west', 'ap-south']);
    expect(screen.getByRole('button', { name: 'Remove US West' })).toHaveFocus();
  });

  test('moves focus to the trigger when the last token is removed', () => {
    render(<Controlled selectedOptions={[regions[0]]} />);
    const remove = screen.getByRole('button', { name: 'Remove US East' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(getTrigger()).toHaveFocus();
  });

  test('names remove buttons with deselectAriaLabel', () => {
    render(
      <Multiselect
        ariaLabel="Regions"
        options={regions}
        selectedOptions={[regions[0]]}
        deselectAriaLabel={option => `Deselect ${option.label}`}
      />
    );
    expect(screen.getByRole('button', { name: 'Deselect US East' })).toBeInTheDocument();
  });

  test('a disabled option keeps its token but cannot be removed', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[{ value: 'eu-central' }]} />);
    expect(screen.getByText('EU Central')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove EU Central' })).toBeNull();
  });

  test('limits the tokens and toggles the rest', () => {
    render(
      <Multiselect
        ariaLabel="Regions"
        options={regions}
        selectedOptions={[regions[0], regions[1], regions[3], regions[4]]}
        tokenLimit={2}
      />
    );
    const multiselect = createWrapper().findMultiselect()!;
    expect(multiselect.findTokens()).toHaveLength(2);
    const toggle = multiselect.findTokenToggle()!;
    expect(toggle.getText()).toBe('Show 2 more');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'false');
    toggle.click();
    expect(multiselect.findTokens()).toHaveLength(4);
    expect(toggle.getText()).toBe('Show fewer');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'true');
  });

  test('hides the tokens with hideTokens', () => {
    render(<Multiselect ariaLabel="Regions" options={regions} selectedOptions={[regions[0]]} hideTokens={true} />);
    expect(createWrapper().findMultiselect()!.findTokens()).toHaveLength(0);
  });
});

describe('Multiselect select all', () => {
  test('selects every enabled option, then deselects them', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} enableSelectAll={true} />);
    fireEvent.click(getTrigger());
    const selectAll = screen.getByRole('option', { name: 'Select all' });
    fireEvent.click(selectAll);
    expect(values(onChange.mock.lastCall![0])).toEqual(['us-east', 'us-west', 'eu-north', 'ap-south']);
    expect(selectAll).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(selectAll);
    expect(values(onChange.mock.lastCall![0])).toEqual([]);
  });

  test('shows a partly checked box while some options are selected', () => {
    render(<Controlled enableSelectAll={true} selectedOptions={[regions[0]]} />);
    const multiselect = createWrapper().findMultiselect()!;
    multiselect.openDropdown();
    expect(multiselect.findSelectAll()!.getElement()).toHaveAttribute('aria-selected', 'false');
    expect(multiselect.findSelectedOptions()).toHaveLength(1);
  });

  test('applies only to the options that match the filter', () => {
    const onChange = vi.fn();
    render(
      <Controlled
        onChangeSpy={onChange}
        enableSelectAll={true}
        filteringType="auto"
        filteringAriaLabel="Filter regions"
        selectedOptions={[regions[4]]}
      />
    );
    fireEvent.click(getTrigger());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'us' } });
    fireEvent.click(screen.getByRole('option', { name: 'Select all' }));
    expect(values(onChange.mock.lastCall![0])).toEqual(['ap-south', 'us-east', 'us-west']);
  });

  test('uses the selectAllText string', () => {
    render(
      <Multiselect
        ariaLabel="Regions"
        options={regions}
        selectedOptions={[]}
        enableSelectAll={true}
        i18nStrings={{ selectAllText: 'Choose every region' }}
      />
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('option', { name: 'Choose every region' })).toBeInTheDocument();
  });
});

describe('Multiselect keyboard', () => {
  test('ArrowDown opens the list and highlights the first option', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(getListbox()).toHaveFocus();
    expect(highlightedText()).toContain('US East');
  });

  test('arrows skip disabled options, and Enter and Space toggle without closing', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'ArrowDown' });
    expect(highlightedText()).toContain('EU North');
    fireEvent.keyDown(getListbox(), { key: 'Enter' });
    expect(values(onChange.mock.lastCall![0])).toEqual(['eu-north']);
    fireEvent.keyDown(getListbox(), { key: 'End' });
    fireEvent.keyDown(getListbox(), { key: ' ' });
    expect(values(onChange.mock.lastCall![0])).toEqual(['eu-north', 'ap-south']);
    expect(getListbox()).toHaveFocus();
    expect(highlightedText()).toContain('AP South');
  });

  test('Escape closes the list and returns focus to the trigger', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  test('the filter input points at the highlighted option', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} filteringType="auto" filteringAriaLabel="Filter regions" />);
    fireEvent.click(getTrigger());
    const filter = screen.getByRole('combobox', { name: 'Filter regions' });
    expect(filter).toHaveFocus();
    fireEvent.change(filter, { target: { value: 'north' } });
    expect(filter).toHaveAttribute('aria-activedescendant', screen.getByRole('option').id);
    fireEvent.keyDown(filter, { key: 'Enter' });
    expect(values(onChange.mock.lastCall![0])).toEqual(['eu-north']);
  });
});

describe('Multiselect status', () => {
  test('calls onLoadItems when it opens and shows the loading text', () => {
    const onLoadItems = vi.fn();
    render(
      <Controlled
        options={[]}
        statusType="loading"
        loadingText="Loading regions"
        onLoadItems={event => onLoadItems(event.detail)}
      />
    );
    fireEvent.click(getTrigger());
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
    expect(screen.getByText('Loading regions')).toBeInTheDocument();
  });

  test('shows the error and retries', () => {
    const onLoadItems = vi.fn();
    render(
      <Controlled
        statusType="error"
        errorText="Could not load regions."
        recoveryText="Retry"
        onLoadItems={event => onLoadItems(event.detail)}
      />
    );
    const multiselect = createWrapper().findMultiselect()!;
    multiselect.openDropdown();
    expect(multiselect.findStatus()!.getText()).toContain('Could not load regions.');
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
    multiselect.findErrorRecoveryButton()!.click();
    expect(onLoadItems).toHaveBeenLastCalledWith({ filteringText: '', firstPage: false, samePage: true });
  });

  test('shows empty and noMatch', () => {
    const { unmount } = render(<Controlled options={[]} empty="No regions" />);
    fireEvent.click(getTrigger());
    expect(screen.getByText('No regions')).toBeInTheDocument();
    unmount();
    render(<Controlled filteringType="auto" filteringAriaLabel="Filter" noMatch="No matching regions" />);
    fireEvent.click(getTrigger());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'mars' } });
    expect(screen.getByText('No matching regions')).toBeInTheDocument();
  });
});

describe('Multiselect in a form field', () => {
  test('takes its label, description and error from the field', () => {
    render(
      <FormField label="Regions" description="Where the nodes run." errorText="Choose a region.">
        <Multiselect options={regions} selectedOptions={[]} placeholder="Choose regions" />
      </FormField>
    );
    expect(getTrigger()).toHaveAccessibleName('Regions Choose regions');
    expect(getTrigger()).toHaveAccessibleDescription('Choose a region. Where the nodes run.');
    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Multiselect test utilities and accessibility', () => {
  test('the wrapper opens and selects options', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    const multiselect = createWrapper().findMultiselect()!;
    multiselect.selectOption(2);
    multiselect.selectOption('ap-south');
    expect(values(onChange.mock.lastCall![0])).toEqual(['us-west', 'ap-south']);
    expect(multiselect.isOpen()).toBe(true);
    expect(multiselect.findSelectedOptions()).toHaveLength(2);
    expect(multiselect.findTrigger().getText()).toBe('2 options selected');
  });

  test('has no accessibility violations when closed with tokens', async () => {
    const { container } = render(
      <FormField label="Regions" description="Where the nodes run.">
        <Multiselect options={regions} selectedOptions={[regions[0], regions[1]]} tokenLimit={1} />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when open', async () => {
    const { container } = render(
      <FormField label="Regions">
        <Multiselect
          options={grouped}
          selectedOptions={[{ value: 'us-west' }]}
          enableSelectAll={true}
          filteringType="auto"
          filteringAriaLabel="Filter regions"
        />
      </FormField>
    );
    fireEvent.click(screen.getByRole('button', { name: /Regions/ }));
    await expectNoAxeViolations(container);
  });
});
