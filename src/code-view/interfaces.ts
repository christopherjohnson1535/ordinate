// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface CodeViewProps extends BaseComponentProps {
  /**
   * The code to show. A single newline at the end is ignored, so a file read from disk does not end
   * with an empty line.
   */
  content: string;
  /**
   * The language of the code, which sets the syntax coloring. The colors are the same as in
   * `CodeEditor`, except that unquoted YAML values are colored as the strings and numbers they are. Each language's parser loads the first time a code view uses it, so the code shows
   * uncolored for a moment the first time.
   * Defaults to `'text'`, which shows the code uncolored.
   */
  language?: CodeViewProps.Language;
  /**
   * Shows the line numbers in a column before the code.
   * Defaults to `true`.
   */
  lineNumbers?: boolean;
  /**
   * The lines to draw attention to, by number, starting from 1. They are set on the highlight color
   * with an accent mark on the leading edge.
   */
  highlightedLines?: ReadonlyArray<number>;
  /**
   * Short notes shown at the end of a line, such as "was 3" after a value that just changed. Notes are
   * not part of the code: they are left out when the code is copied.
   */
  lineNotes?: ReadonlyArray<CodeViewProps.LineNote>;
  /**
   * Wraps long lines instead of scrolling sideways.
   * Defaults to `false`.
   */
  wrapLines?: boolean;
  /**
   * Names the code view, such as the file name. A named code view is a region that screen reader users
   * can find in the landmarks list.
   */
  ariaLabel?: string;
  /**
   * The ID of an element that names the code view, such as a heading or a tab. Use it instead of
   * `ariaLabel` when the name is already on the page.
   */
  ariaLabelledby?: string;
}

export namespace CodeViewProps {
  export type Language =
    'javascript' | 'typescript' | 'json' | 'yaml' | 'html' | 'css' | 'python' | 'markdown' | 'text';

  export interface LineNote {
    /**
     * The line the note belongs to, starting from 1.
     */
    line: number;
    /**
     * The text of the note.
     */
    text: string;
  }
}
