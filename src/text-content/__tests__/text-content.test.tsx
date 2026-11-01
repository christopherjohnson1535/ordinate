// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import TextContent, { TextContentProps } from '../../../lib/components/text-content';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const article = (
  <>
    <h1>Rotating access keys</h1>
    <p>
      Rotate keys every <strong>90 days</strong>. Run <code>ord keys rotate</code> or read the{' '}
      <a href="#policy">key policy</a>.
    </p>
    <h2>Steps</h2>
    <ol>
      <li>Create a second key.</li>
      <li>
        Update every client.
        <ul>
          <li>Build agents</li>
        </ul>
      </li>
    </ol>
    <pre>ord keys list --user deploy</pre>
    <blockquote>
      <p>Never share keys between environments.</p>
    </blockquote>
    <hr />
    <small>Last reviewed in October.</small>
  </>
);

describe('TextContent', () => {
  test('renders the HTML it is given unchanged', () => {
    render(<TextContent>{article}</TextContent>);
    expect(screen.getByRole('heading', { level: 1, name: 'Rotating access keys' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Steps' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'key policy' })).toHaveAttribute('href', '#policy');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('adds no classes to the children', () => {
    render(<TextContent>{article}</TextContent>);
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveAttribute('class');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'guide', 'data-testid': 'text', className: 'custom' } as TextContentProps;
    render(<TextContent {...props}>Text</TextContent>);
    const root = screen.getByTestId('text');
    expect(root).toHaveAttribute('id', 'guide');
    expect(root).not.toHaveClass('custom');
  });
});

describe('TextContent test utilities and accessibility', () => {
  test('the wrapper finds the content', () => {
    render(<TextContent>{article}</TextContent>);
    expect(createWrapper().findTextContent()!.find('h1')!.getText()).toBe('Rotating access keys');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<TextContent>{article}</TextContent>);
    await expectNoAxeViolations(container);
  });
});
