// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface DrawerProps extends BaseComponentProps {
  /**
   * The title of the drawer, rendered as a level 2 heading. Pass text rather than a
   * heading element.
   */
  header?: React.ReactNode;
  /**
   * Main content of the drawer. It scrolls with the drawer.
   */
  children?: React.ReactNode;
  /**
   * Content pinned to the bottom of the drawer, such as actions. It stays in view while
   * the content scrolls.
   */
  footer?: React.ReactNode;
  /**
   * Replaces the content with a loading indicator.
   */
  loading?: boolean;
  /**
   * Text shown next to the loading indicator.
   */
  loadingText?: string;
  /**
   * Removes the padding around the content, for content that brings its own, such as a
   * full-bleed list.
   */
  disableContentPaddings?: boolean;
}
