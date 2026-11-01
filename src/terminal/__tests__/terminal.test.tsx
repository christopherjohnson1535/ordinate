// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Terminal, { TerminalProps } from '../../../lib/components/terminal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const lines: TerminalProps.Line[] = [
  { text: '$ kubectl get pods', type: 'command' },
  { text: 'NAME        READY   STATUS', type: 'header' },
  { text: 'web-2x4kp   1/1     Running' },
  { text: 'web-7fqzn   0/1     ContainerCreating', highlighted: true },
  { text: '' },
  { text: 'PASS  three replicas', type: 'success' },
  { text: 'FAIL  the service has no endpoints', type: 'error' },
  { text: 'Checks run against your current context.', type: 'muted' },
];

const terminal = () => createWrapper().findTerminal()!;

describe('Terminal', () => {
  test('shows every line in order, as given', () => {
    render(<Terminal lines={lines} />);
    expect(terminal().findLines()).toHaveLength(lines.length);
    expect(terminal().findLines()[0].getText()).toBe('$ kubectl get pods\n');
    expect(terminal().getElement().tagName).toBe('PRE');
  });

  test('sets each line type, defaulting to output', () => {
    render(<Terminal lines={lines} />);
    expect(terminal().findLinesOfType('command')).toHaveLength(1);
    expect(terminal().findLinesOfType('output')).toHaveLength(3);
    expect(terminal().findLinesOfType('success')[0].getText()).toContain('PASS');
    expect(terminal().findLinesOfType('error')[0].getText()).toContain('FAIL');
    expect(
      terminal()
        .findHighlightedLines()
        .map(l => l.getText())
    ).toEqual(['web-7fqzn   0/1     ContainerCreating\n']);
  });

  test('keeps an empty line one line tall', () => {
    render(<Terminal lines={[{ text: '' }]} />);
    expect(terminal().findLines()[0].getText()).toBe(' \n');
  });

  test('is a named, focusable region when it has a label', () => {
    render(<Terminal lines={lines} ariaLabel="Output" />);
    expect(screen.getByRole('region', { name: 'Output' })).toHaveAttribute('tabindex', '0');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 't', 'data-testid': 'terminal', className: 'custom', lines } as TerminalProps;
    render(<Terminal {...props} />);
    const root = screen.getByTestId('terminal');
    expect(root).toHaveAttribute('id', 't');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Terminal lines={lines} ariaLabel="Output of the check" />);
    await expectNoAxeViolations(container);
  });
});
