// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Button, { ButtonProps } from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Button', () => {
  test('renders a submit button by default', () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toHaveAttribute('type', 'submit');
  });

  test('renders type="button" when formAction is none', () => {
    render(<Button formAction="none">Preview</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  test('fires onClick with the click detail', () => {
    const onClick = vi.fn();
    render(<Button onClick={event => onClick(event.detail)}>Deploy</Button>);
    fireEvent.click(screen.getByRole('button'), { shiftKey: true });
    expect(onClick).toHaveBeenCalledWith({ button: 0, ctrlKey: false, shiftKey: true, altKey: false, metaKey: false });
  });

  test('does not fire onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled={true} onClick={onClick}>
        Deploy
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('renders a link when href is set', () => {
    render(<Button href="/logs">View log</Button>);
    expect(screen.getByRole('link', { name: 'View log' })).toHaveAttribute('href', '/logs');
  });

  test('a disabled link loses its href and is marked disabled', () => {
    render(
      <Button href="/logs" disabled={true}>
        View log
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  test('preventDefault in onClick stops link navigation', () => {
    render(
      <Button href="/logs" onClick={event => event.preventDefault()}>
        View log
      </Button>
    );
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link').dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });

  test('icon variant uses ariaLabel as its name', () => {
    render(<Button variant="icon" ariaLabel="Add service" iconSvg={<svg />} />);
    expect(screen.getByRole('button', { name: 'Add service' })).toBeInTheDocument();
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'save', 'data-testid': 'save-button', className: 'custom' } as ButtonProps;
    render(<Button {...props}>Save</Button>);
    const button = screen.getByTestId('save-button');
    expect(button).toHaveAttribute('id', 'save');
    expect(button).not.toHaveClass('custom');
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<ButtonProps.Ref>();
    render(<Button ref={ref}>Save</Button>);
    ref.current?.focus();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});

describe('Button test utilities and accessibility', () => {
  test('the wrapper finds and clicks the button', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Deploy</Button>);
    const button = createWrapper().findButton()!;
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(button.isDisabled()).toBe(false);
  });

  test('the wrapper reports a disabled link', () => {
    render(
      <Button href="/logs" disabled={true}>
        View log
      </Button>
    );
    expect(createWrapper().findButton()!.isDisabled()).toBe(true);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Button>Save</Button>
        <Button variant="primary">Deploy</Button>
        <Button href="/logs">View log</Button>
        <Button disabled={true}>Unavailable</Button>
        <Button variant="icon" ariaLabel="Add service" iconSvg={<svg />} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
