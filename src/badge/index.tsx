// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { BadgeProps } from './interfaces';
import { InternalBadge } from './internal';

export type { BadgeProps };

const colorToTone: Record<BadgeProps.Color, BadgeProps.Tone> = {
  grey: 'neutral',
  blue: 'note',
  green: 'complete',
  red: 'fault',
  'severity-critical': 'critical',
  'severity-high': 'high',
  'severity-medium': 'medium',
  'severity-low': 'low',
  'severity-neutral': 'neutral',
};

export default function Badge({ tone, color, children, ...props }: BadgeProps) {
  if (!tone && color) {
    warnOnce(
      'Badge',
      `\`color\` is now \`tone\`; "${color}" is "${colorToTone[color]}". It stops working in the next major version.`
    );
  }
  return (
    <InternalBadge {...getBaseProps(props)} tone={tone ?? (color ? colorToTone[color] : 'neutral')}>
      {children}
    </InternalBadge>
  );
}
