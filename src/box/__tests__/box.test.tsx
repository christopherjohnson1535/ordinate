// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Box, { BoxProps } from '../../../lib/components/box';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/box/styles.css.js';

function renderBox(props: BoxProps = {}) {
  render(<Box {...props}>Content</Box>);
  return createWrapper().findBox()!.getElement();
}

describe('Box', () => {
  test('renders a div by default', () => {
    expect(renderBox().tagName).toBe('DIV');
  });

  test.each<BoxProps.Variant>([
    'div',
    'span',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'p',
    'strong',
    'small',
    'code',
    'pre',
    'samp',
  ])('renders the %s variant as that element', variant => {
    expect(renderBox({ variant }).tagName).toBe(variant.toUpperCase());
  });

  test.each<[BoxProps.Variant, string]>([
    ['key-label', 'DIV'],
    ['value-large', 'SPAN'],
    ['inline-code', 'CODE'],
  ])('renders the %s variant as a %s', (variant, tagName) => {
    expect(renderBox({ variant }).tagName).toBe(tagName);
  });

  test('tagOverride changes the element and keeps the variant style', () => {
    const element = renderBox({ variant: 'h2', tagOverride: 'div' });
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass(styles['variant-h2']);
  });

  test('a heading variant is a heading', () => {
    renderBox({ variant: 'h3' });
    expect(screen.getByRole('heading', { level: 3, name: 'Content' })).toBeInTheDocument();
  });

  test.each<[keyof BoxProps, string, string]>([
    ['fontSize', 'heading-l', 'font-size-heading-l'],
    ['fontWeight', 'heavy', 'font-weight-heavy'],
    ['color', 'text-status-error', 'color-text-status-error'],
    ['display', 'inline-block', 'display-inline-block'],
    ['textAlign', 'center', 'text-align-center'],
    ['float', 'right', 'float-right'],
  ])('applies %s', (prop, value, className) => {
    expect(renderBox({ [prop]: value })).toHaveClass(styles[className]);
  });

  test.each(['margin', 'padding'] as const)('applies a single %s size to all sides', property => {
    expect(renderBox({ [property]: 'l' })).toHaveClass(styles[`${property}-l`]);
  });

  test.each(['margin', 'padding'] as const)('applies %s per side', property => {
    const element = renderBox({ [property]: { top: 'n', horizontal: 'xs', left: 'xxl' } });
    expect(element).toHaveClass(
      styles[`${property}-top-n`],
      styles[`${property}-horizontal-xs`],
      styles[`${property}-left-xxl`]
    );
  });

  test('passes id and data attributes and drops className and style', () => {
    const props = { id: 'note', 'data-testid': 'note', className: 'custom', style: { color: 'red' } } as BoxProps;
    const element = renderBox(props);
    expect(element).toHaveAttribute('id', 'note');
    expect(element).toHaveAttribute('data-testid', 'note');
    expect(element).not.toHaveClass('custom');
    expect(element).not.toHaveAttribute('style');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Box variant="h1">Project overview</Box>
        <Box variant="p" color="text-body-secondary">
          Last deployed <Box variant="inline-code">v2.4.1</Box> to <Box variant="strong">production</Box>.
        </Box>
        <Box variant="key-label">Nodes</Box>
        <Box variant="value-large">12</Box>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
