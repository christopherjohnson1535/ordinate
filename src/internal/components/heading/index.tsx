// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  /**
   * The level chosen by the page. Levels outside 1 to 6 are clamped, so the heading is never lost
   * from the page outline. A missing or non-numeric level falls back to `defaultLevel`.
   */
  level: number | undefined;
  defaultLevel?: HeadingLevel;
  className?: string;
  children?: React.ReactNode;
}

function resolveLevel(level: number | undefined, defaultLevel: HeadingLevel): HeadingLevel {
  if (typeof level !== 'number' || !Number.isFinite(level)) {
    return defaultLevel;
  }
  return Math.min(6, Math.max(1, Math.round(level))) as HeadingLevel;
}

/**
 * A heading element whose level is chosen by the page, so website components keep the outline in order.
 */
export function Heading({ level, defaultLevel = 2, className, children }: HeadingProps) {
  return React.createElement(`h${resolveLevel(level, defaultLevel)}`, { className }, children);
}
