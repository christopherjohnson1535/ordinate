// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { CancelableEventHandler, fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { TextareaProps } from './interfaces';

import styles from './styles.css.js';

function toAutoCompleteValue(autoComplete: boolean | string): string {
  if (typeof autoComplete === 'string') {
    return autoComplete;
  }
  return autoComplete ? 'on' : 'off';
}

function fireKeyEvent(
  handler: CancelableEventHandler<TextareaProps.KeyDetail> | undefined,
  event: React.KeyboardEvent
) {
  const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
  const isComposing = event.nativeEvent.isComposing;
  fireCancelableEvent(handler, { key, ctrlKey, shiftKey, altKey, metaKey, isComposing }, event);
}

export const InternalTextarea = React.forwardRef(
  (
    {
      value,
      onChange,
      rows = 3,
      resize = 'vertical',
      placeholder,
      disabled = false,
      readOnly = false,
      warning = false,
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
      ...rest
    }: TextareaProps,
    ref: React.Ref<TextareaProps.Ref>
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      select: () => textareaRef.current?.select(),
    }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid });

    return (
      <div {...rest} className={styles.root}>
        <textarea
          ref={textareaRef}
          id={field.controlId}
          className={clsx(
            styles.textarea,
            styles[`resize-${resize}`],
            field.invalid && styles.invalid,
            warning && !field.invalid && styles.warning
          )}
          value={value}
          rows={rows}
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
          aria-labelledby={field.ariaLabelledby}
          aria-describedby={field.ariaDescribedby}
          aria-invalid={field.invalid ? 'true' : undefined}
          aria-required={ariaRequired ? 'true' : undefined}
          onChange={event => fireNonCancelableEvent(onChange, { value: event.target.value })}
          onKeyDown={onKeyDown && (event => fireKeyEvent(onKeyDown, event))}
          onKeyUp={onKeyUp && (event => fireKeyEvent(onKeyUp, event))}
          onFocus={() => fireNonCancelableEvent(onFocus, null)}
          onBlur={() => fireNonCancelableEvent(onBlur, null)}
        />
      </div>
    );
  }
);
