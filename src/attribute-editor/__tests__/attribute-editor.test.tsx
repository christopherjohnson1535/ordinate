// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import AttributeEditor, { AttributeEditorProps } from '../../../lib/components/attribute-editor';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

interface Variable {
  name: string;
  value: string;
  locked?: boolean;
}

const initial: Variable[] = [
  { name: 'REGION', value: 'east-1' },
  { name: 'STAGE', value: 'prod', locked: true },
  { name: 'DEBUG', value: '' },
];

function Editor({
  items: initialItems = initial,
  ...rest
}: Partial<AttributeEditorProps<Variable>> & { items?: Variable[] }) {
  const [items, setItems] = useState(initialItems);
  const update = (index: number, change: Partial<Variable>) =>
    setItems(items.map((item, i) => (i === index ? { ...item, ...change } : item)));
  return (
    <AttributeEditor<Variable>
      items={items}
      definition={[
        {
          label: 'Name',
          control: (item, index) => (
            <Input value={item.name} onChange={event => update(index, { name: event.detail.value })} />
          ),
          errorText: item => (item.name ? undefined : 'Enter a name.'),
        },
        {
          label: 'Value',
          info: <a href="#value">Info</a>,
          control: (item, index) => (
            <Input value={item.value} onChange={event => update(index, { value: event.detail.value })} />
          ),
          constraintText: () => 'Up to 256 characters.',
        },
      ]}
      onAddButtonClick={() => setItems([...items, { name: '', value: '' }])}
      onRemoveButtonClick={event => setItems(items.filter((_, index) => index !== event.detail.itemIndex))}
      removeButtonAriaLabel={item => `Remove ${item.name || 'variable'}`}
      isItemRemovable={item => !item.locked}
      empty="No variables."
      {...rest}
    />
  );
}

const getWrapper = () => createWrapper(document.body).findAttributeEditor()!;

// jsdom has no layout, so the editor is given a width the way a browser would report it.
function setEditorWidth(width: number) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
}

