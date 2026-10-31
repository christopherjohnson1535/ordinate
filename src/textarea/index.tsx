// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TextareaProps } from './interfaces';
import { InternalTextarea } from './internal';

export type { TextareaProps };

const Textarea = React.forwardRef(
  (
    {
      value,
      onChange,
      rows = 3,
      resize = 'vertical',
      placeholder,
      disabled = false,
      readOnly = false,
      warning = false,
      autoFocus = false,
      spellcheck,
      disableBrowserAutocorrect = false,
      autoComplete = true,
      name,
      ariaLabel,
      ariaRequired,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      ...props
    }: TextareaProps,
    ref: React.Ref<TextareaProps.Ref>
  ) => (
    <InternalTextarea
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      rows={rows}
      resize={resize}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      warning={warning}
      autoFocus={autoFocus}
      spellcheck={spellcheck}
      disableBrowserAutocorrect={disableBrowserAutocorrect}
      autoComplete={autoComplete}
      name={name}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
    />
  )
);

Textarea.displayName = 'Textarea';

export default Textarea;
