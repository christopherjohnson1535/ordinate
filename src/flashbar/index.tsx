// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FlashbarProps } from './interfaces';
import { InternalFlashbar } from './internal';

export type { FlashbarProps };

export default function Flashbar({ items, stackItems = false, i18nStrings, ...props }: FlashbarProps) {
  return <InternalFlashbar {...getBaseProps(props)} items={items} stackItems={stackItems} i18nStrings={i18nStrings} />;
}