describe('AttributeEditor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('renders a row per item with a field per definition', () => {
    render(<Editor />);
    const rows = getWrapper().findRows();
    expect(rows).toHaveLength(3);
    expect(rows[0].findFields()).toHaveLength(2);
    expect(rows[0].findField(2)!.getText()).toContain('Up to 256 characters.');
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('REGION');
  });

  test('shows errors per row', () => {
    render(<Editor />);
    getWrapper().findRow(3)!.findField(1)!.findControl()!.find('input')!.setNativeValue('');
    expect(getWrapper().findRow(3)!.findField(1)!.findError()!.getText()).toContain('Enter a name.');
    expect(getWrapper().findRow(1)!.findField(1)!.findError()).toBeNull();
  });

  test('hides the remove button of rows that cannot be removed', () => {
    render(<Editor />);
    expect(getWrapper().findRow(2)!.findRemoveButton()).toBeNull();
    expect(getWrapper().findRow(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Remove REGION');
    expect(getWrapper().findRow(1)!.findRemoveButton()!.getText()).toBe('Remove');
  });

  test('shows the empty content and the add button without items', () => {
    render(<Editor items={[]} />);
    expect(getWrapper().findEmptySlot()!.getText()).toBe('No variables.');
    expect(getWrapper().findRows()).toHaveLength(0);
    expect(getWrapper().findAddButton().getText()).toBe('Add new item');
  });

  test('add moves focus to the first control of the new row', () => {
    render(<Editor />);
    getWrapper().findAddButton().click();
    expect(getWrapper().findRows()).toHaveLength(4);
    const firstInput = getWrapper().findRow(4)!.findField(1)!.find('input')!.getElement();
    expect(firstInput).toHaveFocus();
  });

  test('remove fires onRemoveButtonClick and moves focus to the next row', () => {
    const onRemove = vi.fn();
    render(
      <Editor
        items={initial.map(item => ({ ...item, locked: false }))}
        onRemoveButtonClick={event => onRemove(event.detail)}
      />
    );
    getWrapper().findRow(1)!.findRemoveButton()!.click();
    expect(onRemove).toHaveBeenCalledWith({ itemIndex: 0 });
  });

  test('after removing a row, focus moves to the next remove button or the add button', () => {
    render(<Editor items={initial.map(item => ({ ...item, locked: false }))} />);
    getWrapper().findRow(1)!.findRemoveButton()!.click();
    expect(getWrapper().findRows()).toHaveLength(2);
    expect(getWrapper().findRow(1)!.findRemoveButton()!.getElement()).toHaveFocus();
    expect(getWrapper().findRow(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Remove STAGE');

    getWrapper().findRow(2)!.findRemoveButton()!.click();
    expect(getWrapper().findAddButton().getElement()).toHaveFocus();
  });

  test('announces a removed row', () => {
    vi.useFakeTimers();
    const { container } = render(<Editor />);
    act(() => getWrapper().findRow(1)!.findRemoveButton()!.click());
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe('Item 1 removed');
  });

  test('i18nStrings replaces the removal announcement', () => {
    vi.useFakeTimers();
    const { container } = render(<Editor i18nStrings={{ itemRemovedAriaLive: 'Variable removed' }} />);
    act(() => getWrapper().findRow(1)!.findRemoveButton()!.click());
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe('Variable removed');
  });

  test('disableAddButton, button texts and additionalInfo', () => {
    render(
      <Editor
        disableAddButton={true}
        addButtonText="Add variable"
        removeButtonText="Delete"
        additionalInfo="You can add 2 more variables."
      />
    );
    expect(getWrapper().findAddButton().isDisabled()).toBe(true);
    expect(getWrapper().findAddButton().getText()).toBe('Add variable');
    expect(getWrapper().findRow(1)!.findRemoveButton()!.getText()).toBe('Delete');
    expect(getWrapper().findAdditionalInfo()!.getText()).toBe('You can add 2 more variables.');
  });

  test('ref moves focus to a remove button or the add button', () => {
    const ref = createRef<AttributeEditorProps.Ref>();
    render(<Editor ref={ref} />);
    act(() => ref.current!.focusRemoveButton(2));
    expect(getWrapper().findRow(3)!.findRemoveButton()!.getElement()).toHaveFocus();
    act(() => ref.current!.focusAddButton());
    expect(getWrapper().findAddButton().getElement()).toHaveFocus();
    // The locked row has no remove button, so focus falls back to the add button.
    act(() => ref.current!.focusRemoveButton(1));
    expect(getWrapper().findAddButton().getElement()).toHaveFocus();
  });

  describe('narrow layout', () => {
    beforeEach(() => setEditorWidth(320));

    test('repeats the labels in every row', () => {
      render(<Editor />);
      expect(getWrapper().findHeadings()).toHaveLength(0);
      expect(getWrapper().findRow(2)!.findField(1)!.findLabel()!.getText()).toBe('Name');
      expect(screen.getAllByRole('textbox', { name: 'Value' })).toHaveLength(3);
    });
  });

  describe('wide layout', () => {
    beforeEach(() => setEditorWidth(800));

    test('shows the labels once as column headings that name every control', () => {
      render(<Editor />);
      expect(
        getWrapper()
          .findHeadings()
          .map(heading => heading.getText())
      ).toEqual(['Name', 'ValueInfo']);
      expect(getWrapper().findRow(1)!.findField(1)!.findLabel()).toBeNull();
      expect(screen.getAllByRole('textbox', { name: 'Name' })).toHaveLength(3);
      expect(screen.getAllByRole('link', { name: 'Info' })).toHaveLength(1);
    });

    test('follows gridLayout for the current breakpoint', () => {
      render(
        <Editor
          gridLayout={[
            { rows: [[1], [1]], removeButton: { ownRow: true } },
            { breakpoint: 'xl', rows: [[3, 1]] },
          ]}
        />
      );
      expect(getWrapper().findHeadings()).toHaveLength(0);
      expect(getWrapper().findRow(1)!.findField(2)!.findLabel()!.getText()).toBe('Value');
    });

    test('falls back to the default layout when gridLayout misses a field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Editor gridLayout={[{ rows: [[1]] }]} />);
      expect(getWrapper().findHeadings()).toHaveLength(2);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('gridLayout'));
    });

    test('has no axe violations', async () => {
      const { container } = render(<Editor />);
      await expectNoAxeViolations(container);
    });
  });

  test('has no axe violations in the narrow layout', async () => {
    setEditorWidth(320);
    const { container } = render(<Editor />);
    await expectNoAxeViolations(container);
  });

  test('accepts id and data attributes', () => {
    render(<Editor id="variables" data-testid="editor" />);
    expect(screen.getByTestId('editor')).toHaveAttribute('id', 'variables');
  });
});
