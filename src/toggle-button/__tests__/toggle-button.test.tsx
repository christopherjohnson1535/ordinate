// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import ToggleButton, { ToggleButtonProps } from '../../../lib/components/toggle-button';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled(props: Partial<ToggleButtonProps>) {
  const [pressed, setPressed] = useState(false);
  return (
    <ToggleButton {...props} pressed={pressed} onChange={event => setPressed(event.detail.pressed)}>
      Bold
    </ToggleButton>
  );
}

const iconNames = (container: Element) =>
  Array.from(container.querySelectorAll('svg')).map(svg => svg.parentElement?.innerHTML);

describe('ToggleButton', () => {
  test('renders a button with aria-pressed', () => {
    render(<ToggleButton pressed={true}>Bold</ToggleButton>);
    const button = screen.getByRole('button', { name: 'Bold' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('fires onChange with the next state', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ToggleButton pressed={false} onChange={onChange}>
        Bold
      </ToggleButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onChange.mock.calls[0][0].detail).toEqual({ pressed: true });
    rerender(
      <ToggleButton pressed={true} onChange={onChange}>
        Bold
      </ToggleButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onChange.mock.calls[1][0].detail).toEqual({ pressed: false });
  });

  test('toggles when controlled', () => {
    render(<Controlled />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('does not fire onChange while disabled or loading', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ToggleButton pressed={false} disabled={true} onChange={onChange}>
        Bold
      </ToggleButton>
    );
    fireEvent.click(screen.getByRole('button'));
    rerender(
      <ToggleButton pressed={false} loading={true} onChange={onChange}>
        Bold
      </ToggleButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  test('swaps to the pressed icon while pressed', () => {
    const { container, rerender } = render(
      <ToggleButton pressed={false} variant="icon" iconName="star" pressedIconName="star-filled" ariaLabel="Favorite" />
    );
    const unpressed = iconNames(container);
    rerender(
      <ToggleButton pressed={true} variant="icon" iconName="star" pressedIconName="star-filled" ariaLabel="Favorite" />
    );
    expect(iconNames(container)).not.toEqual(unpressed);
    expect(screen.getByRole('button', { name: 'Favorite' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('keeps iconName while pressed when there is no pressed icon', () => {
    const { container, rerender } = render(<ToggleButton pressed={false} iconName="star" ariaLabel="Favorite" />);
    const unpressed = iconNames(container);
    rerender(<ToggleButton pressed={true} iconName="star" ariaLabel="Favorite" />);
    expect(iconNames(container)).toEqual(unpressed);
  });

  test('focuses the button through the ref', () => {
    const ref = React.createRef<ToggleButtonProps.Ref>();
    render(
      <ToggleButton ref={ref} pressed={false}>
        Bold
      </ToggleButton>
    );
    act(() => ref.current!.focus());
    expect(screen.getByRole('button')).toHaveFocus();
  });

  test('exposes its state through the test-utils wrapper', () => {
    const { container } = render(<Controlled />);
    const wrapper = createWrapper(container).findToggleButton()!;
    expect(wrapper.isPressed()).toBe(false);
    wrapper.click();
    expect(wrapper.isPressed()).toBe(true);
    expect(wrapper.findTextRegion()!.getText()).toBe('Bold');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Controlled />
        <ToggleButton pressed={true} variant="icon" iconName="star" ariaLabel="Favorite" />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
