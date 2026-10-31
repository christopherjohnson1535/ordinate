// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import SpaceBetween from '../../../lib/components/space-between';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/space-between/styles.css.js';

describe('SpaceBetween', () => {
  test('wraps each child in its own item', () => {
    render(
      <SpaceBetween size="m">
        <span>One</span>
        <span>Two</span>
        Three
      </SpaceBetween>
    );
    const items = createWrapper().findSpaceBetween()!.findItems();
    expect(items.map(item => item.getText())).toEqual(['One', 'Two', 'Three']);
  });

  test('opens fragments and arrays and leaves out empty children', () => {
    const show = false;
    render(
      <SpaceBetween size="s">
        <>
          <span>One</span>
          <span>Two</span>
        </>
        {['Three', 'Four'].map(text => (
          <span key={text}>{text}</span>
        ))}
        {show && <span>Hidden</span>}
        {null}
      </SpaceBetween>
    );
    const items = createWrapper().findSpaceBetween()!.findItems();
    expect(items.map(item => item.getText())).toEqual(['One', 'Two', 'Three', 'Four']);
  });

  test('is vertical by default and applies the size', () => {
    render(<SpaceBetween size="xl">Item</SpaceBetween>);
    expect(createWrapper().findSpaceBetween()!.getElement()).toHaveClass(styles.vertical, styles['size-xl']);
  });

  test('applies direction and alignment', () => {
    render(
      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        Item
      </SpaceBetween>
    );
    expect(createWrapper().findSpaceBetween()!.getElement()).toHaveClass(styles.horizontal, styles['align-center']);
  });

  test('nested layouts are found separately', () => {
    render(
      <SpaceBetween size="l">
        <SpaceBetween size="xs" direction="horizontal">
          <span>A</span>
          <span>B</span>
        </SpaceBetween>
        <span>C</span>
      </SpaceBetween>
    );
    const [outer, inner] = createWrapper().findAllSpaceBetweens();
    expect(outer.findItems()).toHaveLength(2);
    expect(inner.findItems()).toHaveLength(2);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <SpaceBetween size="s" direction="horizontal">
        <button>Cancel</button>
        <button>Save</button>
      </SpaceBetween>
    );
    await expectNoAxeViolations(container);
  });
});
