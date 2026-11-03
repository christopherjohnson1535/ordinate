// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TableRowProps extends BaseComponentProps {
  /**
   * The cells of the row: `TableHeaderCell`s in the head, `TableBodyCell`s in the body.
   */
  children?: React.ReactNode;
  /**
   * Shows the row as picked for an action: raised on the selected background, with an ink rule on its
   * leading edge. Pair it with a selection cell so the state is also announced.
   */
  selected?: boolean;
  /**
   * The position of the row among all rows of the data set, counting the header row as 1. Set it
   * together with `ariaRowcount` on `TableRoot` when the table shows only part of the data.
   */
  ariaRowindex?: number;
  /**
   * Called when the user clicks anywhere in the row, including on content inside its cells.
   */
  onClick?: NonCancelableEventHandler;
}
