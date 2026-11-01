// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TruncatedTextProps } from './interfaces';
import { InternalTruncatedText } from './internal';

export type { TruncatedTextProps };

export default function TruncatedText({ children, lines = 1, ...props }: TruncatedTextProps) {
  return (
    <InternalTruncatedText {...getBaseProps(props)} lines={lines}>
      {children}
    </InternalTruncatedText>
  );
}
