// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Average advance widths of IBM Plex Sans, as a share of the font size. Tabular figures are
// exactly 0.6 em wide, which is what labels are mostly made of.
function charWidth(char: string): number {
  if (/[0-9]/.test(char)) {
    return 0.6;
  }
  if (/[\s.,:;'|!il]/.test(char)) {
    return 0.28;
  }
  if (/[A-Z]/.test(char)) {
    return 0.66;
  }
  if (/[mwMW]/.test(char)) {
    return 0.82;
  }
  return 0.54;
}

/**
 * Estimates the width of a label in pixels without measuring it, so a layout can be worked out
 * before anything is drawn, including on the server.
 */
export function estimateTextWidth(text: string, fontSize = 12): number {
  let width = 0;
  for (const char of text) {
    width += charWidth(char);
  }
  return Math.ceil(width * fontSize);
}

/**
 * Shortens a label with an ellipsis so its estimated width fits in `maxWidth`.
 */
export function truncateText(text: string, maxWidth: number, fontSize = 12): string {
  if (estimateTextWidth(text, fontSize) <= maxWidth) {
    return text;
  }
  const chars = Array.from(text);
  let end = chars.length;
  while (end > 1 && estimateTextWidth(`${chars.slice(0, end).join('')}…`, fontSize) > maxWidth) {
    end--;
  }
  return `${chars.slice(0, end).join('').trimEnd()}…`;
}
