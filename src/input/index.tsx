// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { InputProps } from './interfaces';
import { InternalInput } from './internal';

export type { InputProps };

const Input = React.forwardRef(
  (
    {
      value,
      onChange,
      type = 'text',
      inputMode,
      step,
      placeholder,
      inlineLabelText,
      disabled = false,
      readOnly = false,
      autoFocus = false,
      ariaLabel,
      ariaRequired,
      clearAriaLabel,
      name,
      autoComplete = true,
      disableBrowserAutocorrect = false,
      spellcheck,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: InputProps,
    ref: React.Ref<InputProps.Ref>
  ) => (
    <InternalInput
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      type={type}
      inputMode={inputMode}
      step={step}
      placeholder={placeholder}
      inlineLabelText={inlineLabelText}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      clearAriaLabel={clearAriaLabel}
      name={name}
      autoComplete={autoComplete}
      disableBrowserAutocorrect={disableBrowserAutocorrect}
      spellcheck={spellcheck}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
    />
  )
);

Input.displayName = 'Input';

export default Input;
