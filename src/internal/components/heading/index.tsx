// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  /**
   * The level chosen by the page. A missing level, or one outside 1 to 6 such as a typo in plain
   * JavaScript, falls back to `defaultLevel`, so a heading is still rendered.
   */
  level: number | undefined;
  defaultLevel?: HeadingLevel;
  className?: string;
  children?: React.ReactNode;
}

function resolveLevel(level: number | undefined, defaultLevel: HeadingLevel): HeadingLevel {
  const valid = level !== undefined && Number.isInteger(level) && level >= 1 && level <= 6;
  return valid ? (level as HeadingLevel) : defaultLevel;
}

/**
 * A heading element whose level is chosen by the page, so website components keep the outline in order.
 */
export function Heading({ level, defaultLevel = 2, className, children }: HeadingProps) {
  return React.createElement(`h${resolveLevel(level, defaultLevel)}`, { className }, children);
}
