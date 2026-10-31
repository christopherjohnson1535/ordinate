// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useContext, useMemo } from 'react';

import { IconProviderContext } from './context';
import { IconProviderProps } from './interfaces';

export type { IconProviderProps };

export default function IconProvider({ icons, children }: IconProviderProps) {
  const parent = useContext(IconProviderContext);
  const value = useMemo(() => (icons === null ? {} : { ...parent, ...icons }), [icons, parent]);
  return <IconProviderContext.Provider value={value}>{children}</IconProviderContext.Provider>;
}
