// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BaseComponentProps } from '../../base-component';

import styles from './styles.css.js';

export type BandTone = 'default' | 'accent' | 'inverted';
export type BandWidth = 'narrow' | 'default' | 'wide' | 'full';
export type BandSpacing = 'none' | 'small' | 'default' | 'large';

export interface BandProps extends BaseComponentProps {
  tag?: 'div' | 'section' | 'header' | 'footer';
  tone?: BandTone;
  width?: BandWidth;
  spacing?: BandSpacing;
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
}

/**
 * A full-width stripe of a website page. The background runs edge to edge while the content keeps
 * to a centered column, so bands stacked on one page line up. The inverted tone switches its content
 * to dark colors, which keeps text, links and buttons inside readable without variants of their own.
 */
export function Band({
  tag: Tag = 'div',
  tone = 'default',
  width = 'default',
  spacing = 'default',
  className,
  innerClassName,
  children,
  ...rest
}: BandProps) {
  return (
    <Tag {...rest} className={clsx(styles.band, styles[`tone-${tone}`], styles[`spacing-${spacing}`], className)}>
      <div className={clsx(styles.inner, styles[`width-${width}`], innerClassName)}>{children}</div>
    </Tag>
  );
}
