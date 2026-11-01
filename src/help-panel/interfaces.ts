// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface HelpPanelProps extends BaseComponentProps {
  /**
   * The title of the panel, usually the name of the page or feature it explains. It is
   * rendered as a level 2 heading, so pass text rather than a heading element.
   */
  header?: React.ReactNode;
  /**
   * The help content. Plain HTML such as paragraphs, lists, `h3` headings, links and
   * `code` is styled the same way as `TextContent`.
   */
  children?: React.ReactNode;
  /**
   * Content below a rule at the end of the panel, usually an `h3` and a list of links
   * to further reading. Styled like the main content.
   */
  footer?: React.ReactNode;
  /**
   * Replaces the content with a loading indicator, for help that is fetched on demand.
   */
  loading?: boolean;
  /**
   * Text shown next to the loading indicator.
   */
  loadingText?: string;
}
