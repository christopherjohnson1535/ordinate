// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalIcon } from '../icon/internal';
import { InternalSpinner } from '../spinner/internal';
import { InternalToken } from '../token/internal';
import { InternalTruncatedText } from '../truncated-text/internal';
import { FileTokenGroupProps } from './interfaces';

import styles from './styles.css.js';

export interface FileTokenProps {
  item: FileTokenGroupProps.Item;
  showFileSize: boolean;
  showFileLastModified: boolean;
  showFileThumbnail: boolean;
  readOnly: boolean;
  formatFileSize: (sizeInBytes: number) => string;
  formatFileLastModified: (date: Date) => string;
  errorIconAriaLabel?: string;
  warningIconAriaLabel?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  dismissButtonRef?: React.Ref<ButtonProps.Ref>;
}

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

// An object URL keeps the file in memory until it is revoked, so each one lives only as long as its
// preview. The URL goes straight onto the image, as it never takes part in rendering.
function ImagePreview({ file }: { file: File }) {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    if (!image || typeof URL.createObjectURL !== 'function') {
      return;
    }
    const url = URL.createObjectURL(file);
    image.src = url;
    return () => {
      URL.revokeObjectURL(url);
      image.removeAttribute('src');
    };
  }, [file]);
  return <img ref={imageRef} className={styles['thumbnail-image']} alt="" />;
}

function Thumbnail({ file, loading }: { file: File; loading: boolean }) {
  let content: React.ReactNode;
  if (loading) {
    content = <InternalSpinner className={styles.spinner} />;
  } else if (isImage(file)) {
    content = <ImagePreview file={file} />;
  } else {
    content = <InternalIcon className={styles['thumbnail-icon']} name="file" />;
  }
  return <span className={styles.thumbnail}>{content}</span>;
}

export function FileToken({
  item,
  showFileSize,
  showFileLastModified,
  showFileThumbnail,
  readOnly,
  formatFileSize,
  formatFileLastModified,
  errorIconAriaLabel,
  warningIconAriaLabel,
  dismissLabel,
  onDismiss,
  dismissButtonRef,
}: FileTokenProps) {
  const { file, loading = false, errorText, warningText } = item;
  const showWarning = Boolean(warningText) && !errorText;
  const hasMetadata = showFileSize || showFileLastModified;

  const label = (
    <span className={styles.file}>
      {showFileThumbnail ? (
        <Thumbnail file={file} loading={loading} />
      ) : (
        loading && <InternalSpinner className={styles.spinner} />
      )}
      <span className={styles.details}>
        {/* File names and sizes keep their own direction, so a Latin name is not reordered in a right-to-left page. */}
        <span className={styles['file-name']} dir="auto">
          <InternalTruncatedText>{file.name}</InternalTruncatedText>
        </span>
        {hasMetadata && (
          <span className={styles.metadata}>
            {showFileSize && (
              <span className={styles['file-size']} dir="auto">
                {formatFileSize(file.size)}
              </span>
            )}
            {showFileLastModified && (
              <span className={styles['file-last-modified']} dir="auto">
                {formatFileLastModified(new Date(file.lastModified))}
              </span>
            )}
          </span>
        )}
      </span>
    </span>
  );

  return (
    <>
      <InternalToken
        className={clsx(styles.token, errorText && styles.invalid, showWarning && styles.warning)}
        label={label}
        readOnly={readOnly}
        dismissLabel={dismissLabel}
        onDismiss={onDismiss}
        dismissButtonRef={dismissButtonRef}
      />
      {errorText && (
        <div className={styles['error-text']}>
          <InternalIcon className={styles['message-icon']} name="fault" size="small" ariaLabel={errorIconAriaLabel} />
          <span>{errorText}</span>
        </div>
      )}
      {showWarning && (
        <div className={styles['warning-text']}>
          <InternalIcon
            className={styles['message-icon']}
            name="caution"
            size="small"
            ariaLabel={warningIconAriaLabel}
          />
          <span>{warningText}</span>
        </div>
      )}
    </>
  );
}
