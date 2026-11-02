// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalModal } from '../modal/internal';
import { ContentDisplay } from './content-display';
import { CollectionPreferencesProps } from './interfaces';
import { CheckboxPreference, NumberChoice, StickyColumns } from './preferences';
import { createDraft } from './utils';

import styles from './styles.css.js';

export function InternalCollectionPreferences<Custom>({
  title,
  confirmLabel,
  cancelLabel,
  disabled = false,
  preferences,
  onConfirm,
  onCancel,
  pageSizePreference,
  wrapLinesPreference,
  stripedRowsPreference,
  contentDensityPreference,
  stickyColumnsPreference,
  contentDisplayPreference,
  customPreference,
  ...rest
}: CollectionPreferencesProps<Custom>) {
  const i18n = useInternalI18n('collection-preferences');
  const triggerRef = useRef<ButtonProps.Ref>(null);
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState<CollectionPreferencesProps.Preferences<Custom>>({});

  const returnFocus = useRef(false);

  const update = (changes: CollectionPreferencesProps.Preferences<Custom>) =>
    setDraft(current => ({ ...current, ...changes }));

  // Runs after the modal has closed its dialog, when the rest of the page can take focus again.
  useEffect(() => {
    if (!visible && returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [visible]);

  const open = () => {
    setDraft(createDraft(preferences, contentDisplayPreference?.options));
    setVisible(true);
  };

  const close = () => {
    returnFocus.current = true;
    setVisible(false);
  };

  const confirm = () => {
    close();
    fireNonCancelableEvent(onConfirm, draft);
  };

  const cancel = () => {
    close();
    fireNonCancelableEvent(onCancel, null);
  };

  const heading = i18n('title', title);
  const hasSettings = Boolean(
    pageSizePreference ||
    wrapLinesPreference ||
    stripedRowsPreference ||
    contentDensityPreference ||
    stickyColumnsPreference ||
    customPreference
  );
  const twoColumns = hasSettings && Boolean(contentDisplayPreference);

  return (
    <div {...rest} className={styles.root}>
      <InternalButton
        ref={triggerRef}
        className={styles.trigger}
        variant="icon"
        iconName="adjust"
        formAction="none"
        ariaLabel={heading}
        ariaHaspopup="dialog"
        disabled={disabled}
        onClick={open}
      />
      <InternalModal
        visible={visible}
        header={heading}
        size={twoColumns ? 'large' : 'medium'}
        onDismiss={cancel}
        footer={
          <>
            <InternalButton className={styles['cancel-button']} variant="link" formAction="none" onClick={cancel}>
              {i18n('cancelLabel', cancelLabel)}
            </InternalButton>
            <InternalButton className={styles['confirm-button']} variant="primary" formAction="none" onClick={confirm}>
              {i18n('confirmLabel', confirmLabel)}
            </InternalButton>
          </>
        }
      >
        <div className={styles['layout-container']}>
          <div className={clsx(styles.layout, twoColumns && styles['two-columns'])}>
            {hasSettings && (
              <div className={styles.column}>
                {pageSizePreference && (
                  <NumberChoice
                    className={styles['page-size']}
                    title={i18n('pageSizeTitle', pageSizePreference.title)}
                    options={pageSizePreference.options}
                    value={draft.pageSize}
                    onChange={pageSize => update({ pageSize })}
                  />
                )}
                {wrapLinesPreference && (
                  <CheckboxPreference
                    className={styles['wrap-lines']}
                    label={i18n('wrapLinesLabel', wrapLinesPreference.label)}
                    description={i18n('wrapLinesDescription', wrapLinesPreference.description)}
                    checked={draft.wrapLines ?? false}
                    onChange={wrapLines => update({ wrapLines })}
                  />
                )}
                {stripedRowsPreference && (
                  <CheckboxPreference
                    className={styles['striped-rows']}
                    label={i18n('stripedRowsLabel', stripedRowsPreference.label)}
                    description={i18n('stripedRowsDescription', stripedRowsPreference.description)}
                    checked={draft.stripedRows ?? false}
                    onChange={stripedRows => update({ stripedRows })}
                  />
                )}
                {contentDensityPreference && (
                  <CheckboxPreference
                    className={styles['content-density']}
                    label={i18n('contentDensityLabel', contentDensityPreference.label)}
                    description={i18n('contentDensityDescription', contentDensityPreference.description)}
                    checked={draft.contentDensity === 'compact'}
                    onChange={compact => update({ contentDensity: compact ? 'compact' : 'comfortable' })}
                  />
                )}
                {stickyColumnsPreference && (
                  <StickyColumns
                    preference={stickyColumnsPreference}
                    value={draft.stickyColumns}
                    onChange={stickyColumns => update({ stickyColumns })}
                    i18n={i18n}
                  />
                )}
                {customPreference && (
                  <div className={styles.custom}>{customPreference(draft.custom, custom => update({ custom }))}</div>
                )}
              </div>
            )}
            {contentDisplayPreference && (
              <div className={clsx(styles.column, twoColumns && styles['secondary-column'])}>
                <ContentDisplay
                  preference={contentDisplayPreference}
                  value={draft.contentDisplay ?? []}
                  onChange={contentDisplay => update({ contentDisplay })}
                />
              </div>
            )}
          </div>
        </div>
      </InternalModal>
    </div>
  );
}
