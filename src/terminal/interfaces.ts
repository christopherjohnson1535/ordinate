// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface TerminalProps extends BaseComponentProps {
  /**
   * The lines of the transcript, in order. Write commands with their prompt, such as `$ kubectl get
   * pods`: the terminal shows the text as given.
   */
  lines: ReadonlyArray<TerminalProps.Line>;
  /**
   * Wraps long lines with a hanging indent instead of scrolling sideways. Lines laid out in columns,
   * with three or more spaces between words like the tables many command-line tools print, never
   * wrap, so their columns stay aligned.
   * Defaults to `true`.
   */
  wrapLines?: boolean;
  /**
   * Names the transcript, such as "Output of the last command". A named terminal is a region that
   * screen reader users can find in the landmarks list.
   */
  ariaLabel?: string;
  /**
   * The ID of an element that names the transcript. Use it instead of `ariaLabel` when the name is
   * already on the page.
   */
  ariaLabelledby?: string;
}

export namespace TerminalProps {
  /**
   * - `command`: a line the user typed.
   * - `output`: what a command printed.
   * - `header`: the header row of a table in the output.
   * - `success` and `error`: a result, such as a check that passed or failed.
   * - `muted`: a note that matters less than the output around it.
   */
  export type LineType = 'command' | 'output' | 'header' | 'success' | 'error' | 'muted';

  export interface Line {
    /**
     * The text of the line.
     */
    text: string;
    /**
     * What kind of line it is, which sets its color and weight. Color is never the only difference:
     * pair `success` and `error` lines with words that say so, such as "PASS" and "FAIL".
     * Defaults to `'output'`.
     */
    type?: LineType;
    /**
     * Draws attention to the line in the accent color, such as output that appeared since the
     * previous step of a walkthrough. Applies to `output` lines.
     */
    highlighted?: boolean;
  }
}
