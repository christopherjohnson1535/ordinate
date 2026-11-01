// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import MenuTile, { MenuTileProps } from '../../../lib/components/menu-tile';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const tile = () => createWrapper().findMenuTile()!;

const items: MenuTileProps.Item[] = [
  { label: 'Full service', value: '$85', description: 'Gears, brakes and wheels.' },
  { label: 'With new cables', value: '$110' },
];

describe('MenuTile', () => {
  test('lists the items with their prices', () => {
    render(<MenuTile title="Full service" items={items} />);
    const list = screen.getByRole('list');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    const [first, second] = tile().findItems();
    expect(first.findLabel().getText()).toBe('Full service');
    expect(first.findValue()!.getText()).toBe('$85');
    expect(first.findDescription()!.getText()).toBe('Gears, brakes and wheels.');
    expect(second.findDescription()).toBeNull();
  });

  test('each row reads as the item and its price, without the leader', () => {
    render(<MenuTile title="Quick fixes" items={[{ label: 'Flat tire repair', value: '$18' }]} />);
    const row = screen.getByRole('listitem');
    expect(row.textContent).toBe('Flat tire repair $18');
    expect(row.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  test('renders the title as a level 3 heading by default', () => {
    render(
      <>
        <MenuTile title="Quick fixes" />
        <MenuTile title="Wheels" headingLevel={2} />
      </>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Quick fixes' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Wheels' })).toBeInTheDocument();
  });

  test('renders the badge, description and footer', () => {
    render(
      <MenuTile
        title="Full service"
        badge="Most booked"
        description="Everything checked."
        footer={<button type="button">Book</button>}
      />
    );
    expect(tile().findBadge()!.getText()).toBe('Most booked');
    expect(tile().findDescription()!.getText()).toBe('Everything checked.');
    expect(within(tile().findFooter()!.getElement()).getByRole('button', { name: 'Book' })).toBeInTheDocument();
  });

  test('renders no list without items', () => {
    render(<MenuTile title="Ask us about custom builds" />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(tile().findBadge()).toBeNull();
    expect(tile().findFooter()).toBeNull();
  });

  test('applies a different class for each tone', () => {
    const tones: MenuTileProps.Tone[] = ['default', 'accent', 'emphasis'];
    render(
      <>
        {tones.map(tone => (
          <MenuTile key={tone} title={tone} tone={tone} />
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllMenuTiles()
      .map(wrapper => wrapper.getElement().className);
    expect(new Set(classNames).size).toBe(tones.length);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'tile', 'data-testid': 'tile', className: 'custom' } as unknown as MenuTileProps;
    render(<MenuTile {...props} title="Tile" />);
    const root = screen.getByTestId('tile');
    expect(root).toHaveAttribute('id', 'tile');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <h2>Repairs</h2>
        <MenuTile
          title="Full service"
          tone="emphasis"
          badge="Most booked"
          description="Everything checked."
          items={items}
          footer={<button type="button">Book</button>}
        />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
