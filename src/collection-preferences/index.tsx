// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CollectionPreferencesProps } from './interfaces';
import { InternalCollectionPreferences } from './internal';

export type { CollectionPreferencesProps };

export default function CollectionPreferences<CustomPreferenceType = unknown>({
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
  ...props
}: CollectionPreferencesProps<CustomPreferenceType>) {
  return (
    <InternalCollectionPreferences<CustomPreferenceType>
      {...getBaseProps(props)}
      title={title}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      disabled={disabled}
      preferences={preferences}
      onConfirm={onConfirm}
      onCancel={onCancel}
      pageSizePreference={pageSizePreference}
      wrapLinesPreference={wrapLinesPreference}
      stripedRowsPreference={stripedRowsPreference}
      contentDensityPreference={contentDensityPreference}
      stickyColumnsPreference={stickyColumnsPreference}
      contentDisplayPreference={contentDisplayPreference}
      customPreference={customPreference}
    />
  );
}
