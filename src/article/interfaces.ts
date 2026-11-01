// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ArticleProps extends BaseComponentProps {
  /**
   * The story, written as plain HTML: paragraphs, `h2` to `h5` headings, lists, links, `blockquote`,
   * `figure` with `img` and `figcaption`, `pre` and `hr`. The elements are styled without classes.
   * Only elements written directly inside the article are styled, so other components placed in it
   * keep their own look.
   */
  children?: React.ReactNode;
  /**
   * A short opening paragraph that sums up the story, set larger than the text, such as "Six
   * bakers on why they still mill their own flour."
   */
  lead?: React.ReactNode;
  /**
   * Who wrote the story and when, such as "By Ada Gray · 4 November 2026". Shown between the lead and
   * the text.
   */
  byline?: React.ReactNode;
  /**
   * Enlarges the first letter of the first paragraph, as in a printed magazine. The letter stays part
   * of the text, so it is read and copied as usual.
   */
  dropCap?: boolean;
  /**
   * Sets the text in one or two columns. Two columns, with a rule between them, are used only where
   * the article is wide enough; on narrow screens the text stays in one column.
   */
  columns?: ArticleProps.Columns;
  /**
   * The length of a line of text: `narrow` for short, quick lines, `default` for comfortable reading,
   * or `wide`. With two columns it sets the length of each column's lines.
   */
  measure?: ArticleProps.Measure;
}

export namespace ArticleProps {
  export type Columns = 1 | 2;

  export type Measure = 'narrow' | 'default' | 'wide';
}
