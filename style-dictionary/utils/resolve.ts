// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GlobalValue, ModeValue, RevisionTokens, TokenValue } from './interfaces.js';
import { TokenName } from './token-names.js';

export type Mode = keyof ModeValue;

export type ResolvedValue = GlobalValue | ModeValue;

const referencePattern = /^\{([a-zA-Z0-9]+)\}$/;

export function isModeValue(value: TokenValue): value is ModeValue {
  return typeof value === 'object';
}

function resolveInMode(tokens: RevisionTokens, name: TokenName, mode: Mode, trail: TokenName[]): GlobalValue {
  if (trail.includes(name)) {
    throw new Error(`Circular token reference: ${[...trail, name].join(' -> ')}`);
  }
  const value = tokens[name];
  if (value === undefined) {
    throw new Error(`Unknown token "${name}"${trail.length ? ` referenced from "${trail[trail.length - 1]}"` : ''}`);
  }
  const literal = isModeValue(value) ? value[mode] : value;
  const match = referencePattern.exec(literal);
  return match ? resolveInMode(tokens, match[1] as TokenName, mode, [...trail, name]) : literal;
}

/**
 * Replaces every `{reference}` with its final value. Tokens that differ between
 * modes keep a `{ light, dark }` pair; all others collapse to a single value.
 */
export function resolveTokens(tokens: RevisionTokens): Record<TokenName, ResolvedValue> {
  const resolved = {} as Record<TokenName, ResolvedValue>;
  for (const name of Object.keys(tokens) as TokenName[]) {
    const light = resolveInMode(tokens, name, 'light', []);
    const dark = resolveInMode(tokens, name, 'dark', []);
    resolved[name] = light === dark ? light : { light, dark };
  }
  return resolved;
}
