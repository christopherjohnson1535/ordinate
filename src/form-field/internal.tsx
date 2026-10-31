// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';

import { FormFieldContext } from '../internal/context/form-field-context';
import { FormFieldProps } from './interfaces';

import styles from './styles.css.js';

export function InternalFormField({
  label,
  description,
  constraintText,
  errorText,
  controlId: controlIdProp,
  children,
  ...rest
}: FormFieldProps) {
  const baseId = useId();
  const controlId = controlIdProp ?? `${baseId}control`;
  const labelId = `${baseId}label`;
  const descriptionId = `${baseId}description`;
  const errorId = `${baseId}error`;
  const constraintId = `${baseId}constraint`;

  const describedBy = [errorText && errorId, description && descriptionId, constraintText && constraintId]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={styles.root}>
      {label && (
        <label id={labelId} className={styles.label} htmlFor={controlId}>
          {label}
        </label>
      )}
      {description && (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      )}
      <div className={styles.control}>
        <FormFieldContext.Provider
          value={{
            controlId,
            ariaLabelledby: label ? labelId : undefined,
            ariaDescribedby: describedBy || undefined,
            invalid: Boolean(errorText),
          }}
        >
          {children}
        </FormFieldContext.Provider>
      </div>
      {errorText && (
        <div id={errorId} className={styles.error}>
          <svg className={styles['error-icon']} viewBox="0 0 12 11" aria-hidden="true" focusable="false">
            <path d="M6 1 11 10H1Z" />
          </svg>
          <span>{errorText}</span>
        </div>
      )}
      {constraintText && (
        <div id={constraintId} className={styles.constraint}>
          {constraintText}
        </div>
      )}
    </div>
  );
}
