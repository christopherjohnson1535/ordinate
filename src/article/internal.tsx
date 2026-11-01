// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { warnOnce } from '../internal/logging';
import { InternalTextContent } from '../text-content/internal';
import { ArticleProps } from './interfaces';

import styles from './styles.css.js';

function getColumns(columns: number): ArticleProps.Columns {
  if (columns !== 1 && columns !== 2) {
    warnOnce('Article', '`columns` must be 1 or 2.');
    return 1;
  }
  return columns;
}

export function InternalArticle({
  children,
  lead,
  byline,
  dropCap = false,
  columns = 1,
  measure = 'default',
  ...rest
}: ArticleProps) {
  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        styles[`measure-${measure}`],
        styles[`columns-${getColumns(columns)}`],
        dropCap && styles['drop-cap']
      )}
    >
      <div className={styles.measure}>
        {lead && <p className={styles.lead}>{lead}</p>}
        {byline && <div className={styles.byline}>{byline}</div>}
        <InternalTextContent className={styles.body}>{children}</InternalTextContent>
      </div>
    </div>
  );
}
