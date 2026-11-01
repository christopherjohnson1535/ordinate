// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Button from '../../../lib/components/button';
import Icon from '../../../lib/components/icon';
import List, { ListProps } from '../../../lib/components/list';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

interface Step {
  id: string;
  title: string;
  detail?: string;
}

const steps: Step[] = [
  { id: 'build', title: 'Build', detail: 'Compile and test' },
  { id: 'stage', title: 'Stage' },
  { id: 'deploy', title: 'Deploy', detail: 'Roll out to all zones' },
];

const renderItem = (item: Step): ListProps.RenderedItem => ({
  id: item.id,
  content: item.title,
  secondaryContent: item.detail,
  icon: <Icon name="status-pending" />,
  actions: <Button variant="icon" iconName="edit" ariaLabel={`Edit ${item.title}`} />,
});

function Sortable({ onChangeSpy }: { onChangeSpy?: (ids: string[]) => void }) {
  const [items, setItems] = useState(steps);
  return (
    <List
      ariaLabel="Pipeline"
      items={items}
      renderItem={renderItem}
      sortable={true}
      onSortingChange={event => {
        onChangeSpy?.(event.detail.items.map(item => item.id));
        setItems(event.detail.items);
      }}
    />
  );
}

const list = () => createWrapper().findList()!;

describe('List', () => {
  test('renders a named list with a row per item', () => {
    render(<List ariaLabel="Pipeline" items={steps} renderItem={renderItem} />);
    expect(screen.getByRole('list', { name: 'Pipeline' }).tagName).toBe('UL');
    const rows = list().findItems();
    expect(rows).toHaveLength(3);
    expect(rows[0].findContent().getText()).toBe('Build');
    expect(rows[0].findSecondaryContent()!.getText()).toBe('Compile and test');
    expect(rows[1].findSecondaryContent()).toBeNull();
    expect(rows[0].findIconSlot()).not.toBeNull();
    expect(rows[0].findActions()!.find('button')).not.toBeNull();
    expect(rows[0].findMoveUpButton()).toBeNull();
  });

  test('renders an ordered list with tagOverride', () => {
    render(<List ariaLabel="Pipeline" items={steps} renderItem={renderItem} tagOverride="ol" />);
    expect(screen.getByRole('list').tagName).toBe('OL');
  });

  test('a sortable list is ordered and has move buttons grouped under the row content', () => {
    render(<Sortable />);
    expect(screen.getByRole('list').tagName).toBe('OL');
    const group = screen.getByRole('group', { name: 'Stage' });
    expect(group).toContainElement(screen.getAllByRole('button', { name: 'Move up' })[1]);
    expect(list().findItems()[0].findMoveUpButton()!.getElement()).toBeDisabled();
    expect(list().findItems()[2].findMoveDownButton()!.getElement()).toBeDisabled();
  });

  test('moves a row and keeps focus on its button', () => {
    const onChange = vi.fn();
    render(<Sortable onChangeSpy={onChange} />);
    const down = list().findItems()[0].findMoveDownButton()!.getElement();
    act(() => down.focus());
    fireEvent.click(down);
    expect(onChange).toHaveBeenLastCalledWith(['stage', 'build', 'deploy']);
    expect(list().findItems()[1].findMoveDownButton()!.getElement()).toHaveFocus();
  });

  test('moves focus to the other button when a row reaches an end', () => {
    const onChange = vi.fn();
    render(<Sortable onChangeSpy={onChange} />);
    const up = list().findItems()[1].findMoveUpButton()!.getElement();
    act(() => up.focus());
    fireEvent.click(up);
    expect(onChange).toHaveBeenLastCalledWith(['stage', 'build', 'deploy']);
    expect(list().findItems()[0].findMoveDownButton()!.getElement()).toHaveFocus();
  });

  test('takes the move button names from i18nStrings', () => {
    render(
      <List
        items={steps}
        renderItem={renderItem}
        sortable={true}
        i18nStrings={{ moveUpAriaLabel: 'Earlier', moveDownAriaLabel: 'Later' }}
      />
    );
    expect(screen.getAllByRole('button', { name: 'Earlier' })).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: 'Later' })).toHaveLength(3);
  });

  test('passes id and data attributes to the root', () => {
    render(<List id="pipeline" data-testid="pipeline" items={steps} renderItem={renderItem} />);
    expect(list().getElement()).toHaveAttribute('id', 'pipeline');
    expect(list().getElement()).toHaveAttribute('data-testid', 'pipeline');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Sortable />);
    await expectNoAxeViolations(container);
  });
});
