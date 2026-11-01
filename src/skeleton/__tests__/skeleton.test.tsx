// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import Skeleton, { SkeletonProps } from '../../../lib/components/skeleton';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Skeleton', () => {
  test('marks the region busy, hides the shapes and gives screen readers a loading text', () => {
    render(<Skeleton data-testid="skeleton" lines={3} />);
    const root = screen.getByTestId('skeleton');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveTextContent('Loading');
    const wrapper = createWrapper().findSkeleton()!;
    expect(wrapper.findLines()).toHaveLength(3);
    expect(wrapper.findLines()[0].getElement().closest('[aria-hidden="true"]')).not.toBeNull();
  });

  test('shows the children once loading is false', () => {
    const { rerender } = render(
      <Skeleton data-testid="skeleton">
        <p>Quarterly report</p>
      </Skeleton>
    );
    expect(screen.queryByText('Quarterly report')).toBeNull();
    rerender(
      <Skeleton data-testid="skeleton" loading={false}>
        <p>Quarterly report</p>
      </Skeleton>
    );
    expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-busy', 'false');
    expect(createWrapper().findSkeleton()!.isLoading()).toBe(false);
  });

  test('draws one line for heading and a frame for block', () => {
    render(
      <>
        <Skeleton variant="heading" lines={4} />
        <Skeleton variant="block" height="large" />
      </>
    );
    const [heading, block] = createWrapper().findAllSkeletons();
    expect(heading.findLines()).toHaveLength(1);
    expect(block.findLines()).toHaveLength(0);
    expect(block.findBlock()).not.toBeNull();
  });

  test('treats an invalid line count as one line', () => {
    render(<Skeleton lines={0} />);
    expect(createWrapper().findSkeleton()!.findLines()).toHaveLength(1);
  });

  test('an empty loadingText leaves out the screen reader text', () => {
    render(<Skeleton loadingText="" />);
    expect(createWrapper().findSkeleton()!.findLoadingText()).toBeNull();
  });

  test('reads the loading text from the provider locale', () => {
    render(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate-ui/components': { de: { skeleton: { loadingText: 'Wird geladen' } } } }]}
      >
        <Skeleton />
      </I18nProvider>
    );
    expect(createWrapper().findSkeleton()!.findLoadingText()!.getText()).toBe('Wird geladen');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'loading', 'data-testid': 'skeleton', className: 'custom' } as SkeletonProps;
    render(<Skeleton {...props} />);
    const root = screen.getByTestId('skeleton');
    expect(root).toHaveAttribute('id', 'loading');
    expect(root).not.toHaveClass('custom');
  });
});

describe('Skeleton accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Skeleton variant="heading" width="medium" loadingText="Loading report" />
        <Skeleton lines={3} loadingText="" />
        <Skeleton variant="block" height="small" loadingText="" />
        <Skeleton loading={false}>
          <p>Loaded</p>
        </Skeleton>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
