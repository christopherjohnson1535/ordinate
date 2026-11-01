// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ContainerProps extends BaseComponentProps {
  /**
   * The heading area of the container, drawn as a sheet label with an ink rule under it. Use the Header
   * component, or plain text for a short label set in small mono capitals, like "Environment".
   */
  header?: React.ReactNode;
  /**
   * Removes the padding around the header.
   */
  disableHeaderPaddings?: boolean;
  /**
   * Main content of the container.
   */
  children?: React.ReactNode;
  /**
   * Removes the padding around the content, for content that sets its own, such as a table or an image.
   */
  disableContentPaddings?: boolean;
  /**
   * Footer of the container, separated from the content by a line.
   */
  footer?: React.ReactNode;
  /**
   * Removes the padding around the footer.
   */
  disableFooterPaddings?: boolean;
  /**
   * Makes the container fill the height of its parent. Short content leaves empty space at the bottom, and long
   * content scrolls inside the container. Use it to give containers in the same row the same height.
   */
  fitHeight?: boolean;
  /**
   * - `default` is for a container on its own.
   * - `stacked` is for containers placed directly one after another. Adjoining stacked containers share a border
   *   and keep square corners where they meet.
   */
  variant?: ContainerProps.Variant;
}

export namespace ContainerProps {
  export type Variant = 'default' | 'stacked';
}
