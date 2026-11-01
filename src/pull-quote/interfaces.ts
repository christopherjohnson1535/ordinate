// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface PullQuoteProps extends BaseComponentProps {
  /**
   * The words being quoted, without quotation marks. Keep it to a sentence or two.
   */
  children?: React.ReactNode;
  /**
   * Who said it, and where, such as "Mara Lindqvist, head baker".
   */
  attribution?: React.ReactNode;
  /**
   * * `default` sets the quote large with the attribution below.
   * * `hanging` adds an oversized quotation mark that hangs beside the text.
   * * `ruled` draws rules above and below the quote, to set it off from the text around it.
   */
  variant?: PullQuoteProps.Variant;
}

export namespace PullQuoteProps {
  export type Variant = 'default' | 'hanging' | 'ruled';
}
