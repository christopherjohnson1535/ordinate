// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ExpandableSectionProps extends BaseComponentProps {
  /**
   * How the section is drawn.
   *
   * - `default` is a plain disclosure inside other content.
   * - `footer` is a lighter disclosure for the footer of a container, which draws the rule above it.
   * - `container` draws the section as a container whose header opens and closes it.
   * - `stacked` is a `container` that shares its borders with the stacked containers next to it.
   * - `navigation` is a quiet disclosure for side navigation.
   * - `inline` is a compact disclosure that sits in running content.
   */
  variant?: ExpandableSectionProps.Variant;
  /**
   * The header text. It becomes the label of the button that opens and closes the section.
   */
  headerText?: React.ReactNode;
  /**
   * Header content, used when `headerText` is not set. Keep it to text: it is rendered inside the button.
   */
  header?: React.ReactNode;
  /**
   * Supporting text shown below the header. Not shown in the `navigation` and `inline` variants.
   */
  headerDescription?: React.ReactNode;
  /**
   * Secondary text shown after the header text, such as a count of items: `(12)`. Only shown in the
   * `container` and `stacked` variants.
   */
  headerCounter?: React.ReactNode;
  /**
   * Content shown after the header, outside the button, usually an info link. Only shown in the `container`
   * and `stacked` variants.
   */
  headerInfo?: React.ReactNode;
  /**
   * Actions shown at the end of the header row, outside the button. Only shown in the `container` and
   * `stacked` variants.
   */
  headerActions?: React.ReactNode;
  /**
   * Accessible name of the button, when the header text alone does not describe the section.
   */
  headerAriaLabel?: string;
  /**
   * Whether the section is open. Setting it makes the section controlled: update it in `onChange`.
   */
  expanded?: boolean;
  /**
   * Whether the section starts open, when `expanded` is not set.
   */
  defaultExpanded?: boolean;
  /**
   * Called when the user opens or closes the section. `event.detail.expanded` is the new state.
   */
  onChange?: NonCancelableEventHandler<ExpandableSectionProps.ChangeDetail>;
  /**
   * Removes the padding around the content, for content that draws its own edges, such as a table.
   */
  disableContentPaddings?: boolean;
  /**
   * Renders the header inside this heading element. The `container` and `stacked` variants use `h2` by
   * default; the others render no heading unless this is set.
   */
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
  /**
   * The content shown while the section is open.
   */
  children?: React.ReactNode;
}

export namespace ExpandableSectionProps {
  export type Variant = 'default' | 'footer' | 'container' | 'stacked' | 'navigation' | 'inline';

  export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  export interface ChangeDetail {
    expanded: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the button that opens and closes the section.
     */
    focus(): void;
  }
}
