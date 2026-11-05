// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import Button from '../../../lib/components/button';
import Checkbox from '../../../lib/components/checkbox';
import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import RadioButton from '../../../lib/components/radio-button';
import SpaceBetween from '../../../lib/components/space-between';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import formFieldStyles from '../../../lib/components/form-field/styles.css.js';
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

describe('FormField layout', () => {
  test('sets the label in the margin by default', () => {
    render(
      <FormField label="Project name">
        <Input value="north-annex" />
      </FormField>
    );
    expect(createWrapper().findFormField()!.getElement()).toHaveClass(formFieldStyles['layout-margin']);
  });

  test('stacks the label above the control when asked', () => {
    render(
      <FormField label="Project name" layout="stacked">
        <Input value="north-annex" />
      </FormField>
    );
    expect(createWrapper().findFormField()!.getElement()).not.toHaveClass(formFieldStyles['layout-margin']);
  });

  test('keeps the label, description and messages in reading order', () => {
    render(
      <FormField label="Project name" description="Shown in lists." constraintText="Lowercase only." errorText="Taken.">
        <Input value="north-annex" />
      </FormField>
    );
    expect(createWrapper().findFormField()!.getElement()).toHaveTextContent(
      /^Project name.*Shown in lists\..*Taken\..*Lowercase only\.$/
    );
  });

  test('draws the character count as a dimension line hidden from screen readers', () => {
    render(
      <FormField label="Description" characterCountText="12 of 64">
        <Input value="north-annex" />
      </FormField>
    );
    const count = createWrapper().findFormField()!.findCharacterCount()!.getElement();
    expect(count).toHaveAttribute('aria-hidden', 'true');
    expect(count).toHaveTextContent('12 of 64');
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

describe('FormField with checkboxes and radio buttons', () => {
  function expectUniqueIds() {
    const ids = Array.from(document.querySelectorAll('[id]'), element => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  }

  test('labels several checkboxes as a group, each with its own ID and name', async () => {
    const { container } = render(
      <FormField label="Send alerts for" description="Alerts go to the on-call rota.">
        <Checkbox checked={false}>Deploy finished</Checkbox>
        <Checkbox checked={true}>Health check failed</Checkbox>
      </FormField>
    );
    expectUniqueIds();
    const group = screen.getByRole('group', { name: 'Send alerts for' });
    expect(group).toHaveAccessibleDescription('Alerts go to the on-call rota.');
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.map(checkbox => group.contains(checkbox))).toEqual([true, true]);
    expect(checkboxes[0]).toHaveAccessibleName('Deploy finished');
    expect(checkboxes[1]).toHaveAccessibleName('Health check failed');
    expect(createWrapper().findFormField()!.findLabel()!.getElement()).not.toHaveAttribute('for');
    await expectNoAxeViolations(container);
  });

  test('labels several radio buttons as a group, also when they are wrapped in a layout', async () => {
    const { container } = render(
      <FormField label="Backup schedule">
        <div role="radiogroup" aria-label="Schedule">
          <SpaceBetween size="xs">
            <RadioButton name="schedule" value="daily" checked={true}>
              Daily
            </RadioButton>
            <RadioButton name="schedule" value="weekly" checked={false}>
              Weekly
            </RadioButton>
          </SpaceBetween>
        </div>
      </FormField>
    );
    expectUniqueIds();
    expect(screen.getByRole('group', { name: 'Backup schedule' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Daily' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  test('gives checkboxes and radio buttons in one field unique IDs', () => {
    render(
      <FormField label="Retention">
        <Checkbox checked={false}>Keep logs</Checkbox>
        <Checkbox checked={false}>Keep metrics</Checkbox>
        <RadioButton name="period" value="30" checked={true}>
          30 days
        </RadioButton>
        <RadioButton name="period" value="90" checked={false}>
          90 days
        </RadioButton>
      </FormField>
    );
    expectUniqueIds();
    expect(screen.getAllByRole('checkbox').map(element => element.id)).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: 'Keep logs' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Keep metrics' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '30 days' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '90 days' })).toBeInTheDocument();
  });

  test('a single checkbox is labeled by the field and by its own label', () => {
    render(
      <FormField label="Logging" description="Kept for 30 days.">
        <Checkbox checked={false}>Enable request logs</Checkbox>
      </FormField>
    );
    expect(screen.queryByRole('group')).toBeNull();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAccessibleName('Logging Enable request logs');
    expect(checkbox).toHaveAccessibleDescription('Kept for 30 days.');
    expect(createWrapper().findFormField()!.findLabel()!.getElement()).toHaveAttribute('for', checkbox.id);
  });

  test('a checkbox keeps a controlId set on it', () => {
    render(
      <FormField label="Send alerts for">
        <Checkbox checked={false} controlId="alert-deploy">
          Deploy finished
        </Checkbox>
      </FormField>
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'alert-deploy');
  });
});
