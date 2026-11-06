// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ContainerProps extends BaseComponentProps {
  /**
   * What the section holds. The kind colors its construction lines, hash marks, dimension and reference, so
   * people can tell kinds apart at a glance. The reference letter carries the same meaning for anyone who
   * cannot rely on color.
   * - `configuration` for settings people change, drawn in drafting blue.
   * - `resource` for things that exist or run, drawn in teal.
   * - `policy` for rules the system follows, drawn in plum.
   * - `neutral` for anything else, drawn in graphite.
   */
  kind?: ContainerProps.Kind;
  /**
   * A short reference set above the heading, as on a drawing set, such as `R1`. Other parts of the page can
   * point back to the section with it.
   */
  reference?: string;
  /**
   * The heading, set in the margin column beside the content.
   */
  heading?: React.ReactNode;
  /**
   * The heading level, from 2 to 6, so the section fits the outline of the page.
   */
  headingLevel?: number;
  /**
   * A sentence under the heading, in the margin column.
   */
  description?: React.ReactNode;
  /**
   * The label of the dimension line drawn along the top of the content, such as "7 services". Use it for a
   * measure of what the section holds.
   */
  measure?: React.ReactNode;
  /**
   * Buttons for the whole section, set at the top of the content column.
   */
  actions?: React.ReactNode;
  /**
   * Main content of the section.
   */
  children?: React.ReactNode;
  /**
   * A closing line under the content, such as a note and a link, drawn above a hash-marked rule.
   */
  footer?: React.ReactNode;
  /**
   * Makes the section fill the height of its parent. Long content scrolls inside it, and while it does the
   * content takes focus so it can be scrolled from the keyboard. Use it to give sections in the same row the
   * same height.
   */
  fitHeight?: boolean;
}

export namespace ContainerProps {
  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';
}
