// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FileInputProps } from './interfaces';
import { InternalFileInput } from './internal';

export type { FileInputProps };

const FileInput = React.forwardRef(
  (
    {
      value,
      onChange,
      multiple = false,
      accept,
      variant = 'button',
      children,
      ariaLabel,
      ariaRequired,
      disabled = false,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: FileInputProps,
    ref: React.Ref<FileInputProps.Ref>
  ) => (
    <InternalFileInput
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      multiple={multiple}
      accept={accept}
      variant={variant}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      disabled={disabled}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
    >
      {children}
    </InternalFileInput>
  )
);

FileInput.displayName = 'FileInput';

export default FileInput;
