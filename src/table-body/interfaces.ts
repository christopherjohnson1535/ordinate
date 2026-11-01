// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

/**
 * The body part of a table, rendered as a `<tbody>`. Place it after `TableHead` inside `TableRoot`.
 */
export interface TableBodyProps extends BaseComponentProps {
  /**
   * The body rows: `TableRow`s of `TableBodyCell`s.
   */
  children?: React.ReactNode;
}
