// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { InternalButton } from '../button/internal';
import { InternalCheckbox } from '../checkbox/internal';
import { InternalFormField } from '../form-field/internal';
import { InternalModal } from '../modal/internal';
import { InternalRadioGroup } from '../radio-group/internal';
import { CodeEditorProps } from './interfaces';

import styles from './styles.css.js';

export interface PreferencesModalLabels {
  header?: string;
  cancel?: string;
  confirm?: string;
  wrapLines?: string;
  showGutter?: string;
  theme?: string;
  themeAuto?: string;
  themeLight?: string;
  themeDark?: string;
}

interface PreferencesModalProps {
  preferences: Required<CodeEditorProps.Preferences>;
  labels: PreferencesModalLabels;
  onConfirm: (preferences: Required<CodeEditorProps.Preferences>) => void;
  onCancel: () => void;
}

/**
 * The editor preferences as a draft: changes apply only when the user confirms them. Render it
 * only while it is open, so each opening starts from the current preferences.
 */
export function PreferencesModal({ preferences, labels, onConfirm, onCancel }: PreferencesModalProps) {
  const [draft, setDraft] = useState(preferences);
  const update = (changes: Partial<CodeEditorProps.Preferences>) => setDraft(current => ({ ...current, ...changes }));

  return (
    <InternalModal
      visible={true}
      header={labels.header}
      size="small"
      onDismiss={onCancel}
      footer={
        <>
          <InternalButton className={styles['preferences-cancel']} variant="link" formAction="none" onClick={onCancel}>
            {labels.cancel}
          </InternalButton>
          <InternalButton
            className={styles['preferences-confirm']}
            variant="primary"
            formAction="none"
            onClick={() => onConfirm(draft)}
          >
            {labels.confirm}
          </InternalButton>
        </>
      }
    >
      <div className={styles.preferences}>
        <div className={styles['preferences-wrap-lines']}>
          <InternalCheckbox checked={draft.wrapLines} onChange={event => update({ wrapLines: event.detail.checked })}>
            {labels.wrapLines}
          </InternalCheckbox>
        </div>
        <div className={styles['preferences-show-gutter']}>
          <InternalCheckbox checked={draft.showGutter} onChange={event => update({ showGutter: event.detail.checked })}>
            {labels.showGutter}
          </InternalCheckbox>
        </div>
        <div className={styles['preferences-theme']}>
          <InternalFormField label={labels.theme}>
            <InternalRadioGroup
              value={draft.theme}
              items={[
                { value: 'auto', label: labels.themeAuto },
                { value: 'light', label: labels.themeLight },
                { value: 'dark', label: labels.themeDark },
              ]}
              onChange={event => update({ theme: event.detail.value as CodeEditorProps.Theme })}
            />
          </InternalFormField>
        </div>
      </div>
    </InternalModal>
  );
}
