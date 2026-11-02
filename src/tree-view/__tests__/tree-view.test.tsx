// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';
import { expectNoAxeViolations } from '../../__tests__/a11y';

interface Node {
  id: string;
  name: string;
  children?: Node[];
}

const items: Node[] = [
  {
    id: 'site',
    name: 'Site',
    children: [
      { id: 'north', name: 'North annex', children: [{ id: 'pump', name: 'Pump room' }] },
      { id: 'south', name: 'South annex' },
    ],
  },
  { id: 'yard', name: 'Yard', children: [{ id: 'gate', name: 'Gate' }] },
  { id: 'office', name: 'Office' },
];

const baseProps: TreeViewProps<Node> = {
  items,
  getItemId: item => item.id,
  getItemChildren: item => item.children,
  renderItem: item => ({ content: item.name }),
  ariaLabel: 'Locations',
};

function Controlled({
  initial = [],
  onToggle,
  ...props
}: Partial<TreeViewProps<Node>> & {
  initial?: string[];
  onToggle?: (detail: TreeViewProps.ItemToggleDetail<Node>) => void;
}) {
  const [expanded, setExpanded] = useState<ReadonlyArray<string>>(initial);
  return (
    <TreeView
      {...baseProps}
      {...props}
      expandedItems={expanded}
      onItemToggle={event => {
        onToggle?.(event.detail);
        const { id, expanded: isExpanded } = event.detail;
        setExpanded(current => (isExpanded ? [...current, id] : current.filter(other => other !== id)));
      }}
    />
  );
}

const wrapper = () => createWrapper().findTreeView()!;
const item = (name: string) => screen.getByRole('treeitem', { name });
const visibleNames = () =>
  wrapper()
    .findVisibleItems()
    .map(entry => entry.findContent().getText());

afterEach(() => {
  document.documentElement.removeAttribute('dir');
});

