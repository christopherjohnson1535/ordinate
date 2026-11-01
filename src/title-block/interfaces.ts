// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TitleBlockProps extends BaseComponentProps {
  /**
   * The cells of the block, in reading order. Each cell has:
   * * `label` (string): A short name for the value, such as "Project" or "Revision", shown small above it.
   * * `value` (ReactNode): The value. Plain text, or anything richer such as a `Link`, a `StatusIndicator`
   *   or a date.
   */
  items: ReadonlyArray<TitleBlockProps.Item>;
  /**
   * How many cells sit side by side:
   * * `auto` (the default): every cell on one row while there is room, wrapping onto more rows as the
   *   space narrows.
   * * A number from 1 to 6: at most that many cells on a row. Rows still hold fewer cells when the space
   *   is too narrow to keep every cell readable.
   */
  columns?: TitleBlockProps.Columns;
  /**
   * Accessible name of the block, when no visible heading names it.
   */
  ariaLabel?: string;
  /**
   * ID of an element that names the block, such as a nearby heading.
   */
  ariaLabelledby?: string;
}

export namespace TitleBlockProps {
  export type Columns = 'auto' | 1 | 2 | 3 | 4 | 5 | 6;

  export interface Item {
    label: string;
    value: React.ReactNode;
  }
}
