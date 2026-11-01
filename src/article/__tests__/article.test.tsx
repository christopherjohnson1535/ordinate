// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Article, { ArticleProps } from '../../../lib/components/article';
import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/article/styles.css.js';

const wrapper = () => createWrapper().findArticle()!;

function Story() {
  return (
    <>
      <p>
        Every miller on the river once knew the sound. <a href="#film">We filmed it</a>.
      </p>
      <h2>Why grind slowly</h2>
      <ul>
        <li>a stone mills about 40 kilos an hour</li>
      </ul>
      <blockquote>
        <p>You can taste the difference.</p>
      </blockquote>
      <figure>
        <img src="mill.png" alt="The mill house" />
        <figcaption>The mill in 1887.</figcaption>
      </figure>
    </>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Article', () => {
  test('renders the lead, the byline and the text in reading order', () => {
    render(
      <Article lead="Six bakers explain." byline="By Tom Lindqvist">
        <Story />
      </Article>
    );
    expect(wrapper().findLead()!.getText()).toBe('Six bakers explain.');
    expect(wrapper().findByline()!.getText()).toBe('By Tom Lindqvist');
    const text = wrapper().getElement().textContent!;
    expect(text.indexOf('Six bakers')).toBeLessThan(text.indexOf('By Tom'));
    expect(text.indexOf('By Tom')).toBeLessThan(text.indexOf('Every miller'));
    expect(wrapper().findContent().getText()).toContain('Why grind slowly');
  });

  test('keeps the content as written: headings, links, lists, quotes and figures', () => {
    render(
      <Article>
        <Story />
      </Article>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Why grind slowly' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'We filmed it' })).toHaveAttribute('href', '#film');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('The mill in 1887.').closest('figure')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'The mill house' })).toBeInTheDocument();
  });

  test('leaves out the lead and byline when not given', () => {
    render(<Article>Text</Article>);
    expect(wrapper().findLead()).toBeNull();
    expect(wrapper().findByline()).toBeNull();
  });

  test('the drop cap keeps the first letter in the text', () => {
    render(
      <Article dropCap={true}>
        <Story />
      </Article>
    );
    expect(wrapper().getElement()).toHaveClass(styles['drop-cap']);
    expect(screen.getByText(/^Every miller/)).toHaveTextContent(/^Every miller on the river/);
  });

  test.each<[ArticleProps.Measure, ArticleProps.Columns]>([
    ['narrow', 2],
    ['default', 1],
    ['wide', 1],
  ])('sets the %s measure in %i column(s)', (measure, columns) => {
    render(
      <Article measure={measure} columns={columns}>
        Text
      </Article>
    );
    expect(wrapper().getElement()).toHaveClass(styles[`measure-${measure}`]);
    expect(wrapper().getElement().classList.contains(styles['columns-2'])).toBe(columns === 2);
  });

  test('falls back to one column and warns for an unsupported count', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Article columns={3 as ArticleProps.Columns}>Text</Article>);
    expect(wrapper().getElement()).not.toHaveClass(styles['columns-2']);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('columns'));
  });

  test('other components inside keep working, and keyboard focus reaches them in order', () => {
    const onClick = vi.fn();
    render(
      <Article byline={<a href="#author">Tom Lindqvist</a>}>
        <p>
          Read the <a href="#more">rest</a>.
        </p>
        <Button onClick={onClick}>Subscribe</Button>
      </Article>
    );
    const focusable = Array.from(wrapper().getElement().querySelectorAll<HTMLElement>('a, button'));
    expect(focusable.map(element => element.textContent)).toEqual(['Tom Lindqvist', 'rest', 'Subscribe']);
    screen.getByRole('button', { name: 'Subscribe' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('passes id and data attributes to the root', () => {
    render(
      <Article id="story" data-testid="story">
        Text
      </Article>
    );
    expect(wrapper().getElement()).toHaveAttribute('id', 'story');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'story');
  });

  test('has no axe violations', async () => {
    const { container } = render(
      <Article lead="Six bakers explain." byline="By Tom Lindqvist" dropCap={true} columns={2}>
        <Story />
      </Article>
    );
    await expectNoAxeViolations(container);
  });
});
