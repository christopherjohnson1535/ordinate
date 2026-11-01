// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TerminalProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTerminalProps extends TerminalProps {
  /**
   * Lets other components position the terminal. Not part of the public API.
   */
  className?: string;
}

// Three or more spaces between words: a table whose columns must stay aligned.
const columnsPattern = /\S {3,}\S/;

export function InternalTerminal({
  lines,
  wrapLines = true,
  ariaLabel,
  ariaLabelledby,
  className,
  ...rest
}: InternalTerminalProps) {
  const named = Boolean(ariaLabel || ariaLabelledby);
  return (
    <pre
      {...rest}
      className={clsx(styles.root, wrapLines && styles['wrap-lines'], className)}
      role={named ? 'region' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      // Output can be wider than the frame, and keyboard users need to reach it to scroll.
      tabIndex={0}
      dir="ltr"
    >
      {lines.map(({ text, type = 'output', highlighted }, index) => (
        <span
          key={index}
          className={clsx(
            styles.line,
            styles[`type-${type}`],
            highlighted && type === 'output' && styles.highlighted,
            columnsPattern.test(text) && styles.columns
          )}
        >
          {/* A space keeps an empty line one line tall. */}
          {text || ' '}
          {'\n'}
        </span>
      ))}
    </pre>
  );
}
