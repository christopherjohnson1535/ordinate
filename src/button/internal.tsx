// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { fireCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { ButtonProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalButtonProps extends ButtonProps {
  /**
   * Lets other components position the button. Not part of the public API.
   */
  className?: string;
}

export const InternalButton = React.forwardRef(
  (
    {
      children,
      variant = 'normal',
      disabled = false,
      href,
      formAction = 'submit',
      fullWidth = false,
      ariaLabel,
      iconSvg,
      onClick,
      className,
      ...rest
    }: InternalButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const elementRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => elementRef.current?.focus() }));

    if (variant === 'icon' && !ariaLabel) {
      warnOnce('Button', 'The icon variant needs an `ariaLabel`.');
    }

    const handleClick = (event: React.MouseEvent) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      const { button, ctrlKey, shiftKey, altKey, metaKey } = event;
      fireCancelableEvent(onClick, { button, ctrlKey, shiftKey, altKey, metaKey }, event);
    };

    const classNames = clsx(
      styles.button,
      styles[`variant-${variant}`],
      fullWidth && styles['full-width'],
      disabled && styles.disabled,
      className
    );

    const content =
      variant === 'icon' ? (
        <span className={styles.icon} aria-hidden="true">
          {iconSvg}
        </span>
      ) : (
        children
      );

    if (href !== undefined) {
      return (
        <a
          {...rest}
          ref={elementRef}
          className={classNames}
          href={disabled ? undefined : href}
          role={disabled ? 'link' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
          aria-label={ariaLabel}
          onClick={handleClick}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...rest}
        ref={elementRef}
        type={formAction === 'none' ? 'button' : 'submit'}
        className={classNames}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={handleClick}
      >
        {content}
      </button>
    );
  }
);
