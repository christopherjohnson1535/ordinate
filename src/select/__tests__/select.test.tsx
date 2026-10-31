// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Modal from '../../../lib/components/modal';
import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const regions: SelectProps.Options = [
  { value: 'us-east', label: 'US East', description: 'Virginia' },
  { value: 'us-west', label: 'US West', labelTag: '3 zones' },
  { value: 'eu-central', label: 'EU Central', disabled: true },
  { value: 'eu-north', label: 'EU North', tags: ['Low carbon'] },
  { value: 'ap-south', label: 'AP South' },
];

const grouped: SelectProps.Options = [
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

function Controlled(props: Partial<SelectProps> & { onChangeSpy?: (detail: SelectProps.ChangeDetail) => void }) {
  const { onChangeSpy, ...rest } = props;
  const [selected, setSelected] = useState<SelectProps.Option | null>(props.selectedOption ?? null);
  return (
    <Select
      ariaLabel="Region"
      options={regions}
      {...rest}
      selectedOption={selected}
      onChange={event => {
        onChangeSpy?.(event.detail);
        setSelected(event.detail.selectedOption);
      }}
    />
  );
}

const getTrigger = () => screen.getByRole('button');
const getListbox = () => screen.getByRole('listbox');
const highlightedText = () => {
  const id = getListbox().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id)?.textContent : null;
};

