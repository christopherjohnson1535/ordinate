// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '../internal/logging';
import { StatusIndicatorProps } from './interfaces';

// The values StatusIndicator took before its states were named like the icons. They still work, with a
// warning, until the next major version.
const typeToState: Record<StatusIndicatorProps.Type, StatusIndicatorProps.State> = {
  error: 'fault',
  warning: 'caution',
  success: 'complete',
  info: 'note',
  stopped: 'halted',
  pending: 'waiting',
  'in-progress': 'underway',
  'not-started': 'queued',
  loading: 'loading',
};

const colorToTone: Record<StatusIndicatorProps.Color, StatusIndicatorProps.Tone> = {
  blue: 'note',
  grey: 'neutral',
  green: 'complete',
  red: 'fault',
  yellow: 'caution',
};

function isLegacyType(value: string): value is StatusIndicatorProps.Type {
  return Object.prototype.hasOwnProperty.call(typeToState, value) && value !== 'loading';
}

/**
 * The state for a value given as a current state or as one of the old type names.
 */
export function resolveState(
  component: string,
  value: StatusIndicatorProps.State | StatusIndicatorProps.Type | undefined
): StatusIndicatorProps.State | undefined {
  if (value === undefined || !isLegacyType(value)) {
    return value as StatusIndicatorProps.State | undefined;
  }
  warnOnce(
    component,
    `The status "${value}" is now called "${typeToState[value]}". The old name stops working in the next major version.`
  );
  return typeToState[value];
}

/**
 * The tone for an old `colorOverride` value.
 */
export function resolveColorOverride(
  color: StatusIndicatorProps.Color | undefined
): StatusIndicatorProps.Tone | undefined {
  if (color === undefined) {
    return undefined;
  }
  warnOnce(
    'StatusIndicator',
    `\`colorOverride\` is now \`tone\`; "${color}" is "${colorToTone[color]}". It stops working in the next major version.`
  );
  return colorToTone[color];
}
