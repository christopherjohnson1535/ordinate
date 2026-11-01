// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { FloatingPanel } from '../internal/components/floating-panel';
import { getFirstTabbable, wrapTabFocus } from '../internal/focus';
import { useInternalI18n } from '../internal/i18n/context';
import { PopoverProps } from './interfaces';

import styles from './styles.css.js';

export const InternalPopover = React.forwardRef(
  (
    {
      children,
      content,
      header,
      position = 'right',
      size = 'medium',
      fixedWidth = false,
      triggerType = 'text',
      wrapTriggerText = true,
      dismissButton = true,
      dismissAriaLabel,
      renderWithPortal = false,
      ...rest
    }: PopoverProps,
    ref: React.Ref<PopoverProps.Ref>
  ) => {
    const i18n = useInternalI18n('popover');
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLSpanElement>(null);
    const triggerRef = useRef<HTMLButtonElement & HTMLSpanElement>(null);
    const panelRef = useRef<HTMLSpanElement>(null);
    const baseId = useId();
    const triggerId = `${baseId}trigger`;
    const headerId = `${baseId}header`;
    const panelId = `${baseId}panel`;

    const focusTrigger = () => {
      const trigger = triggerRef.current;
      if (trigger) {
        // A custom trigger wraps the consumer's own focusable element.
        (triggerType === 'text' ? trigger : (getFirstTabbable(trigger) ?? trigger)).focus();
      }
    };

    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) {
        focusTrigger();
      }
    };

    useImperativeHandle(ref, () => ({ focus: focusTrigger, dismiss: () => setOpen(false) }));

    useEffect(() => {
      if (open && dismissButton) {
        panelRef.current?.focus({ preventScroll: true });
      }
    }, [open, dismissButton]);

    useEffect(() => {
      if (!open) {
        return;
      }
      const handleMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [open]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        // Stops a surrounding modal or dialog from closing too.
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    };

    const toggle = () => setOpen(current => !current);

    const trigger =
      triggerType === 'text' ? (
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className={clsx(styles.trigger, styles['trigger-text'], !wrapTriggerText && styles['no-wrap'])}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={toggle}
        >
          {children}
        </button>
      ) : (
        <span
          ref={triggerRef}
          id={triggerId}
          className={clsx(styles.trigger, styles['trigger-custom'])}
          onClick={toggle}
        >
          {children}
        </span>
      );

    // Sits on the first line of the header, or of the content when there is no header.
    const dismiss = dismissButton && (
      <span className={styles.dismiss}>
        <InternalButton
          className={styles['dismiss-button']}
          variant="icon"
          formAction="none"
          iconName="close"
          ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)}
          onClick={() => close(true)}
        />
      </span>
    );

    return (
      <span {...rest} ref={rootRef} className={styles.root} onKeyDown={handleKeyDown}>
        {trigger}
        {open && (
          <FloatingPanel
            ref={panelRef}
            id={panelId}
            trigger={triggerRef}
            preferredSide={position}
            renderWithPortal={renderWithPortal}
            role="dialog"
            aria-labelledby={header ? headerId : triggerId}
            tabIndex={-1}
            className={clsx(styles.panel, styles[`size-${size}`], fixedWidth && styles['fixed-width'])}
            onKeyDown={dismissButton ? event => wrapTabFocus(event, event.currentTarget) : undefined}
          >
            {header && (
              <span className={styles['header-row']}>
                <span id={headerId} className={styles.header}>
                  {header}
                </span>
                {dismiss}
              </span>
            )}
            <span className={styles.body}>
              <span className={styles.content}>{content}</span>
              {!header && dismiss}
            </span>
          </FloatingPanel>
        )}
      </span>
    );
  }
);
