// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TopNavigationProps } from './interfaces';
import { InternalTopNavigation } from './internal';

export type { TopNavigationProps };

export default function TopNavigation({ identity, utilities = [], search, i18nStrings, ...props }: TopNavigationProps) {
  return (
    <InternalTopNavigation
      {...getBaseProps(props)}
      identity={identity}
      utilities={utilities}
      search={search}
      i18nStrings={i18nStrings}
    />
  );
}
