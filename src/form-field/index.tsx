// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FormFieldProps } from './interfaces';
import { InternalFormField } from './internal';

export type { FormFieldProps };

export default function FormField({
  label,
  info,
  description,
  constraintText,
  characterCountText,
  errorText,
  warningText,
  errorIconAriaLabel = 'Error',
  warningIconAriaLabel = 'Warning',
  controlId,
  stretch = false,
  children,
  secondaryControl,
  ...props
}: FormFieldProps) {
  return (
    <InternalFormField
      {...getBaseProps(props)}
      label={label}
      info={info}
      description={description}
      constraintText={constraintText}
      characterCountText={characterCountText}
      errorText={errorText}
      warningText={warningText}
      errorIconAriaLabel={errorIconAriaLabel}
      warningIconAriaLabel={warningIconAriaLabel}
      controlId={controlId}
      stretch={stretch}
      secondaryControl={secondaryControl}
    >
      {children}
    </InternalFormField>
  );
}
