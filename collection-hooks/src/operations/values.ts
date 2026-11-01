// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getField(item: unknown, key: string): unknown {
  return item !== null && typeof item === 'object' ? (item as Record<string, unknown>)[key] : undefined;
}

/**
 * Whether a value reads as text. Objects are left out so they never match as "[object Object]".
 */
export function isPrimitive(value: unknown): value is string | number | boolean | bigint {
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint';
}

export function toSearchText(value: unknown): string {
  return isPrimitive(value) ? String(value).toLowerCase() : '';
}

/**
 * Reads a number from a number or from a string that holds only a number, so a typed "10" compares
 * numerically with a numeric field.
 */
export function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
  }
  return null;
}
