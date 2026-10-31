// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const shown = new Set<string>();

export function warnOnce(component: string, message: string): void {
  const text = `[ordinate] ${component}: ${message}`;
  if (!shown.has(text)) {
    shown.add(text);
    console.warn(text);
  }
}
