// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Every public component imports this module, so the revision tokens load once with the first component.
import './styles.css.js';

export interface BaseComponentProps {
  /**
   * Adds the specified ID to the root element of the component.
   */
  id?: string;
  /**
   * Data attributes, such as `data-testid`, are added to the root element of the component.
   */
  [dataAttribute: `data-${string}`]: string | undefined;
}

/**
 * Picks the props that may reach the root element. Styling props such as
 * `className` and `style` are deliberately not part of the public API.
 */
export function getBaseProps(props: object): BaseComponentProps {
  const baseProps: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(props)) {
    if (name === 'id' || name.startsWith('data-')) {
      baseProps[name] = value;
    }
  }
  return baseProps as BaseComponentProps;
}
