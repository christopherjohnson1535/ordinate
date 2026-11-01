// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { MenuTileProps } from './interfaces';
import { InternalMenuTile } from './internal';

export type { MenuTileProps };

/**
 * A card that lists what a small business offers and what it costs, such as a repair shop's
 * services or a café's breakfast menu.
 */
export default function MenuTile({
  title,
  items,
  description,
  badge,
  tone = 'default',
  footer,
  headingLevel = 3,
  ...props
}: MenuTileProps) {
  return (
    <InternalMenuTile
      {...getBaseProps(props)}
      title={title}
      items={items}
      description={description}
      badge={badge}
      tone={tone}
      footer={footer}
      headingLevel={headingLevel}
    />
  );
}
