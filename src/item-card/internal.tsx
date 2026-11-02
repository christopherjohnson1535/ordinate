// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { CropMarks } from '../internal/components/crop-marks';
import { ItemCardProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalItemCardProps extends ItemCardProps {
  /**
   * Makes the whole card a pointer target, for a collection where clicking a card selects it.
   * Not part of the public API.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * Lets other components position the card. Not part of the public API.
   */
  className?: string;
}

export function InternalItemCard({
  header,
  description,
  reference,
  kind = 'neutral',
  children,
  footer,
  actions,
  media,
  selected = false,
  selectionControl,
  disabled = false,
  variant = 'default',
  onClick,
  className,
  ...rest
}: InternalItemCardProps) {
  const hasHeaderRow = Boolean(header || description || reference || actions || selectionControl);

  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        selected && styles.selected,
        disabled && styles.disabled,
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
    >
      {variant === 'default' && (
        <CropMarks kind={kind} selected={selected} interactive={Boolean(onClick) && !disabled} />
      )}
      {media && <div className={styles.media}>{media}</div>}
      {(hasHeaderRow || children) && (
        <div className={styles.body}>
          {hasHeaderRow && (
            <div className={styles['header-row']}>
              {selectionControl && <div className={styles.selection}>{selectionControl}</div>}
              <div className={styles.heading}>
                {header && <div className={styles.header}>{header}</div>}
                {description && <div className={styles.description}>{description}</div>}
              </div>
              {reference && <div className={clsx(styles.reference, styles[`kind-${kind}`])}>{reference}</div>}
              {actions && <div className={styles.actions}>{actions}</div>}
            </div>
          )}
          {children && <div className={styles.content}>{children}</div>}
        </div>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
