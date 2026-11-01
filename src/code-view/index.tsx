// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CodeViewProps } from './interfaces';
import { InternalCodeView } from './internal';

export type { CodeViewProps };

/**
 * Read-only code with line numbers, syntax coloring, highlighted lines and short notes at the end of
 * a line. Use it to show a file or a snippet that people read rather than edit; for editing, use
 * `CodeEditor`.
 */
export default function CodeView({
  content,
  language = 'text',
  lineNumbers = true,
  highlightedLines,
  lineNotes,
  wrapLines = false,
  ariaLabel,
  ariaLabelledby,
  ...props
}: CodeViewProps) {
  return (
    <InternalCodeView
      {...getBaseProps(props)}
      content={content}
      language={language}
      lineNumbers={lineNumbers}
      highlightedLines={highlightedLines}
      lineNotes={lineNotes}
      wrapLines={wrapLines}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
