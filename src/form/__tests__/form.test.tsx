// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Button from '../../../lib/components/button';
import Form from '../../../lib/components/form';
import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Example({ errorText }: { errorText?: string }) {
  return (
    <form onSubmit={event => event.preventDefault()}>
      <Form
        header={<h1>Create project</h1>}
        errorText={errorText}
        errorIconAriaLabel="Error"
        actions={
          <>
            <Button formAction="none">Cancel</Button>
            <Button variant="primary">Create project</Button>
          </>
        }
        secondaryActions={<Button formAction="none">Save draft</Button>}
      >
        <FormField label="Project name">
          <Input value="north-annex" />
        </FormField>
      </Form>
    </form>
  );
}

describe('Form', () => {
  test('renders the header, content and actions', () => {
    render(<Example />);
    expect(screen.getByRole('heading', { name: 'Create project' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Project name' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeInTheDocument();
  });

  test('does not render a form element of its own', () => {
    const { container } = render(<Form>Content</Form>);
    expect(container.querySelector('form')).toBeNull();
  });

  test('shows the error in an alert region with the icon label', () => {
    const { rerender } = render(<Example />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeEmptyDOMElement();
    rerender(<Example errorText="The request failed. Try again." />);
    expect(alert).toHaveTextContent('The request failed. Try again.');
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
  });

  test('leaves out the footer when there are no actions', () => {
    render(<Form header="Settings">Content</Form>);
    expect(createWrapper().findForm()!.findActions()).toBeNull();
    expect(createWrapper().findForm()!.findSecondaryActions()).toBeNull();
  });
});

describe('Form drawing', () => {
  test('sets the reference above the header', () => {
    render(<Form kind="configuration" reference="C4" header={<h1>Create a node</h1>} />);
    const form = createWrapper().findForm()!;
    expect(form.findReference()!.getText()).toBe('C4');
    expect(form.getElement()).toHaveTextContent(/^C4Create a node/);
  });

  test('leaves out the reference when there is none', () => {
    render(<Form header={<h1>Create a node</h1>} />);
    expect(createWrapper().findForm()!.findReference()).toBeNull();
  });

  test('hides the construction marks from screen readers', () => {
    const { container } = render(<Example />);
    const marks = container.querySelectorAll('[aria-hidden="true"]');
    expect(marks.length).toBeGreaterThanOrEqual(5);
    marks.forEach(mark => expect(mark).toBeEmptyDOMElement());
  });
});

describe('Form test utilities and accessibility', () => {
  test('the wrapper finds the parts', () => {
    render(<Example errorText="The request failed." />);
    const form = createWrapper().findForm()!;
    expect(form.findHeader()!.getText()).toBe('Create project');
    expect(form.findContent()!.findInput()).not.toBeNull();
    expect(form.findActions()!.findAllButtons()).toHaveLength(2);
    expect(form.findSecondaryActions()!.getText()).toBe('Save draft');
    expect(form.findError()!.getText()).toBe('The request failed.');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Example errorText="The request failed." />);
    await expectNoAxeViolations(container);
  });
});
