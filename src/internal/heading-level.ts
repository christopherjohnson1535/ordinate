// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from './logging';

/**
 * The level of a heading a component renders, from 1 for `h1` to 6 for `h6`.
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * The heading element for `level`. A value outside 1 to 6 warns and falls back to `fallback`, so a
 * typo never drops the heading from the page outline.
 */
export function getHeadingTag(component: string, level: number | undefined, fallback: HeadingLevel): HeadingTag {
  if (level === undefined) {
    return `h${fallback}`;
  }
  if (!Number.isInteger(level) || level < 1 || level > 6) {
    warnOnce(component, '`headingLevel` must be a whole number from 1 to 6.');
    return `h${fallback}`;
  }
  return `h${level as HeadingLevel}`;
}
