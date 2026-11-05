// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { StampProps } from './interfaces';
import { InternalStamp } from './internal';

export type { StampProps };

const legacyTypes: Record<StampProps.LegacyType, StampProps.Type> = {
  info: 'note',
  success: 'complete',
  warning: 'caution',
  error: 'fault',
};

function resolveType(type: StampProps.Type | StampProps.LegacyType): StampProps.Type {
  if (Object.prototype.hasOwnProperty.call(legacyTypes, type)) {
    const current = legacyTypes[type as StampProps.LegacyType];
    warnOnce(
      'Stamp',
      `The type "${type}" is now called "${current}". The old name stops working in the next major version.`
    );
    return current;
  }
  return type as StampProps.Type;
}

export default function Stamp({
  type = 'neutral',
  rotation = 'slight',
  size = 'medium',
  children,
  ...props
}: StampProps) {
  return (
    <InternalStamp {...getBaseProps(props)} type={resolveType(type)} rotation={rotation} size={size}>
      {children}
    </InternalStamp>
  );
}
