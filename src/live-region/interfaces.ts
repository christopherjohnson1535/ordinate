// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface LiveRegionProps extends BaseComponentProps {
  /**
   * Content to announce. Its text is announced when the region mounts and again whenever the text changes.
   * Elements marked `aria-hidden` are left out, and images are read by their `aria-label`.
   */
  children?: React.ReactNode;
  /**
   * Announces right away, interrupting what the screen reader is saying. Use it only for messages the user
   * must hear immediately, such as a failed save. By default announcements wait for the screen reader to
   * finish.
   */
  assertive?: boolean;
  /**
   * Hides the content from view. It is still announced.
   */
  hidden?: boolean;
  /**
   * The element that wraps the content. Use `span` inside text and other inline content.
   */
  tagName?: LiveRegionProps.TagName;
}

export namespace LiveRegionProps {
  export type TagName = 'div' | 'span';
}
