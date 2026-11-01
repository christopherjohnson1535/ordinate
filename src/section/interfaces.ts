// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface SectionProps extends BaseComponentProps {
  /**
   * What the section holds: text, pictures, cards or any other components.
   */
  children?: React.ReactNode;
  /**
   * The section's title, such as "Opening hours" or "Recent work".
   */
  heading?: React.ReactNode;
  /**
   * A line or two under the heading that says what the section is about.
   */
  description?: React.ReactNode;
  /**
   * The heading level, so the page reads in order. Sections directly under the page title use 2.
   */
  headingLevel?: SectionProps.HeadingLevel;
  /**
   * Shown beside the heading, usually a link or button such as "See all recipes".
   */
  actions?: React.ReactNode;
  /**
   * The background of the band.
   *
   * - `default` uses the page background.
   * - `accent` uses a soft tint to set the section apart.
   * - `inverted` uses dark ink with light text. Text, links and buttons inside switch with it.
   */
  tone?: SectionProps.Tone;
  /**
   * How wide the content may grow. The background always runs the full width of the page.
   *
   * - `narrow` suits reading, such as a story or a letter.
   * - `default` lines up with the site header and footer.
   * - `wide` suits galleries and long rows of cards.
   * - `full` lets the content run edge to edge, such as a large photograph.
   */
  width?: SectionProps.Width;
  /**
   * The space above and below the content.
   */
  spacing?: SectionProps.Spacing;
  /**
   * Ink rules, as on a printed page.
   *
   * - `top` draws a rule above the section.
   * - `bottom` draws a rule below it.
   * - `double` draws a thick and a thin rule above it.
   */
  rule?: SectionProps.Rule;
  /**
   * An ID for in-page links, so a link to `#menu` scrolls to the section with `id="menu"`.
   */
  id?: string;
}

export namespace SectionProps {
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export type Tone = 'default' | 'accent' | 'inverted';

  export type Width = 'narrow' | 'default' | 'wide' | 'full';

  export type Spacing = 'none' | 'small' | 'default' | 'large';

  export type Rule = 'none' | 'top' | 'bottom' | 'double';
}
