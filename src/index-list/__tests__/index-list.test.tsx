// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import IndexList, { IndexListProps } from '../../../lib/components/index-list';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const list = () => createWrapper().findIndexList()!;

const contents: IndexListProps.Item[] = [
  { id: 'tide', label: 'What the tide leaves behind', value: '4', href: '/tide' },
  { id: 'sail', label: 'The last sail maker', value: '12', href: '/sail' },
  { id: 'letters', label: 'Letters', value: '28' },
];

const projects: IndexListProps.Item[] = [
  { id: 'harbour', label: 'Harbour House', meta: 'Residential', value: '2025', href: '/harbour' },
  { id: 'library', label: 'Reading Room', meta: 'Public library', value: '2023' },
];

describe('IndexList', () => {
  test('is an unordered list by default, named by ariaLabel', () => {
    render(<IndexList ariaLabel="Prices" items={contents} />);
    const element = screen.getByRole('list', { name: 'Prices' });
    expect(element.tagName).toBe('UL');
    expect(within(element).getAllByRole('listitem')).toHaveLength(3);
    expect(list().findList().getElement()).toBe(element);
  });

  test('ordered renders an ol and numbers rows from 1, hidden from screen readers', () => {
    render(<IndexList ariaLabel="Contents" ordered={true} items={contents} />);
    expect(screen.getByRole('list').tagName).toBe('OL');
    const numbers = list()
      .findItems()
      .map(item => item.findNumber()!);
    expect(numbers.map(number => number.getText())).toEqual(['1', '2', '3']);
    numbers.forEach(number => expect(number.getElement()).toHaveAttribute('aria-hidden', 'true'));
  });

  test('the numbered variant pads automatic numbers to two digits', () => {
    render(<IndexList variant="numbered" ordered={true} items={projects} />);
    expect(list().findItems()[0].findNumber()!.getText()).toBe('01');
  });

  test('a row number of its own is shown and read out', () => {
    render(
      <IndexList
        items={[
          { id: 'a', label: 'Annex', number: 'A-4' },
          { id: 'b', label: 'Barn' },
        ]}
      />
    );
    const [annex, barn] = list().findItems();
    expect(annex.findNumber()!.getText()).toBe('A-4');
    expect(annex.findNumber()!.getElement()).not.toHaveAttribute('aria-hidden');
    expect(barn.findNumber()!.getText()).toBe('');
  });

  test('renders no numbers when there are none', () => {
    render(<IndexList items={contents} />);
    expect(list().findItems()[0].findNumber()).toBeNull();
  });

  test('leaders rows read as the label and the value, with the dots hidden', () => {
    render(<IndexList items={[{ id: 'cut', label: 'Haircut', value: '$32', meta: 'Wash, cut and dry' }]} />);
    const [row] = list().findItems();
    expect(row.findLabel().getText()).toBe('Haircut');
    expect(row.findValue()!.getText()).toBe('$32');
    expect(row.findMeta()!.getText()).toBe('Wash, cut and dry');
    expect(row.getElement().textContent).toBe('Haircut $32Wash, cut and dry');
    expect(row.getElement().querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  test('numbered rows show the label, meta and value', () => {
    render(<IndexList variant="numbered" items={projects} />);
    const [harbour] = list().findItems();
    expect(harbour.findLabel().getText()).toBe('Harbour House');
    expect(harbour.findMeta()!.getText()).toBe('Residential');
    expect(harbour.findValue()!.getText()).toBe('2025');
  });

  test('a row with href links its label', () => {
    render(<IndexList items={contents} />);
    const [tide, , letters] = list().findItems();
    expect(tide.findLink()!.getElement()).toHaveAttribute('href', '/tide');
    expect(screen.getByRole('link', { name: 'What the tide leaves behind' })).toBeInTheDocument();
    expect(letters.findLink()).toBeNull();
  });

  test('fires onFollow with the row id, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(<IndexList variant="numbered" items={projects} onFollow={onFollow} />);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => {
      screen.getByRole('link', { name: 'Harbour House' }).dispatchEvent(event);
    });
    expect(onFollow).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'harbour', href: '/harbour' } }));
    expect(event.defaultPrevented).toBe(true);
  });

  test('leaves clicks with a modifier key to the browser', () => {
    const onFollow = vi.fn();
    render(<IndexList items={contents} onFollow={onFollow} />);
    fireEvent.click(screen.getAllByRole('link')[0], { shiftKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('row links are reachable with the keyboard', () => {
    render(<IndexList items={contents} />);
    list().findItems()[1].findLink()!.focus();
    expect(screen.getByRole('link', { name: 'The last sail maker' })).toHaveFocus();
  });

  test('applies a different class for each variant and size', () => {
    render(
      <>
        <IndexList items={contents} />
        <IndexList items={contents} size="large" />
        <IndexList items={contents} variant="numbered" />
        <IndexList items={contents} variant="numbered" size="large" />
      </>
    );
    const classNames = createWrapper()
      .findAllIndexLists()
      .map(wrapper => wrapper.getElement().className);
    expect(new Set(classNames).size).toBe(4);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'index', 'data-testid': 'index', className: 'custom' } as unknown as IndexListProps;
    render(<IndexList {...props} items={contents} />);
    const root = screen.getByTestId('index');
    expect(root).toHaveAttribute('id', 'index');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <IndexList ariaLabel="Contents" ordered={true} items={contents} />
        <IndexList ariaLabel="Projects" variant="numbered" size="large" ordered={true} items={projects} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
