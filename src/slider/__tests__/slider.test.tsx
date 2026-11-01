// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Slider, { SliderProps } from '../../../lib/components/slider';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Controlled(props: Partial<SliderProps> & { onChangeSpy?: (value: number) => void }) {
  const { onChangeSpy, ...rest } = props;
  const [value, setValue] = useState(props.value ?? 50);
  return (
    <Slider
      ariaLabel="Opacity"
      min={0}
      max={100}
      {...rest}
      value={value}
      onChange={event => {
        onChangeSpy?.(event.detail.value);
        setValue(event.detail.value);
      }}
    />
  );
}

const getSlider = () => screen.getByRole('slider');

describe('Slider', () => {
  test('renders a native range input with its bounds', () => {
    render(<Slider ariaLabel="Opacity" value={30} min={0} max={100} step={5} />);
    const slider = getSlider();
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '5');
    expect(slider).toHaveValue('30');
    expect(slider).toHaveAccessibleName('Opacity');
  });

  test('fires onChange with a number', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    fireEvent.change(getSlider(), { target: { value: '70' } });
    expect(onChange).toHaveBeenCalledWith(70);
    expect(getSlider()).toHaveValue('70');
  });

  test('read-only sliders stay focusable but do not change', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} readOnly={true} />);
    expect(getSlider()).toHaveAttribute('aria-readonly', 'true');
    expect(getSlider()).not.toBeDisabled();
    fireEvent.change(getSlider(), { target: { value: '70' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(getSlider()).toHaveValue('50');
  });

  test('disabled sliders are disabled', () => {
    render(<Slider ariaLabel="Opacity" value={30} min={0} max={100} disabled={true} />);
    expect(getSlider()).toBeDisabled();
    expect(createWrapper().findSlider()!.isDisabled()).toBe(true);
  });

  test('formats the labels and the announced value', () => {
    render(
      <Slider
        ariaLabel="Opacity"
        value={40}
        min={0}
        max={100}
        referenceValues={[25, 50, 75, 150]}
        valueFormatter={value => `${value}%`}
      />
    );
    expect(getSlider()).toHaveAttribute('aria-valuetext', '40%');
    const labels = createWrapper().findSlider()!.findLabels();
    expect(labels.map(label => label.getText())).toEqual(['0%', '25%', '50%', '75%', '100%']);
  });

  test('announces the raw value without a formatter', () => {
    render(<Slider ariaLabel="Opacity" value={40} min={0} max={100} />);
    expect(getSlider()).not.toHaveAttribute('aria-valuetext');
  });

  test('draws a tick at every step', () => {
    const { rerender } = render(<Slider ariaLabel="Rating" value={2} min={0} max={5} tickMarks={true} />);
    expect(createWrapper().findSlider()!.findTickMarks()).toHaveLength(6);
    rerender(<Slider ariaLabel="Rating" value={2} min={0} max={10} step={2.5} tickMarks={true} />);
    expect(createWrapper().findSlider()!.findTickMarks()).toHaveLength(5);
    rerender(<Slider ariaLabel="Rating" value={2} min={0} max={5} />);
    expect(createWrapper().findSlider()!.findTickMarks()).toHaveLength(0);
  });

  test('skips tick marks when there are too many steps', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Slider ariaLabel="Bytes" value={2} min={0} max={10000} tickMarks={true} />);
    expect(createWrapper().findSlider()!.findTickMarks()).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('tickMarks'));
    warn.mockRestore();
  });

  test('describes itself with ariaDescription', () => {
    render(<Slider ariaLabel="Opacity" ariaDescription="0 is transparent." value={30} min={0} max={100} />);
    expect(getSlider()).toHaveAccessibleDescription('0 is transparent.');
  });

  test('marks itself invalid', () => {
    render(<Slider ariaLabel="Opacity" value={30} min={0} max={100} invalid={true} />);
    expect(getSlider()).toHaveAttribute('aria-invalid', 'true');
  });

  test('exposes focus() and fires onFocus and onBlur', () => {
    const ref = React.createRef<SliderProps.Ref>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<Slider ref={ref} ariaLabel="Opacity" value={30} min={0} max={100} onFocus={onFocus} onBlur={onBlur} />);
    act(() => ref.current?.focus());
    expect(getSlider()).toHaveFocus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    act(() => getSlider().blur());
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('warns when max is not above min', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Slider ariaLabel="Opacity" value={0} min={10} max={10} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`max` must be greater than `min`'));
    warn.mockRestore();
  });
});

describe('Slider in a form field', () => {
  test('takes its ID, label, description and error from the field', () => {
    render(
      <FormField label="Opacity" description="Of the overlay." errorText="Too opaque." controlId="opacity">
        <Slider value={30} min={0} max={100} ariaDescription="0 is transparent." />
      </FormField>
    );
    expect(getSlider()).toHaveAttribute('id', 'opacity');
    expect(getSlider()).toHaveAccessibleName('Opacity');
    expect(getSlider()).toHaveAccessibleDescription('Too opaque. Of the overlay. 0 is transparent.');
    expect(getSlider()).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Slider test utilities and accessibility', () => {
  test('the wrapper reads and sets the value', () => {
    const onChange = vi.fn();
    render(<Controlled onChangeSpy={onChange} />);
    const slider = createWrapper().findSlider()!;
    expect(slider.getValue()).toBe(50);
    slider.setValue(20);
    expect(onChange).toHaveBeenCalledWith(20);
    expect(slider.getValue()).toBe(20);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Opacity" description="Of the overlay.">
        <Slider value={30} min={0} max={100} tickMarks={true} step={10} referenceValues={[50]} />
      </FormField>
    );
    await expectNoAxeViolations(container);
  });
});
