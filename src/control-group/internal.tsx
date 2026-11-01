// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { FormFieldContext } from '../internal/context/form-field-context';
import { childKey, flattenChildren } from '../internal/flatten-children';
import { ControlGroupProps } from './interfaces';

import styles from './styles.css.js';

export function InternalControlGroup({
  children,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ...rest
}: ControlGroupProps) {
  const field = useContext(FormFieldContext);
  // Only one control can own the field's control ID, or the label would point at several elements.
  const sharedField = { ...field, controlId: undefined };
  const items = flattenChildren(children);

  return (
    <div
      {...rest}
      role="group"
      className={styles.root}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : field.ariaLabelledby)}
      aria-describedby={ariaDescribedby}
    >
      {items.map((child, index) => (
        <div key={childKey(child, index)} className={styles.item}>
          <FormFieldContext.Provider value={index === 0 ? field : sharedField}>{child}</FormFieldContext.Provider>
        </div>
      ))}
    </div>
  );
}
