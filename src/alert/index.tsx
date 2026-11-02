// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { AlertProps } from './interfaces';
import { InternalAlert } from './internal';

export type { AlertProps };

const legacyTypes: Record<AlertProps.LegacyType, AlertProps.Type> = {
  info: 'note',
  success: 'complete',
  warning: 'caution',
  error: 'fault',
};

function resolveType(type: AlertProps.Type | AlertProps.LegacyType): AlertProps.Type {
  if (Object.prototype.hasOwnProperty.call(legacyTypes, type)) {
    const current = legacyTypes[type as AlertProps.LegacyType];
    warnOnce(
      'Alert',
      `The type "${type}" is now called "${current}". The old name stops working in the next major version.`
    );
    return current;
  }
  return type as AlertProps.Type;
}

const Alert = React.forwardRef(
  (
    {
      type = 'note',
      header,
      children,
      action,
      dismissible = false,
      onDismiss,
      dismissAriaLabel,
      statusIconAriaLabel,
      i18nStrings,
      ...props
    }: AlertProps,
    ref: React.Ref<AlertProps.Ref>
  ) => (
    <InternalAlert
      {...getBaseProps(props)}
      ref={ref}
      type={resolveType(type)}
      header={header}
      action={action}
      dismissible={dismissible}
      onDismiss={onDismiss}
      dismissAriaLabel={dismissAriaLabel}
      statusIconAriaLabel={statusIconAriaLabel}
      i18nStrings={i18nStrings}
    >
      {children}
    </InternalAlert>
  )
);

Alert.displayName = 'Alert';

export default Alert;
