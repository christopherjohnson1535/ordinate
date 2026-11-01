// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import TextFilter, { TextFilterProps } from '../../../lib/components/text-filter';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled({ filteringText: initial = '', onChange, ...rest }: Partial<TextFilterProps>) {
  const [filteringText, setFilteringText] = useState(initial);
  return (
    <TextFilter
      {...rest}
      filteringText={filteringText}
      onChange={event => {
        onChange?.(event);
        setFilteringText(event.detail.filteringText);
      }}
    />
  );
}

const getInput = () => screen.getByRole('searchbox');

describe('TextFilter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders a search input with its text, placeholder and accessible name', () => {
    render(<TextFilter filteringText="web" filteringPlaceholder="Find instances" filteringAriaLabel="Instances" />);
    const input = getInput();
    expect(input).toHaveValue('web');
    expect(input).toHaveAttribute('placeholder', 'Find instances');
    expect(input).toHaveAccessibleName('Instances');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  test('names the input and the clear button in English by default', () => {
    render(<TextFilter filteringText="web" />);
    expect(getInput()).toHaveAccessibleName('Filter');
    expect(screen.getByRole('button', { name: 'Clear filter' })).toBeInTheDocument();
  });

  test('reads its built-in strings from the I18nProvider', () => {
    render(
      <I18nProvider
        locale="en"
        messages={[{ '@ordinate/components': { en: { 'text-filter': { filteringClearAriaLabel: 'Empty' } } } }]}
      >
        <TextFilter filteringText="web" filteringClearAriaLabel={undefined} />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Empty' })).toBeInTheDocument();
  });

  test('fires onChange on every change and onDelayedChange once typing pauses', () => {
    const onChange = vi.fn();
    const onDelayedChange = vi.fn();
    render(<Controlled onChange={onChange} onDelayedChange={onDelayedChange} />);
    fireEvent.change(getInput(), { target: { value: 'w' } });
    fireEvent.change(getInput(), { target: { value: 'we' } });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.change(getInput(), { target: { value: 'web' } });
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange.mock.calls[2][0].detail).toEqual({ filteringText: 'web' });
    expect(onDelayedChange).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(200));
    expect(onDelayedChange).toHaveBeenCalledTimes(1);
    expect(onDelayedChange.mock.calls[0][0].detail).toEqual({ filteringText: 'web' });
  });

  test('the clear button empties the filter and keeps focus in the input', () => {
    const onChange = vi.fn();
    const onDelayedChange = vi.fn();
    render(<Controlled filteringText="web" onChange={onChange} onDelayedChange={onDelayedChange} />);
    const wrapper = createWrapper().findTextFilter()!;
    wrapper.findClearButton()!.click();
    expect(onChange.mock.calls[0][0].detail).toEqual({ filteringText: '' });
    expect(getInput()).toHaveValue('');
    expect(getInput()).toHaveFocus();
    expect(wrapper.findClearButton()).toBeNull();
    act(() => vi.advanceTimersByTime(200));
    expect(onDelayedChange.mock.calls[0][0].detail).toEqual({ filteringText: '' });
  });

  test('shows the count only while there is text', () => {
    const { rerender } = render(<TextFilter filteringText="" countText="3 matches" />);
    const wrapper = createWrapper().findTextFilter()!;
    expect(wrapper.findResultsCount()).toBeNull();
    rerender(<TextFilter filteringText="web" countText="3 matches" />);
    expect(wrapper.findResultsCount()!.getText()).toBe('3 matches');
  });

  test('announces count changes', () => {
    const { rerender, container } = render(<TextFilter filteringText="web" countText="3 matches" />);
    rerender(<TextFilter filteringText="we" countText="7 matches" />);
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('7 matches');
  });

  test('disabled filter cannot be changed or cleared and hides the count', () => {
    render(<TextFilter filteringText="web" countText="3 matches" disabled={true} />);
    const wrapper = createWrapper().findTextFilter()!;
    expect(getInput()).toBeDisabled();
    expect(wrapper.findClearButton()).toBeNull();
    expect(wrapper.findResultsCount()).toBeNull();
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<TextFilterProps.Ref>();
    render(<TextFilter ref={ref} filteringText="" />);
    act(() => ref.current?.focus());
    expect(getInput()).toHaveFocus();
  });

  test('passes id and data attributes to the root, but not className', () => {
    const props = { id: 'filter', 'data-testid': 'instances', className: 'custom' } as TextFilterProps;
    render(<TextFilter {...props} filteringText="" />);
    const root = createWrapper().findTextFilter()!.getElement();
    expect(root).toHaveAttribute('id', 'filter');
    expect(root).toHaveAttribute('data-testid', 'instances');
    expect(root).not.toHaveClass('custom');
  });
});

describe('TextFilter accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<TextFilter filteringText="web" countText="3 matches" filteringAriaLabel="Find" />);
    await expectNoAxeViolations(container);
  });
});
