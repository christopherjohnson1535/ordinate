// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SliderProps } from './interfaces';
import { InternalSlider } from './internal';

export type { SliderProps };

const Slider = React.forwardRef(
  (
    {
      value,
      min,
      max,
      step = 1,
      onChange,
      disabled = false,
      readOnly = false,
      tickMarks,
      hideFillLine = false,
      referenceValues,
      valueFormatter,
      ariaLabel,
      ariaDescription,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: SliderProps,
    ref: React.Ref<SliderProps.Ref>
  ) => (
    <InternalSlider
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      tickMarks={tickMarks}
      hideFillLine={hideFillLine}
      referenceValues={referenceValues}
      valueFormatter={valueFormatter}
      ariaLabel={ariaLabel}
      ariaDescription={ariaDescription}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
    />
  )
);

Slider.displayName = 'Slider';

export default Slider;
