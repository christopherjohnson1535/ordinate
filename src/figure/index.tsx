// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FigureProps } from './interfaces';
import { InternalFigure } from './internal';

export type { FigureProps };

/**
 * A picture with its caption, label and credit, as a `<figure>` and `<figcaption>`.
 */
export default function Figure({ media, caption, label, credit, ...props }: FigureProps) {
  return <InternalFigure {...getBaseProps(props)} media={media} caption={caption} label={label} credit={credit} />;
}
