// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DialogProps } from './interfaces';
import { InternalDialog } from './internal';

export type { DialogProps };

export default function Dialog({
  header,
  children,
  footer,
  onDismiss,
  dismissAriaLabel,
  ariaLabel,
  ...props
}: DialogProps) {
  return (
    <InternalDialog
      {...getBaseProps(props)}
      header={header}
      footer={footer}
      onDismiss={onDismiss}
      dismissAriaLabel={dismissAriaLabel}
      ariaLabel={ariaLabel}
    >
      {children}
    </InternalDialog>
  );
}
