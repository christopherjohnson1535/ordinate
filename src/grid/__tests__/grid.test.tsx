// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Grid, { GridProps } from '../../../lib/components/grid';
import { breakpointMinWidths } from '../../../lib/components/internal/breakpoints';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/grid/styles.css.js';

afterEach(() => vi.restoreAllMocks());

function renderGrid(gridDefinition: ReadonlyArray<GridProps.ElementDefinition>, props: Partial<GridProps> = {}) {
  render(
    <Grid gridDefinition={gridDefinition} {...props}>
      {gridDefinition.map((_, index) => (
        <div key={index}>Item {index + 1}</div>
      ))}
    </Grid>
  );
  return createWrapper().findGrid()!;
}

const property = (element: HTMLElement, name: string) => element.style.getPropertyValue(name);

describe('Grid', () => {
  test('a child without a definition spans the full row', () => {
    render(
      <Grid>
        <div>One</div>
        <div>Two</div>
      </Grid>
    );
    const [first, second] = createWrapper().findGrid()!.findColumns();
    expect(property(first.getElement(), '--grid-column-default')).toBe('1 / span 12');
    expect(property(second.getElement(), '--grid-row-default')).toBe('2');
  });

  test('places children side by side and wraps the one that does not fit', () => {
    const columns = renderGrid([{ colspan: 4 }, { colspan: 8 }, { colspan: 6 }]).findColumns();
    expect(columns.map(column => property(column.getElement(), '--grid-column-default'))).toEqual([
      '1 / span 4',
      '5 / span 8',
      '1 / span 6',
    ]);
    expect(columns.map(column => property(column.getElement(), '--grid-row-default'))).toEqual(['1', '1', '2']);
  });

  test('leaves offset columns empty before a child', () => {
    const [first, second] = renderGrid([{ colspan: 4, offset: 2 }, { colspan: 4 }]).findColumns();
    expect(property(first.getElement(), '--grid-column-default')).toBe('3 / span 4');
    expect(property(second.getElement(), '--grid-column-default')).toBe('7 / span 4');
  });

  test('push and pull swap children visually without moving the others', () => {
    const [first, second] = renderGrid([
      { colspan: 4, push: 8 },
      { colspan: 8, pull: 4 },
    ]).findColumns();
    expect(property(first.getElement(), '--grid-column-default')).toBe('9 / span 4');
    expect(property(second.getElement(), '--grid-column-default')).toBe('1 / span 8');
    expect(property(second.getElement(), '--grid-row-default')).toBe('1');
  });

  test('sets a property only at the breakpoints where the placement changes', () => {
    const [first] = renderGrid([{ colspan: { default: 12, xs: 6, l: 3 } }, { colspan: { default: 12, xs: 6 } }])
      .findColumns()
      .map(column => column.getElement());
    expect(property(first, '--grid-column-default')).toBe('1 / span 12');
    expect(property(first, '--grid-column-xxs')).toBe('');
    expect(property(first, '--grid-column-xs')).toBe('1 / span 6');
    expect(property(first, '--grid-column-l')).toBe('1 / span 3');
    expect(property(first, '--grid-row-xs')).toBe('');
  });

  test('a breakpoint without a value inherits from the next smaller one', () => {
    const [, second] = renderGrid([{ colspan: { xxs: 6 } }, { colspan: { xxs: 6 } }])
      .findColumns()
      .map(column => column.getElement());
    expect(property(second, '--grid-row-default')).toBe('2');
    expect(property(second, '--grid-column-xxs')).toBe('7 / span 6');
    expect(property(second, '--grid-row-xxs')).toBe('1');
  });

  test('warns when the definitions and the children do not match', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Grid gridDefinition={[{ colspan: 6 }]}>
        <div>One</div>
        <div>Two</div>
      </Grid>
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('one entry per child'));
  });

  test('disableGutters removes the gutters', () => {
    const grid = renderGrid([{ colspan: 6 }, { colspan: 6 }], { disableGutters: true });
    expect(grid.findByClassName(styles.grid)!.getElement()).not.toHaveClass(styles.gutters);
  });

  test('passes id and data attributes', () => {
    render(
      <Grid id="dashboard" data-testid="dashboard">
        <div>One</div>
      </Grid>
    );
    expect(screen.getByTestId('dashboard')).toHaveAttribute('id', 'dashboard');
  });

  test('the container queries use the shared breakpoints', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../../lib/components/grid/styles.scoped.css'), 'utf8');
    const widths = [...css.matchAll(/@container \(min-inline-size: (\d+)px\)/g)].map(match => Number(match[1]));
    expect(widths).toEqual(Object.values(breakpointMinWidths).slice(1));
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }]}>
        <p>Main</p>
        <p>Aside</p>
      </Grid>
    );
    await expectNoAxeViolations(container);
  });
});
