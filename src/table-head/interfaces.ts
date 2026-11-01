// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

/**
 * The header part of a table, rendered as a `<thead>`. Place it first inside `TableRoot`.
 */
export interface TableHeadProps extends BaseComponentProps {
  /**
   * The header row: a `TableRow` of `TableHeaderCell`s.
   */
  children?: React.ReactNode;
}
