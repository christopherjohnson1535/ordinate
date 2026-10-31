// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Divider from '../../../lib/components/divider';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Divider', () => {
  test('renders a horizontal rule by default', () => {
    render(<Divider />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('HR');
    expect(separator).not.toHaveAttribute('aria-orientation');
    expect(createWrapper().findDivider()!.findLabel()).toBeNull();
  });

  test('marks a vertical divider as vertical', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('a label names the separator', () => {
    render(<Divider>Or</Divider>);
    expect(screen.getByRole('separator', { name: 'Or' })).toBeInTheDocument();
    expect(createWrapper().findDivider()!.findLabel()!.getText()).toBe('Or');
  });

  test('a vertical divider ignores the label and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Divider orientation="vertical">Or</Divider>);
    expect(screen.getByRole('separator').tagName).toBe('HR');
    expect(screen.queryByText('Or')).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test('passes id and data attributes', () => {
    render(<Divider id="split" data-testid="split" />);
    expect(screen.getByTestId('split')).toHaveAttribute('id', 'split');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Divider />
        <Divider>Or</Divider>
        <div style={{ display: 'flex' }}>
          <span>One</span>
          <Divider orientation="vertical" />
          <span>Two</span>
        </div>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
