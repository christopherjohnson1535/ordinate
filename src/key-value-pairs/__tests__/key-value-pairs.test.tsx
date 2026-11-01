// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import KeyValuePairs, { KeyValuePairsProps } from '../../../lib/components/key-value-pairs';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: KeyValuePairsProps['items'] = [
  { label: 'Instance ID', value: 'i-0f3a2c', id: 'instance-label' },
  { label: 'Region', value: 'north-annex', info: <a href="#info">Info</a> },
  {
    type: 'group',
    title: 'Network',
    items: [
      { label: 'Private address', value: '10.0.4.12' },
      { label: 'Subnet', value: 'subnet-7' },
    ],
  },
];

describe('KeyValuePairs', () => {
  test('renders a description list of terms and values', () => {
    render(<KeyValuePairs items={items} ariaLabel="Instance details" />);
    const terms = screen.getAllByRole('term');
    expect(terms.map(term => term.textContent)).toEqual([
      'Instance ID',
      'RegionInfo',
      'Network',
      'Private address',
      'Subnet',
    ]);
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent('i-0f3a2c');
  });

  test('sets the label id and the accessible name of the list', () => {
    const { container } = render(<KeyValuePairs items={items} ariaLabel="Instance details" />);
    expect(document.getElementById('instance-label')).toHaveTextContent('Instance ID');
    expect(container.querySelector('dl')).toHaveAttribute('aria-label', 'Instance details');
  });

  test('ariaLabelledby points the list at a heading', () => {
    const { container } = render(
      <>
        <h2 id="details">Details</h2>
        <KeyValuePairs items={items} ariaLabelledby="details" />
      </>
    );
    expect(container.querySelector('dl')).toHaveAttribute('aria-labelledby', 'details');
  });

  test('applies a different class for each column count', () => {
    const counts: KeyValuePairsProps.Columns[] = [1, 2, 3, 4];
    const { container } = render(
      <>
        {counts.map(columns => (
          <KeyValuePairs key={columns} items={items} columns={columns} />
        ))}
      </>
    );
    const lists = Array.from(container.querySelectorAll(':scope > div > dl'), list => list.className);
    expect(new Set(lists).size).toBe(counts.length);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'details', 'data-testid': 'kvp', className: 'custom' } as KeyValuePairsProps;
    render(<KeyValuePairs {...props} items={items} />);
    const root = screen.getByTestId('kvp');
    expect(root).toHaveAttribute('id', 'details');
    expect(root).not.toHaveClass('custom');
  });
});

describe('KeyValuePairs test utilities and accessibility', () => {
  test('the wrapper reads pairs and groups', () => {
    render(<KeyValuePairs items={items} />);
    const wrapper = createWrapper().findKeyValuePairs()!;
    const cells = wrapper.findCells();
    expect(cells).toHaveLength(3);
    expect(wrapper.findItems().map(pair => pair.findLabel().getText())).toEqual([
      'Instance ID',
      'Region',
      'Private address',
      'Subnet',
    ]);
    expect(wrapper.findItems()[1].findInfo()!.getText()).toBe('Info');
    expect(wrapper.findItems()[0].findInfo()).toBeNull();
    const [group] = wrapper.findGroups();
    expect(group.findTitle().getText()).toBe('Network');
    expect(group.findItems().map(pair => pair.findValue().getText())).toEqual(['10.0.4.12', 'subnet-7']);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <KeyValuePairs items={items} columns={3} ariaLabel="Instance details" />
        <KeyValuePairs items={[{ type: 'group', items: [{ label: 'Untitled', value: 'Group' }] }]} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
