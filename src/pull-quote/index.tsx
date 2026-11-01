// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PullQuoteProps } from './interfaces';
import { InternalPullQuote } from './internal';

export type { PullQuoteProps };

/**
 * A line lifted from the text and set large, to draw readers in. It renders a `<figure>` with a
 * `<blockquote>` and a `<figcaption>` for the attribution.
 */
export default function PullQuote({ children, attribution, variant = 'default', ...props }: PullQuoteProps) {
  return (
    <InternalPullQuote {...getBaseProps(props)} attribution={attribution} variant={variant}>
      {children}
    </InternalPullQuote>
  );
}
