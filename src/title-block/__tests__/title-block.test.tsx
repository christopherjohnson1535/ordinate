// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import TitleBlock, { TitleBlockProps } from '../../../lib/components/title-block';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: TitleBlockProps.Item[] = [
  { label: 'Project', value: 'North Annex' },
  { label: 'Sheet', value: 'A-02 Services' },
  { label: 'Revision', value: <a href="#revisions">△2</a> },
  { label: 'Checked', value: 'D. Ruiz, 31 Oct 2026' },
];

const wrapper = () => createWrapper().findTitleBlock()!;

describe('TitleBlock', () => {
  test('renders a description list of labels and values in order', () => {
    render(<TitleBlock items={items} />);
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual([
      'Project',
      'Sheet',
      'Revision',
      'Checked',
    ]);
    expect(screen.getAllByRole('definition')[1]).toHaveTextContent('A-02 Services');
    expect(screen.getByRole('link', { name: '△2' })).toHaveAttribute('href', '#revisions');
  });

  test('names the list with ariaLabel or ariaLabelledby', () => {
    const { container, rerender } = render(<TitleBlock items={items} ariaLabel="Sheet details" />);
    expect(container.querySelector('dl')).toHaveAttribute('aria-label', 'Sheet details');
    rerender(
      <>
        <h2 id="sheet">Sheet</h2>
        <TitleBlock items={items} ariaLabelledby="sheet" />
      </>
    );
    expect(container.querySelector('dl')).toHaveAttribute('aria-labelledby', 'sheet');
  });

  test('applies a different class for each column setting', () => {
    const settings: TitleBlockProps.Columns[] = ['auto', 1, 2, 3, 4, 5, 6];
    const { container } = render(
      <>
        {settings.map(columns => (
          <TitleBlock key={columns} items={items} columns={columns} />
        ))}
      </>
    );
    const lists = Array.from(container.querySelectorAll('dl'), list => list.className);
    expect(new Set(lists).size).toBe(settings.length);
  });

  test('defaults to automatic columns', () => {
    const { container } = render(
      <>
        <TitleBlock items={items} />
        <TitleBlock items={items} columns="auto" />
      </>
    );
    const [unset, auto] = Array.from(container.querySelectorAll('dl'), list => list.className);
    expect(unset).toBe(auto);
  });

  test('renders nothing in the list when there are no items', () => {
    render(<TitleBlock items={[]} />);
    expect(screen.queryAllByRole('term')).toHaveLength(0);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'title', 'data-testid': 'title', className: 'custom' } as TitleBlockProps;
    render(<TitleBlock {...props} items={items} />);
    const root = screen.getByTestId('title');
    expect(root).toHaveAttribute('id', 'title');
    expect(root).not.toHaveClass('custom');
  });
});

describe('TitleBlock test utilities and accessibility', () => {
  test('the wrapper reads the cells', () => {
    render(<TitleBlock items={items} />);
    expect(
      wrapper()
        .findItems()
        .map(item => item.findLabel().getText())
    ).toEqual(['Project', 'Sheet', 'Revision', 'Checked']);
    expect(wrapper().findItemByLabel('Checked')!.findValue().getText()).toBe('D. Ruiz, 31 Oct 2026');
    expect(wrapper().findItemByLabel('Drawn')).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<TitleBlock items={items} columns={2} ariaLabel="Sheet details" />);
    await expectNoAxeViolations(container);
  });
});
