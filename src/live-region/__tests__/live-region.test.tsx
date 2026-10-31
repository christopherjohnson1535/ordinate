// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import LiveRegion, { LiveRegionProps } from '../../../lib/components/live-region';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function getAnnouncer() {
  return document.querySelector('[aria-live]') as HTMLElement;
}

function waitForAnnouncement() {
  act(() => {
    vi.runAllTimers();
  });
}

describe('LiveRegion', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('announces politely by default', () => {
    render(<LiveRegion>3 results</LiveRegion>);
    expect(getAnnouncer()).toHaveAttribute('aria-live', 'polite');
    expect(getAnnouncer()).toHaveAttribute('aria-atomic', 'true');
  });

  test('announces assertively when asked', () => {
    render(<LiveRegion assertive={true}>Save failed</LiveRegion>);
    expect(getAnnouncer()).toHaveAttribute('aria-live', 'assertive');
  });

  test('announces the content after it mounts', () => {
    render(<LiveRegion>3 results</LiveRegion>);
    expect(getAnnouncer()).toHaveTextContent('');
    waitForAnnouncement();
    expect(getAnnouncer()).toHaveTextContent('3 results');
  });

  test('announces again when the text changes', () => {
    const { rerender } = render(<LiveRegion>3 results</LiveRegion>);
    waitForAnnouncement();
    rerender(<LiveRegion>5 results</LiveRegion>);
    waitForAnnouncement();
    expect(getAnnouncer()).toHaveTextContent('5 results');
  });

  test('combines quick changes into one announcement', () => {
    const { rerender } = render(<LiveRegion>1 result</LiveRegion>);
    rerender(<LiveRegion>2 results</LiveRegion>);
    rerender(<LiveRegion>4 results</LiveRegion>);
    waitForAnnouncement();
    expect(getAnnouncer()).toHaveTextContent('4 results');
  });

  test('announces in strict mode', () => {
    render(
      <React.StrictMode>
        <LiveRegion>Ready</LiveRegion>
      </React.StrictMode>
    );
    waitForAnnouncement();
    expect(getAnnouncer()).toHaveTextContent('Ready');
  });

  test('skips hidden elements and reads image labels', () => {
    render(
      <LiveRegion>
        <span role="img" aria-label="Error" />
        <span aria-hidden="true">!</span>
        Upload failed
      </LiveRegion>
    );
    waitForAnnouncement();
    expect(getAnnouncer().textContent).toBe('Error Upload failed');
  });

  test('hidden content is not visible but is still announced', () => {
    render(<LiveRegion hidden={true}>Filter applied</LiveRegion>);
    expect(screen.getByText('Filter applied')).not.toBeVisible();
    waitForAnnouncement();
    expect(getAnnouncer()).toHaveTextContent('Filter applied');
  });

  test('uses the tag name for the wrapper', () => {
    render(
      <p>
        <LiveRegion tagName="span">Saving</LiveRegion>
      </p>
    );
    const wrapper = createWrapper().findLiveRegion()!;
    expect(wrapper.getElement().tagName).toBe('SPAN');
    expect(wrapper.findContent().getElement().tagName).toBe('SPAN');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'status', 'data-testid': 'live', className: 'custom' } as LiveRegionProps;
    render(<LiveRegion {...props}>Ready</LiveRegion>);
    const region = screen.getByTestId('live');
    expect(region).toHaveAttribute('id', 'status');
    expect(region).not.toHaveClass('custom');
  });
});

describe('LiveRegion test utilities and accessibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('the wrapper reads the content and the announcement', () => {
    render(<LiveRegion>12 instances running</LiveRegion>);
    waitForAnnouncement();
    const region = createWrapper().findLiveRegion()!;
    expect(region.findContent().getText()).toBe('12 instances running');
    expect(region.getAnnouncement()).toBe('12 instances running');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <LiveRegion>3 results</LiveRegion>
        <LiveRegion hidden={true} assertive={true}>
          Save failed
        </LiveRegion>
      </>
    );
    waitForAnnouncement();
    vi.useRealTimers();
    await expectNoAxeViolations(container);
  });
});
