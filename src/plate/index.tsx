// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { PlateProps } from './interfaces';
import { InternalPlate } from './internal';

export type { PlateProps };

/**
 * A piece of work in a portfolio: the picture, then a catalogue caption with a label, the title, a
 * line of facts and a short description.
 */
export default function Plate({
  media,
  label,
  title,
  href,
  onFollow,
  meta,
  description,
  headingLevel = 3,
  ...props
}: PlateProps) {
  return (
    <InternalPlate
      {...getBaseProps(props)}
      media={media}
      label={label}
      title={title}
      href={href}
      onFollow={onFollow}
      meta={meta}
      description={description}
      headingLevel={headingLevel}
    />
  );
}
