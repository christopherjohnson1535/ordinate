// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Layout breakpoints, smallest first. `default` applies below `xxs`. They describe the width of the
 * container a layout component sits in, not the viewport, so a layout in a narrow panel behaves as
 * it would on a narrow screen.
 */
export const breakpoints = ['default', 'xxs', 'xs', 's', 'm', 'l', 'xl'] as const;

export type Breakpoint = (typeof breakpoints)[number];

/**
 * The narrowest container width, in pixels, at which each breakpoint applies. Grid's styles repeat
 * these values in its container queries.
 */
export const breakpointMinWidths: Readonly<Record<Breakpoint, number>> = {
  default: 0,
  xxs: 465,
  xs: 688,
  s: 912,
  m: 1120,
  l: 1280,
  xl: 1840,
};

export type BreakpointMapping<T> = Partial<Record<Breakpoint, T>>;

export function getBreakpoint(width: number): Breakpoint {
  return breakpoints.reduce<Breakpoint>(
    (current, breakpoint) => (width >= breakpointMinWidths[breakpoint] ? breakpoint : current),
    'default'
  );
}

function isMapping<T>(value: T | BreakpointMapping<T>): value is BreakpointMapping<T> {
  return typeof value === 'object' && value !== null;
}

/**
 * Reads a value that is either the same everywhere or set per breakpoint. A breakpoint without its
 * own value inherits from the nearest smaller one, as min-width media queries do.
 */
export function resolveBreakpointValue<T>(
  value: T | BreakpointMapping<T> | undefined,
  breakpoint: Breakpoint
): T | undefined {
  if (value === undefined || !isMapping(value)) {
    return value;
  }
  const smallerOrEqual = breakpoints.slice(0, breakpoints.indexOf(breakpoint) + 1);
  return smallerOrEqual.reduce<T | undefined>((current, name) => value[name] ?? current, undefined);
}
