// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import PropertyFilter, { PropertyFilterProps } from '../../../lib/components/property-filter';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const properties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'status', propertyLabel: 'Status', operators: ['!='] },
  { key: 'zone', propertyLabel: 'Zone', groupValuesLabel: 'Zones' },
  { key: 'cpus', propertyLabel: 'vCPUs', operators: ['>', '<'] },
];

const options: PropertyFilterProps.FilteringOption[] = [
  { propertyKey: 'status', value: 'running', label: 'Running' },
  { propertyKey: 'status', value: 'stopped', label: 'Stopped' },
  { propertyKey: 'zone', value: 'north-1a' },
];

const empty: PropertyFilterProps.Query = { tokens: [], operation: 'and' };

const twoTokens: PropertyFilterProps.Query = {
  tokens: [
    { propertyKey: 'status', operator: '=', value: 'running' },
    { operator: ':', value: 'web' },
  ],
  operation: 'and',
};

type ControlledProps = Partial<PropertyFilterProps> & { onQuery?: (query: PropertyFilterProps.Query) => void };

function Controlled({ query: initial = empty, onQuery, ...rest }: ControlledProps) {
  const [query, setQuery] = useState(initial);
  return (
    <PropertyFilter
      filteringProperties={properties}
      filteringOptions={options}
      filteringAriaLabel="Find instances"
      {...rest}
      query={query}
      onChange={event => {
        onQuery?.(event.detail);
        setQuery(event.detail);
      }}
    />
  );
}

const wrapper = () => createWrapper().findPropertyFilter()!;
const getInput = () => screen.getByRole('combobox', { name: 'Find instances' });
const type = (text: string) => fireEvent.change(getInput(), { target: { value: text } });
const suggestionTexts = () =>
  wrapper()
    .findSuggestions()
    .map(option => option.getText());

describe('PropertyFilter input', () => {
  test('renders a combobox with English defaults for its name and placeholder', () => {
    render(<PropertyFilter query={empty} filteringProperties={properties} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAccessibleName('Filter');
    expect(input).toHaveAttribute('placeholder', 'Filter by property or value');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  test('suggests properties and values for free text', () => {
    render(<Controlled />);
    type('n');
    expect(
      wrapper()
        .findSuggestionGroups()
        .map(group => group.getText())
    ).toEqual(['Properties', 'Values']);
    expect(suggestionTexts()).toEqual(['Use: "n"', 'Zone', 'Status = Running', 'Zone = north-1a']);
  });

  test('walks from a property to an operator to a value, then adds the filter', () => {
    const onQuery = vi.fn();
    render(<Controlled onQuery={onQuery} />);
    type('sta');
    wrapper().selectSuggestion('Status');
    expect(getInput()).toHaveValue('Status ');
    expect(wrapper().isOpen()).toBe(true);
    expect(wrapper().findSuggestionGroups()[0].getText()).toBe('Operators');
    expect(suggestionTexts()).toEqual(['Use: "Status "', 'Status ⁦=⁩Equals', 'Status ⁦!=⁩Does not equal']);

    wrapper().selectSuggestion('Status !=');
    expect(getInput()).toHaveValue('Status != ');
    expect(wrapper().findSuggestionGroups()[0].getText()).toBe('Status values');
    expect(suggestionTexts()).toEqual(['Use: "Status != "', 'Running', 'Stopped']);

    wrapper().selectSuggestion('Status != stopped');
    expect(onQuery).toHaveBeenCalledWith({
      tokens: [{ propertyKey: 'status', operator: '!=', value: 'stopped' }],
      operation: 'and',
    });
    expect(getInput()).toHaveValue('');
    expect(wrapper().isOpen()).toBe(false);
    expect(getInput()).toHaveFocus();
  });

  test('uses the property group values label and filters values by the typed text', () => {
    render(<Controlled />);
    type('Zone = nor');
    expect(wrapper().findSuggestionGroups()[0].getText()).toBe('Zones');
    type('Status = sto');
    expect(suggestionTexts()).toEqual(['Use: "Status = sto"', 'Stopped']);
  });

  test('Enter adds a filter from the typed text', () => {
    const onQuery = vi.fn();
    render(<Controlled onQuery={onQuery} />);
    type('vCPUs > 4');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onQuery).toHaveBeenLastCalledWith({
      tokens: [{ propertyKey: 'cpus', operator: '>', value: '4' }],
      operation: 'and',
    });
    type('web');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onQuery.mock.lastCall![0].tokens[1]).toEqual({ operator: ':', value: 'web' });
    expect(getInput()).toHaveValue('');
  });

  test('the entered text option adds the typed text as a filter', () => {
    const onQuery = vi.fn();
    render(<Controlled onQuery={onQuery} />);
    type('!: legacy');
    expect(suggestionTexts()).toEqual(['Use: "!: legacy"']);
    wrapper().findEnteredTextOption()!.click();
    expect(onQuery.mock.lastCall![0].tokens).toEqual([{ operator: '!:', value: 'legacy' }]);
  });

  test('without free text filtering, only text that names a property becomes a filter', () => {
    const onQuery = vi.fn();
    render(<Controlled onQuery={onQuery} disableFreeTextFiltering={true} />);
    type('web');
    expect(wrapper().findEnteredTextOption()).toBeNull();
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onQuery).not.toHaveBeenCalled();
    expect(getInput()).toHaveValue('web');
    type('Zone = a');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onQuery).toHaveBeenCalledWith({
      tokens: [{ propertyKey: 'zone', operator: '=', value: 'a' }],
      operation: 'and',
    });
  });

  test('a blank input adds nothing', () => {
    const onQuery = vi.fn();
    render(<Controlled onQuery={onQuery} />);
    type('   ');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onQuery).not.toHaveBeenCalled();
  });

  test('labels the entered text option with i18nStrings', () => {
    render(<Controlled i18nStrings={{ enteredTextLabel: text => `Search for ${text}` }} />);
    type('web');
    expect(wrapper().findEnteredTextOption()!.getText()).toBe('Search for web');
  });
});

