// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FileTokenGroupProps } from './interfaces';
import { InternalFileTokenGroup } from './internal';

export type { FileTokenGroupProps };

export default function FileTokenGroup({
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
  ...props
}: FileTokenGroupProps) {
  return (
    <InternalFileTokenGroup
      {...getBaseProps(props)}
      items={items}
      onDismiss={onDismiss}
      showFileSize={showFileSize}
      showFileLastModified={showFileLastModified}
      showFileThumbnail={showFileThumbnail}
      limit={limit}
      alignment={alignment}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
      i18nStrings={i18nStrings}
    />
  );
}
