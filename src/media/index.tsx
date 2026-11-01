// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { MediaProps } from './interfaces';
import { InternalMedia } from './internal';

export type { MediaProps };

/**
 * An image, video or drawing in a frame of a fixed shape. With nothing in it, it draws a hatched
 * placeholder, so a draft page shows where the pictures will go.
 */
export default function Media({
  src,
  alt,
  aspectRatio = '3:2',
  fit = 'cover',
  children,
  placeholderText,
  ...props
}: MediaProps) {
  return (
    <InternalMedia
      {...getBaseProps(props)}
      src={src}
      alt={alt}
      aspectRatio={aspectRatio}
      fit={fit}
      placeholderText={placeholderText}
    >
      {children}
    </InternalMedia>
  );
}
