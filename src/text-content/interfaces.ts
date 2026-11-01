// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TextContentProps extends BaseComponentProps {
  /**
   * Long-form content written as plain HTML: `p`, `h1` to `h5`, `ul`, `ol`, `a`, `code`, `pre`, `small`,
   * `strong`, `hr` and `blockquote`. The elements are styled without classes. Only elements written directly
   * inside `TextContent` are styled, so other components placed in it keep their own look.
   */
  children?: React.ReactNode;
}
