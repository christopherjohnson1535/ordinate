// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import ErrorBoundary, { ErrorBoundaryProps } from '../../../lib/components/error-boundary';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Broken({ thrown = new Error('Chart data is malformed') }: { thrown?: unknown }): React.ReactNode {
  throw thrown;
}

// React reports caught errors on the console; keep the test output readable.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  test('renders the children when nothing throws, without an element of its own', () => {
    const { container } = render(
      <ErrorBoundary>
        <p>Usage chart</p>
      </ErrorBoundary>
    );
    expect(container.innerHTML).toBe('<p>Usage chart</p>');
    expect(createWrapper().findErrorBoundary()).toBeNull();
  });

  test('shows the fallback when a child throws, and keeps the rest of the page', () => {
    render(
      <>
        <h1>Dashboard</h1>
        <ErrorBoundary>
          <Broken />
        </ErrorBoundary>
      </>
    );
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    const fallback = screen.getByRole('alert');
    expect(fallback).toHaveTextContent('Something went wrong');
    expect(fallback).toHaveTextContent('This part of the page could not be shown.');
    expect(screen.getByRole('button', { name: 'Refresh page' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });

  test('calls onError once with the error, the component stack and the boundary id', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary errorBoundaryId="usage-chart" onError={event => onError(event.detail)}>
        <Broken />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledOnce();
    const detail: ErrorBoundaryProps.ErrorDetail = onError.mock.calls[0][0];
    expect(detail.error.message).toBe('Chart data is malformed');
    expect(detail.errorBoundaryId).toBe('usage-chart');
    expect(detail.errorInfo.componentStack).toContain('Broken');
  });

  test('turns thrown values that are not errors into errors', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={event => onError(event.detail.error)}>
        <Broken thrown="timeout" />
      </ErrorBoundary>
    );
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe('timeout');
  });

  test('renderFallback replaces the built-in message', () => {
    render(
      <ErrorBoundary
        errorBoundaryId="usage-chart"
        renderFallback={({ error, errorBoundaryId }) => (
          <p>
            {errorBoundaryId}: {error.message}
          </p>
        )}
      >
        <Broken />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('usage-chart: Chart data is malformed');
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('adds a feedback link and takes text from i18nStrings', () => {
    render(
      <ErrorBoundary
        feedbackHref="/feedback"
        i18nStrings={{
          headerText: 'Chart unavailable',
          descriptionText: 'The chart failed to load.',
          refreshActionText: 'Reload',
          feedbackLinkText: 'Report it',
        }}
      >
        <Broken />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Chart unavailable');
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Report it' })).toHaveAttribute('href', '/feedback');
  });

  test('a boundary only catches errors from its own children', () => {
    render(
      <ErrorBoundary errorBoundaryId="outer" data-testid="outer">
        <p>Header</p>
        <ErrorBoundary errorBoundaryId="inner" data-testid="inner">
          <Broken />
        </ErrorBoundary>
      </ErrorBoundary>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByTestId('inner')).toHaveAttribute('role', 'alert');
    expect(screen.queryByTestId('outer')).toBeNull();
  });

  test('passes id and data attributes to the fallback, but not className', () => {
    const props = { id: 'chart', 'data-testid': 'fallback', className: 'custom' } as ErrorBoundaryProps;
    render(
      <ErrorBoundary {...props}>
        <Broken />
      </ErrorBoundary>
    );
    const root = screen.getByTestId('fallback');
    expect(root).toHaveAttribute('id', 'chart');
    expect(root).not.toHaveClass('custom');
  });
});

describe('ErrorBoundary test utilities and accessibility', () => {
  test('the wrapper reads the fallback', () => {
    render(
      <ErrorBoundary feedbackHref="/feedback">
        <Broken />
      </ErrorBoundary>
    );
    const wrapper = createWrapper().findErrorBoundary()!;
    expect(wrapper.findHeader()!.getText()).toBe('Something went wrong');
    expect(wrapper.findDescription()!.getText()).toContain('Refresh the page');
    expect(wrapper.findRefreshButton()!.findTextRegion()!.getText()).toBe('Refresh page');
    expect(wrapper.findFeedbackLink()!.getElement()).toHaveAttribute('href', '/feedback');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <ErrorBoundary feedbackHref="/feedback">
        <Broken />
      </ErrorBoundary>
    );
    await expectNoAxeViolations(container);
  });
});
