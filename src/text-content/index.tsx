// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TextContentProps } from './interfaces';
import { InternalTextContent } from './internal';

export type { TextContentProps };

export default function TextContent({ children, ...props }: TextContentProps) {
  return <InternalTextContent {...getBaseProps(props)}>{children}</InternalTextContent>;
}
