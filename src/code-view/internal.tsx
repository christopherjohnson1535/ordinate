// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useState } from 'react';
import type { Parser } from '@lezer/common';
import clsx from 'clsx';

import { getLoadedParser, loadParser, toLines } from './highlight';
import { CodeViewProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalCodeViewProps extends CodeViewProps {
  /**
   * Lets other components position the code view. Not part of the public API.
   */
  className?: string;
}

interface LoadedParser {
  language: CodeViewProps.Language;
  parser: Parser | null | undefined;
}

export function InternalCodeView({
  content,
  language = 'text',
  lineNumbers = true,
  highlightedLines,
  lineNotes,
  wrapLines = false,
  ariaLabel,
  ariaLabelledby,
  className,
  ...rest
}: InternalCodeViewProps) {
  const [loaded, setLoaded] = useState<LoadedParser>(() => ({ language, parser: getLoadedParser(language) }));
  const parser = loaded.language === language ? loaded.parser : getLoadedParser(language);

  useEffect(() => {
    if (parser !== undefined) {
      return;
    }
    let current = true;
    loadParser(language).then(
      next => current && setLoaded({ language, parser: next }),
      () => current && setLoaded({ language, parser: null })
    );
    return () => {
      current = false;
    };
  }, [language, parser]);

  const code = content.endsWith('\n') ? content.slice(0, -1) : content;
  const lines = useMemo(() => toLines(code, parser, language), [code, parser, language]);
  const highlighted = new Set(highlightedLines);
  const notes = new Map<number, string[]>();
  for (const note of lineNotes ?? []) {
    notes.set(note.line, [...(notes.get(note.line) ?? []), note.text]);
  }
  const named = Boolean(ariaLabel || ariaLabelledby);

  return (
    <div
      {...rest}
      className={clsx(styles.root, wrapLines && styles['wrap-lines'], className)}
      role={named ? 'region' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      // The code can be wider than its frame, and keyboard users need to reach it to scroll.
      tabIndex={0}
      dir="ltr"
    >
      <pre className={styles.pre}>
        <code className={styles.code}>
          {lines.map((segments, index) => {
            const number = index + 1;
            const isHighlighted = highlighted.has(number);
            return (
              <span
                key={number}
                className={clsx(styles.line, isHighlighted && styles['line-highlighted'])}
                data-line={number}
              >
                {lineNumbers && (
                  <span className={styles['line-number']} aria-hidden="true">
                    {number}
                  </span>
                )}
                <span className={styles['line-content']}>
                  {segments.map((segment, k) =>
                    segment.kinds ? (
                      <span key={k} className={clsx(segment.kinds.map(kind => styles[`token-${kind}`]))}>
                        {segment.text}
                      </span>
                    ) : (
                      segment.text
                    )
                  )}
                </span>
                {notes.get(number)?.map((text, k) => (
                  <span key={k} className={styles['line-note']}>
                    {text}
                  </span>
                ))}
                {'\n'}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
