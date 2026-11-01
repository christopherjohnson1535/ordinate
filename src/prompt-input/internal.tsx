// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { PromptInputProps } from './interfaces';
import { useAutoGrow } from './use-auto-grow';

import styles from './styles.css.js';

function toAutoCompleteValue(autoComplete: boolean | string): string {
  if (typeof autoComplete === 'string') {
    return autoComplete;
  }
  return autoComplete ? 'on' : 'off';
}

export const InternalPromptInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onAction,
      minRows = 1,
      maxRows = 3,
      actionButtonIconName = 'send',
      actionButtonAriaLabel,
      disableActionButton = false,
      placeholder,
      disabled = false,
      readOnly = false,
      secondaryActions,
      secondaryContent,
      disableSecondaryActionsPaddings = false,
      autoFocus = false,
      spellcheck,
      disableBrowserAutocorrect = false,
      autoComplete = true,
      name,
      ariaLabel,
      ariaRequired,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...rest
    }: PromptInputProps,
    ref: React.Ref<PromptInputProps.Ref>
  ) => {
    const i18n = useInternalI18n('prompt-input');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      select: () => textareaRef.current?.select(),
    }));
    useAutoGrow(textareaRef, value, minRows, maxRows);

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const canSend = !disabled && !readOnly && !disableActionButton;

    const send = () => {
      if (canSend) {
        fireNonCancelableEvent(onAction, { value });
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (fireKeyboardEvent(onKeyDown, event)) {
        return;
      }
      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        // Enter sends, so it never adds a line break, even while sending is disabled.
        event.preventDefault();
        send();
      }
    };

    const actionButton = (
      <InternalButton
        className={styles['action-button']}
        variant="icon"
        formAction="none"
        iconName={actionButtonIconName}
        ariaLabel={i18n('actionButtonAriaLabel', actionButtonAriaLabel)}
        disabled={!canSend}
        onClick={send}
      />
    );

    return (
      <div
        {...rest}
        className={clsx(
          styles.root,
          field.invalid && styles.invalid,
          field.warning && !field.invalid && styles.warning,
          readOnly && !disabled && styles['read-only'],
          disabled && styles.disabled
        )}
      >
        {secondaryContent && <div className={styles['secondary-content']}>{secondaryContent}</div>}
        <div className={styles.main}>
          <textarea
            ref={textareaRef}
            id={field.controlId}
            className={styles.textarea}
            value={value}
            rows={minRows}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            name={name}
            autoFocus={autoFocus}
            spellCheck={spellcheck}
            autoCorrect={disableBrowserAutocorrect ? 'off' : undefined}
            autoCapitalize={disableBrowserAutocorrect ? 'off' : undefined}
            autoComplete={toAutoCompleteValue(autoComplete)}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel && !ariaLabelledby ? undefined : field.ariaLabelledby}
            aria-describedby={field.ariaDescribedby}
            aria-invalid={field.invalid ? 'true' : undefined}
            aria-required={ariaRequired ? 'true' : undefined}
            onChange={event => fireNonCancelableEvent(onChange, { value: event.target.value })}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp && (event => fireKeyboardEvent(onKeyUp, event))}
            onFocus={() => fireNonCancelableEvent(onFocus, null)}
            onBlur={() => fireNonCancelableEvent(onBlur, null)}
          />
          {!secondaryActions && <div className={styles['action-inline']}>{actionButton}</div>}
        </div>
        {secondaryActions && (
          <div className={styles.toolbar}>
            <div
              className={clsx(
                styles['secondary-actions'],
                disableSecondaryActionsPaddings && styles['secondary-actions-flush']
              )}
            >
              {secondaryActions}
            </div>
            <div className={styles['action-toolbar']}>{actionButton}</div>
          </div>
        )}
      </div>
    );
  }
);
