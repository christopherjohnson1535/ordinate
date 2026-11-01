// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  level: HeadingLevel;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A heading at a level chosen by the page author. Levels outside 1 to 6 are clamped, so the heading
 * is never lost from the page outline.
 */
export function Heading({ level, className, children }: HeadingProps) {
  const clamped = Math.min(6, Math.max(1, Math.round(level)));
  return React.createElement(`h${clamped}`, { className }, children);
}
