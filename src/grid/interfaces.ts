// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface GridProps extends BaseComponentProps {
  /**
   * How each child sits on the 12-column grid, in the same order as the children. Each entry can set:
   *
   * - `colspan`: how many columns the child spans, from 1 to 12. Defaults to 12.
   * - `offset`: how many columns to leave empty before the child.
   * - `push`: moves the child toward the end of the row by this many columns, without moving the others.
   * - `pull`: moves the child toward the start of the row by this many columns, without moving the others.
   *
   * Each value is a number, or an object with a value per breakpoint: `default`, `xxs` (465 pixels),
   * `xs` (688), `s` (912), `m` (1120), `l` (1280) and `xl` (1840). Breakpoints compare against the width
   * of the grid's container, not the viewport. A breakpoint without a value takes the next smaller one.
   * A child that does not fit in the rest of a row starts a new row.
   */
  gridDefinition?: ReadonlyArray<GridProps.ElementDefinition>;
  /**
   * Removes the space between columns and rows.
   */
  disableGutters?: boolean;
  /**
   * The content of the grid. Each child takes one entry of `gridDefinition`.
   */
  children?: React.ReactNode;
}

export namespace GridProps {
  export interface BreakpointMapping {
    default?: number;
    xxs?: number;
    xs?: number;
    s?: number;
    m?: number;
    l?: number;
    xl?: number;
  }

  export type Value = number | BreakpointMapping;

  export interface ElementDefinition {
    colspan?: Value;
    offset?: Value;
    pull?: Value;
    push?: Value;
  }
}
