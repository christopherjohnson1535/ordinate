// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface SheetFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  disableContentPaddings?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A framed white sheet with a header, content and footer. Table and Cards draw their container variants
 * with it until those families get their own drawing; public containers use Container.
 */
export function SheetFrame({
  header,
  footer,
  disableContentPaddings = false,
  className,
  children,
  ...rest
}: SheetFrameProps) {
  return (
    <div {...rest} className={clsx(styles.root, className)}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={clsx(styles.content, disableContentPaddings && styles['no-paddings'])}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
