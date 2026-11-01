// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TruncatedTextProps extends BaseComponentProps {
  /**
   * The text to show. When it does not fit, it is cut with an ellipsis and the full text shows in a
   * tooltip on hover and on keyboard focus. Keep it to text and inline elements, such as a `strong`.
   */
  children?: React.ReactNode;
  /**
   * The number of lines the text may take before it is cut. Defaults to one line.
   */
  lines?: number;
}
