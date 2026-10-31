// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SpinnerProps } from './interfaces';
import { InternalSpinner } from './internal';

export type { SpinnerProps };

export default function Spinner({ size = 'normal', variant = 'normal', ...props }: SpinnerProps) {
  return <InternalSpinner {...getBaseProps(props)} size={size} variant={variant} />;
}