describe('PropertyFilter keyboard', () => {
  test('ArrowDown opens the list and Enter chooses the highlighted suggestion', () => {
    render(<Controlled />);
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(wrapper().isOpen()).toBe(true);
    expect(wrapper().findHighlightedSuggestion()!.getText()).toBe('Status');
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(wrapper().findHighlightedSuggestion()!.getText()).toBe('Zone');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(getInput()).toHaveValue('Zone ');
    expect(wrapper().isOpen()).toBe(true);
    expect(getInput()).not.toHaveAttribute('aria-activedescendant');
  });

  test('points at the highlighted suggestion with aria-activedescendant', () => {
    render(<Controlled />);
    type('Status');
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    const id = getInput().getAttribute('aria-activedescendant')!;
    expect(document.getElementById(id)).toHaveTextContent('Use: "Status"');
  });

  test('Escape closes the list, then clears the text', () => {
    render(<Controlled />);
    type('web');
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(wrapper().isOpen()).toBe(false);
    expect(getInput()).toHaveValue('web');
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(getInput()).toHaveValue('');
  });

  test('Enter does not submit a surrounding form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Controlled />
      </form>
    );
    type('web');
    const prevented = !fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(prevented).toBe(true);
  });
});

describe('PropertyFilter tokens', () => {
  test('shows each filter with its operation, and names it for screen readers', () => {
    render(<Controlled query={twoTokens} />);
    const tokens = wrapper().findTokens();
    expect(tokens).toHaveLength(2);
    expect(tokens[0].findLabel().getText()).toBe('Status=Running');
    expect(tokens[0].findLabel().getElement()).toHaveAccessibleName('Status = Running');
    expect(tokens[0].findLabel().getElement()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(tokens[0].findTokenOperation()).toBeNull();
    expect(tokens[1].findLabel().getText()).toBe('web');
    expect(tokens[1].findLabel().getElement()).toHaveAccessibleName('web');
    expect(tokens[1].findTokenOperation()!.findTrigger().getElement()).toHaveAccessibleName('Combine filters with and');
    expect(tokens[1].findRemoveButton().getElement()).toHaveAccessibleName('Remove filter, web');
  });

  test('shows the key of a property that is not in the list', () => {
    render(
      <Controlled query={{ tokens: [{ propertyKey: 'owner', operator: '=', value: 'ana' }], operation: 'and' }} />
    );
    expect(wrapper().findTokens()[0].findLabel().getText()).toBe('owner=ana');
  });

  test('changing the operation changes it for every filter', () => {
    const onQuery = vi.fn();
    render(<Controlled query={twoTokens} onQuery={onQuery} />);
    wrapper().findTokens()[1].findTokenOperation()!.selectOption('or');
    expect(onQuery).toHaveBeenCalledWith({ ...twoTokens, operation: 'or' });
  });

  test('hideOperations writes the operation as text without a control', () => {
    render(<Controlled query={twoTokens} hideOperations={true} />);
    const token = wrapper().findTokens()[1];
    expect(token.findTokenOperation()).toBeNull();
    expect(token.getElement()).toHaveTextContent(/^and/);
  });

  test('reads as a query line: "where", the filters joined by the operation, then the input', () => {
    render(<Controlled query={twoTokens} countText="2 matches" />);
    const list = screen.getByRole('list');
    const query = list.parentElement!;
    expect(query).toContainElement(getInput());
    expect(list.compareDocumentPosition(getInput()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(query).toHaveTextContent(/^where\s*Status=Running.*and\s*web/);
    expect(getInput()).toHaveAttribute('placeholder', 'add a condition…');
    expect(getInput()).toHaveAttribute('type', 'text');
    expect(wrapper().findResultsCount()!.getText()).toBe('2 matches');
  });

  test('without filters the line is a search field with the given placeholder', () => {
    render(<Controlled filteringPlaceholder="Find instances" />);
    expect(screen.queryByText('where')).toBeNull();
    expect(getInput()).toHaveAttribute('placeholder', 'Find instances');
    expect(getInput()).toHaveAttribute('type', 'search');
  });

  test('removing a filter fires onChange and moves focus to the next filter, then to the input', () => {
    const onQuery = vi.fn();
    render(<Controlled query={twoTokens} onQuery={onQuery} />);
    const first = wrapper().findTokens()[0].findRemoveButton();
    first.focus();
    first.click();
    expect(onQuery).toHaveBeenCalledWith({ tokens: [twoTokens.tokens[1]], operation: 'and' });
    const remaining = wrapper().findTokens();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].findRemoveButton().getElement()).toHaveFocus();
    remaining[0].findRemoveButton().click();
    expect(wrapper().findTokens()).toHaveLength(0);
    expect(getInput()).toHaveFocus();
  });

  test('Clear filters removes every filter and focuses the input', () => {
    const onQuery = vi.fn();
    render(<Controlled query={twoTokens} onQuery={onQuery} />);
    const clear = wrapper().findRemoveAllButton()!;
    expect(clear.getElement()).toHaveTextContent('Clear filters');
    clear.click();
    expect(onQuery).toHaveBeenCalledWith({ tokens: [], operation: 'and' });
    expect(wrapper().findRemoveAllButton()).toBeNull();
    expect(getInput()).toHaveFocus();
  });

  test('tokenLimit hides the extra filters behind a toggle', () => {
    const query: PropertyFilterProps.Query = {
      tokens: ['a', 'b', 'c', 'd'].map(value => ({ operator: ':' as const, value })),
      operation: 'or',
    };
    render(<Controlled query={query} tokenLimit={2} />);
    expect(wrapper().findTokens()).toHaveLength(2);
    const toggle = wrapper().findTokenToggle()!;
    expect(toggle.getElement()).toHaveTextContent('+2 more');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'false');
    toggle.click();
    expect(wrapper().findTokens()).toHaveLength(4);
    expect(toggle.getElement()).toHaveTextContent('Show fewer');
  });

  test('shows the count only while there are filters', () => {
    const { rerender } = render(
      <PropertyFilter query={empty} filteringProperties={properties} countText="4 matches" />
    );
    expect(wrapper().findResultsCount()).toBeNull();
    rerender(<PropertyFilter query={twoTokens} filteringProperties={properties} countText="4 matches" />);
    expect(wrapper().findResultsCount()!.getText()).toBe('4 matches');
  });

  test('renders a custom control and custom filter actions', () => {
    render(
      <Controlled
        query={twoTokens}
        customControl={<button>Saved filters</button>}
        customFilterActions={<button>Save filter set</button>}
      />
    );
    expect(wrapper().findCustomControl()!.getText()).toBe('Saved filters');
    expect(wrapper().findFilterActions()!.getText()).toBe('Save filter set');
    expect(wrapper().findRemoveAllButton()).toBeNull();
  });

  test('i18nStrings replace the built-in strings', () => {
    render(
      <Controlled
        query={twoTokens}
        i18nStrings={{
          clearFiltersText: 'Reset',
          queryStartText: 'when',
          addConditionPlaceholder: 'and also…',
          operationAndText: 'all',
          operatorEqualsText: 'is',
          tokenAriaLabel: token => `${token.propertyLabel ?? 'Any'} ${token.operatorText} ${token.value}`,
          removeTokenButtonAriaLabel: token => `Drop ${token.value}`,
        }}
      />
    );
    const tokens = wrapper().findTokens();
    expect(wrapper().findRemoveAllButton()!.getText()).toBe('Reset');
    expect(tokens[0].findLabel().getElement()).toHaveAccessibleName('Status is Running');
    expect(tokens[1].findRemoveButton().getElement()).toHaveAccessibleName('Drop web');
    expect(tokens[1].findTokenOperation()!.findTrigger().getText()).toBe('all');
    expect(screen.getByText('when')).toBeInTheDocument();
    expect(getInput()).toHaveAttribute('placeholder', 'and also…');
  });
});

