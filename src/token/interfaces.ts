// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TokenProps extends BaseComponentProps {
  /**
   * The text of the token.
   */
  label: React.ReactNode;
  /**
   * A short secondary text after the label, such as an ID or a count. Only shown in the `normal` variant.
   */
  labelTag?: React.ReactNode;
  /**
   * Text below the label. Only shown in the `normal` variant.
   */
  description?: React.ReactNode;
  /**
   * Short texts shown in a row below the description, such as properties of the item. Only shown in
   * the `normal` variant.
   */
  tags?: ReadonlyArray<React.ReactNode>;
  /**
   * An icon before the label. Use the Icon component, and give it an `ariaLabel` if it carries meaning
   * the label does not.
   */
  icon?: React.ReactNode;
  /**
   * - `normal` is a ruled box with room for a description and tags, for a selection shown under a control.
   * - `inline` is a single small line that sits in running text or in an input. A label that does not
   *   fit is cut, and the full label shows in a tooltip.
   */
  variant?: TokenProps.Variant;
  /**
   * Dims the token and removes its dismiss button.
   */
  disabled?: boolean;
  /**
   * Shows the token as part of a read-only value: it stays at full contrast but cannot be dismissed.
   */
  readOnly?: boolean;
  /**
   * Called when the user dismisses the token. The token has a dismiss button only when this is set.
   */
  onDismiss?: NonCancelableEventHandler;
  /**
   * Accessible name of the dismiss button. Name the token in it, such as "Remove US East".
   */
  dismissLabel?: string;
  /**
   * Shown in the tooltip of an `inline` token whose label is cut, instead of the label. Use it when the
   * label is a short form of something longer, such as a file name of a full path.
   */
  tooltipContent?: React.ReactNode;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
}