describe('Select', () => {
  test('renders a trigger with the listbox popup pattern', () => {
    render(<Select ariaLabel="Region" options={regions} selectedOption={null} placeholder="Choose a region" />);
    const trigger = getTrigger();
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAccessibleName('Region Choose a region');
    expect(trigger).toHaveTextContent('Choose a region');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('names the trigger with the label and the selected value', () => {
    render(<Select ariaLabel="Region" options={regions} selectedOption={regions[1]} />);
    expect(getTrigger()).toHaveAccessibleName('Region US West');
  });

  test('opens on click and shows the options', () => {
    render(<Select ariaLabel="Region" options={regions} selectedOption={null} />);
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger()).toHaveAttribute('aria-controls', getListbox().id);
    expect(screen.getAllByRole('option')).toHaveLength(5);
    expect(getListbox()).toHaveAccessibleName('Region');
    expect(getListbox()).toHaveFocus();
  });

  test('shows label tags, descriptions and tags', () => {
    render(<Select ariaLabel="Region" options={regions} selectedOption={null} />);
    fireEvent.click(getTrigger());
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('US EastVirginia');
    expect(options[1]).toHaveTextContent('US West3 zones');
    expect(options[3]).toHaveTextContent('EU NorthLow carbon');
  });

  test('marks the selected and disabled options', () => {
    render(<Select ariaLabel="Region" options={regions} selectedOption={{ value: 'us-west' }} />);
    fireEvent.click(getTrigger());
    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[2]).toHaveAttribute('aria-disabled', 'true');
  });

  test('fires onChange with the chosen option and closes', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('option', { name: 'AP South' }));
    expect(onChange).toHaveBeenCalledWith({ selectedOption: regions[4] });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getTrigger()).toHaveTextContent('AP South');
    expect(getTrigger()).toHaveFocus();
  });

  test('does not fire onChange for a disabled option or the selected option', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} selectedOption={regions[0]} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('option', { name: 'EU Central' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(getListbox()).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: /US East/ }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('closes when the user presses the mouse outside', () => {
    render(
      <>
        <button>Outside</button>
        <Select ariaLabel="Region" options={regions} selectedOption={null} />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    expect(getListbox()).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('does not open when disabled or read-only', () => {
    const { rerender } = render(<Select ariaLabel="Region" options={regions} selectedOption={null} disabled={true} />);
    expect(getTrigger()).toBeDisabled();
    rerender(<Select ariaLabel="Region" options={regions} selectedOption={null} readOnly={true} />);
    expect(getTrigger()).toHaveAttribute('aria-disabled', 'true');
    expect(getTrigger()).not.toBeDisabled();
    fireEvent.click(getTrigger());
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('marks itself invalid', () => {
    render(<Select ariaLabel="Region" options={regions} selectedOption={null} invalid={true} />);
    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
  });

  test('renders groups with their options', () => {
    render(<Select ariaLabel="Region" options={grouped} selectedOption={null} />);
    fireEvent.click(getTrigger());
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAccessibleName('Americas');
    expect(groups[1]).toHaveAccessibleName('Europe');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  test('a disabled group disables its options', () => {
    render(
      <Select
        ariaLabel="Region"
        options={[{ ...grouped[0], disabled: true }, grouped[1]] as SelectProps.Options}
        selectedOption={null}
      />
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('option', { name: 'US East' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: 'EU North' })).not.toHaveAttribute('aria-disabled');
  });

  test('shows the empty state', () => {
    render(<Select ariaLabel="Region" options={[]} selectedOption={null} empty="No regions" />);
    fireEvent.click(getTrigger());
    expect(screen.getByText('No regions')).toBeInTheDocument();
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<SelectProps.Ref>();
    render(<Select ref={ref} ariaLabel="Region" options={regions} selectedOption={null} />);
    act(() => ref.current?.focus());
    expect(getTrigger()).toHaveFocus();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('fires onFocus and onBlur once for the whole control', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <>
        <Select ariaLabel="Region" options={regions} selectedOption={null} onFocus={onFocus} onBlur={onBlur} />
        <button>After</button>
      </>
    );
    act(() => getTriggerByName('Region').focus());
    fireEvent.click(getTriggerByName('Region'));
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).not.toHaveBeenCalled();
    act(() => screen.getByRole('button', { name: 'After' }).focus());
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

function getTriggerByName(name: string) {
  return screen.getByRole('button', { name });
}

describe('Select keyboard', () => {
  test('ArrowDown opens the list and highlights the first option', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(getListbox()).toHaveFocus();
    expect(highlightedText()).toContain('US East');
  });

  test('ArrowUp opens the list too', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowUp' });
    expect(getListbox()).toBeInTheDocument();
  });

  test('opening highlights the selected option', () => {
    render(<Controlled selectedOption={regions[3]} />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(highlightedText()).toContain('EU North');
  });

  test('arrows move the highlight and skip disabled options', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    const listbox = getListbox();
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(highlightedText()).toContain('US West');
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(highlightedText()).toContain('EU North');
    fireEvent.keyDown(listbox, { key: 'ArrowUp' });
    expect(highlightedText()).toContain('US West');
  });

  test('the highlight stops at the ends of the list', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'ArrowUp' });
    expect(highlightedText()).toContain('US East');
    fireEvent.keyDown(getListbox(), { key: 'End' });
    fireEvent.keyDown(getListbox(), { key: 'ArrowDown' });
    expect(highlightedText()).toContain('AP South');
  });

  test('Home and End move to the first and last options', () => {
    render(<Controlled />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'End' });
    expect(highlightedText()).toContain('AP South');
    fireEvent.keyDown(getListbox(), { key: 'Home' });
    expect(highlightedText()).toContain('US East');
  });

  test('Enter chooses the highlighted option and returns focus to the trigger', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith({ selectedOption: regions[1] });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  test('Space chooses the highlighted option', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'End' });
    fireEvent.keyDown(getListbox(), { key: ' ' });
    expect(onChange).toHaveBeenCalledWith({ selectedOption: regions[4] });
  });

  test('Escape closes without changing the value and returns focus', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(getTrigger()).toHaveFocus();
  });

  test('Escape inside a modal closes only the list', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Move project" onDismiss={onDismiss}>
        <Select ariaLabel="Region" options={regions} selectedOption={null} />
      </Modal>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    const escape = fireEvent.keyDown(getListbox(), { key: 'Escape' });
    expect(escape).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('Tab closes the list without choosing', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    fireEvent.keyDown(getListbox(), { key: 'Tab' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('type-ahead', () => {
    afterEach(() => vi.useRealTimers());

    test('typing a letter on the trigger opens the list at the matching option', () => {
      render(<Controlled />);
      fireEvent.keyDown(getTrigger(), { key: 'a' });
      expect(highlightedText()).toContain('AP South');
    });

    test('typing in the list jumps to the option that starts with the text', () => {
      vi.useFakeTimers();
      render(<Controlled />);
      fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
      fireEvent.keyDown(getListbox(), { key: 'e' });
      // EU Central is disabled, so the first match is EU North.
      expect(highlightedText()).toContain('EU North');
      act(() => vi.advanceTimersByTime(600));
      fireEvent.keyDown(getListbox(), { key: 'u' });
      fireEvent.keyDown(getListbox(), { key: 's' });
      fireEvent.keyDown(getListbox(), { key: ' ' });
      fireEvent.keyDown(getListbox(), { key: 'w' });
      expect(highlightedText()).toContain('US West');
    });

    test('repeating a letter cycles through its options', () => {
      vi.useFakeTimers();
      render(<Controlled />);
      fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
      fireEvent.keyDown(getListbox(), { key: 'u' });
      expect(highlightedText()).toContain('US West');
      fireEvent.keyDown(getListbox(), { key: 'u' });
      expect(highlightedText()).toContain('US East');
    });
  });
});

describe('Select filtering', () => {
  test('auto filtering shows a filter input and filters the options', () => {
    render(<Controlled filteringType="auto" filteringAriaLabel="Filter regions" />);
    fireEvent.click(getTrigger());
    const filter = screen.getByRole('combobox', { name: 'Filter regions' });
    expect(filter).toHaveFocus();
    fireEvent.change(filter, { target: { value: 'carbon' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('EU North');
  });

  test('the filter input drives the highlight with aria-activedescendant', () => {
    const onChange = vi.fn();
    render(<Controlled filteringType="auto" filteringAriaLabel="Filter regions" onChangeSpy={onChange} />);
    fireEvent.click(getTrigger());
    const filter = screen.getByRole('combobox');
    fireEvent.change(filter, { target: { value: 'us' } });
    const first = screen.getAllByRole('option')[0];
    expect(filter).toHaveAttribute('aria-activedescendant', first.id);
    fireEvent.keyDown(filter, { key: 'ArrowDown' });
    fireEvent.keyDown(filter, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith({ selectedOption: regions[1] });
    expect(getTrigger()).toHaveFocus();
  });

  test('typing in the filter does not trigger type-ahead or choose with Space', () => {
    const onChange = vi.fn();
    render(<Controlled filteringType="auto" filteringAriaLabel="Filter regions" onChangeSpy={onChange} />);
    fireEvent.click(getTrigger());
    const space = fireEvent.keyDown(screen.getByRole('combobox'), { key: ' ' });
    expect(space).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('keeps the options of a matching group', () => {
    render(<Controlled options={grouped} filteringType="auto" filteringAriaLabel="Filter regions" />);
    fireEvent.click(getTrigger());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'europe' } });
    expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['EU Central', 'EU North']);
  });

  test('shows noMatch when nothing matches', () => {
    render(<Controlled filteringType="auto" filteringAriaLabel="Filter regions" noMatch="No matching regions" />);
    fireEvent.click(getTrigger());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'mars' } });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No matching regions')).toBeInTheDocument();
  });

  test('manual filtering shows every option and reports the text', () => {
    const onLoadItems = vi.fn();
    render(
      <Controlled
        filteringType="manual"
        filteringAriaLabel="Filter regions"
        onLoadItems={event => onLoadItems(event.detail)}
      />
    );
    fireEvent.click(getTrigger());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'mars' } });
    expect(screen.getAllByRole('option')).toHaveLength(5);
    expect(onLoadItems).toHaveBeenLastCalledWith({ filteringText: 'mars', firstPage: true, samePage: false });
  });

  test('clears the filter when it closes', () => {
    render(<Controlled filteringType="auto" filteringAriaLabel="Filter regions" />);
    fireEvent.click(getTrigger());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'us' } });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(5);
  });
});

