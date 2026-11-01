// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { getHiddenTokenCount } from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { FileToken } from './file-token';
import { formatFileLastModified, formatFileSize, useFormatLocale } from './format';
import { FileTokenGroupProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalFileTokenGroupProps extends FileTokenGroupProps {
  /**
   * Called after the last file is removed while focus was in the group, so the host can move focus
   * somewhere useful. Not part of the public API.
   */
  onEmptied?(): void;
  /**
   * Lets other components position the group. Not part of the public API.
   */
  className?: string;
}

export function InternalFileTokenGroup({
  items,
  onDismiss,
  showFileSize = false,
  showFileLastModified = false,
  showFileThumbnail = false,
  limit,
  alignment = 'horizontal',
  readOnly = false,
  ariaLabel,
  i18nStrings,
  onEmptied,
  className,
  ...rest
}: InternalFileTokenGroupProps) {
  const i18n = useInternalI18n('file-token-group');
  const locale = useFormatLocale();
  const listId = useId();
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<(ButtonProps.Ref | null)[]>([]);
  const pendingFocus = useRef<number | null>(null);

  const hiddenCount = getHiddenTokenCount(items.length, limit);
  const visible = hiddenCount > 0 && !expanded ? items.slice(0, limit) : items;

  // Removing the focused token would drop focus to the page, so it moves to the next remove button,
  // or the previous one when the last token went.
  useEffect(() => {
    const index = pendingFocus.current;
    if (index === null) {
      return;
    }
    pendingFocus.current = null;
    if (visible.length === 0) {
      onEmptied?.();
      return;
    }
    buttonRefs.current[Math.min(index, visible.length - 1)]?.focus();
  });

  const dismiss = (fileIndex: number) => {
    if (listRef.current?.contains(document.activeElement)) {
      pendingFocus.current = fileIndex;
    }
    fireNonCancelableEvent(onDismiss, { fileIndex });
  };

  const formatSize = i18nStrings?.formatFileSize ?? ((size: number) => formatFileSize(size, locale));
  const formatDate = i18nStrings?.formatFileLastModified ?? ((date: Date) => formatFileLastModified(date, locale));
  const errorIconAriaLabel = i18n('errorIconAriaLabel', i18nStrings?.errorIconAriaLabel);
  const warningIconAriaLabel = i18n('warningIconAriaLabel', i18nStrings?.warningIconAriaLabel);
  const removeLabel = (fileIndex: number, fileName: string) =>
    i18nStrings?.removeFileAriaLabel?.(fileIndex, fileName) ??
    i18n('removeFileAriaLabel', undefined, { fileNumber: fileIndex + 1, fileName });

  return (
    <div {...rest} className={clsx(styles.root, styles[`alignment-${alignment}`], className)}>
      {items.length > 0 && (
        <ul ref={listRef} id={listId} className={styles.list} aria-label={ariaLabel}>
          {visible.map((item, index) => (
            <li
              key={`${index}-${item.file.name}`}
              className={styles.item}
              aria-busy={item.loading ? 'true' : undefined}
            >
              <FileToken
                item={item}
                showFileSize={showFileSize}
                showFileLastModified={showFileLastModified}
                showFileThumbnail={showFileThumbnail}
                readOnly={readOnly}
                formatFileSize={formatSize}
                formatFileLastModified={formatDate}
                errorIconAriaLabel={errorIconAriaLabel}
                warningIconAriaLabel={warningIconAriaLabel}
                dismissLabel={removeLabel(index, item.file.name)}
                onDismiss={onDismiss ? () => dismiss(index) : undefined}
                dismissButtonRef={button => {
                  buttonRefs.current[index] = button;
                }}
              />
            </li>
          ))}
        </ul>
      )}
      {hiddenCount > 0 && (
        <InternalButton
          className={styles.toggle}
          variant="link"
          formAction="none"
          ariaExpanded={expanded}
          ariaControls={listId}
          onClick={() => setExpanded(current => !current)}
        >
          {expanded
            ? i18n('limitShowFewer', i18nStrings?.limitShowFewer)
            : i18n('limitShowMore', i18nStrings?.limitShowMore, { count: hiddenCount })}
        </InternalButton>
      )}
    </div>
  );
}
