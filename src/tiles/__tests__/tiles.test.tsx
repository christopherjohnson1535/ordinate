// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import Tiles, { TilesProps } from '../../../lib/components/tiles';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const plans: TilesProps.Item[] = [
  { value: 'free', label: 'Free', description: 'One project.' },
  { value: 'team', label: 'Team', description: 'Up to 20 people.', image: <img src="team.svg" alt="Team plan" /> },
  { value: 'enterprise', label: 'Enterprise', description: 'Contact sales.', disabled: true },
];

function Controlled(props: Partial<TilesProps> & { onChangeSpy?: (value: string) => void }) {
  const { onChangeSpy, ...rest } = props;
  const [value, setValue] = useState<string | null>(props.value ?? null);
  return (
    <Tiles
      ariaLabel="Plan"
      items={plans}
      {...rest}
      value={value}
      onChange={event => {
        onChangeSpy?.(event.detail.value);
        setValue(event.detail.value);
      }}
    />
  );
}

describe('Tiles', () => {
  test('renders a radio group with a radio button per tile', () => {
    render(<Tiles ariaLabel="Plan" items={plans} value="team" />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName('Plan');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription('One project.');
    expect(screen.getByRole('radio', { name: 'Enterprise' })).toBeDisabled();
    expect(screen.getByRole('img', { name: 'Team plan' })).toBeInTheDocument();
  });

  test('all radio buttons share one name', () => {
    render(<Tiles ariaLabel="Plan" items={plans} value={null} name="plan" />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('name', 'plan');
    }
  });

  test('fires onChange when a radio button is selected', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Free' }));
    expect(onChange).toHaveBeenCalledWith('free');
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
  });

  test('clicking anywhere on a tile selects it and focuses its radio button', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(screen.getByRole('img', { name: 'Team plan' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('team');
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus();
    fireEvent.click(screen.getByText('Up to 20 people.'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('clicking a label fires onChange once', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(screen.getByText('Free'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('ignores disabled tiles', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.click(screen.getByText('Contact sales.'));
    fireEvent.click(screen.getByRole('radio', { name: 'Enterprise' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('read-only tiles stay focusable but do not change', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} value="free" readOnly={true} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    fireEvent.click(screen.getByText('Up to 20 people.'));
    fireEvent.click(screen.getByRole('radio', { name: 'Team' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
  });

  test('marks the selected tile', () => {
    render(<Tiles ariaLabel="Plan" items={plans} value="free" />);
    const tiles = createWrapper().findTiles()!;
    expect(tiles.findSelectedItem()!.getText()).toContain('Free');
    expect(tiles.getSelectedValue()).toBe('free');
  });

  test('lays out the requested number of columns, and warns about values out of range', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container, rerender } = render(<Tiles ariaLabel="Plan" items={plans} value={null} columns={1} />);
    const grid = () => container.querySelector('[role="radiogroup"] > div')!;
    expect(grid().className).toMatch(/columns-1/);
    rerender(<Tiles ariaLabel="Plan" items={plans} value={null} />);
    expect(grid().className).toMatch(/columns-3/);
    rerender(<Tiles ariaLabel="Plan" items={[...plans, { value: 'x', label: 'X' }]} value={null} />);
    expect(grid().className).toMatch(/columns-2/);
    rerender(<Tiles ariaLabel="Plan" items={plans} value={null} columns={7} />);
    expect(grid().className).toMatch(/columns-4/);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('columns'));
    warn.mockRestore();
  });

  test('focus() moves to the selected tile, or the first enabled one', () => {
    const ref = React.createRef<TilesProps.Ref>();
    const { rerender } = render(<Tiles ref={ref} ariaLabel="Plan" items={plans} value="team" />);
    act(() => ref.current?.focus());
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus();
    rerender(<Tiles ref={ref} ariaLabel="Plan" items={plans} value={null} />);
    act(() => ref.current?.focus());
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
  });
});

describe('Tiles in a form field', () => {
  test('the field labels and describes the group, not each radio button', () => {
    render(
      <FormField label="Plan" description="You can change it later." controlId="plan">
        <Tiles items={plans} value={null} />
      </FormField>
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleName('Plan');
    expect(group).toHaveAccessibleDescription('You can change it later.');
    expect(screen.getByRole('radio', { name: 'Free' })).not.toHaveAttribute('id', 'plan');
  });
});

describe('Tiles test utilities and accessibility', () => {
  test('the wrapper finds tiles, radio buttons and images', () => {
    render(<Tiles ariaLabel="Plan" items={plans} value={null} />);
    const tiles = createWrapper().findTiles()!;
    expect(tiles.findItems()).toHaveLength(3);
    expect(tiles.findRadioButtons()).toHaveLength(3);
    const team = tiles.findItemByValue('team')!;
    expect(tiles.findItemImage(team)).not.toBeNull();
    expect(tiles.findItemImage(tiles.findItemByValue('free')!)).toBeNull();
    expect(tiles.findSelectedItem()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Plan" description="You can change it later.">
        <Tiles items={plans} value="team" />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
