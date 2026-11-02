// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ItemCardProps extends BaseComponentProps {
  /**
   * The title of the card, such as the name of the item. Often a link to the item's page.
   */
  header?: React.ReactNode;
  /**
   * Text below the header that says what the item is.
   */
  description?: React.ReactNode;
  /**
   * A short reference at the end of the header row, such as R1, set in the kind's color. Pair the
   * letter with the kind, so the meaning does not rest on color alone.
   */
  reference?: React.ReactNode;
  /**
   * What the item is, told by the color of the corner marks and the reference: `configuration`,
   * `resource`, `policy` or `neutral`. Neutral graphite when left out.
   */
  kind?: ItemCardProps.Kind;
  /**
   * Main content of the card, such as the item's properties.
   */
  children?: React.ReactNode;
  /**
   * Content at the bottom of the card, such as when the item last changed.
   */
  footer?: React.ReactNode;
  /**
   * Controls at the end of the header row, such as a button dropdown with the item's actions.
   */
  actions?: React.ReactNode;
  /**
   * An image or illustration across the top edge of the card. Give it its own alt text, or an
   * empty one if it is decoration.
   */
  media?: React.ReactNode;
  /**
   * Closes the corner marks into a frame in ink. Pair it with a control in `selectionControl` that
   * says the same, because the frame alone is not announced.
   */
  selected?: boolean;
  /**
   * A checkbox or radio button at the start of the header row that selects the card.
   */
  selectionControl?: React.ReactNode;
  /**
   * Dims the card, for an item that cannot be selected or used right now.
   */
  disabled?: boolean;
  /**
   * - `default` stands on its own, drawn with marks at its four corners in place of a border.
   * - `embedded` drops the marks and padding, for a card inside another surface such as a container
   *   or a popover.
   */
  variant?: ItemCardProps.Variant;
}

export namespace ItemCardProps {
  export type Variant = 'default' | 'embedded';
  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';
}
