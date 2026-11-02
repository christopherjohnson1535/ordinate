// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Steps, { StepsProps } from '../../../lib/components/steps';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const steps: StepsProps.Step[] = [
  { header: 'Build image', status: 'complete', statusIconAriaLabel: 'Done', details: '2 minutes' },
  { header: 'Run tests', status: 'fault', statusIconAriaLabel: 'Failed', details: <a href="#report">Report</a> },
  { header: 'Deploy', status: 'waiting', statusIconAriaLabel: 'Pending' },
];

const wrapper = () => createWrapper().findSteps()!;

describe('Steps', () => {
  test('renders an ordered list with one item per step', () => {
    render(<Steps steps={steps} ariaLabel="Deployment" />);
    const list = screen.getByRole('list', { name: 'Deployment' });
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  test('ariaLabelledby names the list', () => {
    render(
      <>
        <h2 id="progress">Progress</h2>
        <Steps steps={steps} ariaLabelledby="progress" />
      </>
    );
    expect(screen.getByRole('list', { name: 'Progress' })).toBeInTheDocument();
  });

  test('shows the header, details and a status icon named by statusIconAriaLabel', () => {
    render(<Steps steps={steps} />);
    const [first, second, third] = wrapper().findItems();
    expect(first.findHeader().getText()).toBe('Build image');
    expect(first.findDetails()!.getText()).toBe('2 minutes');
    expect(within(first.getElement()).getByRole('img', { name: 'Done' })).toBeInTheDocument();
    expect(within(second.getElement()).getByRole('link', { name: 'Report' })).toBeInTheDocument();
    expect(third.findDetails()).toBeNull();
    expect(second.findStatusIndicator()).not.toBeNull();
  });

  test('a status icon without a label is decorative', () => {
    render(<Steps steps={[{ header: 'Build', status: 'complete' }]} />);
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('renders a loading step with a spinner', () => {
    render(<Steps steps={[{ header: 'Deploy', status: 'loading', statusIconAriaLabel: 'In progress' }]} />);
    expect(screen.getByRole('img', { name: 'In progress' })).toBeInTheDocument();
  });

  test('supports the horizontal orientation', () => {
    render(<Steps steps={steps} orientation="horizontal" ariaLabel="Deployment" />);
    expect(wrapper().findItems()).toHaveLength(3);
  });

  test('passes id and data attributes to the root', () => {
    render(<Steps steps={steps} id="steps" data-testid="steps" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'steps');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'steps');
  });

  test('still accepts the old status names, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Steps steps={[{ header: 'Build', status: 'success' }]} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"success" is now called "complete"'));
    warn.mockRestore();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Steps steps={steps} ariaLabel="Deployment" />);
    await expectNoAxeViolations(container);
  });
});
