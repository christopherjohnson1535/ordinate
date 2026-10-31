// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useState } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { FormFieldContext } from '../internal/context/form-field-context';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { FormFieldProps } from './interfaces';

import styles from './styles.css.js';

const characterCountDelay = 1000;

// Screen readers would read the count after every keystroke, so their copy only updates once typing pauses.
function useSettledValue<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return settled;
}

export function InternalFormField({
  label,
  info,
  description,
  constraintText,
  characterCountText,
  errorText,
  warningText,
  errorIconAriaLabel,
  warningIconAriaLabel,
  controlId: controlIdProp,
  stretch = false,
  children,
  secondaryControl,
  ...rest
}: FormFieldProps) {
  const i18n = useInternalI18n('form-field');
  const baseId = useId();
  const controlId = controlIdProp ?? `${baseId}control`;
  const labelId = `${baseId}label`;
  const descriptionId = `${baseId}description`;
  const errorId = `${baseId}error`;
  const warningId = `${baseId}warning`;
  const constraintId = `${baseId}constraint`;
  const characterCountId = `${baseId}character-count`;

  const settledCharacterCount = useSettledValue(characterCountText, characterCountDelay);

  if (errorText && warningText) {
    warnOnce('FormField', '`warningText` is not shown while `errorText` is set.');
  }
  const showWarning = Boolean(warningText) && !errorText;

  const describedBy = [
    errorText && errorId,
    showWarning && warningId,
    description && descriptionId,
    constraintText && constraintId,
    characterCountText && characterCountId,
  ]
    .filter(Boolean)
    .join(' ');

  const sharedContext = {
    ariaLabelledby: label ? labelId : undefined,
    ariaDescribedby: describedBy || undefined,
    invalid: Boolean(errorText),
    warning: showWarning,
  };

  return (
    <div {...rest} className={styles.root}>
      {(label || info) && (
        <div className={styles['label-row']}>
          {label && (
            <label id={labelId} className={styles.label} htmlFor={controlId}>
              {label}
            </label>
          )}
          {info && <span className={styles.info}>{info}</span>}
        </div>
      )}
      {description && (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      )}
      <div className={clsx(styles.controls, stretch && styles.stretch)}>
        <div className={styles.control}>
          <FormFieldContext.Provider value={{ controlId, ...sharedContext }}>{children}</FormFieldContext.Provider>
        </div>
        {secondaryControl && (
          <div className={styles['secondary-control']}>
            <FormFieldContext.Provider value={sharedContext}>{secondaryControl}</FormFieldContext.Provider>
          </div>
        )}
      </div>
      {errorText && (
        <div id={errorId} className={styles.error}>
          <InternalIcon
            className={styles['message-icon']}
            name="status-negative"
            size="small"
            ariaLabel={i18n('errorIconAriaLabel', errorIconAriaLabel)}
          />
          <span>{errorText}</span>
        </div>
      )}
      {showWarning && (
        <div id={warningId} className={styles.warning}>
          <InternalIcon
            className={styles['message-icon']}
            name="status-warning"
            size="small"
            ariaLabel={i18n('warningIconAriaLabel', warningIconAriaLabel)}
          />
          <span>{warningText}</span>
        </div>
      )}
      {(constraintText || characterCountText) && (
        <div className={styles.hints}>
          {constraintText && (
            <span id={constraintId} className={styles.constraint}>
              {constraintText}
            </span>
          )}
          {characterCountText && (
            <>
              <span className={styles['character-count']} aria-hidden="true">
                {characterCountText}
              </span>
              <span id={characterCountId} className={styles['screenreader-only']}>
                {settledCharacterCount}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