describe('PropertyFilter token editor', () => {
  test('edits the property, operator and value of a filter', () => {
    const onQuery = vi.fn();
    render(<Controlled query={twoTokens} onQuery={onQuery} />);
    const token = wrapper().findTokens()[0];
    const editor = token.openEditor();
    expect(screen.getByRole('dialog', { name: 'Edit filter' })).toBeInTheDocument();
    expect(editor.findPropertySelect().findTrigger().getText()).toBe('Status');
    expect(editor.findOperatorSelect().findTrigger().getText()).toBe('Equals');
    expect(editor.findValueInput().findNativeInput().getElement()).toHaveValue('running');

    editor.findOperatorSelect().selectOption('!=');
    editor.findValueInput().setInputValue('stopped ');
    editor.findApplyButton().click();
    expect(onQuery).toHaveBeenCalledWith({
      tokens: [{ propertyKey: 'status', operator: '!=', value: 'stopped' }, twoTokens.tokens[1]],
      operation: 'and',
    });
    expect(token.findEditorDialog()).toBeNull();
    expect(wrapper().findTokens()[0].findLabel().getElement()).toHaveFocus();
  });

  test('changing the property resets an operator it does not allow and clears the value', () => {
    const onQuery = vi.fn();
    render(
      <Controlled
        query={{ tokens: [{ propertyKey: 'status', operator: '!=', value: 'running' }], operation: 'and' }}
        onQuery={onQuery}
      />
    );
    const editor = wrapper().findTokens()[0].openEditor();
    editor.findPropertySelect().selectOption('zone');
    expect(editor.findOperatorSelect().findTrigger().getText()).toBe('Equals');
    expect(editor.findValueInput().findNativeInput().getElement()).toHaveValue('');
    editor.findValueInput().setInputValue('north-1a');
    editor.findApplyButton().click();
    expect(onQuery.mock.lastCall![0].tokens).toEqual([{ propertyKey: 'zone', operator: '=', value: 'north-1a' }]);
  });

  test('turns a filter into free text with "All properties"', () => {
    const onQuery = vi.fn();
    render(<Controlled query={twoTokens} onQuery={onQuery} />);
    const editor = wrapper().findTokens()[0].openEditor();
    editor.findPropertySelect().selectOption(1);
    expect(editor.findPropertySelect().findTrigger().getText()).toBe('All properties');
    expect(editor.findOperatorSelect().findTrigger().getText()).toBe('Contains');
    editor.findValueInput().setInputValue('web');
    editor.findApplyButton().click();
    expect(onQuery.mock.lastCall![0].tokens[0]).toEqual({ operator: ':', value: 'web' });
  });

  test('suggests the values of the chosen property', () => {
    render(<Controlled query={twoTokens} />);
    const editor = wrapper().findTokens()[0].openEditor();
    editor.findValueInput().setInputValue('');
    expect(
      editor
        .findValueInput()
        .findOptions()
        .map(option => option.getText())
    ).toEqual(['Running', 'Stopped']);
  });

  test('Cancel and Escape close the editor without changes and return focus to the filter', () => {
    const onQuery = vi.fn();
    render(<Controlled query={twoTokens} onQuery={onQuery} />);
    const token = wrapper().findTokens()[0];
    let editor = token.openEditor();
    editor.findValueInput().setInputValue('changed');
    editor.findCancelButton().click();
    expect(token.findEditorDialog()).toBeNull();
    expect(token.findLabel().getElement()).toHaveFocus();

    editor = token.openEditor();
    expect(editor.findValueInput().findNativeInput().getElement()).toHaveValue('running');
    fireEvent.keyDown(editor.getElement(), { key: 'Escape' });
    expect(token.findEditorDialog()).toBeNull();
    expect(onQuery).not.toHaveBeenCalled();
  });

  test('names the editor fields and buttons in English', () => {
    render(<Controlled query={twoTokens} />);
    const editor = wrapper().findTokens()[0].openEditor();
    expect(editor.findPropertySelect().findTrigger().getElement()).toHaveAccessibleName('Property Status');
    expect(editor.findOperatorSelect().findTrigger().getElement()).toHaveAccessibleName('Operator Equals');
    expect(editor.findValueInput().findNativeInput().getElement()).toHaveAccessibleName('Value');
    expect(editor.findCancelButton().getText()).toBe('Cancel');
    expect(editor.findApplyButton().getText()).toBe('Apply');
    expect(wrapper().findTokens()[0].findEditorDismissButton()!.getElement()).toHaveAccessibleName('Close editor');
  });
});

