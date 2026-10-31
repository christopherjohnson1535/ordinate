// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DensityValue, GlobalValue, ModeValue, RevisionTokens, TokenValue } from './interfaces.js';
import { TokenName } from './token-names.js';

export type Mode = keyof ModeValue;
export type Density = keyof DensityValue;

export type ResolvedValue = GlobalValue | ModeValue | DensityValue;

interface Context {
  mode: Mode;
  density: Density;
}

const referencePattern = /^\{([a-zA-Z0-9]+)\}$/;

export function isModeValue(value: TokenValue): value is ModeValue {
  return typeof value === 'object' && 'light' in value;
}

export function isDensityValue(value: TokenValue): value is DensityValue {
  return typeof value === 'object' && 'comfortable' in value;
}

function pick(value: TokenValue, { mode, density }: Context): GlobalValue {
  if (isModeValue(value)) {
    return value[mode];
  }
  if (isDensityValue(value)) {
    return value[density];
  }
  return value;
}

function resolveIn(tokens: RevisionTokens, name: TokenName, context: Context, trail: TokenName[]): GlobalValue {
  if (trail.includes(name)) {
    throw new Error(`Circular token reference: ${[...trail, name].join(' -> ')}`);
  }
  const value = tokens[name];
  if (value === undefined) {
    throw new Error(`Unknown token "${name}"${trail.length ? ` referenced from "${trail[trail.length - 1]}"` : ''}`);
  }
  const literal = pick(value, context);
  const match = referencePattern.exec(literal);
  return match ? resolveIn(tokens, match[1] as TokenName, context, [...trail, name]) : literal;
}

/**
 * Replaces every `{reference}` with its final value. Tokens that differ between
 * modes keep a `{ light, dark }` pair, tokens that differ between densities keep
 * a `{ comfortable, compact }` pair, and all others collapse to a single value.
 * A token may vary by mode or by density, not both.
 */
export function resolveTokens(tokens: RevisionTokens): Record<TokenName, ResolvedValue> {
  const resolved = {} as Record<TokenName, ResolvedValue>;
  for (const name of Object.keys(tokens) as TokenName[]) {
    const at = (mode: Mode, density: Density) => resolveIn(tokens, name, { mode, density }, []);
    const light = at('light', 'comfortable');
    const dark = at('dark', 'comfortable');
    const compact = at('light', 'compact');
    if (light !== dark && light !== compact) {
      throw new Error(`Token "${name}" varies by both mode and density, which is not supported.`);
    }
    if (light !== dark) {
      resolved[name] = { light, dark };
    } else if (light !== compact) {
      resolved[name] = { comfortable: light, compact };
    } else {
      resolved[name] = light;
    }
  }
  return resolved;
}