describe('Select status', () => {
  test('calls onLoadItems when it opens', () => {
    const onLoadItems = vi.fn();
    render(<Controlled onLoadItems={event => onLoadItems(event.detail)} />);
    fireEvent.click(getTrigger());
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  });

  test('shows the loading text', () => {
    render(<Controlled options={[]} statusType="loading" loadingText="Loading regions" />);
    fireEvent.click(getTrigger());
    expect(screen.getByText('Loading regions')).toBeInTheDocument();
  });

  test('shows the error and retries with the recovery button', () => {
    const onLoadItems = vi.fn();
    render(
      <Controlled
        statusType="error"
        errorText="Could not load regions."
        recoveryText="Retry"
        errorIconAriaLabel="Error"
        onLoadItems={event => onLoadItems(event.detail)}
      />
    );
    fireEvent.click(getTrigger());
    expect(screen.getByText('Could not load regions.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onLoadItems).toHaveBeenLastCalledWith({ filteringText: '', firstPage: false, samePage: true });
    expect(getListbox()).toBeInTheDocument();
  });

  test('loads the next page at the end of the list while pending', () => {
    const onLoadItems = vi.fn();
    render(<Controlled statusType="pending" onLoadItems={event => onLoadItems(event.detail)} />);
    fireEvent.click(getTrigger());
    const content = getListbox().parentElement!;
    Object.defineProperty(content, 'scrollHeight', { value: 400 });
    Object.defineProperty(content, 'clientHeight', { value: 200 });
    content.scrollTop = 200;
    fireEvent.scroll(content);
    expect(onLoadItems).toHaveBeenLastCalledWith({ filteringText: '', firstPage: false, samePage: false });
  });

  test('shows the finished text', () => {
    render(<Controlled finishedText="End of results" />);
    fireEvent.click(getTrigger());
    expect(screen.getByText('End of results')).toBeInTheDocument();
  });
});

describe('Select in a form field', () => {
  test('takes its label, description and error from the field', () => {
    render(
      <FormField label="Region" description="Where the nodes run." errorText="Choose a region.">
        <Select options={regions} selectedOption={null} placeholder="Choose a region" />
      </FormField>
    );
    const trigger = getTrigger();
    expect(trigger).toHaveAccessibleName('Region Choose a region');
    expect(trigger).toHaveAccessibleDescription('Choose a region. Where the nodes run.');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  test('the label points at the trigger', () => {
    render(
      <FormField label="Region" controlId="region">
        <Select options={regions} selectedOption={null} />
      </FormField>
    );
    expect(getTrigger()).toHaveAttribute('id', 'region');
    expect(screen.getByText('Region')).toHaveAttribute('for', 'region');
  });
});

describe('Select test utilities and accessibility', () => {
  test('the wrapper opens, finds and selects options', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} filteringType="auto" filteringAriaLabel="Filter regions" />);
    const select = createWrapper().findSelect()!;
    expect(select.findDropdown()).toBeNull();
    select.openDropdown();
    expect(select.isOpen()).toBe(true);
    expect(select.findDropdown()).not.toBeNull();
    expect(select.findFilteringInput()).not.toBeNull();
    expect(select.findOptions()).toHaveLength(5);
    select.selectOption(2);
    expect(onChange).toHaveBeenLastCalledWith({ selectedOption: regions[1] });
    select.selectOption('ap-south');
    expect(onChange).toHaveBeenLastCalledWith({ selectedOption: regions[4] });
    expect(select.findTrigger().getText()).toBe('AP South');
    expect(select.isDisabled()).toBe(false);
  });

  test('the wrapper finds the status and the recovery button', () => {
    render(<Controlled statusType="error" errorText="Could not load regions." recoveryText="Retry" />);
    const select = createWrapper().findSelect()!;
    select.openDropdown();
    expect(select.findStatus()!.getText()).toContain('Could not load regions.');
    expect(select.findErrorRecoveryButton()!.getText()).toBe('Retry');
  });

  test('has no accessibility violations when closed', async () => {
    const { container } = render(
      <FormField label="Region" description="Where the nodes run.">
        <Select options={regions} selectedOption={regions[0]} />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when open', async () => {
    const { container } = render(
      <FormField label="Region">
        <Select options={grouped} selectedOption={{ value: 'us-west' }} />
      </FormField>
    );
    fireEvent.click(getTrigger());
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when open with a filter', async () => {
    const { container } = render(
      <Select
        ariaLabel="Region"
        options={regions}
        selectedOption={null}
        filteringType="auto"
        filteringAriaLabel="Filter regions"
        statusType="error"
        errorText="Could not load regions."
        recoveryText="Retry"
      />
    );
    fireEvent.click(getTrigger());
    await expectNoAxeViolations(container);
  });
});
