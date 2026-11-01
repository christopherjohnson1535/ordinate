// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Button from '../../../lib/components/button';
import ControlGroup from '../../../lib/components/control-group';
import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import Select from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const units = [
  { value: 'gib', label: 'GiB' },
  { value: 'tib', label: 'TiB' },
];

describe('ControlGroup', () => {
  test('renders a group with one cell per control', () => {
    const { container } = render(
      <ControlGroup ariaLabel="Search">
        <Input value="" ariaLabel="Query" />
        <>
          <Button>Search</Button>
        </>
        {null}
      </ControlGroup>
    );
    const group = screen.getByRole('group', { name: 'Search' });
    expect(group).toBeInTheDocument();
    const wrapper = createWrapper(container).findControlGroup()!;
    expect(wrapper.findItems()).toHaveLength(2);
    expect(wrapper.findItem(2)!.getText()).toBe('Search');
    expect(wrapper.findItem(3)).toBeNull();
  });

  test('passes ariaLabelledby and ariaDescribedby on', () => {
    render(
      <>
        <span id="label">Size</span>
        <span id="hint">Up to 16 TiB</span>
        <ControlGroup ariaLabelledby="label" ariaDescribedby="hint">
          <Input value="" ariaLabel="Amount" />
        </ControlGroup>
      </>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAccessibleName('Size');
    expect(group).toHaveAccessibleDescription('Up to 16 TiB');
  });

  test('inside a form field, the label names the group and the first control', () => {
    render(
      <FormField label="Volume size" errorText="Enter a size.">
        <ControlGroup>
          <Input value="" />
          <Select selectedOption={units[0]} options={units} ariaLabel="Unit" />
        </ControlGroup>
      </FormField>
    );
    expect(screen.getByRole('group')).toHaveAccessibleName('Volume size');
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleName('Volume size');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a size.');
    expect(document.querySelectorAll(`[id="${input.id}"]`)).toHaveLength(1);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    expect(trigger).not.toHaveAttribute('id', input.id);
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  test('ariaLabel replaces the form field label on the group', () => {
    render(
      <FormField label="Volume size">
        <ControlGroup ariaLabel="Size and unit">
          <Input value="" />
        </ControlGroup>
      </FormField>
    );
    expect(screen.getByRole('group')).toHaveAccessibleName('Size and unit');
  });

  test('accepts id and data attributes but no styling props', () => {
    const props = { id: 'group', 'data-testid': 'size', className: 'nope' } as React.ComponentProps<
      typeof ControlGroup
    >;
    render(
      <ControlGroup {...props} ariaLabel="Size">
        <Input value="" ariaLabel="Amount" />
      </ControlGroup>
    );
    const group = screen.getByTestId('size');
    expect(group).toHaveAttribute('id', 'group');
    expect(group).not.toHaveClass('nope');
  });

  test('has no axe violations', async () => {
    const { container } = render(
      <FormField label="Volume size">
        <ControlGroup>
          <Input value="100" />
          <Select selectedOption={units[0]} options={units} ariaLabel="Unit" />
          <Button>Apply</Button>
        </ControlGroup>
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
