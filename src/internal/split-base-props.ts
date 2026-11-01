// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from './base-component';

/**
 * Separates the props that belong on a component's root element (`id` and `data-*`) from the
 * rest, for components whose root wraps another component that would otherwise receive them too.
 */
export function splitBaseProps<P extends object>(props: P): [BaseComponentProps, Omit<P, keyof BaseComponentProps>] {
  const base: Record<string, unknown> = {};
  const others: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(props)) {
    (name === 'id' || name.startsWith('data-') ? base : others)[name] = value;
  }
  return [base as BaseComponentProps, others as Omit<P, keyof BaseComponentProps>];
}
