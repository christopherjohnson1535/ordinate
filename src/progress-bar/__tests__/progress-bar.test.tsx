// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import ProgressBar, { ProgressBarProps } from '../../../lib/components/progress-bar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

afterEach(() => {
  vi.useRealTimers();
});

describe('ProgressBar', () => {
  test('renders a progress bar named by the label and described by the texts', () => {
    render(
      <ProgressBar value={42} label="Uploading backup" description="north-annex.tar" additionalInfo="2 minutes left" />
    );
    const bar = screen.getByRole('progressbar', { name: 'Uploading backup' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAccessibleDescription('north-annex.tar 2 minutes left');
  });

  test('prints the rounded percentage, hidden from screen readers', () => {
    render(<ProgressBar value={33.6} label="Upload" />);
    const percentage = createWrapper().findProgressBar()!.findPercentageText()!;
    expect(percentage.getText()).toBe('34%');
    expect(percentage.getElement()).toHaveAttribute('aria-hidden', 'true');
  });

  test('clamps values outside 0 to 100', () => {
    const { rerender } = render(<ProgressBar value={140} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<ProgressBar value={-5} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<ProgressBar value={Number.NaN} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  test('ariaLabel and ariaLabelledby name the bar instead of the label', () => {
    const { rerender } = render(<ProgressBar value={10} ariaLabel="Copying files" />);
    expect(screen.getByRole('progressbar', { name: 'Copying files' })).toBeInTheDocument();
    rerender(
      <>
        <h2 id="title">Migration</h2>
        <ProgressBar value={10} label="Visible label" ariaLabelledby="title" ariaDescribedby="title" />
      </>
    );
    expect(screen.getByRole('progressbar', { name: 'Migration' })).toHaveAccessibleDescription('Migration');
  });

  test('shows the result state and text in place of the measure, and announces them', () => {
    vi.useFakeTimers();
    render(<ProgressBar status="fault" value={31} label="Upload" resultText="Upload failed" />);
    expect(screen.queryByRole('progressbar')).toBeNull();
    const wrapper = createWrapper().findProgressBar()!;
    expect(wrapper.findPercentageText()).toBeNull();
    expect(wrapper.findStatus()!.getText()).toBe('Fault');
    expect(wrapper.findResultText()!.getText()).toBe('Upload failed');
    act(() => {
      vi.runAllTimers();
    });
    const announcer = document.querySelector('[aria-live="polite"]');
    expect(announcer).toHaveTextContent('Fault Upload failed');
  });

  test('accepts the old status names with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<ProgressBar status="in-progress" value={10} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');
    rerender(<ProgressBar status="success" label="Upload" />);
    expect(createWrapper().findProgressBar()!.findStatus()!.getText()).toBe('Complete');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"success" is now called "complete"'));
    warn.mockRestore();
  });

  test('fires onResultButtonClick from the result button', () => {
    const onClick = vi.fn();
    render(
      <ProgressBar status="fault" resultText="Upload failed" resultButtonText="Retry" onResultButtonClick={onClick} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('the flash variant leaves announcing the result to the flash', () => {
    render(<ProgressBar variant="flash" status="complete" resultText="Done" />);
    expect(document.querySelector('[aria-live]')).toBeNull();
  });

  test('applies a different class for each variant', () => {
    const variants: ProgressBarProps.Variant[] = ['standalone', 'flash', 'key-value'];
    render(
      <>
        {variants.map(variant => (
          <ProgressBar key={variant} variant={variant} value={50} label={variant} />
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllProgressBars()
      .map(bar => bar.getElement().className);
    expect(new Set(classNames).size).toBe(variants.length);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'upload', 'data-testid': 'progress', className: 'custom' } as ProgressBarProps;
    render(<ProgressBar {...props} label="Upload" />);
    const root = screen.getByTestId('progress');
    expect(root).toHaveAttribute('id', 'upload');
    expect(root).not.toHaveClass('custom');
  });
});

describe('ProgressBar test utilities and accessibility', () => {
  test('the wrapper reads the parts', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <ProgressBar value={20} label="Upload" description="backup.tar" additionalInfo="Slow network" />
    );
    const wrapper = createWrapper().findProgressBar()!;
    expect(wrapper.findLabel()!.getText()).toBe('Upload');
    expect(wrapper.findDescription()!.getText()).toBe('backup.tar');
    expect(wrapper.findAdditionalInfo()!.getText()).toBe('Slow network');
    expect(wrapper.findBar()!.getElement()).toHaveAttribute('aria-valuenow', '20');
    expect(wrapper.findResultButton()).toBeNull();
    rerender(
      <ProgressBar
        status="complete"
        label="Upload"
        resultText="Done"
        resultButtonText="View"
        onResultButtonClick={onClick}
      />
    );
    expect(wrapper.findBar()).toBeNull();
    wrapper.findResultButton()!.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <ProgressBar value={40} label="Uploading" description="backup.tar" additionalInfo="2 minutes left" />
        <ProgressBar value={60} ariaLabel="Copying" variant="key-value" />
        <ProgressBar status="complete" label="Upload" resultText="Done" />
        <ProgressBar status="fault" label="Upload" resultText="Failed" resultButtonText="Retry" variant="flash" />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
