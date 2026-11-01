// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TutorialPanelProps } from './interfaces';
import { InternalTutorialPanel } from './internal';

export type { TutorialPanelProps };

export default function TutorialPanel({
  tutorials,
  loading = false,
  onFeedbackClick,
  downloadUrl,
  i18nStrings,
  ...props
}: TutorialPanelProps) {
  return (
    <InternalTutorialPanel
      {...getBaseProps(props)}
      tutorials={tutorials}
      loading={loading}
      onFeedbackClick={onFeedbackClick}
      downloadUrl={downloadUrl}
      i18nStrings={i18nStrings}
    />
  );
}
