// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import CodeView, { CodeViewProps } from '../../../lib/components/code-view';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const yaml = `apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3 # three copies
`;

const codeView = () => createWrapper().findCodeView()!;

describe('CodeView', () => {
  test('shows one numbered line per line of code, ignoring a final newline', () => {
    render(<CodeView content={yaml} />);
    expect(codeView().findLines()).toHaveLength(4);
    expect(
      codeView()
        .findLineNumbers()
        .map(n => n.getText())
    ).toEqual(['1', '2', '3', '4']);
    expect(codeView().findLineContent(4)!.getText()).toBe('  replicas: 3 # three copies');
  });

  test('hides line numbers from screen readers, and can leave them out', () => {
    const { rerender } = render(<CodeView content={yaml} />);
    expect(codeView().findLineNumbers()[0].getElement()).toHaveAttribute('aria-hidden', 'true');
    rerender(<CodeView content={yaml} lineNumbers={false} />);
    expect(codeView().findLineNumbers()).toHaveLength(0);
  });

  test('marks highlighted lines and shows notes at the end of a line', () => {
    render(<CodeView content={yaml} highlightedLines={[2, 4]} lineNotes={[{ line: 4, text: 'was 1' }]} />);
    expect(
      codeView()
        .findHighlightedLines()
        .map(l => l.getElement().dataset.line)
    ).toEqual(['2', '4']);
    expect(
      codeView()
        .findLineNotes()
        .map(n => n.getText())
    ).toEqual(['was 1']);
    expect(codeView().findLine(4)!.getText()).toContain('was 1');
    expect(codeView().findLineContent(4)!.getText()).not.toContain('was 1');
  });

  test('colors the code once the language has loaded', async () => {
    render(<CodeView content={yaml} language="yaml" />);
    await waitFor(() => expect(codeView().findLineContent(1)!.findAll('span').length).toBeGreaterThan(0));
    const kinds = (line: number) =>
      codeView()
        .findLineContent(line)!
        .findAll('span')
        .map(span => [span.getText(), span.getElement().className.match(/token-([a-z]+)/)?.[1]]);
    expect(kinds(2)).toContainEqual(['kind', 'property']);
    expect(kinds(2)).toContainEqual(['Deployment', 'string']);
    expect(kinds(4)).toContainEqual(['3', 'number']);
    expect(kinds(4)).toContainEqual(['# three copies', 'comment']);
    // The text never changes, only how it is split into colored runs.
    expect(codeView().findLineContent(4)!.getText()).toBe('  replicas: 3 # three copies');
  });

  test('is a named, focusable region when it has a label', () => {
    render(<CodeView content={yaml} ariaLabel="deployment.yaml" />);
    const region = screen.getByRole('region', { name: 'deployment.yaml' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveAttribute('dir', 'ltr');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'code', 'data-testid': 'code', className: 'custom', content: 'a' } as CodeViewProps;
    render(<CodeView {...props} />);
    const root = screen.getByTestId('code');
    expect(root).toHaveAttribute('id', 'code');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <CodeView content={yaml} language="yaml" ariaLabel="deployment.yaml" highlightedLines={[4]} />
    );
    await expectNoAxeViolations(container);
  });
});