describe('PropertyFilter loading', () => {
  test('asks for the values of a typed property', () => {
    const onLoadItems = vi.fn();
    render(<Controlled onLoadItems={onLoadItems} />);
    type('web');
    expect(onLoadItems).not.toHaveBeenCalled();
    type('Status != ru');
    expect(onLoadItems.mock.lastCall![0].detail).toEqual({
      filteringProperty: properties[0],
      filteringOperator: '!=',
      filteringText: 'ru',
      firstPage: true,
      samePage: false,
    });
  });

  test('asks while no property is chosen when properties load asynchronously', () => {
    const onLoadItems = vi.fn();
    render(<Controlled onLoadItems={onLoadItems} asyncProperties={true} />);
    type('web');
    expect(onLoadItems.mock.lastCall![0].detail).toEqual({ filteringText: 'web', firstPage: true, samePage: false });
  });

  test('shows the loading status and retries after an error', () => {
    const onLoadItems = vi.fn();
    const { rerender } = render(
      <Controlled onLoadItems={onLoadItems} filteringStatusType="loading" filteringLoadingText="Loading values" />
    );
    type('Status = ');
    expect(wrapper().findStatus()!.getText()).toBe('Loading values');
    rerender(
      <Controlled
        onLoadItems={onLoadItems}
        filteringStatusType="error"
        filteringErrorText="Failed"
        filteringRecoveryText="Retry"
      />
    );
    wrapper().findErrorRecoveryButton()!.click();
    expect(onLoadItems.mock.lastCall![0].detail).toMatchObject({ firstPage: false, samePage: true });
  });

  test('the editor asks for the values of its property', () => {
    const onLoadItems = vi.fn();
    render(<Controlled query={twoTokens} onLoadItems={onLoadItems} />);
    const editor = wrapper().findTokens()[0].openEditor();
    editor.findValueInput().setInputValue('st');
    expect(onLoadItems.mock.lastCall![0].detail).toEqual({
      filteringProperty: properties[0],
      filteringOperator: '=',
      filteringText: 'st',
      firstPage: true,
      samePage: false,
    });
  });
});

