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
  description,
  constraintText,
  errorText,
  controlId,
  children,
  ...props
}: FormFieldProps) {
  return (
    <InternalFormField
      {...getBaseProps(props)}
      label={label}
      description={description}
      constraintText={constraintText}
      errorText={errorText}
      controlId={controlId}
    >
      {children}
    </InternalFormField>
  );
}
