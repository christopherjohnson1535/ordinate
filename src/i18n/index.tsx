// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useMemo } from 'react';

import { I18nContext, mergeMessages } from '../internal/i18n/context';
import { I18nProviderProps } from './interfaces';

export type { I18nProviderProps };

/**
 * Supplies translated labels to every Ordinate component inside it. A label passed
 * to a component as a prop always takes precedence.
 */
export default function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  const value = useMemo(() => ({ locale: locale ?? null, messages: mergeMessages(messages) }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
