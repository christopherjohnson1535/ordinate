// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalCheckbox } from '../checkbox/internal';
import { InternalFormField } from '../form-field/internal';
import { InternalRadioGroup } from '../radio-group/internal';
import { CollectionPreferencesProps } from './interfaces';

import styles from './styles.css.js';

interface NumberChoiceProps {
  className: string;
  title: string | undefined;
  description?: string;
  options: ReadonlyArray<{ value: number; label?: string }>;
  value: number | undefined;
  onChange: (value: number) => void;
}

/**
 * A titled radio group whose values are numbers, used for the page size and the sticky columns.
 */
export function NumberChoice({ className, title, description, options, value, onChange }: NumberChoiceProps) {
  return (
    <div className={className}>
      <InternalFormField label={title} description={description}>
        <InternalRadioGroup
          value={value === undefined ? null : String(value)}
          items={options.map(option => ({ value: String(option.value), label: option.label ?? String(option.value) }))}
          onChange={event => onChange(Number(event.detail.value))}
        />
      </InternalFormField>
    </div>
  );
}

interface CheckboxPreferenceProps {
  className: string;
  label: string | undefined;
  description: string | undefined;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxPreference({ className, label, description, checked, onChange }: CheckboxPreferenceProps) {
  return (
    <div className={className}>
      <InternalCheckbox checked={checked} description={description} onChange={event => onChange(event.detail.checked)}>
        {label}
      </InternalCheckbox>
    </div>
  );
}

interface StickyColumnsProps {
  preference: CollectionPreferencesProps.StickyColumnsPreference;
  value: CollectionPreferencesProps.StickyColumns | undefined;
  onChange: (value: CollectionPreferencesProps.StickyColumns) => void;
  i18n: (key: string, provided?: string) => string | undefined;
}

export function StickyColumns({
  preference: { firstColumns, lastColumns },
  value,
  onChange,
  i18n,
}: StickyColumnsProps) {
  return (
    <>
      {firstColumns && (
        <NumberChoice
          className={styles['sticky-first-columns']}
          title={i18n('stickyFirstColumnsTitle', firstColumns.title)}
          description={i18n('stickyFirstColumnsDescription', firstColumns.description)}
          options={firstColumns.options}
          value={value?.first}
          onChange={first => onChange({ ...value, first })}
        />
      )}
      {lastColumns && (
        <NumberChoice
          className={styles['sticky-last-columns']}
          title={i18n('stickyLastColumnsTitle', lastColumns.title)}
          description={i18n('stickyLastColumnsDescription', lastColumns.description)}
          options={lastColumns.options}
          value={value?.last}
          onChange={last => onChange({ ...value, last })}
        />
      )}
    </>
  );
}
