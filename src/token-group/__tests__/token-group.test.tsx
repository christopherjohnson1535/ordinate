// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import TokenGroup, { TokenGroupProps } from '../../../lib/components/token-group';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const regions: TokenGroupProps.Item[] = [
  { label: 'US East', description: 'Virginia', iconName: 'globe' },
  { label: 'US West', labelTag: 'us-west-2', tags: ['3 zones'] },
  { label: 'EU Central', disabled: true },
  { label: 'AP South' },
];

function Controlled(props: Partial<TokenGroupProps>) {
  const [items, setItems] = useState(props.items ?? regions);
  return (
    <TokenGroup
      {...props}
      items={items}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.itemIndex))}
    />
  );
}

const group = () => createWrapper().findTokenGroup()!;

describe('TokenGroup', () => {
  test('renders a list with a token per item', () => {
    render(<TokenGroup items={regions} ariaLabel="Regions" />);
    expect(screen.getByRole('list', { name: 'Regions' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    const tokens = group().findTokens();
    expect(tokens.map(token => token.findLabel().getText())).toEqual(['US East', 'US West', 'EU Central', 'AP South']);
    expect(tokens[0].findDescription()!.getText()).toBe('Virginia');
    expect(tokens[0].findIconSlot()).not.toBeNull();
    expect(tokens[1].findLabelTag()!.getText()).toBe('us-west-2');
    expect(tokens[1].findTags()[0].getText()).toBe('3 zones');
    expect(tokens[2].isDisabled()).toBe(true);
  });

  test('fires onDismiss with the item index, and names the buttons after the labels', () => {
    const onDismiss = vi.fn();
    render(<TokenGroup items={regions} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove US West' }));
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { itemIndex: 1 } }));
    expect(screen.queryByRole('button', { name: 'Remove EU Central' })).toBeNull();
  });

  test('uses dismissLabel from the item', () => {
    render(<TokenGroup items={[{ label: 'US East', dismissLabel: 'Drop US East' }]} onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: 'Drop US East' })).toBeInTheDocument();
  });

  test('moves focus to the next dismiss button, skipping disabled tokens', () => {
    render(<Controlled />);
    const remove = screen.getByRole('button', { name: 'Remove US West' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(screen.getByRole('button', { name: 'Remove AP South' })).toHaveFocus();
  });

  test('moves focus back to an earlier token when the last one is removed', () => {
    render(<Controlled />);
    const remove = screen.getByRole('button', { name: 'Remove AP South' });
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(screen.getByRole('button', { name: 'Remove US West' })).toHaveFocus();
  });

  test('has no dismiss buttons when read-only or without onDismiss', () => {
    const { rerender } = render(<TokenGroup items={regions} readOnly={true} onDismiss={() => {}} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    rerender(<TokenGroup items={regions} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('limits the tokens and toggles the rest', () => {
    render(<TokenGroup items={regions} limit={2} />);
    expect(group().findTokens()).toHaveLength(2);
    const toggle = group().findTokenToggle()!;
    expect(toggle.getText()).toBe('+2 more');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'false');
    toggle.click();
    expect(group().findTokens()).toHaveLength(4);
    expect(toggle.getText()).toBe('Show fewer');
    expect(toggle.getElement()).toHaveAttribute('aria-expanded', 'true');
  });

  test('takes the toggle texts from i18nStrings', () => {
    render(<TokenGroup items={regions} limit={1} i18nStrings={{ limitShowMore: 'More', limitShowFewer: 'Less' }} />);
    const toggle = group().findTokenToggle()!;
    expect(toggle.getText()).toBe('More');
    toggle.click();
    expect(toggle.getText()).toBe('Less');
  });

  test('has no toggle when the items fit the limit', () => {
    render(<TokenGroup items={regions} limit={4} />);
    expect(group().findTokenToggle()).toBeNull();
  });

  test('stacks the tokens with the vertical alignment', () => {
    const { container } = render(<TokenGroup items={regions} alignment="vertical" />);
    expect(container.querySelector('[class*="alignment-vertical"]')).not.toBeNull();
  });

  test('passes id and data attributes to the root', () => {
    render(<TokenGroup id="regions" data-testid="regions" items={regions} />);
    expect(group().getElement()).toHaveAttribute('id', 'regions');
    expect(group().getElement()).toHaveAttribute('data-testid', 'regions');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<TokenGroup items={regions} limit={3} ariaLabel="Regions" onDismiss={() => {}} />);
    await expectNoAxeViolations(container);
  });
});
