// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Cards, { CardsProps } from '../../../lib/components/cards';
import FormField from '../../../lib/components/form-field';
import Header from '../../../lib/components/header';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import marksStyles from '../../../lib/components/internal/components/crop-marks/styles.css.js';
import frameStyles from '../../../lib/components/internal/components/sheet-frame/styles.css.js';

interface Node {
  id: string;
  name: string;
  type: string;
  zone: string;
}

const nodes: Node[] = [
  { id: 'n1', name: 'node-01', type: 'm7.large', zone: 'us-east-1a' },
  { id: 'n2', name: 'node-02', type: 'm7.xlarge', zone: 'us-east-1b' },
  { id: 'n3', name: 'node-03', type: 'c7.large', zone: 'us-east-1c' },
];

const cardDefinition: CardsProps.CardDefinition<Node> = {
  header: item => item.name,
  sections: [
    { id: 'type', header: 'Type', content: item => item.type, width: 50 },
    { id: 'zone', header: 'Zone', content: item => item.zone, width: 50 },
    { content: () => 'Always shown' },
  ],
};

function Selectable(props: Partial<CardsProps<Node>> & { onChangeSpy?: (ids: string[]) => void }) {
  const { onChangeSpy, ...rest } = props;
  const [selectedItems, setSelectedItems] = useState<ReadonlyArray<Node>>(props.selectedItems ?? []);
  return (
    <Cards
      items={nodes}
      cardDefinition={cardDefinition}
      selectionType="multi"
      trackBy="id"
      {...rest}
      selectedItems={selectedItems}
      onSelectionChange={event => {
        onChangeSpy?.(event.detail.selectedItems.map(item => item.id));
        setSelectedItems(event.detail.selectedItems);
      }}
    />
  );
}

const cards = () => createWrapper().findCards()!;

describe('Cards', () => {
  test('renders a list with a card per item, with header and sections', () => {
    render(<Cards items={nodes} cardDefinition={cardDefinition} ariaLabels={{ cardsLabel: 'Nodes' }} />);
    const list = screen.getByRole('list', { name: 'Nodes' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    const items = cards().findItems();
    expect(items[0].findHeader()!.getText()).toBe('node-01');
    expect(items[0].findSectionHeaders().map(header => header.getText())).toEqual(['Type', 'Zone']);
    expect(items[0].findSections().map(section => section.getText())).toEqual([
      'Typem7.large',
      'Zoneus-east-1a',
      'Always shown',
    ]);
    expect(items[0].findSelectionInput()).toBeNull();
  });

  test('shows only the visible sections, keeping sections without an ID', () => {
    render(<Cards items={nodes} cardDefinition={cardDefinition} visibleSections={['zone']} />);
    expect(
      cards()
        .findItems()[0]
        .findSections()
        .map(section => section.getText())
    ).toEqual(['Zoneus-east-1a', 'Always shown']);
  });

  test('sets the section widths', () => {
    render(<Cards items={nodes} cardDefinition={cardDefinition} />);
    const sections = cards().findItems()[0].findSections();
    expect(sections[0].getElement().style.flexBasis).toBe('50%');
    expect(sections[2].getElement().style.flexBasis).toBe('100%');
  });

  test('names the list after the header', () => {
    render(<Cards items={nodes} cardDefinition={cardDefinition} header={<Header>Nodes</Header>} />);
    expect(screen.getByRole('list', { name: 'Nodes' })).toBeInTheDocument();
    expect(cards().findHeader()!.getText()).toBe('Nodes');
  });

  test('renders the filter, pagination and preferences slots', () => {
    render(
      <Cards
        items={nodes}
        cardDefinition={cardDefinition}
        filter={<input aria-label="Find nodes" />}
        pagination={<span>Page 1</span>}
        preferences={<button type="button">Preferences</button>}
      />
    );
    expect(cards().findFilterSlot()!.find('input')).not.toBeNull();
    expect(cards().findPaginationSlot()!.getText()).toBe('Page 1');
    expect(cards().findPreferencesSlot()!.getText()).toBe('Preferences');
  });

  test('shows the loading state in place of the cards', () => {
    const { rerender } = render(<Cards items={nodes} cardDefinition={cardDefinition} loading={true} />);
    expect(cards().findItems()).toHaveLength(0);
    expect(cards().findLoadingText()!.getText()).toBe('Loading');
    rerender(<Cards items={nodes} cardDefinition={cardDefinition} loading={true} loadingText="Loading nodes" />);
    expect(cards().findLoadingText()!.getText()).toBe('Loading nodes');
  });

  test('shows the empty slot when there are no items', () => {
    render(<Cards items={[]} cardDefinition={cardDefinition} empty="No nodes" />);
    expect(cards().findEmptySlot()!.getText()).toBe('No nodes');
    expect(screen.queryByRole('list')).toBeNull();
  });

  test('the full-page variant does not put the cards on a framed sheet', () => {
    const { container, rerender } = render(<Cards items={nodes} cardDefinition={cardDefinition} />);
    expect(container.querySelector(`.${frameStyles.root}`)).not.toBeNull();
    rerender(<Cards items={nodes} cardDefinition={cardDefinition} variant="full-page" />);
    expect(container.querySelector(`.${frameStyles.root}`)).toBeNull();
  });

  test('passes id and data attributes to the root', () => {
    render(<Cards id="nodes" data-testid="nodes" items={nodes} cardDefinition={cardDefinition} />);
    expect(cards().getElement()).toHaveAttribute('id', 'nodes');
    expect(cards().getElement()).toHaveAttribute('data-testid', 'nodes');
  });

  test("shows each card's reference and colors the cards by kind", () => {
    render(
      <Cards
        items={nodes}
        kind="resource"
        cardDefinition={{ ...cardDefinition, reference: item => `R${item.id.slice(1)}` }}
      />
    );
    const items = cards().findItems();
    expect(items.map(item => item.findReference()!.getText())).toEqual(['R1', 'R2', 'R3']);
    expect(items[0].findByClassName(marksStyles['kind-resource'])).not.toBeNull();
  });
});

describe('Cards per row', () => {
  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'getBoundingClientRect');
  });

  function setWidth(width: number) {
    HTMLElement.prototype.getBoundingClientRect = () => ({ width }) as DOMRect;
  }

  const columns = () => screen.getByRole('list').style.gridTemplateColumns;

  test('picks the layout for the width of the component', () => {
    const cardsPerRow = [{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 900, cards: 3 }];
    setWidth(600);
    render(<Cards items={nodes} cardDefinition={cardDefinition} cardsPerRow={cardsPerRow} />);
    expect(columns()).toBe('repeat(2, minmax(0, 1fr))');
    setWidth(1000);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(columns()).toBe('repeat(3, minmax(0, 1fr))');
    setWidth(200);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(columns()).toBe('repeat(1, minmax(0, 1fr))');
  });

  test('defaults to one card per row on a narrow screen', () => {
    setWidth(320);
    render(<Cards items={nodes} cardDefinition={cardDefinition} />);
    expect(columns()).toBe('repeat(1, minmax(0, 1fr))');
  });
});

