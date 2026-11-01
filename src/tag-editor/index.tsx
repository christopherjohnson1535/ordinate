// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TagEditorProps } from './interfaces';
import { InternalTagEditor } from './internal';

export type { TagEditorProps };

export default function TagEditor({
  tags = [],
  onChange,
  keysRequest,
  valuesRequest,
  allowedCharacterPattern,
  tagLimit = 50,
  loading = false,
  i18nStrings,
  ...props
}: TagEditorProps) {
  return (
    <InternalTagEditor
      {...getBaseProps(props)}
      tags={tags}
      onChange={onChange}
      keysRequest={keysRequest}
      valuesRequest={valuesRequest}
      allowedCharacterPattern={allowedCharacterPattern}
      tagLimit={tagLimit}
      loading={loading}
      i18nStrings={i18nStrings}
    />
  );
}
