// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { RuleEndMarks } from '../internal/components/construction';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { ModalProps } from './interfaces';

import styles from './styles.css.js';

const bodyOpenClassName = 'ord-modal-open';

export function InternalModal({
  kind = 'neutral',
  reference,
  visible,
  onDismiss,
  header,
  footer,
  children,
  size = 'medium',
  position = 'center',
  disableContentPaddings = false,
  hideDismissButton = false,
  closeAriaLabel,
  ...rest
}: ModalProps) {
  const i18n = useInternalI18n('modal');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (visible && !dialog.open) {
      dialog.showModal();
    } else if (!visible && dialog.open) {
      dialog.close();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    document.body.classList.add(bodyOpenClassName);
    return () => document.body.classList.remove(bodyOpenClassName);
  }, [visible]);

  const dismiss = (reason: ModalProps.DismissReason) => fireNonCancelableEvent(onDismiss, { reason });

  return (
    // The dialog itself only receives clicks on its backdrop; content clicks land on the container.
    <dialog
      {...rest}
      ref={dialogRef}
      className={clsx(styles.dialog, styles[`kind-${kind}`], styles[`size-${size}`], styles[`position-${position}`])}
      aria-labelledby={header ? headingId : undefined}
      onCancel={event => {
        event.preventDefault();
        dismiss('keyboard');
      }}
      onClick={event => {
        if (event.target === event.currentTarget) {
          dismiss('overlay');
        }
      }}
    >
      <div className={styles.container}>
        {(header || reference || !hideDismissButton) && (
          <div className={clsx(styles.header, hideDismissButton && styles['header-without-dismiss'])}>
            <div className={styles.title}>
              {reference && <span className={styles.reference}>{reference}</span>}
              {header && (
                <h2 id={headingId} className={styles.heading}>
                  {header}
                </h2>
              )}
            </div>
            {!hideDismissButton && (
              <InternalButton
                className={styles['close-button']}
                variant="icon"
                formAction="none"
                iconName="close"
                ariaLabel={i18n('closeAriaLabel', closeAriaLabel)}
                onClick={() => dismiss('closeButton')}
              />
            )}
          </div>
        )}
        <div className={clsx(styles.content, disableContentPaddings && styles['no-paddings'])}>{children}</div>
        {footer && (
          <div className={styles.footer}>
            <RuleEndMarks kind={kind} />
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
