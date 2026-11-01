// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { FeedbackPanel, useFeedback } from '../internal/components/feedback-panel';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalTooltip } from '../tooltip/internal';
import { CopyToClipboardProps } from './interfaces';

import styles from './styles.css.js';

// Resolves once the text is on the clipboard; rejects when the browser has no clipboard API or refuses.
function writeToClipboard(text: string): Promise<void> {
  try {
    const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
    if (!clipboard?.writeText) {
      return Promise.reject(new Error('The clipboard is not available.'));
    }
    return clipboard.writeText(text);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function InternalCopyToClipboard({
  textToCopy,
  variant = 'button',
  copyButtonText,
  copyButtonAriaLabel,
  copySuccessText,
  copyErrorText,
  textToDisplay,
  popoverRenderWithPortal = false,
  disabled = false,
  disabledReason,
  ...rest
}: CopyToClipboardProps) {
  const i18n = useInternalI18n('copy-to-clipboard');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const { feedback, start, resolve, dismissHandlers } = useFeedback();

  const buttonText = i18n('copyButtonText', copyButtonText);
  const iconLabel = i18n('copyButtonAriaLabel', copyButtonAriaLabel ?? copyButtonText);
  const showsReason = disabled && Boolean(disabledReason);

  const renderMessage = (succeeded: boolean) => (
    <span className={styles.feedback}>
      <InternalIcon className={styles['feedback-icon']} name={succeeded ? 'check' : 'status-negative'} />
      <span>{succeeded ? i18n('copySuccessText', copySuccessText) : i18n('copyErrorText', copyErrorText)}</span>
    </span>
  );

  const copy = () => {
    const token = start();
    writeToClipboard(textToCopy).then(
      () => resolve(token, renderMessage(true)),
      () => resolve(token, renderMessage(false))
    );
  };

  const button = (
    <InternalButton
      className={clsx(styles.button, variant === 'inline' && styles['inline-button'])}
      variant={variant === 'button' ? 'normal' : 'icon'}
      formAction="none"
      iconName="copy"
      disabled={disabled}
      focusableWhenDisabled={showsReason}
      ariaLabel={variant === 'button' ? copyButtonAriaLabel : iconLabel}
      onClick={copy}
    >
      {variant === 'button' ? buttonText : undefined}
    </InternalButton>
  );

  return (
    <span {...rest} className={clsx(styles.root, styles[`variant-${variant}`])} {...dismissHandlers}>
      {variant === 'inline' && <span className={styles.text}>{textToDisplay ?? textToCopy}</span>}
      <span ref={triggerRef} className={styles.trigger}>
        {showsReason ? <InternalTooltip content={disabledReason}>{button}</InternalTooltip> : button}
      </span>
      {feedback && (
        <FeedbackPanel key={feedback.key} trigger={triggerRef} renderWithPortal={popoverRenderWithPortal}>
          {feedback.content}
        </FeedbackPanel>
      )}
    </span>
  );
}
