// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SplitPanelProps } from './interfaces';
import { InternalSplitPanel } from './internal';

export type { SplitPanelProps };

export default function SplitPanel({
  header,
  headerDescription,
  headerInfo,
  headerActions,
  children,
  closeBehavior = 'collapse',
  hidePreferencesButton = false,
  i18nStrings,
  ...props
}: SplitPanelProps) {
  return (
    <InternalSplitPanel
      {...getBaseProps(props)}
      header={header}
      headerDescription={headerDescription}
      headerInfo={headerInfo}
      headerActions={headerActions}
      closeBehavior={closeBehavior}
      hidePreferencesButton={hidePreferencesButton}
      i18nStrings={i18nStrings}
    >
      {children}
    </InternalSplitPanel>
  );
}
