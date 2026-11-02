// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { CropMarks } from '../internal/components/crop-marks';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { isPlainLeftClick } from '../internal/link-click';
import { ActionCardProps } from './interfaces';

import styles from './styles.css.js';

export const InternalActionCard = React.forwardRef(
  (
    {
      header,
      description,
      children,
      iconName,
      kind = 'neutral',
      href,
      target,
      onClick,
      onFollow,
      disabled = false,
      ariaLabel,
      ...rest
    }: ActionCardProps,
    ref: React.Ref<ActionCardProps.Ref>
  ) => {
    const elementRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => elementRef.current?.focus() }));

    const baseId = useId();
    const headerId = `${baseId}header`;
    const descriptionId = `${baseId}description`;

    const content = (
      <>
        <CropMarks kind={kind} interactive={!disabled} />
        {iconName && (
          <span className={styles.icon}>
            <InternalIcon name={iconName} size="medium" variant={disabled ? 'disabled' : 'normal'} />
          </span>
        )}
        <span className={styles.text}>
          <span id={headerId} className={styles.header}>
            {header}
          </span>
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
          {children && <span className={styles.content}>{children}</span>}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          {/* A leader line with an arrowhead, like the one that points a note at the part it describes. */}
          <svg className={styles.leader} viewBox="0 0 28 12" focusable="false">
            <path d="M1 6h25M21.5 2l4.5 4-4.5 4" />
          </svg>
        </span>
      </>
    );

    const common = {
      ...rest,
      ref: elementRef,
      className: clsx(styles.root, disabled && styles.disabled),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabel ? undefined : headerId,
      'aria-describedby': description ? descriptionId : undefined,
    };

    if (href === undefined) {
      return (
        <button {...common} type="button" disabled={disabled} onClick={() => fireNonCancelableEvent(onClick, null)}>
          {content}
        </button>
      );
    }

    if (disabled) {
      return (
        <a {...common} role="link" aria-disabled="true">
          {content}
        </a>
      );
    }

    return (
      <a
        {...common}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={event => {
          if (isPlainLeftClick(event)) {
            fireCancelableEvent(onFollow, { href, target }, event);
          }
        }}
      >
        {content}
      </a>
    );
  }
);
