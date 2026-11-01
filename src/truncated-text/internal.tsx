// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { warnOnce } from '../internal/logging';
import { InternalTooltip } from '../tooltip/internal';
import { TruncatedTextProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTruncatedTextProps extends TruncatedTextProps {
  /**
   * Shown in the tooltip instead of the text itself, and linked to the text as its accessible
   * description. Not part of the public API.
   */
  tooltipContent?: React.ReactNode;
  /**
   * Lets other components position the text. Not part of the public API.
   */
  className?: string;
  lang?: string;
}

function getLineCount(lines: number): number {
  if (!Number.isInteger(lines) || lines < 1) {
    warnOnce('TruncatedText', '`lines` must be a whole number of at least 1.');
    return Math.max(Math.round(lines) || 1, 1);
  }
  return lines;
}

// Line boxes can round up by a pixel without hiding anything, so height gets a pixel of slack.
function isCut(element: HTMLElement): boolean {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight + 1;
}

export function InternalTruncatedText({
  children,
  lines = 1,
  tooltipContent,
  className,
  lang,
  ...rest
}: InternalTruncatedTextProps) {
  const lineCount = getLineCount(lines);
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  const measure = () => {
    if (textRef.current) {
      setTruncated(isCut(textRef.current));
    }
  };
  useResizeObserver(textRef, measure);
  // New text can overflow without changing the size of the box, which the observer would miss.
  useEffect(measure, [children, lineCount]);

  return (
    <span {...rest} className={clsx(styles.root, className)}>
      {/* The tooltip stays mounted while the text fits, so the measured element is never replaced. */}
      <InternalTooltip
        content={truncated ? (tooltipContent ?? children) : null}
        suppressed={!truncated}
        describesTrigger={truncated && tooltipContent !== undefined}
      >
        <span
          ref={textRef}
          lang={lang}
          className={clsx(styles.text, lineCount > 1 && styles['multi-line'])}
          style={lineCount > 1 ? { WebkitLineClamp: lineCount } : undefined}
          // Only cut text needs a tab stop, so keyboard users can open the tooltip with the rest of it.
          tabIndex={truncated ? 0 : undefined}
          data-truncated={truncated ? 'true' : undefined}
        >
          {children}
        </span>
      </InternalTooltip>
    </span>
  );
}
