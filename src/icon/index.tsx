// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { IconProps } from './interfaces';
import { InternalIcon } from './internal';

export type { IconProps };

export default function Icon({ name, svg, size = 'normal', variant = 'normal', ariaLabel, ...props }: IconProps) {
  return (
    <InternalIcon {...getBaseProps(props)} name={name} svg={svg} size={size} variant={variant} ariaLabel={ariaLabel} />
  );
}
