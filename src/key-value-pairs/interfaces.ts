// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface KeyValuePairsProps extends BaseComponentProps {
  /**
   * The pairs to show, in reading order. Each item is a pair, or a group of pairs under a title. Every pair
   * and every group takes one cell of the grid.
   */
  items: ReadonlyArray<KeyValuePairsProps.Item>;
  /**
   * The largest number of columns, from 1 to 4. Columns drop away as the space gets narrower, so every
   * column stays wide enough to read.
   */
  columns?: KeyValuePairsProps.Columns;
  /**
   * Accessible name of the list, when no visible heading names it.
   */
  ariaLabel?: string;
  /**
   * ID of an element that names the list, such as a nearby heading.
   */
  ariaLabelledby?: string;
}

export namespace KeyValuePairsProps {
  export type Columns = 1 | 2 | 3 | 4;

  export interface Pair {
    type?: 'pair';
    /**
     * The key, shown above the value.
     */
    label: React.ReactNode;
    /**
     * The value. Use `StatusIndicator`, `Link` or `ProgressBar` with the `key-value` variant for values that
     * are more than text.
     */
    value: React.ReactNode;
    /**
     * Content shown after the label, usually an info link.
     */
    info?: React.ReactNode;
    /**
     * ID of the label element, so other elements can refer to it.
     */
    id?: string;
  }

  export interface Group {
    type: 'group';
    /**
     * The title shown above the pairs of the group.
     */
    title?: React.ReactNode;
    /**
     * The pairs of the group, stacked in one cell.
     */
    items: ReadonlyArray<Pair>;
  }

  export type Item = Pair | Group;
}