describe('PropertyFilter states', () => {
  test('disabled prevents every change', () => {
    render(<Controlled query={twoTokens} disabled={true} />);
    expect(getInput()).toBeDisabled();
    const tokens = wrapper().findTokens();
    expect(tokens[0].findLabel().getElement()).toBeDisabled();
    expect(tokens[0].findRemoveButton().getElement()).toBeDisabled();
    expect(tokens[1].findTokenOperation()!.isDisabled()).toBe(true);
    expect(wrapper().findRemoveAllButton()!.getElement()).toBeDisabled();
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<PropertyFilterProps.Ref>();
    render(<PropertyFilter ref={ref} query={empty} filteringProperties={properties} />);
    act(() => ref.current?.focus());
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  test('passes id and data attributes to the root, but not className', () => {
    const props = { id: 'filter', 'data-testid': 'instances', className: 'custom' } as PropertyFilterProps;
    render(<PropertyFilter {...props} query={empty} filteringProperties={properties} />);
    const root = wrapper().getElement();
    expect(root).toHaveAttribute('id', 'filter');
    expect(root).toHaveAttribute('data-testid', 'instances');
    expect(root).not.toHaveClass('custom');
  });
});

describe('PropertyFilter accessibility', () => {
  test('has no axe violations with filters', async () => {
    const { container } = render(<Controlled query={twoTokens} countText="2 matches" tokenLimit={1} />);
    await expectNoAxeViolations(container);
  });

  test('has no axe violations with open suggestions', async () => {
    const { container } = render(<Controlled />);
    type('Status');
    await expectNoAxeViolations(container);
  });

  test('has no axe violations with the editor open', async () => {
    const { container } = render(<Controlled query={twoTokens} />);
    wrapper().findTokens()[0].openEditor();
    await expectNoAxeViolations(container);
  });
});
