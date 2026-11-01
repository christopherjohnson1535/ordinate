// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import SegmentedControl, { SegmentedControlProps } from '../../../lib/components/segmented-control';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const options: SegmentedControlProps.Option[] = [
  { id: 'day', text: 'Day' },
  { id: 'week', text: 'Week' },
  { id: 'month', text: 'Month', disabled: true },
  { id: 'year', text: 'Year' },
];

function Controlled({ onChangeSpy, ...props }: Partial<SegmentedControlProps> & { onChangeSpy?: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>('week');
  return (
    <SegmentedControl
      label="Period"
      options={options}
      selectedId={selectedId}
      {...props}
      onChange={event => {
        onChangeSpy?.();
        setSelectedId(event.detail.selectedId);
      }}
    />
  );
}

const segment = (name: string) => screen.getByRole('button', { name });

afterEach(() => {
  document.documentElement.removeAttribute('dir');
});

describe('SegmentedControl', () => {
  test('renders a labelled group of toggle buttons', () => {
    render(<SegmentedControl label="Period" options={options} selectedId="week" />);
    expect(screen.getByRole('group')).toHaveAccessibleName('Period');
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(segment('Week')).toHaveAttribute('aria-pressed', 'true');
    expect(segment('Day')).toHaveAttribute('aria-pressed', 'false');
    expect(segment('Month')).toBeDisabled();
  });

  test('prefers ariaLabelledby over label', () => {
    render(
      <>
        <span id="heading">Time range</span>
        <SegmentedControl label="Period" ariaLabelledby="heading" options={options} selectedId={null} />
      </>
    );
    expect(screen.getByRole('group')).toHaveAccessibleName('Time range');
  });

  test('fires onChange when another segment is chosen', () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Period" options={options} selectedId="week" onChange={onChange} />);
    fireEvent.click(segment('Year'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toEqual({ selectedId: 'year' });
    fireEvent.click(segment('Week'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('keeps a single tab stop on the selected segment', () => {
    render(<Controlled />);
    expect(segment('Week')).toHaveAttribute('tabindex', '0');
    expect(segment('Day')).toHaveAttribute('tabindex', '-1');
    expect(segment('Year')).toHaveAttribute('tabindex', '-1');
  });

  test('puts the tab stop on the first enabled segment when none is selected', () => {
    render(
      <SegmentedControl
        label="Period"
        options={[{ id: 'a', text: 'A', disabled: true }, ...options]}
        selectedId={null}
      />
    );
    expect(segment('Day')).toHaveAttribute('tabindex', '0');
  });

  test('moves focus with the arrow keys, skipping disabled segments and wrapping', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    act(() => segment('Week').focus());
    fireEvent.keyDown(segment('Week'), { key: 'ArrowRight' });
    expect(segment('Year')).toHaveFocus();
    expect(segment('Year')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(segment('Year'), { key: 'ArrowRight' });
    expect(segment('Day')).toHaveFocus();
    fireEvent.keyDown(segment('Day'), { key: 'ArrowLeft' });
    expect(segment('Year')).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('moves focus to the ends with Home and End', () => {
    render(<Controlled />);
    act(() => segment('Week').focus());
    fireEvent.keyDown(segment('Week'), { key: 'End' });
    expect(segment('Year')).toHaveFocus();
    fireEvent.keyDown(segment('Year'), { key: 'Home' });
    expect(segment('Day')).toHaveFocus();
  });

  test('reverses the arrow keys in right-to-left layout', () => {
    document.documentElement.dir = 'rtl';
    render(
      <div style={{ direction: 'rtl' }}>
        <Controlled />
      </div>
    );
    act(() => segment('Week').focus());
    fireEvent.keyDown(segment('Week'), { key: 'ArrowLeft' });
    expect(segment('Year')).toHaveFocus();
  });

  test('returns the tab stop to the selected segment when focus leaves', () => {
    render(
      <>
        <Controlled />
        <button>After</button>
      </>
    );
    act(() => segment('Week').focus());
    fireEvent.keyDown(segment('Week'), { key: 'ArrowLeft' });
    expect(segment('Day')).toHaveAttribute('tabindex', '0');
    act(() => screen.getByRole('button', { name: 'After' }).focus());
    expect(segment('Week')).toHaveAttribute('tabindex', '0');
  });

  test('names icon-only segments with iconAlt', () => {
    render(
      <SegmentedControl
        label="View"
        options={[
          { id: 'list', iconName: 'list-view', iconAlt: 'List' },
          { id: 'grid', iconName: 'grid-view', iconAlt: 'Grid' },
        ]}
        selectedId="grid"
      />
    );
    expect(segment('Grid')).toHaveAttribute('aria-pressed', 'true');
    expect(segment('List')).toBeInTheDocument();
  });

  test('focuses the selected segment through the ref', () => {
    const ref = React.createRef<SegmentedControlProps.Ref>();
    render(<SegmentedControl ref={ref} label="Period" options={options} selectedId="year" />);
    act(() => ref.current!.focus());
    expect(segment('Year')).toHaveFocus();
  });

  test('passes id and data attributes to the root', () => {
    const { container } = render(
      <SegmentedControl id="period" data-testid="period" label="Period" options={options} selectedId="day" />
    );
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('id', 'period');
    expect(root).toHaveAttribute('data-testid', 'period');
  });

  test('exposes its parts through the test-utils wrapper', () => {
    const { container } = render(<Controlled />);
    const wrapper = createWrapper(container).findSegmentedControl()!;
    expect(wrapper.findSegments()).toHaveLength(4);
    expect(wrapper.findSelectedSegment()!.getText()).toBe('Week');
    wrapper.findSegmentById('day')!.click();
    expect(wrapper.findSelectedSegment()!.getText()).toBe('Day');
    expect(wrapper.findSegmentById('missing')).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Controlled />);
    await expectNoAxeViolations(container);
  });
});
