// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Button, { ButtonProps } from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/button/styles.css.js';

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

describe('Button loading', () => {
  test('shows an indicator, stays focusable and ignores clicks', () => {
    const onClick = vi.fn();
    render(
      <Button loading={true} onClick={onClick}>
        Save changes
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    button.focus();
    expect(button).toHaveFocus();
  });

  test('a loading submit button does not submit its form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button loading={true}>Save changes</Button>
      </form>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('announces loadingText in a live region only while loading', () => {
    const { rerender } = render(<Button loadingText="Saving changes">Save changes</Button>);
    const region = document.querySelector('[aria-live="polite"]')!;
    expect(region).toHaveTextContent('');
    rerender(
      <Button loading={true} loadingText="Saving changes">
        Save changes
      </Button>
    );
    expect(region).toHaveTextContent('Saving changes');
  });

  test('a loading link loses its href and stays in the tab order', () => {
    render(
      <Button href="/logs" loading={true}>
        View log
      </Button>
    );
    const link = screen.getByRole('link', { name: 'View log' });
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '0');
  });
});

describe('Button icons', () => {
  test.each(['left', 'right'] as const)('places a built-in icon on the %s', iconAlign => {
    render(
      <Button iconName="add" iconAlign={iconAlign}>
        Add service
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Add service' });
    const children = Array.from(button.children);
    const iconIndex = children.findIndex(child => child.querySelector('svg'));
    expect(iconIndex).toBe(iconAlign === 'left' ? 0 : children.length - 1);
  });

  test('the icon variant renders a built-in icon', () => {
    render(<Button variant="icon" iconName="edit" ariaLabel="Edit project" />);
    const button = screen.getByRole('button', { name: 'Edit project' });
    expect(button.querySelector('svg')).not.toBeNull();
  });

  test('the loading indicator replaces the icon', () => {
    render(
      <Button iconName="add" loading={true}>
        Add service
      </Button>
    );
    const button = createWrapper().findButton()!;
    expect(button.findLoadingIndicator()).not.toBeNull();
    expect(button.findIcon()).toBeNull();
  });
});

describe('Button links', () => {
  test('external links open in a new tab with a safe rel and say so', () => {
    render(
      <Button href="https://example.com/docs" external={true}>
        Read the docs
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Read the docs Opens in a new tab' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('externalIconAriaLabel changes what screen readers hear', () => {
    render(
      <Button href="https://example.com/docs" external={true} externalIconAriaLabel="Neues Fenster">
        Dokumentation
      </Button>
    );
    expect(screen.getByRole('link', { name: 'Dokumentation Neues Fenster' })).toBeInTheDocument();
  });

  test('rel and target can be set', () => {
    render(
      <Button href="/report" target="_blank" rel="noopener">
        Open report
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  test('download is passed to the link', () => {
    const { rerender } = render(
      <Button href="/export.csv" download="nodes.csv">
        Download
      </Button>
    );
    expect(screen.getByRole('link')).toHaveAttribute('download', 'nodes.csv');
    rerender(
      <Button href="/export.csv" download={true}>
        Download
      </Button>
    );
    expect(screen.getByRole('link')).toHaveAttribute('download');
  });
});

describe('Button leader', () => {
  const findButton = () => createWrapper().findButton()!;

  test('a link within the application ends in a leader hidden from screen readers', () => {
    render(<Button href="/billing">Open billing</Button>);
    const leader = findButton().findLeader();
    expect(leader).not.toBeNull();
    expect(leader!.getElement()).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link')).toHaveAccessibleName('Open billing');
  });

  test.each<[string, Partial<ButtonProps>]>([
    ['without href', {}],
    ['with an icon', { href: '/billing', iconName: 'add' }],
    ['in a new tab', { href: '/billing', target: '_blank' }],
    ['to another site', { href: 'https://example.com', external: true }],
  ])('has no leader %s', (_, props) => {
    render(<Button {...props}>Open billing</Button>);
    expect(findButton().findLeader()).toBeNull();
  });

  test('the icon variant has no leader', () => {
    render(<Button variant="icon" href="/billing" iconName="copy" ariaLabel="Open billing" />);
    expect(findButton().findLeader()).toBeNull();
  });

  test('an external link carries the diagonal leader with its label', () => {
    render(
      <Button href="https://example.com" external={true}>
        Read the docs
      </Button>
    );
    expect(findButton().findExternalIcon()).not.toBeNull();
    expect(screen.getByRole('img', { name: 'Opens in a new tab' })).toBeInTheDocument();
  });
});

describe('Button attributes', () => {
  test('form associates the button with a form elsewhere on the page', () => {
    render(
      <>
        <form id="create-project" />
        <Button form="create-project">Create</Button>
      </>
    );
    expect(screen.getByRole('button')).toHaveAttribute('form', 'create-project');
  });

  test('maps the aria props to attributes', () => {
    render(
      <>
        <Button ariaExpanded={false} ariaHaspopup="menu" ariaControls="actions-menu">
          Actions
        </Button>
        <ul id="actions-menu" />
      </>
    );
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-controls', 'actions-menu');
  });

  test('wrapText={false} keeps the text on one line', () => {
    const { rerender } = render(<Button>Save changes</Button>);
    expect(screen.getByRole('button')).not.toHaveClass(styles['no-wrap']);
    rerender(<Button wrapText={false}>Save changes</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles['no-wrap']);
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

  test('the wrapper finds the text, icons and loading state', () => {
    render(
      <>
        <Button iconName="add">Add service</Button>
        <Button href="https://example.com" external={true}>
          Docs
        </Button>
        <Button loading={true}>Saving</Button>
      </>
    );
    const [withIcon, external, loading] = createWrapper().findAllButtons();
    expect(withIcon.findTextRegion()!.getText()).toBe('Add service');
    expect(withIcon.findIcon()).not.toBeNull();
    expect(withIcon.isLoading()).toBe(false);
    expect(external.findExternalIcon()).not.toBeNull();
    expect(loading.isLoading()).toBe(true);
    expect(loading.isDisabled()).toBe(true);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Button iconName="add">Add service</Button>
        <Button iconName="open-outside" iconAlign="right">
          Open
        </Button>
        <Button loading={true} loadingText="Saving">
          Save
        </Button>
        <Button href="/logs" loading={true}>
          Loading link
        </Button>
        <Button href="https://example.com" external={true}>
          Docs
        </Button>
        <Button ariaExpanded={true} ariaControls="panel">
          Details
        </Button>
        <div id="panel" />
        <Button variant="icon" iconName="edit" ariaLabel="Edit" />
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
