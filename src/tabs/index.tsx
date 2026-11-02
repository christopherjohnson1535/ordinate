// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TabsProps } from './interfaces';
import { InternalTabs } from './internal';

export type { TabsProps };

export default function Tabs({
  tabs,
  activeTabId,
  onChange,
  variant = 'default',
  kind = 'neutral',
  ariaLabel,
  ariaLabelledby,
  disableContentPaddings = false,
  i18nStrings,
  ...props
}: TabsProps) {
  return (
    <InternalTabs
      {...getBaseProps(props)}
      tabs={tabs}
      activeTabId={activeTabId}
      onChange={onChange}
      variant={variant}
      kind={kind}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      disableContentPaddings={disableContentPaddings}
      i18nStrings={i18nStrings}
    />
  );
}
