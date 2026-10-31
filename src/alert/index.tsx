// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { AlertProps } from './interfaces';
import { InternalAlert } from './internal';

export type { AlertProps };

const Alert = React.forwardRef(
  (
    {
      type = 'info',
      header,
      children,
      action,
      dismissible = false,
      onDismiss,
      dismissAriaLabel = 'Dismiss',
      statusIconAriaLabel,
      ...props
    }: AlertProps,
    ref: React.Ref<AlertProps.Ref>
  ) => (
    <InternalAlert
      {...getBaseProps(props)}
      ref={ref}
      type={type}
      header={header}
      action={action}
      dismissible={dismissible}
      onDismiss={onDismiss}
      dismissAriaLabel={dismissAriaLabel}
      statusIconAriaLabel={statusIconAriaLabel}
    >
      {children}
    </InternalAlert>
  )
);

Alert.displayName = 'Alert';

export default Alert;
