// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { FloatingPanel, FloatingPanelProps } from '../../../lib/components/internal/components/floating-panel';

// jsdom does no layout, so the trigger's rectangle and the panel's size are stubbed.
const triggerRect = { top: 380, bottom: 420, left: 480, right: 520, width: 40, height: 40, x: 480, y: 380 };

beforeEach(() => {
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
  vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return this.getAttribute('role') === 'tooltip' ? 200 : 16;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return this.getAttribute('role') === 'tooltip' ? 100 : 8;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.style.direction = '';
});

function Example(props: Partial<FloatingPanelProps>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={element => {
          triggerRef.current = element;
          if (element) {
            element.getBoundingClientRect = () => ({ ...triggerRect, toJSON: () => triggerRect }) as DOMRect;
          }
        }}
      >
        Trigger
      </button>
      <FloatingPanel role="tooltip" trigger={triggerRef} preferredSide="top" {...props}>
        Panel
      </FloatingPanel>
    </>
  );
}

describe('FloatingPanel', () => {
  test('places the panel on the preferred side, its arrow depth away from the trigger', () => {
    render(<Example preferredSide="top" gap={4} />);
    const panel = screen.getByRole('tooltip');
    expect(panel.style.top).toBe(`${380 - 8 - 4 - 100}px`);
    expect(panel.style.left).toBe('400px');
  });

  test('flips logical sides in right-to-left layout', () => {
    document.documentElement.style.direction = 'rtl';
    render(<Example preferredSide="right" />);
    expect(screen.getByRole('tooltip').style.left).toBe(`${480 - 8 - 4 - 200}px`);
  });

  test('stays in the document while hidden', () => {
    const { rerender } = render(<Example hidden={true} />);
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    rerender(<Example hidden={false} />);
    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  test('renders into the document body with a portal', () => {
    const { container } = render(<Example renderWithPortal={true} />);
    expect(container.querySelector('[role="tooltip"]')).toBeNull();
    expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull();
  });
});
