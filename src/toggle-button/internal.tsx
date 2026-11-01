// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { ToggleButtonProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalToggleButtonProps extends ToggleButtonProps {
  /**
   * Lets other components position the button. Not part of the public API.
   */
  className?: string;
}

export const InternalToggleButton = React.forwardRef(
  (
    {
      pressed,
      onChange,
      children,
      variant = 'normal',
      iconName,
      pressedIconName,
      disabled = false,
      loading = false,
      loadingText,
      ariaLabel,
      className,
      ...rest
    }: InternalToggleButtonProps,
    ref: React.Ref<ToggleButtonProps.Ref>
  ) => {
    if (variant === 'icon' && !iconName) {
      warnOnce('ToggleButton', 'The icon variant needs an `iconName`.');
    }

    return (
      <InternalButton
        {...rest}
        ref={ref}
        className={clsx(styles['toggle-button'], pressed && styles.pressed, className)}
        variant={variant}
        formAction="none"
        iconName={pressed ? (pressedIconName ?? iconName) : iconName}
        disabled={disabled}
        loading={loading}
        loadingText={loadingText}
        ariaLabel={ariaLabel}
        aria-pressed={pressed}
        onClick={() => fireNonCancelableEvent(onChange, { pressed: !pressed })}
      >
        {children}
      </InternalButton>
    );
  }
);
