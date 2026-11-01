// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { HelpPanelProps } from './interfaces';
import { InternalHelpPanel } from './internal';

export type { HelpPanelProps };

export default function HelpPanel({
  header,
  children,
  footer,
  loading = false,
  loadingText,
  ...props
}: HelpPanelProps) {
  return (
    <InternalHelpPanel
      {...getBaseProps(props)}
      header={header}
      footer={footer}
      loading={loading}
      loadingText={loadingText}
    >
      {children}
    </InternalHelpPanel>
  );
}
