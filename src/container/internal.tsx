// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ContainerProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalContainerProps extends ContainerProps {
  /**
   * Lets other components position the container. Not part of the public API.
   */
  className?: string;
}

export function InternalContainer({
  header,
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  footer,
  disableFooterPaddings = false,
  fitHeight = false,
  variant = 'default',
  className,
  children,
  ...rest
}: InternalContainerProps) {
  return (
    <div
      {...rest}
      className={clsx(styles.root, styles[`variant-${variant}`], fitHeight && styles['fit-height'], className)}
    >
      {header && <div className={clsx(styles.header, disableHeaderPaddings && styles['no-paddings'])}>{header}</div>}
      <div className={clsx(styles.content, disableContentPaddings && styles['no-paddings'])}>{children}</div>
      {footer && <div className={clsx(styles.footer, disableFooterPaddings && styles['no-paddings'])}>{footer}</div>}
    </div>
  );
}
