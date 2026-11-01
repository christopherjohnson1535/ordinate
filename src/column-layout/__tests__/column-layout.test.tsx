// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import ColumnLayout, { ColumnLayoutProps } from '../../../lib/components/column-layout';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/column-layout/styles.css.js';

// jsdom has no layout, so the measured width comes from this stub.
let layoutWidth = 0;

function stubWidth(width: number) {
  layoutWidth = width;
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains(styles.root) ? layoutWidth : 0;
    },
  });
}

afterEach(() => {
  // Removing the stub uncovers jsdom's own clientWidth on Element.prototype.
  delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
});

function renderLayout(props: ColumnLayoutProps, count = 4) {
  render(
    <ColumnLayout {...props}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>Cell {index + 1}</div>
      ))}
    </ColumnLayout>
  );
  return createWrapper().findAllColumnLayouts().at(-1)!;
}

describe('ColumnLayout', () => {
  test('wraps each child in a cell, in order', () => {
    const layout = renderLayout({ columns: 2 }, 3);
    expect(layout.findItems().map(item => item.getText())).toEqual(['Cell 1', 'Cell 2', 'Cell 3']);
  });

  test('skips empty children', () => {
    render(
      <ColumnLayout columns={2}>
        <div>One</div>
        {null}
        {false}
        <div>Two</div>
      </ColumnLayout>
    );
    expect(createWrapper().findColumnLayout()!.findItems()).toHaveLength(2);
  });

  test('gives each child inside a fragment its own cell', () => {
    render(
      <ColumnLayout columns={3}>
        <>
          <div>One</div>
          <div>Two</div>
        </>
        <div>Three</div>
      </ColumnLayout>
    );
    const items = createWrapper().findColumnLayout()!.findItems();
    expect(items.map(item => item.getText())).toEqual(['One', 'Two', 'Three']);
  });

  test('shows every column before it has been measured', () => {
    expect(renderLayout({ columns: 4 }).getColumnCount()).toBe(4);
  });

  test.each([
    [400, 4, 1],
    [600, 4, 2],
    [600, 3, 2],
    [600, 1, 1],
    [800, 4, 4],
    [800, 3, 3],
  ])('at %ipx with %i columns, shows %i', (width, columns, expected) => {
    stubWidth(width);
    const layout = renderLayout({ columns: columns as ColumnLayoutProps.Columns });
    expect(layout.getColumnCount()).toBe(expected);
  });

  test('fits as many columns as minColumnWidth allows, up to columns', () => {
    stubWidth(700);
    expect(renderLayout({ columns: 4, minColumnWidth: 200, disableGutters: true }).getColumnCount()).toBe(3);
  });

  test('never drops below one column', () => {
    stubWidth(100);
    expect(renderLayout({ columns: 4, minColumnWidth: 300 }).getColumnCount()).toBe(1);
  });

  test('follows the container when it is resized', () => {
    stubWidth(900);
    const layout = renderLayout({ columns: 4 });
    expect(layout.getColumnCount()).toBe(4);
    stubWidth(500);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(layout.getColumnCount()).toBe(2);
  });

  test('marks where each cell sits, so rules stop at the outer edges', () => {
    stubWidth(800);
    const items = renderLayout({ columns: 3, borders: 'all' }, 5).findItems();
    const marked = (name: string) => items.map(item => item.getElement().classList.contains(styles[name]));
    expect(marked('first-in-row')).toEqual([true, false, false, true, false]);
    expect(marked('last-in-row')).toEqual([false, false, true, false, true]);
    expect(marked('first-row')).toEqual([true, true, true, false, false]);
    expect(marked('last-row')).toEqual([false, false, false, true, true]);
  });

  test.each([
    ['none', 'default', []],
    ['vertical', 'default', ['vertical-rules']],
    ['horizontal', 'default', ['horizontal-rules']],
    ['all', 'default', ['vertical-rules', 'horizontal-rules']],
    ['horizontal', 'text-grid', ['vertical-rules']],
  ] as const)('borders %s with the %s variant draws %j', (borders, variant, expected) => {
    const root = renderLayout({ columns: 2, borders, variant }).getElement();
    for (const rule of ['vertical-rules', 'horizontal-rules']) {
      expect(root.classList.contains(styles[rule])).toBe((expected as ReadonlyArray<string>).includes(rule));
    }
  });

  test('disableGutters removes the gutters', () => {
    expect(renderLayout({ columns: 2 }).getElement()).toHaveClass(styles.gutters);
    expect(renderLayout({ columns: 2, disableGutters: true }, 2).getElement()).not.toHaveClass(styles.gutters);
  });

  test('passes id and data attributes', () => {
    render(
      <ColumnLayout id="specs" data-testid="specs">
        <div>One</div>
      </ColumnLayout>
    );
    expect(screen.getByTestId('specs')).toHaveAttribute('id', 'specs');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <ColumnLayout columns={3} variant="text-grid">
        <p>Instance type: m5.large</p>
        <p>Zone: eu-west-1a</p>
        <p>State: running</p>
      </ColumnLayout>
    );
    await expectNoAxeViolations(container);
  });
});
