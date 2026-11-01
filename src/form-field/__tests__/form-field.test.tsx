// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import Button from '../../../lib/components/button';
import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import inputStyles from '../../../lib/components/input/styles.css.js';

describe('FormField warning', () => {
  test('shows the warning with an icon and describes the control with it', () => {
    render(
      <FormField label="Capacity" description="Number of nodes." warningText="More than 50 nodes takes longer.">
        <Input value="80" />
      </FormField>
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription(/More than 50 nodes takes longer\. Number of nodes\.$/);
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  test('puts the control in its warning state', () => {
    render(
      <FormField label="Capacity" warningText="More than 50 nodes takes longer.">
        <Input value="80" />
      </FormField>
    );
    expect(createWrapper().findInput()!.getElement()).toHaveClass(inputStyles.warning);
  });

  test('errorText wins over warningText', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <FormField label="Capacity" errorText="Enter at least 1 node." warningText="More than 50 nodes takes longer.">
        <Input value="0" />
      </FormField>
    );
    const field = createWrapper().findFormField()!;
    expect(field.findWarning()).toBeNull();
    expect(field.findError()!.getText()).toBe('Enter at least 1 node.');
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Enter at least 1 node\.$/);
    expect(input.getAttribute('aria-describedby')).toBe(field.findError()!.getElement().id);
    expect(createWrapper().findInput()!.getElement()).not.toHaveClass(inputStyles.warning);
    warn.mockRestore();
  });

  test('the icon labels can be changed', () => {
    render(
      <FormField label="Nodes" warningText="Many nodes." warningIconAriaLabel="Caution">
        <Input value="80" />
      </FormField>
    );
    expect(screen.getByRole('img', { name: 'Caution' })).toBeInTheDocument();
  });
});

describe('FormField info and secondary control', () => {
  test('renders info beside the label', () => {
    render(
      <FormField label="Region" info={<a href="#help">Info</a>}>
        <Input value="" />
      </FormField>
    );
    expect(screen.getByRole('link', { name: 'Info' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Region' })).toBeInTheDocument();
  });

  test('renders the secondary control without giving it the control ID', () => {
    render(
      <FormField label="Project name" controlId="name" secondaryControl={<Button formAction="none">Generate</Button>}>
        <Input value="" />
      </FormField>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'name');
    expect(screen.getByRole('button', { name: 'Generate' })).not.toHaveAttribute('id');
  });

  test('the secondary control shares the label and validation state', () => {
    render(
      <FormField label="Capacity" errorText="Enter a number." secondaryControl={<Input value="" ariaLabel="Unit" />}>
        <Input value="" />
      </FormField>
    );
    const [, secondary] = screen.getAllByRole('textbox');
    expect(secondary).toHaveAttribute('aria-invalid', 'true');
    expect(secondary).toHaveAccessibleDescription(/Enter a number\.$/);
  });
});

describe('FormField character count', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('shows the count and describes the control with it', () => {
    render(
      <FormField label="Description" constraintText="Up to 64 characters." characterCountText="12 of 64">
        <Input value="north-annex" />
      </FormField>
    );
    expect(createWrapper().findFormField()!.findCharacterCount()!.getText()).toBe('12 of 64');
    expect(createWrapper().findFormField()!.findConstraint()!.getText()).toBe('Up to 64 characters.');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Up to 64 characters. 12 of 64');
  });

  test('screen readers get the new count once typing pauses', () => {
    const { rerender } = render(
      <FormField label="Description" characterCountText="1 of 64">
        <Input value="n" />
      </FormField>
    );
    rerender(
      <FormField label="Description" characterCountText="2 of 64">
        <Input value="no" />
      </FormField>
    );
    const input = screen.getByRole('textbox');
    expect(createWrapper().findFormField()!.findCharacterCount()!.getText()).toBe('2 of 64');
    expect(input).toHaveAccessibleDescription('1 of 64');
    act(() => vi.advanceTimersByTime(1000));
    expect(input).toHaveAccessibleDescription('2 of 64');
  });
});

describe('FormField test utilities and accessibility', () => {
  test('the wrapper finds the new parts', () => {
    render(
      <FormField
        label="Project name"
        info={<a href="#help">Info</a>}
        warningText="This name is already used by an archived project."
        secondaryControl={<Button formAction="none">Generate</Button>}
      >
        <Input value="north-annex" />
      </FormField>
    );
    const field = createWrapper().findFormField()!;
    expect(field.findInfo()!.getText()).toBe('Info');
    expect(field.findWarning()!.getText()).toBe('This name is already used by an archived project.');
    expect(field.findSecondaryControl()!.findButton()!.getText()).toBe('Generate');
    expect(field.findCharacterCount()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <form>
        <FormField label="Region" info={<a href="#help">Info</a>} stretch={true}>
          <Input value="us-mountain-1" />
        </FormField>
        <FormField label="Capacity" warningText="More than 50 nodes takes longer.">
          <Input value="80" />
        </FormField>
        <FormField
          label="Description"
          constraintText="Up to 64 characters."
          characterCountText="12 of 64"
          secondaryControl={<Button formAction="none">Generate</Button>}
        >
          <Input value="north-annex" />
        </FormField>
      </form>
    );
    await expectNoAxeViolations(container);
  });
});
