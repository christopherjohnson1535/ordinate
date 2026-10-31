// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface NativeControlAttributes {
  id: string;
  className: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export interface AbstractSwitchProps {
  /**
   * The root class of the component built on this layout, used by its test-utils wrapper.
   */
  className: string;
  controlId?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  /**
   * Renders the native input with the given attributes spread onto it.
   */
  nativeControl: (attributes: NativeControlAttributes) => React.ReactNode;
  /**
   * The drawn control. It sits under the transparent native input, which takes the clicks.
   */
  styledControl: React.ReactNode;
}

function joinIds(...ids: (string | undefined | false)[]): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined;
}

/**
 * Shared layout for checkbox, radio button and toggle: a native input laid over a
 * drawn control, followed by a label and an optional description.
 */
export function AbstractSwitch({
  className,
  controlId,
  label,
  description,
  disabled = false,
  ariaLabelledby,
  ariaDescribedby,
  nativeControl,
  styledControl,
  ...rest
}: AbstractSwitchProps) {
  const baseId = useId();
  const id = controlId ?? `${baseId}control`;
  const labelId = `${baseId}label`;
  const descriptionId = `${baseId}description`;

  // The <label for> names the input on its own. Once aria-labelledby comes from a form
  // field it replaces that name, so the switch's own label has to be listed there too.
  const labelledBy = ariaLabelledby ? joinIds(ariaLabelledby, Boolean(label) && labelId) : undefined;
  const describedBy = joinIds(ariaDescribedby, Boolean(description) && descriptionId);

  return (
    <span {...rest} className={clsx(styles.root, disabled && styles.disabled, className)}>
      <span className={styles.control}>
        {nativeControl({
          id,
          className: styles['native-input'],
          'aria-labelledby': labelledBy,
          'aria-describedby': describedBy,
        })}
        {styledControl}
      </span>
      {(label || description) && (
        <span className={styles.content}>
          {label && (
            <label id={labelId} htmlFor={id} className={styles.label}>
              {label}
            </label>
          )}
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
