// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { fireCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { ButtonProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalButtonProps extends ButtonProps {
  /**
   * Lets other components position the button. Not part of the public API.
   */
  className?: string;
  /**
   * Lets a composite widget, such as a toolbar, manage the tab stop. Not part of the public API.
   */
  tabIndex?: number;
  /**
   * Keeps a disabled button in the tab order, marked with `aria-disabled`, so a reason for
   * it being disabled can be shown on focus. Not part of the public API.
   */
  focusableWhenDisabled?: boolean;
}

export const InternalButton = React.forwardRef(
  (
    {
      children,
      variant = 'normal',
      disabled = false,
      loading = false,
      loadingText,
      iconName,
      iconAlign = 'left',
      iconSvg,
      wrapText = true,
      href,
      target: targetProp,
      rel,
      external = false,
      externalIconAriaLabel,
      download,
      formAction = 'submit',
      form,
      fullWidth = false,
      ariaLabel,
      ariaExpanded,
      ariaHaspopup,
      ariaControls,
      onClick,
      className,
      tabIndex,
      focusableWhenDisabled = false,
      ...rest
    }: InternalButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const i18n = useInternalI18n('button');
    const elementRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => elementRef.current?.focus() }));

    const isIconOnly = variant === 'icon';
    const hasIcon = Boolean(iconName || iconSvg);
    const inactive = disabled || loading;
    const nativeDisabled = disabled && !focusableWhenDisabled;
    const target = targetProp ?? (external && href !== undefined ? '_blank' : undefined);

    if (isIconOnly && !ariaLabel) {
      warnOnce('Button', 'The icon variant needs an `ariaLabel`.');
    }
    if (external && hasIcon && iconAlign === 'right' && !isIconOnly) {
      warnOnce('Button', 'A right-aligned icon and the external icon should not be used together.');
    }

    const handleClick = (event: React.MouseEvent) => {
      if (inactive) {
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
      !wrapText && styles['no-wrap'],
      disabled && styles.disabled,
      loading && styles.loading,
      className
    );

    const icon = hasIcon ? (
      <InternalIcon
        className={clsx(styles.icon, styles[`icon-${isIconOnly ? 'left' : iconAlign}`])}
        name={iconName}
        svg={iconSvg}
      />
    ) : null;
    const leftIcon = loading ? (
      <span className={styles['loading-indicator']} aria-hidden="true" />
    ) : (
      (isIconOnly || iconAlign === 'left') && icon
    );
    const rightIcon = !isIconOnly && iconAlign === 'right' && icon;

    const content = (
      <>
        {leftIcon}
        {!isIconOnly && children !== undefined && children !== null && (
          <span className={styles.content}>{children}</span>
        )}
        {!isIconOnly && external && ' '}
        {!isIconOnly && external && (
          <InternalIcon
            className={styles['external-icon']}
            name="external"
            ariaLabel={target === '_blank' ? i18n('externalIconAriaLabel', externalIconAriaLabel) : undefined}
          />
        )}
        {rightIcon}
      </>
    );

    // A live region is only announced reliably when it is already in the page before its text changes.
    const loadingAnnouncement = loadingText !== undefined && (
      <span className={styles['loading-text']} aria-live="polite">
        {loading ? loadingText : ''}
      </span>
    );

    const ariaProps = {
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
      'aria-haspopup': ariaHaspopup,
      'aria-controls': ariaControls,
    };

    if (href !== undefined) {
      return (
        <>
          <a
            {...rest}
            {...ariaProps}
            ref={elementRef}
            className={classNames}
            href={inactive ? undefined : href}
            target={target}
            rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
            download={download}
            role={inactive ? 'link' : undefined}
            tabIndex={tabIndex ?? (inactive && !nativeDisabled ? 0 : undefined)}
            aria-disabled={inactive ? 'true' : undefined}
            onClick={handleClick}
          >
            {content}
          </a>
          {loadingAnnouncement}
        </>
      );
    }

    return (
      <>
        <button
          {...rest}
          {...ariaProps}
          ref={elementRef}
          type={formAction === 'none' ? 'button' : 'submit'}
          form={form}
          className={classNames}
          disabled={nativeDisabled}
          tabIndex={tabIndex}
          aria-disabled={inactive && !nativeDisabled ? 'true' : undefined}
          onClick={handleClick}
        >
          {content}
        </button>
        {loadingAnnouncement}
      </>
    );
  }
);
