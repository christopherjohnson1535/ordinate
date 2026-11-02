// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ConstructionTopLine, RuleEndMarks } from '../construction';

import styles from './styles.css.js';

export interface SheetFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A full-width drawn section with the header on top, for collections such as Table and Cards that need
 * the whole width for their content. It is drawn like Container: a construction line opens it and runs
 * past both ends, and the rule above the footer carries a hash mark at each end.
 */
export function SheetFrame({ header, footer, className, children, ...rest }: SheetFrameProps) {
  return (
    <div {...rest} className={clsx(styles.root, className)}>
      <ConstructionTopLine />
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && (
        <div className={styles.footer}>
          <RuleEndMarks />
          {footer}
        </div>
      )}
    </div>
  );
}