describe('TreeView', () => {
  test('renders a named tree with levels, sizes and positions', () => {
    render(<Controlled initial={['site']} />);
    expect(screen.getByRole('tree', { name: 'Locations' })).toBeInTheDocument();
    expect(item('Site')).toHaveAttribute('aria-level', '1');
    expect(item('Site')).toHaveAttribute('aria-expanded', 'true');
    expect(item('North annex')).toHaveAttribute('aria-level', '2');
    expect(item('North annex')).toHaveAttribute('aria-posinset', '1');
    expect(item('South annex')).toHaveAttribute('aria-setsize', '2');
    expect(item('Office')).not.toHaveAttribute('aria-expanded');
    expect(screen.getAllByRole('group')).toHaveLength(1);
  });

  test('renders the parts of an item', () => {
    render(
      <TreeView
        {...baseProps}
        renderItem={entry => ({
          content: <strong>{entry.name}</strong>,
          secondaryContent: `${entry.children?.length ?? 0} children`,
          icon: <span data-testid={`icon-${entry.id}`} />,
          actions: <button type="button">Edit {entry.name}</button>,
          announcementLabel: `${entry.name} location`,
        })}
      />
    );
    const site = wrapper().findItemById('site')!;
    expect(site.findContent().getText()).toBe('Site');
    expect(site.findSecondaryContent()!.getText()).toBe('2 children');
    expect(site.findActions()!.getText()).toBe('Edit Site');
    expect(screen.getByTestId('icon-site')).toBeInTheDocument();
    expect(item('Site location')).toBe(site.getElement());
  });

  test('keeps a single tab stop that follows focus', () => {
    render(<Controlled />);
    const tabStops = () => screen.getAllByRole('treeitem').filter(entry => entry.tabIndex === 0);
    expect(tabStops()).toEqual([item('Site')]);
    act(() => item('Yard').focus());
    expect(tabStops()).toEqual([item('Yard')]);
  });

  test('moves focus with the up, down, Home and End keys', () => {
    render(<Controlled initial={['site']} />);
    act(() => item('Site').focus());
    fireEvent.keyDown(item('Site'), { key: 'ArrowDown' });
    expect(item('North annex')).toHaveFocus();
    fireEvent.keyDown(item('North annex'), { key: 'ArrowDown' });
    expect(item('South annex')).toHaveFocus();
    fireEvent.keyDown(item('South annex'), { key: 'ArrowUp' });
    expect(item('North annex')).toHaveFocus();
    fireEvent.keyDown(item('North annex'), { key: 'End' });
    expect(item('Office')).toHaveFocus();
    fireEvent.keyDown(item('Office'), { key: 'ArrowDown' });
    expect(item('Office')).toHaveFocus();
    fireEvent.keyDown(item('Office'), { key: 'Home' });
    expect(item('Site')).toHaveFocus();
  });

  test('expands with Right, then moves into the children', () => {
    const onToggle = vi.fn();
    render(<Controlled onToggle={onToggle} />);
    act(() => item('Site').focus());
    fireEvent.keyDown(item('Site'), { key: 'ArrowRight' });
    expect(onToggle).toHaveBeenCalledWith({ id: 'site', item: items[0], expanded: true });
    expect(item('Site')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Site')).toHaveFocus();
    fireEvent.keyDown(item('Site'), { key: 'ArrowRight' });
    expect(item('North annex')).toHaveFocus();
  });

  test('moves to the parent with Left, then collapses it', () => {
    const onToggle = vi.fn();
    render(<Controlled initial={['site']} onToggle={onToggle} />);
    act(() => item('South annex').focus());
    fireEvent.keyDown(item('South annex'), { key: 'ArrowLeft' });
    expect(item('Site')).toHaveFocus();
    fireEvent.keyDown(item('Site'), { key: 'ArrowLeft' });
    expect(onToggle).toHaveBeenCalledWith({ id: 'site', item: items[0], expanded: false });
    expect(screen.queryByRole('treeitem', { name: 'South annex' })).toBeNull();
  });

  test('swaps Right and Left in right-to-left layout', () => {
    document.documentElement.dir = 'rtl';
    render(
      <div style={{ direction: 'rtl' }}>
        <Controlled />
      </div>
    );
    act(() => item('Site').focus());
    fireEvent.keyDown(item('Site'), { key: 'ArrowLeft' });
    expect(item('Site')).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(item('Site'), { key: 'ArrowRight' });
    expect(item('Site')).toHaveAttribute('aria-expanded', 'false');
  });

  test('expands every sibling with the asterisk key', () => {
    const onToggle = vi.fn();
    render(<Controlled onToggle={onToggle} />);
    act(() => item('Office').focus());
    fireEvent.keyDown(item('Office'), { key: '*' });
    expect(onToggle.mock.calls.map(([detail]) => detail.id)).toEqual(['site', 'yard']);
    expect(visibleNames()).toEqual(['Site', 'North annex', 'South annex', 'Yard', 'Gate', 'Office']);
  });

  test('toggles with the button and keeps focus on the item', () => {
    render(<Controlled initial={['site', 'north']} />);
    act(() => item('Pump room').focus());
    const site = wrapper().findItemById('site')!;
    expect(site.findToggle()!.getElement()).toHaveAccessibleName('Collapse Site');
    site.findToggle()!.click();
    expect(site.isExpanded()).toBe(false);
    expect(item('Site')).toHaveFocus();
    expect(site.findToggle()!.getElement()).toHaveAccessibleName('Expand Site');
    expect(site.findChildItems()).toHaveLength(0);
  });

  test('moves the tab stop to the closest visible ancestor when a branch collapses', () => {
    const { rerender } = render(<TreeView {...baseProps} expandedItems={['site', 'north']} />);
    act(() => item('Pump room').focus());
    rerender(<TreeView {...baseProps} expandedItems={[]} />);
    expect(item('Site')).toHaveAttribute('tabindex', '0');
  });

  test('keeps its own expanded state when uncontrolled', () => {
    render(<TreeView {...baseProps} />);
    wrapper().findItemById('yard')!.findToggle()!.click();
    expect(visibleNames()).toEqual(['Site', 'Yard', 'Gate', 'Office']);
  });

  test('only lets Tab reach the actions of the item holding the tab stop', () => {
    render(
      <TreeView
        {...baseProps}
        renderItem={entry => ({ content: entry.name, actions: <button type="button">Edit {entry.name}</button> })}
      />
    );
    const edit = (name: string) => screen.getByRole('button', { name: `Edit ${name}` });
    expect(edit('Site')).not.toHaveAttribute('tabindex');
    expect(edit('Yard')).toHaveAttribute('tabindex', '-1');
    act(() => item('Yard').focus());
    expect(edit('Yard')).not.toHaveAttribute('tabindex');
    expect(edit('Site')).toHaveAttribute('tabindex', '-1');
  });

  test('ignores arrow keys pressed inside the actions', () => {
    render(
      <TreeView
        {...baseProps}
        renderItem={entry => ({ content: entry.name, actions: <button type="button">Edit</button> })}
      />
    );
    const edit = screen.getAllByRole('button', { name: 'Edit' })[0];
    act(() => edit.focus());
    fireEvent.keyDown(edit, { key: 'ArrowDown' });
    expect(edit).toHaveFocus();
  });

  test('takes toggle labels from i18nStrings, then from an I18nProvider', () => {
    const { rerender } = render(
      <TreeView {...baseProps} i18nStrings={{ expandButtonLabel: entry => `Open ${entry.name}` }} />
    );
    expect(wrapper().findItemById('site')!.findToggle()!.getElement()).toHaveAccessibleName('Open Site');
    rerender(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate/components': { de: { 'tree-view': { expandButtonLabel: '{label} aufklappen' } } } }]}
      >
        <TreeView {...baseProps} />
      </I18nProvider>
    );
    expect(wrapper().findItemById('site')!.findToggle()!.getElement()).toHaveAccessibleName('Site aufklappen');
  });

  test('renders a custom toggle icon', () => {
    render(
      <TreeView
        {...baseProps}
        expandedItems={['site']}
        renderItemToggleIcon={({ expanded }) => <span data-testid="toggle-icon">{expanded ? '-' : '+'}</span>}
      />
    );
    expect(screen.getAllByTestId('toggle-icon').map(icon => icon.textContent)).toEqual(['-', '+', '+']);
  });

  test('currentItemId marks the item the user is on', () => {
    render(<TreeView {...baseProps} expandedItems={['site']} currentItemId="south" />);
    const tree = createWrapper().findTreeView()!;
    expect(tree.findCurrentItem()!.getId()).toBe('south');
    expect(tree.findItemById('south')!.getElement()).toHaveAttribute('aria-current', 'true');
    expect(tree.findItemById('north')!.isCurrent()).toBe(false);
  });

  test('passes id and data attributes to the root', () => {
    render(<TreeView {...baseProps} id="locations" data-testid="tree" />);
    expect(screen.getByTestId('tree')).toHaveAttribute('id', 'locations');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Controlled
        initial={['site', 'north']}
        renderItem={entry => ({
          content: entry.name,
          secondaryContent: entry.children ? `${entry.children.length} children` : undefined,
          actions: <button type="button">Edit {entry.name}</button>,
        })}
      />
    );
    await expectNoAxeViolations(container);
  });
});
