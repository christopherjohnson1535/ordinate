// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalFileDropzone } from '../file-dropzone/internal';
import { FileInputProps } from '../file-input/interfaces';
import { InternalFileInput } from '../file-input/internal';
import { InternalFileTokenGroup } from '../file-token-group/internal';
import { InternalIcon } from '../icon/internal';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useFilesDragging } from '../internal/hooks/use-files-dragging';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { FileUploadProps } from './interfaces';

import styles from './styles.css.js';

function joinIds(...ids: ReadonlyArray<string | false | null | undefined>): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined;
}

export const InternalFileUpload = React.forwardRef(
  (
    {
      value,
      onChange,
      multiple = false,
      accept,
      showFileSize = false,
      showFileLastModified = false,
      showFileThumbnail = false,
      tokenLimit,
      fileErrors,
      fileWarnings,
      constraintText,
      errorText,
      warningText,
      ariaLabel,
      ariaRequired,
      i18nStrings,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...rest
    }: FileUploadProps,
    ref: React.Ref<FileUploadProps.Ref>
  ) => {
    const i18n = useInternalI18n('file-upload');
    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const inputRef = useRef<FileInputProps.Ref>(null);
    const baseId = useId();
    const errorId = `${baseId}error`;
    const warningId = `${baseId}warning`;
    const constraintId = `${baseId}constraint`;
    const dragging = useFilesDragging();
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    if (errorText && warningText) {
      warnOnce('FileUpload', '`warningText` is not shown while `errorText` is set.');
    }
    const showWarning = Boolean(warningText) && !errorText;

    const change = (files: File[]) => fireNonCancelableEvent(onChange, { value: files });
    const add = (files: File[]) => change(multiple ? [...value, ...files] : files.slice(0, 1));

    const items = value.map((file, index) => ({
      file,
      errorText: fileErrors?.[index] || undefined,
      warningText: fileWarnings?.[index] || undefined,
    }));

    return (
      <div {...rest} className={styles.root}>
        {dragging ? (
          <InternalFileDropzone className={styles.dropzone} onChange={event => add(event.detail.value)}>
            <InternalIcon name="upload" size="medium" />
            <span>{i18n('dropzoneText', i18nStrings?.dropzoneText, { multiple: String(multiple) })}</span>
          </InternalFileDropzone>
        ) : (
          <InternalFileInput
            ref={inputRef}
            value={value}
            onChange={event => change(event.detail.value)}
            multiple={multiple}
            accept={accept}
            ariaLabel={ariaLabel}
            ariaRequired={ariaRequired}
            controlId={field.controlId}
            ariaLabelledby={field.ariaLabelledby}
            ariaDescribedby={joinIds(
              field.ariaDescribedby,
              Boolean(errorText) && errorId,
              showWarning && warningId,
              Boolean(constraintText) && constraintId
            )}
            invalid={field.invalid || Boolean(errorText)}
            warning={field.warning || showWarning}
          >
            {i18nStrings?.uploadButtonText}
          </InternalFileInput>
        )}
        {(errorText || showWarning || constraintText) && (
          <div className={styles.hints}>
            {errorText && (
              <div id={errorId} className={clsx(styles.message, styles.error)}>
                <InternalIcon
                  className={styles['message-icon']}
                  name="fault"
                  size="small"
                  ariaLabel={i18n('errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
                />
                <span>{errorText}</span>
              </div>
            )}
            {showWarning && (
              <div id={warningId} className={clsx(styles.message, styles.warning)}>
                <InternalIcon
                  className={styles['message-icon']}
                  name="caution"
                  size="small"
                  ariaLabel={i18n('warningIconAriaLabel', i18nStrings?.warningIconAriaLabel)}
                />
                <span>{warningText}</span>
              </div>
            )}
            {constraintText && (
              <div id={constraintId} className={styles.constraint}>
                {constraintText}
              </div>
            )}
          </div>
        )}
        {/* Stays mounted when empty, so it can hand focus back after the last file is removed. */}
        <InternalFileTokenGroup
          className={styles.tokens}
          items={items}
          alignment="vertical"
          limit={tokenLimit}
          showFileSize={showFileSize}
          showFileLastModified={showFileLastModified}
          showFileThumbnail={showFileThumbnail}
          i18nStrings={{
            removeFileAriaLabel: i18nStrings?.removeFileAriaLabel,
            limitShowMore: i18nStrings?.limitShowMore,
            limitShowFewer: i18nStrings?.limitShowFewer,
            errorIconAriaLabel: i18nStrings?.errorIconAriaLabel,
            warningIconAriaLabel: i18nStrings?.warningIconAriaLabel,
            formatFileSize: i18nStrings?.formatFileSize,
            formatFileLastModified: i18nStrings?.formatFileLastModified,
          }}
          onDismiss={event => change(value.filter((_, index) => index !== event.detail.fileIndex))}
          onEmptied={() => inputRef.current?.focus()}
        />
      </div>
    );
  }
);
