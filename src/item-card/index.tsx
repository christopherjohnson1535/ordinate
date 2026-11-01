// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ItemCardProps } from './interfaces';
import { InternalItemCard } from './internal';

export type { ItemCardProps };

export default function ItemCard({
  header,
  description,
  children,
  footer,
  actions,
  media,
  selected = false,
  selectionControl,
  disabled = false,
  variant = 'default',
  ...props
}: ItemCardProps) {
  return (
    <InternalItemCard
      {...getBaseProps(props)}
      header={header}
      description={description}
      footer={footer}
      actions={actions}
      media={media}
      selected={selected}
      selectionControl={selectionControl}
      disabled={disabled}
      variant={variant}
    >
      {children}
    </InternalItemCard>
  );
}
