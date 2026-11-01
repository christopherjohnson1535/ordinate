// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TextContentProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTextContentProps extends TextContentProps {
  /**
   * Lets other components position the content. Not part of the public API.
   */
  className?: string;
}

export function InternalTextContent({ children, className, ...rest }: InternalTextContentProps) {
  return (
    <div {...rest} className={clsx(styles.root, className)}>
      {children}
    </div>
  );
}
