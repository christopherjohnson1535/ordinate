// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { FileInputProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalFileInputProps extends FileInputProps {
  /**
   * Lets other components position the control. Not part of the public API.
   */
  className?: string;
}

// Keeps the native input holding the same files as `value`, so that screen readers announce the
// chosen files and a surrounding form submits them. Browsers without a DataTransfer constructor keep
// whatever the user last picked.
function syncNativeFiles(input: HTMLInputElement | null, files: ReadonlyArray<File>) {
  if (!input || typeof DataTransfer === 'undefined') {
    return;
  }
  try {
    const transfer = new DataTransfer();
    files.forEach(file => transfer.items.add(file));
    input.files = transfer.files;
  } catch {
    // Some older browsers expose DataTransfer but do not let scripts construct or assign it.
  }
}

export const InternalFileInput = React.forwardRef(
  (
    {
      value,
      onChange,
      multiple = false,
      accept,
      variant = 'button',
      children,
      ariaLabel,
      ariaRequired,
      disabled = false,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      className,
      ...rest
    }: InternalFileInputProps,
    ref: React.Ref<FileInputProps.Ref>
  ) => {
    const i18n = useInternalI18n('file-input');
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const inputRef = useRef<HTMLInputElement>(null);
    const textId = useId();
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    useEffect(() => syncNativeFiles(inputRef.current, value), [value]);

    const text = children ?? i18n('uploadButtonText', undefined, { multiple: String(multiple) });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(event.target.files ?? []);
      // Cancelling the file chooser can clear the native input without the value changing.
      if (picked.length === 0) {
        syncNativeFiles(inputRef.current, value);
        return;
      }
      fireNonCancelableEvent(onChange, { value: multiple ? [...value, ...picked] : picked.slice(0, 1) });
    };

    const labelledBy = ariaLabel
      ? ariaLabelledby
      : [field.ariaLabelledby, textId].filter(Boolean).join(' ') || undefined;

    return (
      <span {...rest} className={clsx(styles.root, className)}>
        {/* The button is hidden from assistive technology, so the native input carries its text as its name. */}
        <span id={textId} hidden={true}>
          {text}
        </span>
        <input
          ref={inputRef}
          type="file"
          id={field.controlId}
          className={styles['native-input']}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={field.ariaDescribedby}
          aria-invalid={field.invalid ? 'true' : undefined}
          aria-required={ariaRequired ? 'true' : undefined}
          onChange={handleChange}
        />
        <InternalButton
          className={clsx(
            styles.trigger,
            field.invalid && styles.invalid,
            field.warning && !field.invalid && styles.warning
          )}
          variant={variant === 'icon' ? 'icon' : 'normal'}
          iconName="upload"
          formAction="none"
          disabled={disabled}
          ariaLabel={variant === 'icon' ? (ariaLabel ?? (typeof text === 'string' ? text : undefined)) : undefined}
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => inputRef.current?.click()}
        >
          {variant === 'button' ? text : undefined}
        </InternalButton>
      </span>
    );
  }
);
