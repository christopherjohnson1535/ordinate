// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Dropdown, { DropdownProps } from '../../../lib/components/dropdown';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled(props: Partial<DropdownProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dropdown
        open={open}
        ariaRole="dialog"
        ariaLabel="Filters"
        trigger={
          <button aria-expanded={open} onClick={() => setOpen(!open)}>
            Filters
          </button>
        }
        content={<p>Filter content</p>}
        onOutsideClick={() => setOpen(false)}
        onEscape={() => setOpen(false)}
        {...props}
      />
      <button>Elsewhere</button>
    </>
  );
}

const getTrigger = () => screen.getByRole('button', { name: 'Filters' });

describe('Dropdown', () => {
  test('shows the popup while open', () => {
    const { rerender } = render(<Dropdown open={false} trigger={<button>Filters</button>} content="Content" />);
    expect(createWrapper().findDropdown()!.isOpen()).toBe(false);
    rerender(<Dropdown open={true} trigger={<button>Filters</button>} content="Content" />);
    expect(createWrapper().findDropdown()!.findContent()!.getText()).toBe('Content');
  });

  test('the host opens it and closes it on an outside click', () => {
    render(<Controlled />);
    fireEvent.click(getTrigger());
    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveTextContent('Filter content');
    fireEvent.mouseDown(screen.getByText('Filter content'));
    expect(screen.queryByRole('dialog')).not.toBeNull();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('fires onEscape only while open', () => {
    const onEscape = vi.fn();
    const { rerender } = render(<Dropdown open={false} trigger={<button>Filters</button>} onEscape={onEscape} />);
    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(onEscape).not.toHaveBeenCalled();
    rerender(<Dropdown open={true} trigger={<button>Filters</button>} onEscape={onEscape} />);
    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  test('Escape inside a modal reaches only the dropdown', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Settings" onDismiss={onDismiss}>
        <Controlled />
      </Modal>
    );
    fireEvent.click(getTrigger());
    const escape = fireEvent.keyDown(screen.getByText('Filter content'), { key: 'Escape' });
    expect(escape).toBe(false);
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('renders the header and footer around the content', () => {
    render(
      <Dropdown open={true} trigger={<button>Filters</button>} header="Header" content="Content" footer="Footer" />
    );
    const dropdown = createWrapper().findDropdown()!;
    expect(dropdown.findHeader()!.getText()).toBe('Header');
    expect(dropdown.findFooter()!.getText()).toBe('Footer');
  });

  test('named widths change the popup classes', () => {
    const { rerender } = render(<Dropdown open={true} trigger={<button>Filters</button>} content="Content" />);
    const popup = () => createWrapper().findDropdown()!.findOpenDropdown()!.getElement().className;
    const initial = popup();
    rerender(
      <Dropdown open={true} trigger={<button>Filters</button>} content="Content" minWidth="medium" maxWidth="large" />
    );
    expect(popup()).not.toBe(initial);
  });

  test('labels the popup', () => {
    render(
      <>
        <h2 id="filters-heading">Filters</h2>
        <Dropdown open={true} trigger={<button>Open</button>} ariaRole="menu" ariaLabelledby="filters-heading" />
      </>
    );
    expect(screen.getByRole('menu', { name: 'Filters' })).toBeInTheDocument();
  });

  test('passes id and data attributes to the root', () => {
    render(<Dropdown open={false} trigger={<button>Filters</button>} id="filters" {...{ 'data-testid': 'filters' }} />);
    const root = createWrapper().findDropdown()!.getElement();
    expect(root).toHaveAttribute('id', 'filters');
    expect(root).toHaveAttribute('data-testid', 'filters');
  });
});

describe('Dropdown test utilities and accessibility', () => {
  test('the wrapper presses Escape', () => {
    render(<Controlled />);
    fireEvent.click(getTrigger());
    const dropdown = createWrapper().findDropdown()!;
    expect(dropdown.isOpen()).toBe(true);
    dropdown.pressEscape();
    expect(dropdown.isOpen()).toBe(false);
  });

  test('has no accessibility violations when open', async () => {
    render(<Controlled header={<strong>Narrow the list</strong>} footer={<button>Apply</button>} />);
    fireEvent.click(getTrigger());
    await expectNoAxeViolations(document.body);
  });
});
