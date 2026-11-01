// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import createWrapper from '../../../lib/components/test-utils/dom';
import TruncatedText from '../../../lib/components/truncated-text';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const text = 'arn:aws:s3:::example-bucket-with-a-very-long-name/logs/2026/10/31';

// jsdom does no layout, so the text box reports the sizes a browser would.
function mockSizes({ scrollWidth = 100, clientWidth = 100, scrollHeight = 20, clientHeight = 20 }) {
  const sizes = { scrollWidth, clientWidth, scrollHeight, clientHeight };
  for (const [name, value] of Object.entries(sizes)) {
    Object.defineProperty(HTMLElement.prototype, name, { configurable: true, get: () => value });
  }
}

function resetSizes() {
  for (const name of ['scrollWidth', 'clientWidth', 'scrollHeight', 'clientHeight']) {
    Reflect.deleteProperty(HTMLElement.prototype, name);
  }
}

const wrapper = () => createWrapper().findTruncatedText()!;

describe('TruncatedText', () => {
  beforeEach(() => vi.useFakeTimers());

  afterEach(() => {
    vi.useRealTimers();
    resetSizes();
  });

  test('renders the text with no tooltip or tab stop when it fits', () => {
    mockSizes({});
    render(<TruncatedText>{text}</TruncatedText>);
    expect(wrapper().findText().getElement()).not.toHaveAttribute('tabindex');
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('');
    expect(wrapper().isTruncated()).toBe(false);
    fireEvent.mouseEnter(wrapper().findTooltip()!.getElement());
    act(() => vi.advanceTimersByTime(500));
    expect(wrapper().findTooltip()!.isVisible()).toBe(false);
  });

  test('shows the full text in a tooltip on hover when it is cut', () => {
    mockSizes({ scrollWidth: 300 });
    render(<TruncatedText>{text}</TruncatedText>);
    expect(wrapper().isTruncated()).toBe(true);
    fireEvent.mouseEnter(wrapper().findTooltip()!.getElement());
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent(text);
    expect(wrapper().findTooltip()!.isVisible()).toBe(true);
  });

  test('cut text takes a tab stop, and focus shows the tooltip until Escape', () => {
    mockSizes({ scrollWidth: 300 });
    render(<TruncatedText>{text}</TruncatedText>);
    const textElement = wrapper().findText().getElement();
    expect(textElement).toHaveAttribute('tabindex', '0');
    act(() => textElement.focus());
    expect(wrapper().findTooltip()!.isVisible()).toBe(true);
    fireEvent.keyDown(textElement, { key: 'Escape' });
    expect(wrapper().findTooltip()!.isVisible()).toBe(false);
  });

  test('clamps to several lines and measures the height', () => {
    mockSizes({ scrollHeight: 80, clientHeight: 40 });
    render(<TruncatedText lines={2}>{text}</TruncatedText>);
    const textElement = wrapper().findText().getElement();
    expect(textElement.style.webkitLineClamp).toBe('2');
    expect(wrapper().isTruncated()).toBe(true);
  });

  test('ignores a pixel of rounding in the height', () => {
    mockSizes({ scrollHeight: 41, clientHeight: 40 });
    render(<TruncatedText lines={2}>{text}</TruncatedText>);
    expect(wrapper().isTruncated()).toBe(false);
  });

  test('measures again when the text changes', () => {
    mockSizes({});
    const { rerender } = render(<TruncatedText>Short</TruncatedText>);
    expect(wrapper().isTruncated()).toBe(false);
    mockSizes({ scrollWidth: 300 });
    rerender(<TruncatedText>{text}</TruncatedText>);
    expect(wrapper().isTruncated()).toBe(true);
  });

  test('measures again when the window resizes', () => {
    mockSizes({});
    render(<TruncatedText>{text}</TruncatedText>);
    mockSizes({ scrollWidth: 300 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(wrapper().isTruncated()).toBe(true);
  });

  test('warns about a line count that is not a whole number', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<TruncatedText lines={0}>{text}</TruncatedText>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('lines'));
    warn.mockRestore();
  });

  test('passes id and data attributes to the root', () => {
    render(
      <TruncatedText id="path" data-testid="path">
        {text}
      </TruncatedText>
    );
    expect(wrapper().getElement()).toHaveAttribute('id', 'path');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'path');
  });

  test('has no accessibility violations, cut or not', async () => {
    vi.useRealTimers();
    mockSizes({ scrollWidth: 300 });
    const { container } = render(
      <div>
        <TruncatedText>{text}</TruncatedText>
        <TruncatedText lines={3}>{text}</TruncatedText>
      </div>
    );
    await expectNoAxeViolations(container);
  });
});
