// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import NavigableGroup, { NavigableGroupProps } from '../../../lib/components/navigable-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const byText = (element: HTMLElement) => element.textContent ?? '';
const wrapper = () => createWrapper().findNavigableGroup()!;
const button = (name: string) => screen.getByRole('button', { name });
const press = (key: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(document.activeElement!, { key, ...init });
const focused = () => document.activeElement?.textContent;

function Toolbar(props: Partial<NavigableGroupProps> & { disabled?: string[] }) {
  const { disabled = [], ...rest } = props;
  return (
    <NavigableGroup navigationDirection="horizontal" getItemKey={byText} ariaLabel="Edit" {...rest}>
      {['Copy', 'Cut', 'Paste'].map(name => (
        <button key={name} disabled={disabled.includes(name)}>
          {name}
        </button>
      ))}
    </NavigableGroup>
  );
}

afterEach(() => {
  document.documentElement.removeAttribute('dir');
});

describe('NavigableGroup', () => {
  test('renders a group with the given name, or another role', () => {
    const { rerender } = render(<Toolbar />);
    expect(screen.getByRole('group', { name: 'Edit' })).toBeInTheDocument();
    rerender(<Toolbar role="toolbar" />);
    expect(screen.getByRole('toolbar', { name: 'Edit' })).toBeInTheDocument();
  });

  test('makes the first item the only tab stop', () => {
    render(<Toolbar />);
    expect(button('Copy')).toHaveAttribute('tabindex', '0');
    expect(button('Cut')).toHaveAttribute('tabindex', '-1');
    expect(button('Paste')).toHaveAttribute('tabindex', '-1');
    expect(wrapper().findTabStop()!.getText()).toBe('Copy');
  });

  test('horizontal: Left and Right move, Home and End jump, Up and Down do nothing', () => {
    render(<Toolbar />);
    act(() => button('Copy').focus());
    press('ArrowRight');
    expect(focused()).toBe('Cut');
    press('ArrowDown');
    expect(focused()).toBe('Cut');
    press('End');
    expect(focused()).toBe('Paste');
    press('ArrowLeft');
    expect(focused()).toBe('Cut');
    press('Home');
    expect(focused()).toBe('Copy');
  });

  test('the item last focused keeps the tab stop', () => {
    render(<Toolbar />);
    act(() => button('Copy').focus());
    press('ArrowRight');
    expect(button('Cut')).toHaveAttribute('tabindex', '0');
    expect(button('Copy')).toHaveAttribute('tabindex', '-1');
  });

  test('stops at the ends unless loopFocus is set', () => {
    const { rerender } = render(<Toolbar />);
    act(() => button('Paste').focus());
    press('ArrowRight');
    expect(focused()).toBe('Paste');
    rerender(<Toolbar loopFocus={true} />);
    press('ArrowRight');
    expect(focused()).toBe('Copy');
    press('ArrowLeft');
    expect(focused()).toBe('Paste');
  });

  test('vertical uses Up and Down; both uses all four arrows', () => {
    const { rerender } = render(<Toolbar navigationDirection="vertical" />);
    act(() => button('Copy').focus());
    press('ArrowRight');
    expect(focused()).toBe('Copy');
    press('ArrowDown');
    expect(focused()).toBe('Cut');
    rerender(<Toolbar navigationDirection="both" />);
    press('ArrowRight');
    expect(focused()).toBe('Paste');
    press('ArrowUp');
    expect(focused()).toBe('Cut');
  });

  test('Left and Right follow the reading direction', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    render(
      <div style={{ direction: 'rtl' }}>
        <Toolbar />
      </div>
    );
    act(() => button('Copy').focus());
    press('ArrowLeft');
    expect(focused()).toBe('Cut');
    press('ArrowRight');
    expect(focused()).toBe('Copy');
  });

  test('skips disabled items', () => {
    render(<Toolbar disabled={['Cut']} />);
    act(() => button('Copy').focus());
    press('ArrowRight');
    expect(focused()).toBe('Paste');
  });

  test('moves the tab stop when its item is disabled or removed', () => {
    function Changing() {
      const [items, setItems] = useState(['Copy', 'Cut', 'Paste']);
      return (
        <>
          <NavigableGroup navigationDirection="horizontal" getItemKey={byText}>
            {items.map(item => (
              <button key={item}>{item}</button>
            ))}
          </NavigableGroup>
          <button onClick={() => setItems(['Cut', 'Paste'])}>Remove copy</button>
        </>
      );
    }
    render(<Changing />);
    fireEvent.click(button('Remove copy'));
    expect(button('Cut')).toHaveAttribute('tabindex', '0');
  });

  test('ignores keys with modifiers, keys already handled, and arrows in text fields', () => {
    render(
      <NavigableGroup navigationDirection="horizontal" getItemKey={element => element.getAttribute('name') ?? ''}>
        <input name="search" aria-label="Search" />
        <button name="go">Go</button>
      </NavigableGroup>
    );
    const input = screen.getByRole('textbox');
    act(() => input.focus());
    press('ArrowRight');
    expect(document.activeElement).toBe(input);
    act(() => button('Go').focus());
    press('ArrowLeft', { ctrlKey: true });
    expect(focused()).toBe('Go');
  });

  test('leaves the items of a nested group to that group', () => {
    render(
      <NavigableGroup navigationDirection="horizontal" getItemKey={byText} ariaLabel="Outer">
        <button>One</button>
        <NavigableGroup navigationDirection="horizontal" getItemKey={byText} ariaLabel="Inner">
          <button>Inner A</button>
          <button>Inner B</button>
        </NavigableGroup>
        <button>Two</button>
      </NavigableGroup>
    );
    expect(button('Inner A')).toHaveAttribute('tabindex', '0');
    act(() => button('One').focus());
    press('ArrowRight');
    expect(focused()).toBe('Two');
    act(() => button('Inner A').focus());
    press('ArrowRight');
    expect(focused()).toBe('Inner B');
    press('ArrowRight');
    expect(focused()).toBe('Inner B');
  });

  test('keeps items its author took out of the tab order out of the group', () => {
    render(
      <NavigableGroup navigationDirection="horizontal" getItemKey={byText}>
        <button>One</button>
        <button tabIndex={-1}>Hidden helper</button>
        <button>Two</button>
      </NavigableGroup>
    );
    act(() => button('One').focus());
    press('ArrowRight');
    expect(focused()).toBe('Two');
  });

  test('ref.focus() moves focus to the tab stop', () => {
    const ref = React.createRef<NavigableGroupProps.Ref>();
    render(<Toolbar ref={ref} />);
    act(() => button('Copy').focus());
    press('ArrowRight');
    act(() => button('Copy').blur());
    act(() => ref.current!.focus());
    expect(focused()).toBe('Cut');
  });

  test('passes id and data attributes to the root', () => {
    render(<Toolbar id="group" data-testid="group" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'group');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'group');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Toolbar role="toolbar" />);
    await expectNoAxeViolations(container);
  });
});
