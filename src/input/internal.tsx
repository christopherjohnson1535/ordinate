// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { useCommandLine } from '../internal/context/command-line-context';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { InputProps } from './interfaces';

import styles from './styles.css.js';

function toAutoCompleteValue(autoComplete: boolean | string): string {
  if (typeof autoComplete === 'string') {
    return autoComplete;
  }
  return autoComplete ? 'on' : 'off';
}

export interface InternalInputProps extends InputProps {
  /**
   * Attributes for the native input that other components need, such as the combobox role and
   * state of an autosuggest. Not part of the public API. They are applied last, so they win.
   */
  nativeInputAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Draws the input as a command line: a prompt mark, mono type and a `/` key hint, with `/`
   * anywhere on the page moving focus to it. Defaults to whether the input sits in a container
   * that asks for a command line, such as the search slot of the top navigation. Not part of the
   * public API.
   */
  commandLine?: boolean;
}

const commandLineShortcut = '/';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

// Moves focus to the input when the user presses the shortcut outside any field.
function useShortcutFocus(enabled: boolean, inputRef: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const modified = event.ctrlKey || event.metaKey || event.altKey;
      if (event.key !== commandLineShortcut || modified || event.defaultPrevented || isTypingTarget(event.target)) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, inputRef]);
}

export const InternalInput = React.forwardRef(
  (
    {
      value,
      onChange,
      type = 'text',
      inputMode,
      step,
      placeholder,
      inlineLabelText,
      disabled = false,
      readOnly = false,
      autoFocus,
      ariaLabel,
      ariaRequired,
      clearAriaLabel,
      name,
      autoComplete = true,
      disableBrowserAutocorrect = false,
      spellcheck,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      nativeInputAttributes,
      commandLine: commandLineProp,
      ...rest
    }: InternalInputProps,
    ref: React.Ref<InputProps.Ref>
  ) => {
    const i18n = useInternalI18n('input');
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      select: () => inputRef.current?.select(),
    }));

    const generatedId = useId();
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const inputId = field.controlId ?? (inlineLabelText ? `${generatedId}input` : undefined);
    const isSearch = type === 'search';
    const showClearButton = isSearch && value !== '' && !disabled && !readOnly;
    const commandLineFromContext = useCommandLine();
    const commandLine = (commandLineProp ?? commandLineFromContext) && !inlineLabelText;
    const shortcutEnabled = commandLine && !disabled && !readOnly;
    useShortcutFocus(shortcutEnabled, inputRef);

    const clear = () => {
      inputRef.current?.focus();
      fireNonCancelableEvent(onChange, { value: '' });
    };

    return (
      <div
        {...rest}
        className={clsx(
          styles.root,
          isSearch && styles['root-search'],
          commandLine && styles['command-line'],
          field.invalid && styles.invalid,
          field.warning && !field.invalid && styles.warning,
          readOnly && !disabled && styles['read-only'],
          disabled && styles.disabled
        )}
      >
        {commandLine ? (
          <span className={styles.prompt} aria-hidden="true">
            {'\u203a'}
          </span>
        ) : (
          isSearch && <InternalIcon className={styles['search-icon']} name="search" />
        )}
        <div className={styles.main}>
          {inlineLabelText && (
            <label className={styles['inline-label']} htmlFor={inputId}>
              {inlineLabelText}
            </label>
          )}
          <input
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type={type}
            inputMode={inputMode}
            step={step}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            name={name}
            autoComplete={toAutoCompleteValue(autoComplete)}
            autoCorrect={disableBrowserAutocorrect ? 'off' : undefined}
            autoCapitalize={disableBrowserAutocorrect ? 'off' : undefined}
            spellCheck={spellcheck}
            aria-label={ariaLabel}
            // An ariaLabel set on the input names it, so it replaces the label from the form field.
            aria-labelledby={ariaLabel && !ariaLabelledby ? undefined : field.ariaLabelledby}
            aria-describedby={field.ariaDescribedby}
            aria-invalid={field.invalid ? 'true' : undefined}
            aria-required={ariaRequired ? 'true' : undefined}
            aria-keyshortcuts={shortcutEnabled ? commandLineShortcut : undefined}
            onChange={event => fireNonCancelableEvent(onChange, { value: event.target.value })}
            onFocus={() => fireNonCancelableEvent(onFocus, null)}
            onBlur={() => fireNonCancelableEvent(onBlur, null)}
            onKeyDown={onKeyDown && (event => fireKeyboardEvent(onKeyDown, event))}
            onKeyUp={onKeyUp && (event => fireKeyboardEvent(onKeyUp, event))}
            // Browsers change a focused number input when the page scrolls over it, which is easy to do by accident.
            onWheel={type === 'number' ? event => event.currentTarget.blur() : undefined}
            {...nativeInputAttributes}
          />
        </div>
        {shortcutEnabled && value === '' && (
          <kbd className={styles['key-hint']} aria-hidden="true">
            {commandLineShortcut}
          </kbd>
        )}
        {showClearButton && (
          <InternalButton
            className={styles['clear-button']}
            variant="icon"
            formAction="none"
            iconName="close"
            ariaLabel={i18n('clearAriaLabel', clearAriaLabel)}
            onClick={clear}
          />
        )}
      </div>
    );
  }
);
