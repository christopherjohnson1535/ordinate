// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FormProps } from './interfaces';
import { InternalForm } from './internal';

export type { FormProps };

export default function Form({
  kind = 'neutral',
  reference,
  children,
  header,
  errorText,
  errorIconAriaLabel,
  actions,
  secondaryActions,
  variant = 'full-page',
  ...props
}: FormProps) {
  return (
    <InternalForm
      {...getBaseProps(props)}
      kind={kind}
      reference={reference}
      header={header}
      errorText={errorText}
      errorIconAriaLabel={errorIconAriaLabel}
      actions={actions}
      secondaryActions={secondaryActions}
      variant={variant}
    >
      {children}
    </InternalForm>
  );
}