describe('Cards selection', () => {
  test('multi selection adds checkboxes named by the card headers', () => {
    const onChange = vi.fn();
    render(<Selectable onChangeSpy={onChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'node-02' });
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(['n2']);
    expect(checkbox).toBeChecked();
    fireEvent.click(screen.getByRole('checkbox', { name: 'node-03' }));
    expect(onChange).toHaveBeenLastCalledWith(['n2', 'n3']);
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(['n3']);
    expect(
      cards()
        .findSelectedItems()
        .map(item => item.findHeader()!.getText())
    ).toEqual(['node-03']);
  });

  test('single selection uses one radio group', () => {
    const onChange = vi.fn();
    render(<Selectable onChangeSpy={onChange} selectionType="single" />);
    const radios = screen.getAllByRole('radio');
    expect(new Set(radios.map(radio => radio.getAttribute('name'))).size).toBe(1);
    fireEvent.click(radios[0]);
    expect(onChange).toHaveBeenLastCalledWith(['n1']);
    fireEvent.click(radios[2]);
    expect(onChange).toHaveBeenLastCalledWith(['n3']);
    expect(radios[2]).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  });

  test('matches selected items by trackBy', () => {
    render(<Selectable selectedItems={[{ ...nodes[1] }]} />);
    expect(screen.getByRole('checkbox', { name: 'node-02' })).toBeChecked();
  });

  test('accepts a trackBy function', () => {
    render(<Selectable trackBy={item => item.name} selectedItems={[{ ...nodes[0] }]} />);
    expect(screen.getByRole('checkbox', { name: 'node-01' })).toBeChecked();
  });

  test('disabled items cannot be selected', () => {
    const onChange = vi.fn();
    render(<Selectable onChangeSpy={onChange} isItemDisabled={item => item.id === 'n1'} entireCardClickable={true} />);
    const checkbox = screen.getByRole('checkbox', { name: 'node-01' });
    expect(checkbox).toBeDisabled();
    fireEvent.click(screen.getByText('m7.large'));
    expect(onChange).not.toHaveBeenCalled();
    expect(cards().findItems()[0].isDisabled()).toBe(true);
  });

  test('itemSelectionLabel names the controls', () => {
    render(
      <Selectable
        ariaLabels={{
          itemSelectionLabel: (data, item) => `Select ${item.name} (${data.selectedItems.length} selected)`,
          selectionGroupLabel: 'Node selection',
        }}
      />
    );
    expect(screen.getByRole('checkbox', { name: 'Select node-01 (0 selected)' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Node selection' })).toBeInTheDocument();
  });

  test('entireCardClickable selects with a click anywhere on the card and focuses the control', () => {
    const onChange = vi.fn();
    render(<Selectable onChangeSpy={onChange} entireCardClickable={true} />);
    fireEvent.click(screen.getByText('us-east-1b'));
    expect(onChange).toHaveBeenLastCalledWith(['n2']);
    expect(screen.getByRole('checkbox', { name: 'node-02' })).toHaveFocus();
  });

  test('a card click does nothing without entireCardClickable', () => {
    const onChange = vi.fn();
    render(<Selectable onChangeSpy={onChange} />);
    fireEvent.click(screen.getByText('us-east-1b'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('selection controls ignore a surrounding form field', () => {
    render(
      <FormField label="Nodes" controlId="nodes">
        <Selectable />
      </FormField>
    );
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).not.toHaveAttribute('id', 'nodes');
    }
  });

  test('the selection control is reachable with the keyboard', () => {
    render(<Selectable />);
    const checkbox = screen.getByRole('checkbox', { name: 'node-01' });
    act(() => checkbox.focus());
    expect(checkbox).toHaveFocus();
  });
});

describe('Cards accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <Selectable
        header={<Header>Nodes</Header>}
        selectedItems={[nodes[0]]}
        isItemDisabled={item => item.id === 'n3'}
      />
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations while loading or empty', async () => {
    const { container } = render(
      <div>
        <Cards items={[]} cardDefinition={cardDefinition} loading={true} />
        <Cards items={[]} cardDefinition={cardDefinition} empty="No nodes" variant="full-page" />
      </div>
    );
    await expectNoAxeViolations(container);
  });
});
