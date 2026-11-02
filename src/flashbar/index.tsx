// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { FlashbarProps } from './interfaces';
import { InternalFlashbar, InternalMessageDefinition } from './internal';

export type { FlashbarProps };

const legacyTypes: Record<FlashbarProps.LegacyType, FlashbarProps.Type> = {
  info: 'note',
  success: 'complete',
  warning: 'caution',
  error: 'fault',
  'in-progress': 'note',
};

function resolveItem(item: FlashbarProps.MessageDefinition): InternalMessageDefinition {
  const type = item.type ?? 'note';
  if (!Object.prototype.hasOwnProperty.call(legacyTypes, type)) {
    return { ...item, type: type as FlashbarProps.Type };
  }
  const current = legacyTypes[type as FlashbarProps.LegacyType];
  if (type === 'in-progress') {
    warnOnce(
      'Flashbar',
      'The type "in-progress" is now a "note" with `loading` set. The old name stops working in the next major version.'
    );
    return { ...item, type: current, loading: item.loading ?? true };
  }
  warnOnce(
    'Flashbar',
    `The type "${type}" is now called "${current}". The old name stops working in the next major version.`
  );
  return { ...item, type: current };
}

export default function Flashbar({ items, stackItems = false, i18nStrings, ...props }: FlashbarProps) {
  return (
    <InternalFlashbar
      {...getBaseProps(props)}
      items={items.map(resolveItem)}
      stackItems={stackItems}
      i18nStrings={i18nStrings}
    />
  );
}
