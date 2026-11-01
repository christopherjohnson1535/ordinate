// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The design tokens the charts use are defined by the revision styles that ship with the components.
import '@ordinate/components/internal/base-component';

export interface BaseChartProps {
  /**
   * Adds the specified ID to the root element of the chart.
   */
  id?: string;
  /**
   * Data attributes, such as `data-testid`, are added to the root element of the chart.
   */
  [dataAttribute: `data-${string}`]: string | undefined;
}

/**
 * Picks the props that may reach the root element. Styling props such as `className` and
 * `style` are not part of the public API, as in the components.
 */
export function getBaseProps(props: object): BaseChartProps {
  const baseProps: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(props)) {
    if (name === 'id' || name.startsWith('data-')) {
      baseProps[name] = value;
    }
  }
  return baseProps as BaseChartProps;
}
